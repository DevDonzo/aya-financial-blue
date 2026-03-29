import { sql } from "kysely";

import { db } from "../kysely.js";
import type { NormalizedActivityEvent } from "../../../types/blue.js";

export async function insertActivityEvent(event: NormalizedActivityEvent) {
  const result = await db
    .insertInto("activity_events")
    .values({
      id: event.id,
      employee_id: event.employeeId ?? null,
      source: event.source,
      source_event_id: event.sourceEventId ?? null,
      action_type: event.actionType,
      entity_type: event.entityType ?? null,
      entity_id: event.entityId ?? null,
      entity_title: event.entityTitle ?? null,
      occurred_at: event.occurredAt,
      summary: event.summary,
      raw_payload: JSON.stringify(event.rawPayload),
    })
    .onConflict((conflict) => conflict.columns(["source", "source_event_id"]).doNothing())
    .executeTakeFirst();

  return Number(result.numInsertedOrUpdatedRows ?? 0) > 0;
}

export async function listEventsForEmployeeDay(employeeId: string, date: string) {
  return await db
    .selectFrom("activity_events as ae")
    .leftJoin("employees as e", "e.id", "ae.employee_id")
    .select([
      "ae.id",
      "ae.source",
      "ae.action_type",
      "ae.entity_type",
      "ae.entity_id",
      "ae.entity_title",
      "ae.occurred_at",
      "ae.summary",
      "e.display_name as employee_name",
    ])
    .where("ae.employee_id", "=", employeeId)
    .where(sql`substr(ae.occurred_at, 1, 10)`, "=", date)
    .orderBy("ae.occurred_at", "desc")
    .execute();
}

export async function countEventsBySourceForEmployeeDay(
  employeeId: string,
  date: string,
) {
  return await db
    .selectFrom("activity_events")
    .select([
      "source",
      sql<number>`count(*)`.as("count"),
    ])
    .where("employee_id", "=", employeeId)
    .where(sql`substr(occurred_at, 1, 10)`, "=", date)
    .groupBy("source")
    .orderBy("count", "desc")
    .execute();
}

export async function countEventsByActionForEmployeeDay(
  employeeId: string,
  date: string,
) {
  return await db
    .selectFrom("activity_events")
    .select([
      "action_type",
      sql<number>`count(*)`.as("count"),
    ])
    .where("employee_id", "=", employeeId)
    .where(sql`substr(occurred_at, 1, 10)`, "=", date)
    .groupBy("action_type")
    .orderBy("count", "desc")
    .execute();
}

export async function listEventsForDay(date: string, limit = 25) {
  return await db
    .selectFrom("activity_events as ae")
    .leftJoin("employees as e", "e.id", "ae.employee_id")
    .select([
      "ae.id",
      "ae.source",
      "ae.action_type",
      "ae.entity_type",
      "ae.entity_id",
      "ae.entity_title",
      "ae.occurred_at",
      "ae.summary",
      "e.id as employee_id",
      "e.display_name as employee_name",
    ])
    .where(sql`substr(ae.occurred_at, 1, 10)`, "=", date)
    .orderBy("ae.occurred_at", "desc")
    .limit(limit)
    .execute();
}

export async function countEventsByEmployeeForDay(date: string) {
  return await db
    .selectFrom("activity_events as ae")
    .innerJoin("employees as e", "e.id", "ae.employee_id")
    .select([
      "e.id as employee_id",
      "e.display_name as employee_name",
      sql<number>`count(*)`.as("count"),
    ])
    .where(sql`substr(ae.occurred_at, 1, 10)`, "=", date)
    .groupBy(["e.id", "e.display_name"])
    .orderBy("count", "desc")
    .orderBy("e.display_name", "asc")
    .execute();
}

export async function listEmployeesWithoutActivityForDay(date: string) {
  return await db
    .selectFrom("employees as e")
    .select(["e.id", "e.display_name"])
    .where(({ not, exists, selectFrom }) =>
      not(
        exists(
          selectFrom("activity_events as ae")
            .select("ae.id")
            .whereRef("ae.employee_id", "=", "e.id")
            .where(sql`substr(ae.occurred_at, 1, 10)`, "=", date),
        ),
      ),
    )
    .orderBy("e.display_name", "asc")
    .execute();
}
