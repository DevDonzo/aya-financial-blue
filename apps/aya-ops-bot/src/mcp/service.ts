import { getBlueRecordDetail } from "../blue/record-detail.js";
import {
  getIndexedRecord,
  resolveListQuery,
  resolveRecordQuery,
  searchRecordQuery,
  syncWorkspaceIndex,
} from "../blue/workspace-index.js";
import { config } from "../config.js";
import {
  handleInboundMessage,
  type InboundMessagePayload,
} from "../messages/handle-message.js";
import {
  createComment,
  createLeadRecord,
  listAssignedOpenRecords,
  moveRecord,
} from "../modules/blue/graphql/client.js";
import {
  clearPendingRecordChoiceForActor,
  rememberPendingRecordChoice,
  resolvePendingRecordChoice,
} from "../modules/disambiguation/record-choices.js";
import { buildEmployeeDaySummary } from "../summary/daily.js";
import {
  buildNoActivitySummary,
  buildTeamDaySummary,
} from "../summary/team.js";
import { resolveActorIdentity as resolveActorIdentityService } from "../modules/identity/service.js";
import { answerReportingQuestion, getReportingOverview } from "../reporting/service.js";
import type { BlueRequestAuth, EmployeeIdentity } from "../domain/types.js";
import { ValidationError } from "../app/errors.js";
import { resolveBlueWriteAuth } from "../modules/blue/request-auth.js";

export async function resolveActorIdentity(input: {
  employeeId?: string;
  employeeEmail?: string;
  employeeName?: string;
}): Promise<EmployeeIdentity | null> {
  try {
    return await resolveActorIdentityService({
      employeeId: input.employeeId,
      employeeEmail: input.employeeEmail,
      employeeName: input.employeeName,
      transport: "mcp",
      autoLinkByEmail: true,
    });
  } catch {
    return null;
  }
}

export async function runAyaMessageTool(input: {
  message: string;
  actorEmployeeId?: string;
  actorEmployeeEmail?: string;
  actorEmployeeName?: string;
  blueAuth?: BlueRequestAuth | null;
}) {
  const payload: InboundMessagePayload = {
    transport: "mcp",
    actorEmployeeId: input.actorEmployeeId,
    actorEmployeeEmail: input.actorEmployeeEmail,
    actorEmployeeName: input.actorEmployeeName,
    actorBlueTokenId: input.blueAuth?.tokenId,
    actorBlueTokenSecret: input.blueAuth?.tokenSecret,
    message: input.message,
  };

  return await handleInboundMessage(payload);
}

export async function searchClients(
  query: string,
  limit = 8,
  actor?: EmployeeIdentity | null,
) {
  const items = await searchRecordQuery(query, limit);
  if (actor && items.length > 1) {
    await rememberPendingRecordChoice({
      actor,
      transport: "mcp",
      continuationAction: "get_client_detail",
      originalQuery: query,
      candidates: items.map((item) => ({
        id: item.id,
        title: item.title,
        listTitle: item.listTitle,
      })),
    });
  } else if (actor && items.length <= 1) {
    await clearPendingRecordChoiceForActor(actor);
  }

  return {
    query,
    items,
  };
}

export async function getClientDetail(input: {
  recordId?: string;
  clientQuery?: string;
  actor?: EmployeeIdentity | null;
}) {
  const resolved =
    input.recordId && input.recordId.trim()
      ? {
          id: input.recordId.trim(),
          title: undefined,
        }
      : await resolveRecordOrThrow(
          input.clientQuery,
          "clientQuery",
          input.actor,
          "get_client_detail",
        );

  const detail = await getBlueRecordDetail(resolved.id);

  return {
    recordId: resolved.id,
    recordTitle: resolved.title ?? detail.title,
    detail,
  };
}

export async function getClientComments(input: {
  recordId?: string;
  clientQuery?: string;
  limit?: number;
  actor?: EmployeeIdentity | null;
}) {
  const resolved =
    input.recordId && input.recordId.trim()
      ? {
          id: input.recordId.trim(),
          title: undefined,
        }
      : await resolveRecordOrThrow(
          input.clientQuery,
          "clientQuery",
          input.actor,
          "comments.list_recent",
        );

  const detail = await getBlueRecordDetail(resolved.id);
  const comments = detail.recentActivity
    .filter((item) => item.commentText && item.commentText.trim())
    .slice(0, Math.min(input.limit ?? 8, 20))
    .map((item) => ({
      id: item.id,
      occurredAt: item.occurredAt,
      actor: item.actor,
      text: item.commentText ?? "",
    }));

  const responseText =
    comments.length === 0
      ? `${resolved.title ?? detail.title} has no recent comments recorded.`
      : [
          `Recent comments for ${resolved.title ?? detail.title}:`,
          ...comments.map(
            (comment, index) =>
              `${index + 1}. ${comment.actor} (${comment.occurredAt.slice(0, 10)}): ${comment.text}`,
          ),
        ].join("\n");

  return {
    recordId: resolved.id,
    recordTitle: resolved.title ?? detail.title,
    comments,
    responseText,
  };
}

export async function getEmployeeDaySummary(input: {
  employeeId?: string;
  employeeEmail?: string;
  employeeName?: string;
  date?: string;
}) {
  const actor = await resolveActorOrThrow(input);
  const date = normalizeDate(input.date);

  return await buildEmployeeDaySummary(actor.employeeId, date);
}

export async function getTeamDaySummary(input: {
  date?: string;
  inactiveOnly?: boolean;
}) {
  const date = normalizeDate(input.date);
  return input.inactiveOnly
    ? await buildNoActivitySummary(date)
    : await buildTeamDaySummary(date);
}

export async function getEmployeeWorkload(input: {
  employeeId?: string;
  employeeEmail?: string;
  employeeName?: string;
}) {
  const actor = await resolveActorOrThrow(input);
  const result = await listAssignedOpenRecords({
    workspaceId: config.BLUE_WORKSPACE_ID,
    companyId: config.BLUE_COMPANY_ID,
    assigneeId: actor.employeeId,
    limit: 50,
    skip: 0,
  });

  const items = result.items.map((item) => ({
    id: item.id,
    title: item.title,
    listTitle: item.todoList.title,
    dueAt: item.duedAt ?? null,
  }));
  const rawOutput =
    items.length === 0
      ? "No open records."
      : items
          .map(
            (item, index) =>
              `${index + 1}. ${item.title} (${item.listTitle})${
                item.dueAt ? ` due ${item.dueAt.slice(0, 10)}` : ""
              }`,
          )
          .join("\n");

  return {
    employeeId: actor.employeeId,
    employeeName: actor.displayName,
    rawOutput,
    items,
    pageInfo: result.pageInfo,
  };
}


export async function moveClientToStage(input: {
  recordQuery: string;
  targetListQuery: string;
  actor?: EmployeeIdentity | null;
  blueAuth?: BlueRequestAuth | null;
}) {
  const writeAuth = resolveBlueWriteAuth(input.blueAuth);
  const record = await resolveRecordOrThrow(
    input.recordQuery,
    "recordQuery",
    input.actor,
    "records.move",
    {
      targetListQuery: input.targetListQuery,
    },
  );
  const list = await resolveListOrThrow(input.targetListQuery);
  const indexedRecord = await getIndexedRecord(record.id);

  if (indexedRecord?.listId === list.id) {
    return {
      recordId: record.id,
      recordTitle: record.title,
      targetListId: list.id,
      targetListTitle: list.title,
      responseText: `${record.title} is already in ${list.title}.`,
    };
  }

  const result = await moveRecord({
    workspaceId: config.BLUE_WORKSPACE_ID,
    recordId: record.id,
    targetListId: list.id,
    auth: writeAuth,
  });
  if (!result.ok) {
    throw new Error("Failed to move client");
  }
  await syncWorkspaceIndex();

  return {
    recordId: record.id,
    recordTitle: record.title,
    targetListId: list.id,
    targetListTitle: list.title,
    responseText: `Moved ${record.title} to ${list.title}.`,
  };
}

export async function addCommentToClient(input: {
  recordQuery: string;
  text: string;
  actor?: EmployeeIdentity | null;
  blueAuth?: BlueRequestAuth | null;
}) {
  const writeAuth = resolveBlueWriteAuth(input.blueAuth);
  const record = await resolveRecordOrThrow(
    input.recordQuery,
    "recordQuery",
    input.actor,
    "comments.create",
    {
      text: input.text.trim(),
    },
  );
  const comment = await createComment({
    workspaceId: config.BLUE_WORKSPACE_ID,
    recordId: record.id,
    text: input.text.trim(),
    auth: writeAuth,
  });

  return {
    recordId: record.id,
    recordTitle: record.title,
    text: input.text.trim(),
    comment,
    responseText: `Added comment to ${record.title}.`,
  };
}

export async function createClientRecord(input: {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  financeAmount?: number;
  notes?: string;
  targetListQuery?: string;
  actor?: EmployeeIdentity | null;
  blueAuth?: BlueRequestAuth | null;
}) {
  const writeAuth = resolveBlueWriteAuth(input.blueAuth);
  const list = await resolveListOrThrow(input.targetListQuery || "🧰 0 - Leads/Tasks");
  const record = await createLeadRecord({
    workspaceId: config.BLUE_WORKSPACE_ID,
    listId: list.id,
    firstName: input.firstName?.trim(),
    lastName: input.lastName?.trim(),
    fullName: input.fullName?.trim(),
    phone: input.phone?.trim(),
    email: input.email?.trim(),
    financeAmount: input.financeAmount,
    notes: input.notes?.trim(),
    auth: writeAuth,
  });
  await syncWorkspaceIndex();

  return {
    recordId: record.id,
    recordTitle: record.title,
    listId: list.id,
    listTitle: list.title,
    responseText: `Created ${record.title} in ${list.title}.`,
  };
}

async function resolveActorOrThrow(input: {
  employeeId?: string;
  employeeEmail?: string;
  employeeName?: string;
}) {
  const actor = await resolveActorIdentityService({
    employeeId: input.employeeId,
    employeeEmail: input.employeeEmail,
    employeeName: input.employeeName,
    transport: "mcp",
    autoLinkByEmail: true,
  });

  return actor;
}

async function resolveRecordOrThrow(
  query: string | undefined,
  fieldName: string,
  actor?: EmployeeIdentity | null,
  continuationAction = "get_client_detail",
  pendingParameters?: Record<string, unknown>,
) {
  if (!query || !query.trim()) {
    throw new ValidationError(`Missing required parameter: ${fieldName}`);
  }

  if (actor) {
    const pendingSelection = await resolvePendingRecordChoice({
      actor,
      transport: "mcp",
      message: query.trim(),
    });
    if (pendingSelection) {
      await clearPendingRecordChoiceForActor(actor);
      return {
        id: pendingSelection.candidate.id,
        title: pendingSelection.candidate.title,
        listTitle: pendingSelection.candidate.listTitle ?? "",
      };
    }
  }

  const resolution = await resolveRecordQuery(query.trim());
  if (!resolution) {
    throw new ValidationError(
      `No cached Blue record matched "${query}". Sync the workspace index and try again.`,
    );
  }

  if (!resolution.match) {
    if (actor) {
      await rememberPendingRecordChoice({
        actor,
        transport: "mcp",
        continuationAction,
        originalQuery: query.trim(),
        pendingParameters,
        candidates: resolution.candidates,
      });
    }
    throw new ValidationError(
      formatCandidates(
        resolution.candidates.map((candidate: { title: string; listTitle?: string }) =>
          candidate.listTitle
            ? `${candidate.title} (${candidate.listTitle})`
            : candidate.title,
        ),
        `Multiple records matched "${query}". Be more specific.`,
      ),
    );
  }

  if (actor) {
    await clearPendingRecordChoiceForActor(actor);
  }

  return resolution.match;
}

async function resolveListOrThrow(query: string) {
  if (!query.trim()) {
    throw new ValidationError("Missing required parameter: targetListQuery");
  }

  const resolution = await resolveListQuery(query.trim());
  if (!resolution) {
    throw new ValidationError(
      `No cached Blue list matched "${query}". Sync the workspace index and try again.`,
    );
  }

  if (!resolution.match) {
    throw new ValidationError(
      formatCandidates(
        resolution.candidates.map((candidate: { title: string }) => candidate.title),
        `Multiple lists matched "${query}". Be more specific.`,
      ),
    );
  }

  return resolution.match;
}

function formatCandidates(candidates: string[], prefix: string) {
  return `${prefix}\n${candidates.map((candidate) => `- ${candidate}`).join("\n")}`;
}

function normalizeDate(date: string | undefined) {
  if (date && date.trim()) {
    return date.trim();
  }

  return new Date().toISOString().slice(0, 10);
}
