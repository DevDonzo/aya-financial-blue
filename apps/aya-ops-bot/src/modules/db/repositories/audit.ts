import { sql } from "kysely";

import { resolvedAuditStdoutMode } from "../../../config.js";
import { logger } from "../../../lib/logger.js";
import { db } from "../kysely.js";

export async function insertBotAuditLog(input: {
  id: string;
  employeeId?: string;
  transport: string;
  inboundText: string;
  detectedIntent?: string;
  adapter: string;
  commandName?: string;
  commandArgs?: string;
  outcome: string;
  responseText?: string;
  requestJson?: unknown;
  responseJson?: unknown;
}) {
  await db
    .insertInto("bot_audit_logs")
    .values({
      id: input.id,
      employee_id: input.employeeId ?? null,
      transport: input.transport,
      inbound_text: input.inboundText,
      detected_intent: input.detectedIntent ?? null,
      adapter: input.adapter,
      command_name: input.commandName ?? null,
      command_args: input.commandArgs ?? null,
      outcome: input.outcome,
      response_text: input.responseText ?? null,
      request_json:
        input.requestJson === undefined ? null : JSON.stringify(input.requestJson),
      response_json:
        input.responseJson === undefined ? null : JSON.stringify(input.responseJson),
    })
    .execute();

  logger.info(
    {
      audit: {
        id: input.id,
        employeeId: input.employeeId ?? null,
        transport: input.transport,
        detectedIntent: input.detectedIntent ?? null,
        adapter: input.adapter,
        commandName: input.commandName ?? null,
        outcome: input.outcome,
        ...(resolvedAuditStdoutMode === "full"
          ? {
              inboundText: input.inboundText,
              responseText: input.responseText ?? null,
              requestJson: input.requestJson ?? null,
              responseJson: input.responseJson ?? null,
            }
          : {}),
      },
    },
    "audit event",
  );
}

export async function getAdminDashboardOverview(dateIso: string) {
  const counts = await db
    .selectFrom("bot_audit_logs")
    .select([
      sql<number>`count(*)`.as("total_interactions"),
      sql<number>`sum(case when outcome = 'success' then 1 else 0 end)`.as(
        "success_count",
      ),
      sql<number>`sum(case when outcome != 'success' then 1 else 0 end)`.as(
        "failure_count",
      ),
      sql<number>`count(distinct employee_id)`.as("active_employees"),
    ])
    .where(sql`substr(created_at, 1, 10)`, "=", dateIso)
    .executeTakeFirst();

  const latest = await db
    .selectFrom("bot_audit_logs")
    .select("created_at")
    .orderBy("created_at", "desc")
    .limit(1)
    .executeTakeFirst();

  return {
    date: dateIso,
    totalInteractions: counts?.total_interactions ?? 0,
    successCount: counts?.success_count ?? 0,
    failureCount: counts?.failure_count ?? 0,
    activeEmployees: counts?.active_employees ?? 0,
    latestInteractionAt: latest?.created_at ?? null,
  };
}

export async function listAdminDashboardEmployeeActivity(limit = 25) {
  return await db
    .selectFrom("employees as e")
    .leftJoin("bot_audit_logs as l", "l.employee_id", "e.id")
    .select([
      "e.id as employee_id",
      "e.display_name",
      "e.role_name",
      sql<number>`count(l.id)`.as("interaction_count"),
      sql<number>`sum(case when l.outcome = 'success' then 1 else 0 end)`.as(
        "success_count",
      ),
      sql<number>`sum(case when l.outcome != 'success' and l.id is not null then 1 else 0 end)`.as(
        "failure_count",
      ),
      sql<number>`round(
        case
          when count(l.id) = 0 then 0
          else (sum(case when l.outcome = 'success' then 1 else 0 end) * 100.0) / count(l.id)
        end,
        2
      )`.as("success_rate"),
      sql<string | null>`max(l.created_at)`.as("latest_interaction_at"),
    ])
    .groupBy(["e.id", "e.display_name", "e.role_name"])
    .orderBy(sql`case when latest_interaction_at is null then 1 else 0 end`)
    .orderBy("latest_interaction_at", "desc")
    .orderBy("e.display_name", "asc")
    .limit(limit)
    .execute();
}

export async function listAdminDashboardRecentLogs(input?: {
  employeeId?: string;
  limit?: number;
}) {
  let query = db
    .selectFrom("bot_audit_logs as l")
    .leftJoin("employees as e", "e.id", "l.employee_id")
    .select([
      "l.id",
      "l.created_at",
      "l.employee_id",
      "e.display_name",
      "e.role_name",
      "l.transport",
      "l.detected_intent",
      "l.adapter",
      "l.command_name",
      "l.outcome",
      "l.inbound_text",
      "l.response_text",
    ]);

  if (input?.employeeId) {
    query = query.where("l.employee_id", "=", input.employeeId);
  }

  return await query
    .orderBy("l.created_at", "desc")
    .limit(input?.limit ?? 50)
    .execute();
}

export async function getAdminDashboardLogDetail(id: string) {
  return await db
    .selectFrom("bot_audit_logs as l")
    .leftJoin("employees as e", "e.id", "l.employee_id")
    .select([
      "l.id",
      "l.created_at",
      "l.employee_id",
      "e.display_name",
      "e.role_name",
      "l.transport",
      "l.detected_intent",
      "l.adapter",
      "l.command_name",
      "l.command_args",
      "l.outcome",
      "l.inbound_text",
      "l.response_text",
      "l.request_json",
      "l.response_json",
    ])
    .where("l.id", "=", id)
    .executeTakeFirst();
}
