import type { IncomingMessage, ServerResponse } from "node:http";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

import {
  addCommentToClient,
  createClientRecord,
  getClientComments,
  getClientDetail,
  getEmployeeDaySummary,
  getEmployeeWorkload,
  getTeamDaySummary,
  moveClientToStage,
  resolveActorIdentity,
  runAyaMessageTool,
  searchClients,
} from "./service.js";
import {
  answerReportingQuestion,
  getReportingOverview,
} from "../reporting/service.js";
import type { BlueRequestAuth } from "../domain/types.js";
import { normalizeBlueRequestAuth } from "../modules/blue/request-auth.js";

export async function handleAyaMcpRequest(
  request: IncomingMessage,
  response: ServerResponse,
  parsedBody?: unknown,
) {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  const server = createAyaMcpServer();
  await server.connect(transport);
  await transport.handleRequest(request, response, parsedBody);
}

async function getHeaderActor(
  headers: Record<string, string | string[] | undefined> | undefined,
  fallback?: {
    employeeId?: string;
    employeeEmail?: string;
    employeeName?: string;
  },
) {
  const employeeId =
    getHeaderValue(headers, "x-aya-employee-id") ??
    fallback?.employeeId ??
    undefined;
  const employeeEmail =
    getHeaderValue(headers, "x-aya-employee-email") ??
    fallback?.employeeEmail ??
    undefined;
  const employeeName =
    getHeaderValue(headers, "x-aya-employee-name") ??
    fallback?.employeeName ??
    undefined;

  return await resolveActorIdentity({
    employeeId: employeeId || undefined,
    employeeEmail: employeeEmail || undefined,
    employeeName: employeeName || undefined,
  });
}

function getHeaderBlueAuth(
  headers: Record<string, string | string[] | undefined> | undefined,
): BlueRequestAuth | null {
  return normalizeBlueRequestAuth({
    tokenId:
      getHeaderValue(headers, "x-aya-blue-token-id") ??
      getHeaderValue(headers, "x-blue-token-id"),
    tokenSecret:
      getHeaderValue(headers, "x-aya-blue-token-secret") ??
      getHeaderValue(headers, "x-blue-token-secret"),
  });
}

async function requireToolActor(
  headers: Record<string, string | string[] | undefined> | undefined,
  fallback?: {
    employeeId?: string;
    employeeEmail?: string;
    employeeName?: string;
  },
) {
  const actor = await getHeaderActor(headers, fallback);
  if (!actor) {
    throw new Error(
      "This Aya tool requires employee identity. Send x-aya-employee-id, x-aya-employee-email, or x-aya-employee-name.",
    );
  }

  return actor;
}

async function requireAdminToolActor(
  headers: Record<string, string | string[] | undefined> | undefined,
  fallback?: {
    employeeId?: string;
    employeeEmail?: string;
    employeeName?: string;
  },
) {
  const actor = await requireToolActor(headers, fallback);
  if (actor.roleName !== "admin") {
    throw new Error("This Aya reporting tool requires admin or manager access.");
  }

  return actor;
}

function getHeaderValue(
  headers: Record<string, string | string[] | undefined> | undefined,
  name: string,
) {
  if (!headers) {
    return null;
  }

  const value =
    headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function toStructuredContent(value: unknown) {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function createAyaMcpServer() {
  const server = new McpServer({
    name: "aya-ops-mcp",
    version: "0.1.0",
    websiteUrl: "https://chat-internal.ayafinancial.com",
  });

  server.registerTool(
    "aya_message",
    {
      title: "Aya Chat Action",
      description:
        "Run one Aya bot request in natural language. Use this for normal employee chat behavior.",
      inputSchema: {
        message: z
          .string()
          .min(1)
          .describe("Natural-language employee request"),
      },
    },
    async ({ message }, extra) => {
      const actor = await getHeaderActor(extra.requestInfo?.headers);
      const blueAuth = getHeaderBlueAuth(extra.requestInfo?.headers);
      const result = await runAyaMessageTool({
        message,
        actorEmployeeId: actor?.employeeId,
        actorEmployeeEmail: actor?.email,
        actorEmployeeName: actor?.displayName,
        blueAuth,
      });

      return {
        content: [{ type: "text", text: result.responseText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_search_clients",
    {
      title: "Search Clients",
      description:
        "Search cached Blue CRM records in the allowed Aya workspace `03 - AYA x Hamza/ AI`.",
      inputSchema: {
        query: z.string().min(1),
        limit: z.number().int().min(1).max(20).default(8),
      },
    },
    async ({ query, limit }, extra) => {
      const actor = await getHeaderActor(extra.requestInfo?.headers);
      const result = await searchClients(query, limit, actor);
      const responseText =
        result.items.length === 0
          ? `No cached Blue clients matched "${query}".`
          : result.items
              .map(
                (item: { title: string; listTitle: string }, index: number) =>
                  `${index + 1}. ${item.title} (${item.listTitle})`,
              )
              .join("\n");

      return {
        content: [{ type: "text", text: responseText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_get_client_comments",
    {
      title: "Get Client Comments",
      description:
        "Show recent comments for a Blue CRM record in the allowed Aya workspace `03 - AYA x Hamza/ AI`. `clientQuery` can be a client name, record title, email, or phone number.",
      inputSchema: {
        recordId: z.string().optional(),
        clientQuery: z
          .string()
          .optional()
          .describe("Client name, record title, email, or phone number"),
        limit: z.number().int().min(1).max(20).default(8),
      },
    },
    async ({ recordId, clientQuery, limit }, extra) => {
      const actor = await getHeaderActor(extra.requestInfo?.headers);
      const result = await getClientComments({
        recordId,
        clientQuery,
        limit,
        actor,
      });
      return {
        content: [{ type: "text", text: result.responseText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_get_client_detail",
    {
      title: "Get Client Detail",
      description:
        "Load a client's current Blue status, contact fields, and recent activity/comments. Use `clientQuery` for a client name, record title, email, or phone number.",
      inputSchema: {
        recordId: z.string().optional(),
        clientQuery: z
          .string()
          .optional()
          .describe("Client name, record title, email, or phone number"),
      },
    },
    async ({ recordId, clientQuery }, extra) => {
      const actor = await getHeaderActor(extra.requestInfo?.headers);
      const result = await getClientDetail({ recordId, clientQuery, actor });
      const contactBits = [
        result.detail.contact.phone
          ? `Phone: ${result.detail.contact.phone}`
          : null,
        result.detail.contact.email
          ? `Email: ${result.detail.contact.email}`
          : null,
      ].filter(Boolean);

      const responseText = [
        `${result.recordTitle} is currently in ${result.detail.list}.`,
        contactBits.join(" | "),
        result.detail.recentActivity.length > 0
          ? `Recent activity: ${result.detail.recentActivity[0]?.summary ?? "n/a"}`
          : "No recent activity captured.",
      ]
        .filter(Boolean)
        .join("\n");

      return {
        content: [{ type: "text", text: responseText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_get_employee_day_summary",
    {
      title: "Employee Day Summary",
      description:
        "Summarize one internal Aya employee's logged work for a given day from the local activity store. Do not use this for CRM clients or client emails.",
      inputSchema: {
        employeeId: z.string().optional(),
        employeeEmail: z.string().email().optional(),
        employeeName: z.string().optional(),
        date: z.string().optional(),
      },
    },
    async ({ employeeId, employeeEmail, employeeName, date }, extra) => {
      const actor = await getHeaderActor(extra.requestInfo?.headers);
      const result = await getEmployeeDaySummary({
        employeeId: employeeId ?? actor?.employeeId,
        employeeEmail: employeeEmail ?? actor?.email,
        employeeName: employeeName ?? actor?.displayName,
        date,
      });
      return {
        content: [{ type: "text", text: result.summaryText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_get_team_day_summary",
    {
      title: "Team Day Summary",
      description:
        "Summarize team activity or list inactive employees for a given day.",
      inputSchema: {
        date: z.string().optional(),
        inactiveOnly: z.boolean().default(false),
      },
    },
    async ({ date, inactiveOnly }, extra) => {
      await requireAdminToolActor(extra.requestInfo?.headers);
      const result = await getTeamDaySummary({ date, inactiveOnly });
      return {
        content: [{ type: "text", text: result.summaryText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_get_reporting_overview",
    {
      title: "Reporting Overview",
      description:
        "Admin/manager reporting snapshot from Blue. Use this when a manager asks what dashboards or reports exist, whether enterprise reporting is enabled, or what reporting inventory is available.",
      inputSchema: {},
    },
    async (_args, extra) => {
      await requireAdminToolActor(extra.requestInfo?.headers);
      const result = await getReportingOverview();
      return {
        content: [{ type: "text", text: result.summaryText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_answer_reporting_question",
    {
      title: "Answer Reporting Question",
      description:
        "Admin/manager reporting helper for natural-language questions about Blue dashboards, reports, enterprise reporting availability, latest report activity, and reporting inventory.",
      inputSchema: {
        question: z.string().min(1),
      },
    },
    async ({ question }, extra) => {
      await requireAdminToolActor(extra.requestInfo?.headers);
      const result = await answerReportingQuestion({ question });
      return {
        content: [{ type: "text", text: result.answerText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_get_employee_workload",
    {
      title: "Employee Workload",
      description:
        "Show the current open Blue workload assigned to one internal employee in the allowed workspace. Do not use this for CRM clients or client emails.",
      inputSchema: {
        employeeId: z.string().optional(),
        employeeEmail: z.string().email().optional(),
        employeeName: z.string().optional(),
      },
    },
    async ({ employeeId, employeeEmail, employeeName }, extra) => {
      const actor = await getHeaderActor(extra.requestInfo?.headers);
      const result = await getEmployeeWorkload({
        employeeId: employeeId ?? actor?.employeeId,
        employeeEmail: employeeEmail ?? actor?.email,
        employeeName: employeeName ?? actor?.displayName,
      });
      return {
        content: [{ type: "text", text: result.rawOutput }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_create_client_record",
    {
      title: "Create Client Record",
      description:
        "Create a new lead/client record in the allowed Aya workspace `03 - AYA x Hamza/ AI`. Use targetListQuery if the user names the desired stage or list. Prefer explicit firstName and lastName. Normalize names to normal human casing, keep email lowercase, normalize phone formatting, and ask a short follow-up if the name is ambiguous. Do not invent purchase price or down payment. If this tool succeeds, do not call move, detail, or comments tools unless the user explicitly asks for another action.",
      inputSchema: {
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        fullName: z.string().min(1).optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        financeAmount: z.number().positive().optional(),
        notes: z.string().optional(),
        targetListQuery: z.string().optional(),
      },
    },
    async (
      {
        firstName,
        lastName,
        fullName,
        phone,
        email,
        financeAmount,
        notes,
        targetListQuery,
      },
      extra,
    ) => {
      const actor = await requireToolActor(extra.requestInfo?.headers);
      const blueAuth = getHeaderBlueAuth(extra.requestInfo?.headers);
      const result = await createClientRecord({
        firstName,
        lastName,
        fullName,
        phone,
        email,
        financeAmount,
        notes,
        targetListQuery,
        actor,
        blueAuth,
      });
      return {
        content: [{ type: "text", text: result.responseText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_move_client_to_stage",
    {
      title: "Move Client To Stage",
      description:
        "Move an existing Blue CRM record to another list in the allowed Aya workspace `03 - AYA x Hamza/ AI`. Use this only for an existing record that already exists in Blue. Do not use this immediately after successfully creating a new lead unless the user explicitly asks for a second separate move.",
      inputSchema: {
        recordQuery: z.string().min(1),
        targetListQuery: z.string().min(1),
      },
    },
    async ({ recordQuery, targetListQuery }, extra) => {
      const actor = await requireToolActor(extra.requestInfo?.headers);
      const blueAuth = getHeaderBlueAuth(extra.requestInfo?.headers);
      const result = await moveClientToStage({
        recordQuery,
        targetListQuery,
        actor,
        blueAuth,
      });
      return {
        content: [{ type: "text", text: result.responseText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  server.registerTool(
    "aya_add_client_comment",
    {
      title: "Add Client Comment",
      description:
        "Add a comment to a Blue CRM record in the allowed Aya workspace `03 - AYA x Hamza/ AI`.",
      inputSchema: {
        recordQuery: z.string().min(1),
        text: z.string().min(1),
      },
    },
    async ({ recordQuery, text }, extra) => {
      const actor = await requireToolActor(extra.requestInfo?.headers);
      const blueAuth = getHeaderBlueAuth(extra.requestInfo?.headers);
      const result = await addCommentToClient({
        recordQuery,
        text,
        actor,
        blueAuth,
      });
      return {
        content: [{ type: "text", text: result.responseText }],
        structuredContent: toStructuredContent(result),
      };
    },
  );

  return server;
}
