import { db } from "../kysely.js";

export async function upsertActiveRecordContext(input: {
  employeeId: string;
  transport: string;
  recordId: string;
  recordTitle: string;
  listTitle?: string | null;
  expiresAt: string;
}) {
  const nowIso = new Date().toISOString();

  await db
    .insertInto("active_record_context")
    .values({
      employee_id: input.employeeId,
      transport: input.transport,
      record_id: input.recordId,
      record_title: input.recordTitle,
      list_title: input.listTitle ?? null,
      expires_at: input.expiresAt,
      created_at: nowIso,
      updated_at: nowIso,
    })
    .onConflict((oc) =>
      oc.column("employee_id").doUpdateSet({
        transport: input.transport,
        record_id: input.recordId,
        record_title: input.recordTitle,
        list_title: input.listTitle ?? null,
        expires_at: input.expiresAt,
        updated_at: nowIso,
      }),
    )
    .execute();
}

export async function getActiveRecordContext(employeeId: string) {
  return await db
    .selectFrom("active_record_context")
    .selectAll()
    .where("employee_id", "=", employeeId)
    .executeTakeFirst();
}

export async function deleteActiveRecordContext(employeeId: string) {
  await db
    .deleteFrom("active_record_context")
    .where("employee_id", "=", employeeId)
    .execute();
}
