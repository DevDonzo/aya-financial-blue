import { PermissionError, ValidationError } from "../app/errors.js";
import { getBlueRecordDetail } from "../blue/record-detail.js";
import { resolveEmployeeName } from "../blue/users-sync.js";
import {
  getIndexedRecord,
  resolveListQuery,
  resolveRecordQuery,
  searchRecordQuery,
  syncWorkspaceIndex,
} from "../blue/workspace-index.js";
import { config } from "../config.js";
import { createId } from "../db.js";
import type {
  BlueRequestAuth,
  EmployeeIdentity,
  IntentRequest,
} from "../domain/types.js";
import {
  createComment,
  createLeadRecord,
  listAssignedOpenRecords,
  moveRecord,
} from "../modules/blue/graphql/client.js";
import {
  normalizeBlueRequestAuth,
  resolveBlueWriteAuth,
} from "../modules/blue/request-auth.js";
import {
  clearPendingRecordChoiceForActor,
  rememberPendingRecordChoice,
  resolvePendingRecordChoice,
} from "../modules/disambiguation/record-choices.js";
import { resolveActorIdentity } from "../modules/identity/service.js";
import { answerReportingQuestion, getReportingOverview } from "../reporting/service.js";
import { detectIntent } from "../router/intents.js";
import { insertBotAuditLog } from "../store/audit-store.js";
import { buildEmployeeDaySummary } from "../summary/daily.js";
import {
  buildNoActivitySummary,
  buildTeamDaySummary,
} from "../summary/team.js";

export interface InboundMessagePayload {
  transport?: string;
  senderId?: string;
  senderLabel?: string;
  actorEmployeeId?: string;
  actorEmployeeEmail?: string;
  actorEmployeeName?: string;
  actorBlueTokenId?: string;
  actorBlueTokenSecret?: string;
  message: string;
}

export interface MessageResponse {
  matched: boolean;
  intent?: string;
  actor: EmployeeIdentity;
  responseText: string;
  data?: unknown;
}

interface BlueExecutionResult {
  commandName: string;
  commandArgs: string;
  outcome: string;
  responseText: string;
  requestJson?: unknown;
  responseJson?: unknown;
  data?: unknown;
}

interface PendingFollowUpExecution extends BlueExecutionResult {
  intent: string;
  adapter: string;
}

function wrapPendingExecution(
  intent: string,
  execution: BlueExecutionResult,
): PendingFollowUpExecution {
  return {
    intent,
    adapter: "pending-record-choice",
    ...execution,
  };
}

function resolvePayloadBlueAuth(
  payload: InboundMessagePayload,
): BlueRequestAuth | null {
  return normalizeBlueRequestAuth({
    tokenId: payload.actorBlueTokenId,
    tokenSecret: payload.actorBlueTokenSecret,
  });
}

function redactPayloadForAudit(payload: InboundMessagePayload) {
  return {
    ...payload,
    actorBlueTokenId: payload.actorBlueTokenId ? "[redacted]" : undefined,
    actorBlueTokenSecret: payload.actorBlueTokenSecret
      ? "[redacted]"
      : undefined,
  };
}

export async function resolveActorFromPayload(
  payload: InboundMessagePayload,
): Promise<EmployeeIdentity> {
  return await resolveActorIdentity({
    employeeId: payload.actorEmployeeId,
    employeeEmail: payload.actorEmployeeEmail,
    employeeName: payload.actorEmployeeName,
    transport: payload.transport,
    senderId: payload.senderId,
    autoLinkByEmail: true,
  });
}

function enforceIntentPermissions(
  actor: EmployeeIdentity,
  match: NonNullable<ReturnType<typeof detectIntent>>,
) {
  const role = actor.roleName ?? "employee";

  if (role === "admin") {
    return;
  }

  if (
    match.intent === "summary.team_day" ||
    match.intent === "summary.no_activity_day" ||
    match.intent === "reporting.overview" ||
    match.intent === "reporting.question"
  ) {
    throw new PermissionError();
  }

  if (
    match.intent === "records.list_assigned" &&
    typeof match.parameters.employeeName === "string" &&
    match.parameters.employeeName.trim().toLowerCase() !==
      actor.displayName.trim().toLowerCase()
  ) {
    throw new PermissionError();
  }

  if (
    match.intent === "summary.employee_day" &&
    typeof match.parameters.employeeName === "string" &&
    match.parameters.employeeName.trim().toLowerCase() !==
      actor.displayName.trim().toLowerCase()
  ) {
    throw new PermissionError();
  }
}

async function recordAudit(input: {
  actor: EmployeeIdentity;
  transport: string;
  inboundText: string;
  detectedIntent?: string;
  adapter: string;
  outcome: string;
  responseText: string;
  commandName?: string;
  commandArgs?: string;
  requestJson?: unknown;
  responseJson?: unknown;
}) {
  await insertBotAuditLog({
    id: createId("audit"),
    employeeId: input.actor.blueUserId,
    transport: input.transport,
    inboundText: input.inboundText,
    detectedIntent: input.detectedIntent,
    adapter: input.adapter,
    commandName: input.commandName,
    commandArgs: input.commandArgs,
    outcome: input.outcome,
    responseText: input.responseText,
    requestJson: input.requestJson,
    responseJson: input.responseJson,
  });
}

function requireStringParameter(
  parameters: Record<string, string | number | boolean | undefined>,
  key: string,
) {
  const value = parameters[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new ValidationError(`Missing required parameter: ${key}`);
  }

  return value.trim();
}

function formatCandidates(
  candidates: Array<{ title: string; listTitle?: string }>,
  prefix: string,
) {
  const items = candidates
    .map((candidate) =>
      candidate.listTitle
        ? `- ${candidate.title} (${candidate.listTitle})`
        : `- ${candidate.title}`,
    )
    .join("\n");

  return `${prefix}\n${items}`;
}

async function resolveBlueMatch(
  actor: EmployeeIdentity,
  transport: string,
  match: NonNullable<ReturnType<typeof detectIntent>>,
) {
  if (match.intent === "records.list_assigned") {
    if (match.parameters.assigneeId) {
      return match;
    }

    const employeeName = requireStringParameter(
      match.parameters,
      "employeeName",
    );
    const employee = await resolveEmployeeName(employeeName);

    if (!employee) {
      throw new ValidationError(`Unknown employee: ${employeeName}`);
    }

    return {
      ...match,
      parameters: {
        ...match.parameters,
        assigneeId: employee.id,
      },
    };
  }

  if (match.intent === "records.move") {
    const recordQuery = requireStringParameter(match.parameters, "recordQuery");
    const targetListQuery = requireStringParameter(
      match.parameters,
      "targetListQuery",
    );

    const recordResolution = await resolveRecordReferenceForIntent({
      actor,
      transport,
      recordQuery,
      continuationAction: "records.move",
      pendingParameters: {
        targetListQuery,
      },
    });
    if (!recordResolution) {
      throw new ValidationError(
        `No cached Blue record matched "${recordQuery}". Sync the workspace index and try again.`,
      );
    }

    if (!recordResolution.match) {
      throw new ValidationError(
        formatCandidates(
          recordResolution.candidates,
          `Multiple records matched "${recordQuery}". Be more specific.`,
        ),
      );
    }

    const listResolution = await resolveListQuery(targetListQuery);
    if (!listResolution) {
      throw new ValidationError(
        `No cached Blue list matched "${targetListQuery}". Sync the workspace index and try again.`,
      );
    }

    if (!listResolution.match) {
      throw new ValidationError(
        formatCandidates(
          listResolution.candidates,
          `Multiple lists matched "${targetListQuery}". Be more specific.`,
        ),
      );
    }

    return {
      ...match,
      parameters: {
        ...match.parameters,
        recordId: recordResolution.match.id,
        recordTitle: recordResolution.match.title,
        sourceListTitle: recordResolution.match.listTitle,
        targetListId: listResolution.match.id,
        targetListTitle: listResolution.match.title,
      },
    };
  }

  if (match.intent === "records.create") {
    const fullName = requireStringParameter(match.parameters, "fullName");
    const targetListQuery =
      typeof match.parameters.targetListQuery === "string" &&
      match.parameters.targetListQuery.trim()
        ? match.parameters.targetListQuery.trim()
        : "🧰 0 - Leads/Tasks";

    const listResolution = await resolveListQuery(targetListQuery);
    if (!listResolution) {
      throw new ValidationError(
        `No cached Blue list matched "${targetListQuery}". Sync the workspace index and try again.`,
      );
    }

    if (!listResolution.match) {
      throw new ValidationError(
        formatCandidates(
          listResolution.candidates,
          `Multiple lists matched "${targetListQuery}". Be more specific.`,
        ),
      );
    }

    return {
      ...match,
      parameters: {
        ...match.parameters,
        fullName,
        targetListId: listResolution.match.id,
        targetListTitle: listResolution.match.title,
      },
    };
  }

  if (match.intent === "comments.create") {
    const recordQuery = requireStringParameter(match.parameters, "recordQuery");
    const text = requireStringParameter(match.parameters, "text");
    const recordResolution = await resolveRecordReferenceForIntent({
      actor,
      transport,
      recordQuery,
      continuationAction: "comments.create",
      pendingParameters: {
        text,
      },
    });

    if (!recordResolution) {
      throw new ValidationError(
        `No cached Blue record matched "${recordQuery}". Sync the workspace index and try again.`,
      );
    }

    if (!recordResolution.match) {
      throw new ValidationError(
        formatCandidates(
          recordResolution.candidates,
          `Multiple records matched "${recordQuery}". Be more specific.`,
        ),
      );
    }

    return {
      ...match,
      parameters: {
        ...match.parameters,
        recordId: recordResolution.match.id,
        recordTitle: recordResolution.match.title,
        text,
      },
    };
  }

  if (match.intent === "comments.list_recent") {
    const recordQuery = requireStringParameter(match.parameters, "recordQuery");
    const recordResolution = await resolveRecordReferenceForIntent({
      actor,
      transport,
      recordQuery,
      continuationAction: "comments.list_recent",
    });

    if (!recordResolution) {
      throw new ValidationError(
        `No cached Blue record matched "${recordQuery}". Sync the workspace index and try again.`,
      );
    }

    if (!recordResolution.match) {
      throw new ValidationError(
        formatCandidates(
          recordResolution.candidates,
          `Multiple records matched "${recordQuery}". Be more specific.`,
        ),
      );
    }

    return {
      ...match,
      parameters: {
        ...match.parameters,
        recordId: recordResolution.match.id,
        recordTitle: recordResolution.match.title,
      },
    };
  }

  return match;
}

export async function handleInboundMessage(
  payload: InboundMessagePayload,
): Promise<MessageResponse> {
  const actor = await resolveActorFromPayload(payload);
  const transport = payload.transport ?? "http";
  const blueAuth = resolvePayloadBlueAuth(payload);
  const auditPayload = redactPayloadForAudit(payload);

  const intentRequest: IntentRequest = {
    actor,
    message: payload.message,
    nowIso: new Date().toISOString(),
  };

  const match = detectIntent(intentRequest);
  if (!match) {
    const pendingFollowUp = await continuePendingRecordChoice(
      actor,
      transport,
      payload.message,
      blueAuth,
    );
    if (pendingFollowUp) {
      await recordAudit({
        actor,
        transport,
        inboundText: payload.message,
        detectedIntent: pendingFollowUp.intent,
        adapter: pendingFollowUp.adapter,
        commandName: pendingFollowUp.commandName,
        commandArgs: pendingFollowUp.commandArgs,
        outcome: pendingFollowUp.outcome,
        responseText: pendingFollowUp.responseText,
        requestJson: pendingFollowUp.requestJson,
        responseJson: pendingFollowUp.responseJson,
      });

      return {
        matched: true,
        intent: pendingFollowUp.intent,
        actor,
        responseText: pendingFollowUp.responseText,
        data: pendingFollowUp.data,
      };
    }

    const responseText =
      "I could not match that request to a supported action yet.";
    await recordAudit({
      actor,
      transport,
      inboundText: payload.message,
      adapter: "none",
      outcome: "unmatched",
      responseText,
      requestJson: {
        payload: auditPayload,
      },
      responseJson: {
        matched: false,
      },
    });

    return {
      matched: false,
      actor,
      responseText,
    };
  }

  enforceIntentPermissions(actor, match);

  if (match.intent === "summary.employee_day") {
    const employeeName = String(
      match.parameters.employeeName ?? actor.displayName,
    );
    const employee = await resolveEmployeeName(employeeName);
    if (!employee) {
      throw new ValidationError(`Unknown employee: ${employeeName}`);
    }

    const summary = await buildEmployeeDaySummary(
      employee.id,
      new Date().toISOString().slice(0, 10),
    );

    await recordAudit({
      actor,
      transport,
      inboundText: payload.message,
      detectedIntent: match.intent,
      adapter: "local",
      outcome: "success",
      responseText: summary.summaryText,
      requestJson: {
        payload: auditPayload,
        match,
        employeeId: employee.id,
      },
      responseJson: summary,
    });

    return {
      matched: true,
      intent: match.intent,
      actor,
      responseText: summary.summaryText,
      data: summary,
    };
  }

  if (match.intent === "summary.team_day") {
    const summary = await buildTeamDaySummary(
      new Date().toISOString().slice(0, 10),
    );

    await recordAudit({
      actor,
      transport,
      inboundText: payload.message,
      detectedIntent: match.intent,
      adapter: "local",
      outcome: "success",
      responseText: summary.summaryText,
      requestJson: {
        payload: auditPayload,
        match,
      },
      responseJson: summary,
    });

    return {
      matched: true,
      intent: match.intent,
      actor,
      responseText: summary.summaryText,
      data: summary,
    };
  }

  if (match.intent === "summary.no_activity_day") {
    const summary = await buildNoActivitySummary(
      new Date().toISOString().slice(0, 10),
    );

    await recordAudit({
      actor,
      transport,
      inboundText: payload.message,
      detectedIntent: match.intent,
      adapter: "local",
      outcome: "success",
      responseText: summary.summaryText,
      requestJson: {
        payload: auditPayload,
        match,
      },
      responseJson: summary,
    });

    return {
      matched: true,
      intent: match.intent,
      actor,
      responseText: summary.summaryText,
      data: summary,
    };
  }

  if (match.intent === "records.search") {
    const query = requireStringParameter(match.parameters, "query");
    const results = await searchRecordQuery(query, 5);
    const responseText =
      results.length === 0
        ? `No cached Blue records matched "${query}".`
        : results
            .map(
              (item: { title: string; listTitle: string }, index: number) =>
                `${index + 1}. ${item.title} (${item.listTitle})`,
            )
            .join("\n");

    await recordAudit({
      actor,
      transport,
      inboundText: payload.message,
      detectedIntent: match.intent,
      adapter: "local-cache",
      outcome: "success",
      responseText,
      requestJson: {
        payload: auditPayload,
        match,
        query,
      },
      responseJson: {
        items: results,
      },
    });

    if (results.length > 1) {
      await rememberPendingRecordChoice({
        actor,
        transport,
        continuationAction: "get_client_detail",
        originalQuery: query,
        candidates: results.map((item) => ({
          id: item.id,
          title: item.title,
          listTitle: item.listTitle,
        })),
      });
    } else if (results.length === 1) {
      await clearPendingRecordChoiceForActor(actor);
    }

    return {
      matched: true,
      intent: match.intent,
      actor,
      responseText,
      data: {
        items: results,
      },
    };
  }

  if (match.intent === "reporting.overview") {
    const overview = await getReportingOverview();

    await recordAudit({
      actor,
      transport,
      inboundText: payload.message,
      detectedIntent: match.intent,
      adapter: "blue-reporting",
      outcome: "success",
      responseText: overview.summaryText,
      requestJson: {
        payload: auditPayload,
        match,
      },
      responseJson: overview,
    });

    return {
      matched: true,
      intent: match.intent,
      actor,
      responseText: overview.summaryText,
      data: overview,
    };
  }

  if (match.intent === "reporting.question") {
    const question = requireStringParameter(match.parameters, "question");
    const result = await answerReportingQuestion({ question });

    await recordAudit({
      actor,
      transport,
      inboundText: payload.message,
      detectedIntent: match.intent,
      adapter: "blue-reporting",
      outcome: "success",
      responseText: result.answerText,
      requestJson: {
        payload: auditPayload,
        match,
        question,
      },
      responseJson: result,
    });

    return {
      matched: true,
      intent: match.intent,
      actor,
      responseText: result.answerText,
      data: result,
    };
  }

  const resolvedMatch = await resolveBlueMatch(actor, transport, match);
  const execution = await executeBlueIntent(actor, resolvedMatch, blueAuth);

  await recordAudit({
    actor,
    transport,
    inboundText: payload.message,
    detectedIntent: resolvedMatch.intent,
    adapter: "blue-graphql",
    commandName: execution.commandName,
    commandArgs: execution.commandArgs,
    outcome: execution.outcome,
    responseText: execution.responseText,
    requestJson: execution.requestJson,
    responseJson: execution.responseJson,
  });

  return {
    matched: true,
    intent: resolvedMatch.intent,
    actor,
    responseText: execution.responseText,
    data: execution.data,
  };
}

async function executeBlueIntent(
  actor: EmployeeIdentity,
  match: NonNullable<ReturnType<typeof detectIntent>>,
  blueAuth?: BlueRequestAuth | null,
): Promise<BlueExecutionResult> {
  if (match.intent === "records.move") {
    const writeAuth = resolveBlueWriteAuth(blueAuth);
    const recordId = requireStringParameter(match.parameters, "recordId");
    const targetListId = requireStringParameter(
      match.parameters,
      "targetListId",
    );
    const recordTitle = String(match.parameters.recordTitle);
    const targetListTitle = String(match.parameters.targetListTitle);
    const indexedRecord = await getIndexedRecord(recordId);

    if (indexedRecord?.listId === targetListId) {
      return {
        commandName: "moveTodo",
        commandArgs: JSON.stringify({ recordId, targetListId }),
        outcome: "success",
        responseText: `${recordTitle} is already in ${targetListTitle}.`,
        requestJson: {
          operation: "moveTodo",
          workspaceId: config.BLUE_WORKSPACE_ID,
          recordId,
          targetListId,
          skipped: "already-in-target-list",
        },
        responseJson: {
          ok: true,
          skipped: true,
        },
        data: {
          ok: true,
          skipped: true,
          recordId,
          recordTitle,
          targetListId,
          targetListTitle,
        },
      };
    }

    const result = await moveRecord({
      workspaceId: config.BLUE_WORKSPACE_ID,
      recordId,
      targetListId,
      auth: writeAuth,
    });

    await syncWorkspaceIndex();

    return {
      commandName: "moveTodo",
      commandArgs: JSON.stringify({ recordId, targetListId }),
      outcome: result.ok ? "success" : "failure",
      responseText: `Moved ${recordTitle} to ${targetListTitle}.`,
      requestJson: {
        operation: "moveTodo",
        authMode: writeAuth ? "user" : "system",
        workspaceId: config.BLUE_WORKSPACE_ID,
        recordId,
        targetListId,
      },
      responseJson: result,
      data: {
        ok: result.ok,
        recordId,
        recordTitle,
        targetListId,
        targetListTitle,
      },
    };
  }

  if (match.intent === "records.create") {
    const writeAuth = resolveBlueWriteAuth(blueAuth);
    const fullName = requireStringParameter(match.parameters, "fullName");
    const targetListId = requireStringParameter(
      match.parameters,
      "targetListId",
    );
    const targetListTitle = requireStringParameter(
      match.parameters,
      "targetListTitle",
    );
    const phone =
      typeof match.parameters.phone === "string"
        ? match.parameters.phone.trim()
        : undefined;
    const email =
      typeof match.parameters.email === "string"
        ? match.parameters.email.trim()
        : undefined;
    const financeAmountRaw =
      typeof match.parameters.financeAmount === "string"
        ? match.parameters.financeAmount.trim()
        : undefined;
    const notes =
      typeof match.parameters.notes === "string"
        ? match.parameters.notes.trim()
        : undefined;
    const financeAmount = financeAmountRaw
      ? Number(financeAmountRaw.replaceAll(",", ""))
      : undefined;

    if (financeAmountRaw && Number.isNaN(financeAmount)) {
      throw new ValidationError(`Invalid finance amount: ${financeAmountRaw}`);
    }

    const result = await createLeadRecord({
      workspaceId: config.BLUE_WORKSPACE_ID,
      listId: targetListId,
      fullName,
      phone,
      email,
      financeAmount,
      notes,
      auth: writeAuth,
    });

    await syncWorkspaceIndex();

    return {
      commandName: "createTodo",
      commandArgs: JSON.stringify({
        listId: targetListId,
        fullName,
        phone,
        email,
        financeAmount,
      }),
      outcome: "success",
      responseText: `Created ${fullName} in ${targetListTitle}.`,
      requestJson: {
        operation: "createLeadRecord",
        authMode: writeAuth ? "user" : "system",
        workspaceId: config.BLUE_WORKSPACE_ID,
        listId: targetListId,
        fullName,
        phone,
        email,
        financeAmount,
        notes,
      },
      responseJson: result,
      data: {
        recordId: result.id,
        recordTitle: result.title,
        listId: result.todoList.id,
        listTitle: result.todoList.title,
      },
    };
  }

  if (match.intent === "comments.create") {
    const writeAuth = resolveBlueWriteAuth(blueAuth);
    const recordId = requireStringParameter(match.parameters, "recordId");
    const text = requireStringParameter(match.parameters, "text");
    const recordTitle = String(match.parameters.recordTitle);
    const result = await createComment({
      workspaceId: config.BLUE_WORKSPACE_ID,
      recordId,
      text,
      auth: writeAuth,
    });

    return {
      commandName: "createComment",
      commandArgs: JSON.stringify({ recordId, text }),
      outcome: "success",
      responseText: `Added comment to ${recordTitle}.`,
      requestJson: {
        operation: "createComment",
        authMode: writeAuth ? "user" : "system",
        workspaceId: config.BLUE_WORKSPACE_ID,
        recordId,
        text,
      },
      responseJson: result,
      data: {
        recordId,
        recordTitle,
        comment: result,
      },
    };
  }

  if (match.intent === "comments.list_recent") {
    const recordId = requireStringParameter(match.parameters, "recordId");
    const recordTitle = requireStringParameter(match.parameters, "recordTitle");
    const detail = await getBlueRecordDetail(recordId);
    const comments = detail.recentActivity
      .filter((item) => item.commentText && item.commentText.trim())
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        occurredAt: item.occurredAt,
        actor: item.actor,
        text: item.commentText ?? "",
      }));

    const responseText =
      comments.length === 0
        ? `${recordTitle} has no recent comments recorded.`
        : [
            `Recent comments for ${recordTitle}:`,
            ...comments.map(
              (comment, index) =>
                `${index + 1}. ${comment.actor} (${comment.occurredAt.slice(0, 10)}): ${comment.text}`,
            ),
          ].join("\n");

    return {
      commandName: "commentList",
      commandArgs: JSON.stringify({ recordId, limit: 8 }),
      outcome: "success",
      responseText,
      requestJson: {
        operation: "getBlueRecordDetail",
        workspaceId: config.BLUE_WORKSPACE_ID,
        recordId,
        limit: 8,
      },
      responseJson: {
        recordId,
        recordTitle,
        comments,
      },
      data: {
        recordId,
        recordTitle,
        comments,
      },
    };
  }

  if (match.intent === "records.list_assigned") {
    const assigneeId = requireStringParameter(match.parameters, "assigneeId");
    const employeeName = String(
      match.parameters.employeeName ?? actor.displayName,
    );
    const result = await listAssignedOpenRecords({
      workspaceId: config.BLUE_WORKSPACE_ID,
      companyId: config.BLUE_COMPANY_ID,
      assigneeId,
      limit: 50,
      skip: 0,
    });

    const items = result.items.map((item) => ({
      id: item.id,
      title: item.title,
      listTitle: item.todoList.title,
      dueAt: item.duedAt ?? null,
      done: item.done,
      archived: item.archived,
    }));
    const totalItems = result.pageInfo.totalItems ?? items.length;
    const responseText =
      items.length === 0
        ? `${employeeName} has no open Blue records right now.`
        : [
            `${employeeName} has ${totalItems} open Blue record${totalItems === 1 ? "" : "s"}.`,
            ...items
              .slice(0, 12)
              .map(
                (item, index) =>
                  `${index + 1}. ${item.title} (${item.listTitle})${
                    item.dueAt ? ` due ${item.dueAt.slice(0, 10)}` : ""
                  }`,
              ),
            result.pageInfo.hasNextPage
              ? `Showing the first ${items.length} records. More are available.`
              : null,
          ]
            .filter(Boolean)
            .join("\n");

    return {
      commandName: "todoQueries.todos",
      commandArgs: JSON.stringify({
        companyId: config.BLUE_COMPANY_ID,
        workspaceId: config.BLUE_WORKSPACE_ID,
        assigneeId,
        limit: 50,
        skip: 0,
      }),
      outcome: "success",
      responseText,
      requestJson: {
        operation: "listAssignedOpenRecords",
        companyId: config.BLUE_COMPANY_ID,
        workspaceId: config.BLUE_WORKSPACE_ID,
        assigneeId,
        limit: 50,
        skip: 0,
      },
      responseJson: result,
      data: {
        employeeId: assigneeId,
        employeeName,
        items,
        pageInfo: result.pageInfo,
      },
    };
  }

  throw new ValidationError(`Unsupported Blue intent: ${match.intent}`);
}

async function resolveRecordReferenceForIntent(input: {
  actor: EmployeeIdentity;
  transport: string;
  recordQuery: string;
  continuationAction: string;
  pendingParameters?: Record<string, unknown>;
}) {
  const pendingSelection = await resolvePendingRecordChoice({
    actor: input.actor,
    transport: input.transport,
    message: input.recordQuery,
  });
  if (pendingSelection) {
    await clearPendingRecordChoiceForActor(input.actor);
    return {
      match: {
        id: pendingSelection.candidate.id,
        title: pendingSelection.candidate.title,
        listTitle: pendingSelection.candidate.listTitle ?? "",
      },
      candidates: [],
    };
  }

  const directResolution = await resolveRecordQuery(input.recordQuery);
  if (!directResolution) {
    return null;
  }

  if (!directResolution.match) {
    await rememberPendingRecordChoice({
      actor: input.actor,
      transport: input.transport,
      continuationAction: input.continuationAction,
      originalQuery: input.recordQuery,
      pendingParameters: input.pendingParameters,
      candidates: directResolution.candidates,
    });
    return directResolution;
  }

  await clearPendingRecordChoiceForActor(input.actor);
  return directResolution;
}

async function continuePendingRecordChoice(
  actor: EmployeeIdentity,
  transport: string,
  message: string,
  blueAuth?: BlueRequestAuth | null,
): Promise<PendingFollowUpExecution | null> {
  const pendingSelection = await resolvePendingRecordChoice({
    actor,
    transport,
    message,
  });
  if (!pendingSelection) {
    return null;
  }

  const { candidate, context } = pendingSelection;
  await clearPendingRecordChoiceForActor(actor);

  if (context.continuationAction === "get_client_detail") {
    const detail = await getBlueRecordDetail(candidate.id);
    const contactBits = [
      detail.contact.phone ? `Phone: ${detail.contact.phone}` : null,
      detail.contact.email ? `Email: ${detail.contact.email}` : null,
    ].filter(Boolean);
    const responseText = [
      `${candidate.title} is currently in ${detail.list}.`,
      contactBits.join(" | "),
      detail.recentActivity.length > 0
        ? `Recent activity: ${detail.recentActivity[0]?.summary ?? "n/a"}`
        : "No recent activity captured.",
    ]
      .filter(Boolean)
      .join("\n");

    return {
      intent: "records.search",
      adapter: "pending-record-choice",
      commandName: "getBlueRecordDetail",
      commandArgs: JSON.stringify({ recordId: candidate.id }),
      outcome: "success",
      responseText,
      requestJson: {
        operation: "getBlueRecordDetail",
        recordId: candidate.id,
        pendingContext: context,
      },
      responseJson: {
        recordId: candidate.id,
        recordTitle: candidate.title,
        detail,
      },
      data: {
        recordId: candidate.id,
        recordTitle: candidate.title,
        detail,
      },
    };
  }

  if (context.continuationAction === "comments.list_recent") {
    const syntheticMatch = {
      intent: "comments.list_recent" as const,
      confidence: 1,
      parameters: {
        recordId: candidate.id,
        recordTitle: candidate.title,
      },
    };
    return wrapPendingExecution(
      syntheticMatch.intent,
      await executeBlueIntent(actor, syntheticMatch, blueAuth),
    );
  }

  if (context.continuationAction === "comments.create") {
    const text =
      typeof context.pendingParameters.text === "string"
        ? context.pendingParameters.text
        : "";
    const syntheticMatch = {
      intent: "comments.create" as const,
      confidence: 1,
      parameters: {
        recordId: candidate.id,
        recordTitle: candidate.title,
        text,
      },
    };
    return wrapPendingExecution(
      syntheticMatch.intent,
      await executeBlueIntent(actor, syntheticMatch, blueAuth),
    );
  }

  if (context.continuationAction === "records.move") {
    const targetListQuery =
      typeof context.pendingParameters.targetListQuery === "string"
        ? context.pendingParameters.targetListQuery
        : "";
    const listResolution = await resolveListQuery(targetListQuery);
    if (!listResolution) {
      throw new ValidationError(
        `No cached Blue list matched "${targetListQuery}". Sync the workspace index and try again.`,
      );
    }

    if (!listResolution.match) {
      throw new ValidationError(
        formatCandidates(
          listResolution.candidates,
          `Multiple lists matched "${targetListQuery}". Be more specific.`,
        ),
      );
    }

    const syntheticMatch = {
      intent: "records.move" as const,
      confidence: 1,
      parameters: {
        recordId: candidate.id,
        recordTitle: candidate.title,
        sourceListTitle: candidate.listTitle ?? "",
        targetListId: listResolution.match.id,
        targetListTitle: listResolution.match.title,
      },
    };
    return wrapPendingExecution(
      syntheticMatch.intent,
      await executeBlueIntent(actor, syntheticMatch, blueAuth),
    );
  }

  return null;
}
