import {
  createId,
  ensureEmployee,
  findEmployeeByName,
  upsertIdentityLink,
} from "../db.js";
import { fetchWorkspaceUsers } from "../modules/blue/graphql/client.js";
import { config } from "../config.js";

export async function syncWorkspaceEmployees() {
  const users = await fetchWorkspaceUsers(config.BLUE_WORKSPACE_ID);

  for (const user of users) {
    await ensureEmployee({
      employeeId: user.id,
      displayName: user.fullName,
      email: user.email,
      timezone: user.timezone ?? "America/Toronto",
    });

    await upsertIdentityLink({
      id: createId("ident"),
      employeeId: user.id,
      source: "blue",
      externalId: user.id,
      externalLabel: user.fullName,
    });

    if (user.email) {
      await upsertIdentityLink({
        id: createId("ident"),
        employeeId: user.id,
        source: "email",
        externalId: user.email,
        externalLabel: user.fullName,
      });
    }
  }

  return {
    fetched: users.length,
  };
}

export async function resolveEmployeeName(name: string) {
  return await findEmployeeByName(name);
}
