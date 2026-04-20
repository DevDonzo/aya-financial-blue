import {
  ExternalServiceError,
  ValidationError,
} from "../../app/errors.js";
import { getBlueRecordDetail } from "../../blue/record-detail.js";
import {
  listBotAuditLogsForDay,
  listBotAuditLogsForEmployeeDay,
  listBotAuditLogsInRange,
  listCachedBlueRecordsForInspection,
} from "../../db.js";
import {
  getIndexedRecord,
  resolveListQuery,
  resolveRecordQuery,
  searchRecordQuery,
  syncWorkspaceIndex,
} from "../../blue/workspace-index.js";
import { config } from "../../config.js";
import type { BlueRequestAuth, EmployeeIdentity } from "../../domain/types.js";
import type { BluePageInfo, BlueRecord } from "../../types/blue.js";
import {
  createComment,
  createLeadRecord,
  listAssignedOpenRecords,
  moveRecord,
} from "../blue/graphql/client.js";
import { resolveBlueWriteAuth } from "../blue/request-auth.js";
import {
  clearActiveRecordContextForActor,
  getActiveRecordContextForActor,
  rememberActiveRecordContext,
} from "../disambiguation/active-record-context.js";
import {
  clearPendingRecordChoiceForActor,
  rememberPendingRecordChoice,
  resolvePendingRecordChoice,
} from "../disambiguation/record-choices.js";
import { resolveActorIdentity as resolveActorIdentityService } from "../identity/service.js";
import { answerReportingQuestion, getReportingOverview } from "../../reporting/service.js";
import { buildEmployeeDaySummary } from "../../summary/daily.js";
import {
  buildNoActivitySummary,
  buildTeamDaySummary,
} from "../../summary/team.js";
import {
  buildClientBriefingInsights,
  buildClientDetailResponseText,
} from "./record-briefing.js";
import {
  buildEmployeeActivityReport,
  type EmployeeActivityFocus,
  buildWorkspaceActivityReport,
  buildRecordActivityReport,
  type RecordActivityFocus,
  type WorkspaceActivityFocus,
} from "./admin-activity-report.js";
import { normalizeActivityDateRange } from "./activity-date-range.js";
import {
  buildWorkspaceExceptionReport,
  type ExceptionReportFocus,
} from "./exception-report.js";

const BLUE_WRITE_AUTH_REJECTED_MESSAGE =
  "Blue rejected your saved personal Token ID and Secret for this write action. Open the Aya MCP server settings, re-save your Blue Token ID and Secret from Blue > Profile > API, then try again.";

export async function searchClients(
  input: {
    query: string;
    limit?: number;
    actor?: EmployeeIdentity | null;
    transport?: string;
  },
) {
  const items = await searchRecordQuery(input.query, input.limit ?? 8);

  if (input.actor && items.length > 1) {
    await rememberPendingRecordChoice({
      actor: input.actor,
      transport: input.transport ?? "mcp",
      continuationAction: "records.detail",
      originalQuery: input.query,
      candidates: items.map((item) => ({
        id: item.id,
        title: item.title,
        listTitle: item.listTitle,
      })),
    });
  } else if (input.actor && items.length === 1) {
    await clearPendingRecordChoiceForActor(input.actor);
    await rememberActiveRecordContext({
      actor: input.actor,
      transport: input.transport ?? "mcp",
      recordId: items[0].id,
      recordTitle: items[0].title,
      listTitle: items[0].listTitle,
    });
  } else if (input.actor) {
    await clearPendingRecordChoiceForActor(input.actor);
    await clearActiveRecordContextForActor(input.actor);
  }

  return {
    query: input.query,
    items,
  };
}

export async function getClientDetail(input: {
  recordId?: string;
  recordQuery?: string;
  useActiveRecordContext?: boolean;
  detailMode?: "default" | "briefing" | "call_prep";
  briefingFocus?: "general" | "handoff" | "blockers" | "missing_docs";
  actor?: EmployeeIdentity | null;
  transport?: string;
}) {
  const resolved =
    input.recordId && input.recordId.trim()
      ? await resolveDirectRecordReference(
          input.recordId.trim(),
          input.actor ?? null,
          input.transport,
        )
      : await resolveRecordOrThrow({
          query: input.recordQuery,
          fieldName: "recordQuery",
          actor: input.actor ?? null,
          transport: input.transport ?? "mcp",
          continuationAction: "records.detail",
          pendingParameters: {
            detailMode: input.detailMode ?? "default",
            briefingFocus: input.briefingFocus ?? "general",
          },
          useActiveRecordContext: input.useActiveRecordContext,
        });

  const detail = await getBlueRecordDetail(resolved.id);
  if (input.actor) {
    await rememberActiveRecordContext({
      actor: input.actor,
      transport: input.transport ?? "mcp",
      recordId: resolved.id,
      recordTitle: resolved.title ?? detail.title,
      listTitle: detail.list,
    });
  }

  const responseText = buildClientDetailResponseText(
    resolved.title ?? detail.title,
    detail,
    input.detailMode ?? "default",
    input.briefingFocus ?? "general",
  );

  return {
    recordId: resolved.id,
    recordTitle: resolved.title ?? detail.title,
    detail,
    briefing: buildClientBriefingInsights(detail),
    responseText,
  };
}

export async function getClientComments(input: {
  recordId?: string;
  recordQuery?: string;
  useActiveRecordContext?: boolean;
  limit?: number;
  actor?: EmployeeIdentity | null;
  transport?: string;
}) {
  const resolved =
    input.recordId && input.recordId.trim()
      ? await resolveDirectRecordReference(
          input.recordId.trim(),
          input.actor ?? null,
          input.transport,
        )
      : await resolveRecordOrThrow({
          query: input.recordQuery,
          fieldName: "recordQuery",
          actor: input.actor ?? null,
          transport: input.transport ?? "mcp",
          continuationAction: "comments.list_recent",
          useActiveRecordContext: input.useActiveRecordContext,
        });

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

  if (input.actor) {
    await rememberActiveRecordContext({
      actor: input.actor,
      transport: input.transport ?? "mcp",
      recordId: resolved.id,
      recordTitle: resolved.title ?? detail.title,
      listTitle: detail.list,
    });
  }

  return {
    recordId: resolved.id,
    recordTitle: resolved.title ?? detail.title,
    comments,
    responseText: buildCommentsResponseText(
      resolved.title ?? detail.title,
      comments,
    ),
  };
}

export async function getEmployeeDaySummary(input: {
  employeeId?: string;
  employeeEmail?: string;
  employeeName?: string;
  date?: string;
  transport?: string;
}) {
  const actor = await resolveActorOrThrow(input);
  const date = normalizeDate(input.date);
  return await buildEmployeeDaySummary(actor.employeeId, date);
}

export async function getEmployeeActivityReport(input: {
  employeeId?: string;
  employeeEmail?: string;
  employeeName?: string;
  date?: string;
  dateStart?: string;
  dateEnd?: string;
  dateLabel?: string;
  focus?: EmployeeActivityFocus;
  transport?: string;
}) {
  const actor = await resolveActorOrThrow(input);
  const range = normalizeActivityDateRange(input);
  const rows =
    range.dateStart === range.dateEnd
      ? await listBotAuditLogsForEmployeeDay({
          employeeId: actor.employeeId,
          dateIso: range.dateStart,
        })
      : await listBotAuditLogsInRange({
          employeeId: actor.employeeId,
          dateStartIso: range.dateStart,
          dateEndIso: range.dateEnd,
        });

  return buildEmployeeActivityReport({
    employeeName: actor.displayName,
    dateStart: range.dateStart,
    dateEnd: range.dateEnd,
    dateLabel: range.dateLabel,
    rows,
    focus: input.focus,
  });
}

export async function getWorkspaceActivityReport(input: {
  date?: string;
  dateStart?: string;
  dateEnd?: string;
  dateLabel?: string;
  focus?: WorkspaceActivityFocus;
}) {
  const range = normalizeActivityDateRange(input);
  const rows =
    range.dateStart === range.dateEnd
      ? await listBotAuditLogsForDay({
          dateIso: range.dateStart,
        })
      : await listBotAuditLogsInRange({
          dateStartIso: range.dateStart,
          dateEndIso: range.dateEnd,
        });

  return buildWorkspaceActivityReport({
    dateStart: range.dateStart,
    dateEnd: range.dateEnd,
    dateLabel: range.dateLabel,
    rows,
    focus: input.focus,
  });
}

export async function getWorkspaceExceptionReport(input: {
  focus?: ExceptionReportFocus;
  employeeName?: string;
}) {
  const rows = await listCachedBlueRecordsForInspection(config.BLUE_WORKSPACE_ID);

  return buildWorkspaceExceptionReport({
    rows,
    focus: input.focus,
    employeeName: input.employeeName,
  });
}

export async function getRecordActivityReport(input: {
  recordId?: string;
  recordQuery?: string;
  useActiveRecordContext?: boolean;
  date?: string;
  dateStart?: string;
  dateEnd?: string;
  dateLabel?: string;
  focus?: RecordActivityFocus;
  actor?: EmployeeIdentity | null;
  transport?: string;
}) {
  const resolved =
    input.recordId && input.recordId.trim()
      ? await resolveDirectRecordReference(
          input.recordId.trim(),
          input.actor ?? null,
          input.transport,
        )
      : await resolveRecordOrThrow({
          query: input.recordQuery,
          fieldName: "recordQuery",
          actor: input.actor ?? null,
          transport: input.transport ?? "mcp",
          continuationAction: "activity.record_report",
          useActiveRecordContext: input.useActiveRecordContext,
        });

  const range = normalizeActivityDateRange(input);
  const rows =
    range.dateStart === range.dateEnd
      ? await listBotAuditLogsForDay({
          dateIso: range.dateStart,
        })
      : await listBotAuditLogsInRange({
          dateStartIso: range.dateStart,
          dateEndIso: range.dateEnd,
        });

  return buildRecordActivityReport({
    recordId: resolved.id,
    recordTitle: resolved.title,
    dateStart: range.dateStart,
    dateEnd: range.dateEnd,
    dateLabel: range.dateLabel,
    rows,
    focus: input.focus,
  });
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
  transport?: string;
}) {
  const actor = await resolveActorOrThrow(input);
  const { items, pageInfo } = await loadAssignedOpenRecords(actor.employeeId);
  const totalItems = pageInfo.totalItems ?? items.length;
  const responseText =
    items.length === 0
      ? `${actor.displayName} has no open Blue records right now.`
      : [
          `${actor.displayName} has ${totalItems} open Blue record${
            totalItems === 1 ? "" : "s"
          }.`,
          ...items.slice(0, 12).map(
            (item, index) =>
              `${index + 1}. ${item.title} (${item.listTitle})${
                item.dueAt ? ` due ${item.dueAt.slice(0, 10)}` : ""
              }`,
          ),
          pageInfo.hasNextPage
            ? `Showing the first ${items.length} records. More are available.`
            : null,
        ]
          .filter(Boolean)
          .join("\n");

  return {
    employeeId: actor.employeeId,
    employeeName: actor.displayName,
    responseText,
    items,
    pageInfo,
  };
}

export async function getEmployeeFollowUpQueue(input: {
  employeeId?: string;
  employeeEmail?: string;
  employeeName?: string;
  date?: string;
  transport?: string;
}) {
  const actor = await resolveActorOrThrow(input);
  const referenceDate = normalizeDate(input.date);
  const { items, pageInfo } = await loadAssignedOpenRecords(actor.employeeId);
  const priorities = buildFollowUpPriorityQueue(items, referenceDate);
  const responseText = buildFollowUpQueueResponseText(
    actor.displayName,
    referenceDate,
    priorities,
    pageInfo.hasNextPage,
  );

  return {
    employeeId: actor.employeeId,
    employeeName: actor.displayName,
    date: referenceDate,
    responseText,
    ...priorities,
    pageInfo,
  };
}

export async function moveClientToStage(input: {
  recordId?: string;
  recordQuery?: string;
  targetListQuery: string;
  useActiveRecordContext?: boolean;
  actor?: EmployeeIdentity | null;
  blueAuth?: BlueRequestAuth | null;
  transport?: string;
}) {
  const writeAuth = resolveBlueWriteAuth(input.blueAuth);
  const record =
    input.recordId && input.recordId.trim()
      ? await resolveDirectRecordReference(
          input.recordId.trim(),
          input.actor ?? null,
          input.transport,
        )
      : await resolveRecordOrThrow({
          query: input.recordQuery,
          fieldName: "recordQuery",
          actor: input.actor ?? null,
          transport: input.transport ?? "mcp",
          continuationAction: "records.move",
          pendingParameters: {
            targetListQuery: input.targetListQuery,
          },
          useActiveRecordContext: input.useActiveRecordContext,
        });
  const list = await resolveListOrThrow(input.targetListQuery);
  const indexedRecord = await getIndexedRecord(record.id);

  if (indexedRecord?.listId === list.id) {
    return {
      ok: true,
      skipped: true,
      recordId: record.id,
      recordTitle: record.title,
      targetListId: list.id,
      targetListTitle: list.title,
      responseText: `${record.title} is already in ${list.title}.`,
    };
  }

  const result = await executeBlueWrite(() =>
    moveRecord({
      workspaceId: config.BLUE_WORKSPACE_ID,
      recordId: record.id,
      targetListId: list.id,
      auth: writeAuth,
    }),
  );

  if (!result.ok) {
    throw new ValidationError(`Blue could not move ${record.title}.`);
  }

  await syncWorkspaceIndex({ auth: writeAuth });

  if (input.actor) {
    await rememberActiveRecordContext({
      actor: input.actor,
      transport: input.transport ?? "mcp",
      recordId: record.id,
      recordTitle: record.title,
      listTitle: list.title,
    });
  }

  return {
    ok: true,
    recordId: record.id,
    recordTitle: record.title,
    targetListId: list.id,
    targetListTitle: list.title,
    responseText: `Moved ${record.title} to ${list.title}.`,
  };
}

export async function addCommentToClient(input: {
  recordId?: string;
  recordQuery?: string;
  text: string;
  useActiveRecordContext?: boolean;
  actor?: EmployeeIdentity | null;
  blueAuth?: BlueRequestAuth | null;
  transport?: string;
}) {
  const writeAuth = resolveBlueWriteAuth(input.blueAuth);
  const record =
    input.recordId && input.recordId.trim()
      ? await resolveDirectRecordReference(
          input.recordId.trim(),
          input.actor ?? null,
          input.transport,
        )
      : await resolveRecordOrThrow({
          query: input.recordQuery,
          fieldName: "recordQuery",
          actor: input.actor ?? null,
          transport: input.transport ?? "mcp",
          continuationAction: "comments.create",
          pendingParameters: {
            text: input.text.trim(),
          },
          useActiveRecordContext: input.useActiveRecordContext,
        });
  const comment = await executeBlueWrite(() =>
    createComment({
      workspaceId: config.BLUE_WORKSPACE_ID,
      recordId: record.id,
      text: input.text.trim(),
      auth: writeAuth,
    }),
  );

  if (input.actor) {
    await rememberActiveRecordContext({
      actor: input.actor,
      transport: input.transport ?? "mcp",
      recordId: record.id,
      recordTitle: record.title,
      listTitle: record.listTitle,
    });
  }

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
  transport?: string;
}) {
  const writeAuth = resolveBlueWriteAuth(input.blueAuth);
  const list = await resolveListOrThrow(input.targetListQuery || "🧰 0 - Leads/Tasks");
  const record = await executeBlueWrite(() =>
    createLeadRecord({
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
    }),
  );
  await syncWorkspaceIndex({ auth: writeAuth });

  if (input.actor) {
    await rememberActiveRecordContext({
      actor: input.actor,
      transport: input.transport ?? "mcp",
      recordId: record.id,
      recordTitle: record.title,
      listTitle: record.todoList.title,
    });
  }

  return {
    recordId: record.id,
    recordTitle: record.title,
    listId: list.id,
    listTitle: list.title,
    responseText: `Created ${record.title} in ${list.title}.`,
  };
}

export async function resolveActorOrThrow(input: {
  employeeId?: string;
  employeeEmail?: string;
  employeeName?: string;
  transport?: string;
}) {
  return await resolveActorIdentityService({
    employeeId: input.employeeId,
    employeeEmail: input.employeeEmail,
    employeeName: input.employeeName,
    transport: input.transport ?? "mcp",
    autoLinkByEmail: true,
  });
}

export {
  answerReportingQuestion,
  getReportingOverview,
};

type WorkloadItem = {
  id: string;
  title: string;
  listTitle: string;
  dueAt: string | null;
  updatedAt: string | null;
  startedAt: string | null;
  commentCount: number;
  done: boolean;
  archived: boolean;
};

type FollowUpPriorityItem = WorkloadItem & {
  priority: "overdue" | "due_today" | "stale";
  reason: string;
};

interface RecordResolutionInput {
  query?: string;
  fieldName: string;
  actor?: EmployeeIdentity | null;
  transport: string;
  continuationAction: string;
  pendingParameters?: Record<string, unknown>;
  useActiveRecordContext?: boolean;
}

async function resolveRecordOrThrow(input: RecordResolutionInput) {
  if (input.useActiveRecordContext) {
    const active = await resolveActiveRecordContextOrThrow(
      input.actor ?? null,
      input.transport,
      input.fieldName,
    );
    return {
      id: active.recordId,
      title: active.recordTitle,
      listTitle: active.listTitle ?? "",
    };
  }

  if (!input.query || !input.query.trim()) {
    throw new ValidationError(`Missing required parameter: ${input.fieldName}`);
  }

  if (input.actor) {
    const pendingSelection = await resolvePendingRecordChoice({
      actor: input.actor,
      transport: input.transport,
      message: input.query.trim(),
    });
    if (pendingSelection) {
      await clearPendingRecordChoiceForActor(input.actor);
      await rememberActiveRecordContext({
        actor: input.actor,
        transport: input.transport,
        recordId: pendingSelection.candidate.id,
        recordTitle: pendingSelection.candidate.title,
        listTitle: pendingSelection.candidate.listTitle ?? "",
      });
      return {
        id: pendingSelection.candidate.id,
        title: pendingSelection.candidate.title,
        listTitle: pendingSelection.candidate.listTitle ?? "",
      };
    }
  }

  const resolution = await resolveRecordQuery(input.query.trim());
  if (!resolution) {
    throw new ValidationError(
      `No cached Blue record matched "${input.query}". Sync the workspace index and try again.`,
    );
  }

  if (!resolution.match) {
    if (input.actor) {
      await rememberPendingRecordChoice({
        actor: input.actor,
        transport: input.transport,
        continuationAction: input.continuationAction,
        originalQuery: input.query.trim(),
        pendingParameters: input.pendingParameters,
        candidates: resolution.candidates,
      });
    }
    throw new ValidationError(
      formatCandidates(
        resolution.candidates.map((candidate) =>
          candidate.listTitle
            ? `${candidate.title} (${candidate.listTitle})`
            : candidate.title,
        ),
        `Multiple records matched "${input.query}". Be more specific.`,
      ),
    );
  }

  if (input.actor) {
    await clearPendingRecordChoiceForActor(input.actor);
    await rememberActiveRecordContext({
      actor: input.actor,
      transport: input.transport,
      recordId: resolution.match.id,
      recordTitle: resolution.match.title,
      listTitle: resolution.match.listTitle,
    });
  }

  return resolution.match;
}

async function resolveDirectRecordReference(
  recordId: string,
  actor?: EmployeeIdentity | null,
  transport?: string,
) {
  const cached = await getIndexedRecord(recordId);
  if (cached && actor) {
    await rememberActiveRecordContext({
      actor,
      transport: transport ?? "mcp",
      recordId: cached.id,
      recordTitle: cached.title,
      listTitle: cached.listTitle,
    });
  }

  return {
    id: recordId,
    title: cached?.title ?? recordId,
    listTitle: cached?.listTitle ?? "",
  };
}

async function resolveActiveRecordContextOrThrow(
  actor: EmployeeIdentity | null,
  transport: string,
  fieldName: string,
) {
  if (!actor) {
    throw new ValidationError(`Missing required parameter: ${fieldName}`);
  }

  const active = await getActiveRecordContextForActor(actor, transport);
  if (!active) {
    throw new ValidationError(
      "I need the client name first. Ask me to open or summarize the client, then try again.",
    );
  }

  return active;
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
        resolution.candidates.map((candidate) => candidate.title),
        `Multiple lists matched "${query}". Be more specific.`,
      ),
    );
  }

  return resolution.match;
}

async function executeBlueWrite<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (isBlueWriteAuthRejected(error)) {
      throw new ValidationError(BLUE_WRITE_AUTH_REJECTED_MESSAGE);
    }
    throw error;
  }
}

function isBlueWriteAuthRejected(error: unknown) {
  if (!(error instanceof ExternalServiceError)) {
    return false;
  }

  const message = error.message.toLowerCase();
  const details = error.details as
    | { message?: string; extensions?: Record<string, unknown> }
    | undefined;
  const code = String(details?.extensions?.code ?? "").toUpperCase();
  const detailMessage = String(details?.message ?? "").toLowerCase();

  return (
    code === "UNAUTHENTICATED" ||
    message.includes("not authenticated") ||
    message.includes("unauthorized") ||
    detailMessage.includes("not authenticated") ||
    detailMessage.includes("unauthorized")
  );
}

function buildCommentsResponseText(
  recordTitle: string,
  comments: Array<{
    occurredAt: string;
    actor: string;
    text: string;
  }>,
) {
  if (comments.length === 0) {
    return `${recordTitle} has no recent comments recorded.`;
  }

  return [
    `Recent comments for ${recordTitle}:`,
    ...comments.map(
      (comment, index) =>
        `${index + 1}. ${comment.actor} (${comment.occurredAt.slice(0, 10)}): ${comment.text}`,
    ),
  ].join("\n");
}

async function loadAssignedOpenRecords(
  assigneeId: string,
): Promise<{ items: WorkloadItem[]; pageInfo: BluePageInfo }> {
  const result = await listAssignedOpenRecords({
    workspaceId: config.BLUE_WORKSPACE_ID,
    companyId: config.BLUE_COMPANY_ID,
    assigneeId,
    limit: 50,
    skip: 0,
  });

  return {
    items: result.items.map(toWorkloadItem),
    pageInfo: {
      hasNextPage: Boolean(result.pageInfo.hasNextPage),
      hasPreviousPage: Boolean(result.pageInfo.hasPreviousPage),
      totalItems: result.pageInfo.totalItems ?? undefined,
      page: result.pageInfo.page ?? undefined,
      perPage: result.pageInfo.perPage ?? undefined,
    },
  };
}

function toWorkloadItem(item: BlueRecord): WorkloadItem {
  return {
    id: item.id,
    title: item.title,
    listTitle: item.todoList.title,
    dueAt: item.duedAt ?? null,
    updatedAt: item.updatedAt ?? null,
    startedAt: item.startedAt ?? null,
    commentCount: item.commentCount ?? 0,
    done: item.done,
    archived: item.archived,
  };
}

function buildFollowUpPriorityQueue(
  items: WorkloadItem[],
  referenceDate: string,
): {
  overdue: FollowUpPriorityItem[];
  dueToday: FollowUpPriorityItem[];
  stale: FollowUpPriorityItem[];
  prioritized: FollowUpPriorityItem[];
} {
  const staleCutoff = shiftIsoDate(referenceDate, -5);
  const overdue: FollowUpPriorityItem[] = [];
  const dueToday: FollowUpPriorityItem[] = [];
  const stale: FollowUpPriorityItem[] = [];

  for (const item of items) {
    const dueDate = isoDay(item.dueAt);
    const updatedDate = isoDay(item.updatedAt);

    if (dueDate && dueDate < referenceDate) {
      overdue.push({
        ...item,
        priority: "overdue",
        reason: `overdue since ${dueDate}`,
      });
      continue;
    }

    if (dueDate === referenceDate) {
      dueToday.push({
        ...item,
        priority: "due_today",
        reason: `due today (${referenceDate})`,
      });
      continue;
    }

    if (updatedDate && updatedDate <= staleCutoff) {
      stale.push({
        ...item,
        priority: "stale",
        reason: `stale, last updated ${updatedDate}`,
      });
    }
  }

  const byUrgency = (left: FollowUpPriorityItem, right: FollowUpPriorityItem) =>
    sortByDate(left.dueAt, right.dueAt) ||
    sortByDate(left.updatedAt, right.updatedAt) ||
    left.title.localeCompare(right.title);

  overdue.sort(byUrgency);
  dueToday.sort(byUrgency);
  stale.sort(byUrgency);

  return {
    overdue,
    dueToday,
    stale,
    prioritized: [...overdue, ...dueToday, ...stale],
  };
}

function buildFollowUpQueueResponseText(
  employeeName: string,
  referenceDate: string,
  priorities: {
    overdue: FollowUpPriorityItem[];
    dueToday: FollowUpPriorityItem[];
    stale: FollowUpPriorityItem[];
    prioritized: FollowUpPriorityItem[];
  },
  hasMore: boolean | null | undefined,
) {
  if (priorities.prioritized.length === 0) {
    return `${employeeName} has no overdue, due-today, or stale files on ${referenceDate}.`;
  }

  return [
    `Follow-up queue for ${employeeName} on ${referenceDate}`,
    `Overdue: ${priorities.overdue.length} | Due today: ${priorities.dueToday.length} | Stale: ${priorities.stale.length}`,
    ...priorities.prioritized.slice(0, 10).map(
      (item, index) =>
        `${index + 1}. ${item.title} (${item.listTitle}) - ${item.reason}`,
    ),
    hasMore
      ? "Showing the first priority files only. More open files are available."
      : null,
  ]
    .filter(Boolean)
    .join("\n");
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

function isoDay(value: string | null | undefined) {
  return value ? value.slice(0, 10) : null;
}

function shiftIsoDate(date: string, days: number) {
  const normalized = new Date(`${date}T00:00:00.000Z`);
  normalized.setUTCDate(normalized.getUTCDate() + days);
  return normalized.toISOString().slice(0, 10);
}

function sortByDate(left: string | null, right: string | null) {
  if (left && right) {
    return left.localeCompare(right);
  }

  if (left) {
    return -1;
  }

  if (right) {
    return 1;
  }

  return 0;
}
