import fs from "node:fs";
import path from "node:path";

import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

import {
  getAdminDashboardLogDetail,
  getAdminDashboardOverview,
  listAdminDashboardEmployeeActivity,
  listAdminDashboardRecentLogs,
  listBlueSyncStates,
  listBlueWebhookSubscriptions,
} from "../db.js";
import { runBlueIngestionOnce } from "../jobs/blue-poller.js";
import { listRecentLibreChatTranscripts } from "../librechat/transcripts.js";
import { syncWorkspaceEmployees } from "../blue/users-sync.js";
import { syncWorkspaceIndex } from "../blue/workspace-index.js";
import { config } from "../config.js";
import { NotFoundError } from "../app/errors.js";
import { getReportingOverview } from "../reporting/service.js";
import { normalizeBlueRequestAuth } from "../modules/blue/request-auth.js";
import {
  adminLogsQuerySchema,
  adminTranscriptsQuerySchema,
  syncBodySchema,
} from "../types/api.js";
import { parseWithSchema } from "../app/plugins/zod.js";

const adminUiDistDir = path.resolve(import.meta.dirname, "..", "..", "admin-ui", "dist");
const adminUiIndexPath = path.join(adminUiDistDir, "index.html");

export const adminRoutes: FastifyPluginAsync = async (app) => {
  const serveAdminShell = async (_request: FastifyRequest, reply: FastifyReply) => {
    if (!fs.existsSync(adminUiIndexPath)) {
      reply.type("text/html");
      return `
        <!doctype html>
        <html>
          <body style="font-family: sans-serif; padding: 24px;">
            <h1>Aya Admin UI</h1>
            <p>The React admin UI has not been built yet.</p>
            <p>Run <code>npm run build:admin-ui</code> in <code>apps/aya-ops-bot</code>.</p>
          </body>
        </html>
      `;
    }

    reply.type("text/html");
    return fs.readFileSync(adminUiIndexPath, "utf8");
  };

  app.get("/admin", serveAdminShell);
  app.get("/admin/", serveAdminShell);

  app.get("/admin/api/overview", { preHandler: [app.requireRoles(["admin"])] }, async (request) => {
    const date =
      (request.query as { date?: string } | undefined)?.date ?? getIsoDateString();
    const [syncStates, webhookSubscriptions] = await Promise.all([
      listBlueSyncStates(config.BLUE_WORKSPACE_ID),
      listBlueWebhookSubscriptions(config.BLUE_WORKSPACE_ID),
    ]);
    return {
      overview: await getAdminDashboardOverview(date),
      employees: await listAdminDashboardEmployeeActivity(50),
      sync: {
        states: syncStates,
        webhooks: webhookSubscriptions,
      },
    };
  });

  app.get("/admin/api/logs", { preHandler: [app.requireRoles(["admin"])] }, async (request) => {
    const query = parseWithSchema(adminLogsQuerySchema, request.query);
    return {
      items: await listAdminDashboardRecentLogs(query),
    };
  });

  app.get(
    "/admin/api/logs/:id",
    { preHandler: [app.requireRoles(["admin"])] },
    async (request) => {
      const detail = await getAdminDashboardLogDetail(
        (request.params as { id: string }).id,
      );
      if (!detail) {
        throw new NotFoundError("Audit log not found");
      }

      return {
        item: {
          ...detail,
          request_json: safeParseJson(detail.request_json),
          response_json: safeParseJson(detail.response_json),
        },
      };
    },
  );

  app.get(
    "/admin/api/employee-activity",
    { preHandler: [app.requireRoles(["admin"])] },
    async () => ({
      items: await listAdminDashboardEmployeeActivity(100),
    }),
  );

  app.get(
    "/admin/api/reporting",
    { preHandler: [app.requireRoles(["admin"])] },
    async (request) => {
      const overview = await getReportingOverview({
        auth: normalizeBlueRequestAuth({
          tokenId: getHeaderValue(
            request.headers,
            "x-aya-blue-token-id",
          ) ?? getHeaderValue(request.headers, "x-blue-token-id"),
          tokenSecret:
            getHeaderValue(request.headers, "x-aya-blue-token-secret") ??
            getHeaderValue(request.headers, "x-blue-token-secret"),
        }),
      });
      return {
        capability: overview.capability,
        dashboards: overview.dashboards,
        reports: overview.reports,
        errors: {
          dashboards: null,
          reports: null,
        },
      };
    },
  );

  app.get(
    "/admin/api/transcripts",
    { preHandler: [app.requireRoles(["admin"])] },
    async (request) => {
      const query = parseWithSchema(adminTranscriptsQuerySchema, request.query);
      return {
        items: await listRecentLibreChatTranscripts(query),
      };
    },
  );

  app.post(
    "/admin/api/sync/workspace-index",
    { preHandler: [app.requireRoles(["admin"])] },
    async (request) => {
      const payload = parseWithSchema(syncBodySchema, request.body) ?? {};
      return await syncWorkspaceIndex({
        forceFull: payload.forceFull,
      });
    },
  );

  app.post(
    "/admin/api/sync/employees",
    { preHandler: [app.requireRoles(["admin"])] },
    async () => await syncWorkspaceEmployees(),
  );

  app.post(
    "/admin/api/sync/blue-activity",
    { preHandler: [app.requireRoles(["admin"])] },
    async () => await runBlueIngestionOnce(),
  );
};

function getIsoDateString() {
  return new Date().toISOString().slice(0, 10);
}

function safeParseJson(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getHeaderValue(
  headers: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value =
    headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}
