import cookie from "@fastify/cookie";
import Fastify from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestEnvironment } from "../helpers/test-env.js";

describe("admin routes", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("rejects unauthenticated access", async () => {
    const env = createTestEnvironment();
    try {
      const app = await buildTestAdminApp();
      const response = await app.inject({
        method: "GET",
        url: "/admin/api/employee-activity",
      });

      expect(response.statusCode).toBe(401);
      await app.close();
    } finally {
      env.cleanup();
    }
  });

  it("returns log detail and allows manual sync for admins", async () => {
    const env = createTestEnvironment();
    try {
      const app = await buildTestAdminApp();
      const { ensureEmployee, createAuthSession, createId, insertBotAuditLog } =
        await import("../../src/db.js");

      await ensureEmployee({
        employeeId: "admin_1",
        displayName: "Admin User",
        email: "admin@example.com",
        roleName: "admin",
      });
      await createAuthSession({
        id: createId("session"),
        employeeId: "admin_1",
        sessionToken: "admin-session-token",
        expiresAt: "2099-01-01T00:00:00.000Z",
      });
      await insertBotAuditLog({
        id: "audit_1",
        employeeId: "admin_1",
        transport: "web",
        inboundText: "hello",
        adapter: "local",
        outcome: "success",
        responseText: "ok",
        requestJson: { prompt: "hello" },
        responseJson: { message: "ok" },
      });
      await insertBotAuditLog({
        id: "audit_2",
        employeeId: "admin_1",
        transport: "web",
        inboundText: "move this to underwriting",
        detectedIntent: "records.move",
        adapter: "planner",
        outcome: "needs_clarification",
        responseText: "Which client should I move?",
        requestJson: {
          plan: {
            intent: "records.move",
            confidence: 0.74,
            matchedSignals: ["records:move:context"],
          },
        },
        responseJson: { clarificationRequired: true },
      });

      const detailResponse = await app.inject({
        method: "GET",
        url: "/admin/api/logs/audit_1",
        headers: {
          cookie: "aya_session=admin-session-token",
        },
      });
      expect(detailResponse.statusCode).toBe(200);
      expect(detailResponse.json().item.request_json).toEqual({ prompt: "hello" });

      const overviewResponse = await app.inject({
        method: "GET",
        url: "/admin/api/overview",
        headers: {
          cookie: "aya_session=admin-session-token",
        },
      });
      expect(overviewResponse.statusCode).toBe(200);
      expect(overviewResponse.json().overview.planner).toMatchObject({
        plannedCount: 1,
        clarificationCount: 1,
        lowConfidenceCount: 1,
        activeRecordFollowUps: 1,
        topIntents: [{ intent: "records.move", count: 1 }],
      });

      const syncResponse = await app.inject({
        method: "POST",
        url: "/admin/api/sync/workspace-index",
        headers: {
          cookie: "aya_session=admin-session-token",
        },
        payload: {},
      });
      expect(syncResponse.statusCode).toBe(200);
      expect(syncResponse.json()).toMatchObject({ mode: "incremental" });

      const reportingResponse = await app.inject({
        method: "GET",
        url: "/admin/api/reporting",
        headers: {
          cookie: "aya_session=admin-session-token",
        },
      });
      expect(reportingResponse.statusCode).toBe(200);
      expect(reportingResponse.json()).toMatchObject({
        capability: {
          configured: true,
          supportsDashboards: true,
          supportsReports: false,
        },
        dashboards: {
          items: [{ id: "dashboard_1", title: "Ops Dashboard" }],
        },
        reports: {
          items: [],
        },
      });

      await app.close();
    } finally {
      env.cleanup();
    }
  });
});

async function buildTestAdminApp() {
  vi.doMock("../../src/blue/workspace-index.js", async () => {
    const actual =
      await vi.importActual<typeof import("../../src/blue/workspace-index.js")>(
        "../../src/blue/workspace-index.js",
      );
    return {
      ...actual,
      syncWorkspaceIndex: vi.fn().mockResolvedValue({
        mode: "incremental",
        recordsSynced: 1,
      }),
    };
  });

  vi.doMock("../../src/blue/users-sync.js", async () => {
    const actual =
      await vi.importActual<typeof import("../../src/blue/users-sync.js")>(
        "../../src/blue/users-sync.js",
      );
    return {
      ...actual,
      syncWorkspaceEmployees: vi.fn().mockResolvedValue({
        synced: 1,
      }),
    };
  });

  vi.doMock("../../src/jobs/blue-poller.js", async () => {
    const actual =
      await vi.importActual<typeof import("../../src/jobs/blue-poller.js")>(
        "../../src/jobs/blue-poller.js",
      );
    return {
      ...actual,
      runBlueIngestionOnce: vi.fn().mockResolvedValue({
        activity: { inserted: 1 },
      }),
    };
  });

  vi.doMock("../../src/modules/blue/graphql/client.js", async () => {
    const actual =
      await vi.importActual<typeof import("../../src/modules/blue/graphql/client.js")>(
        "../../src/modules/blue/graphql/client.js",
      );
    return {
      ...actual,
      fetchBlueReportingCapability: vi.fn().mockResolvedValue({
        configured: true,
        companyId: "test-company",
        companyName: "Test Company",
        companySlug: "test-company",
        subscriptionStatus: "active",
        subscriptionActive: true,
        subscriptionTrialing: false,
        isEnterprise: false,
        supportsDashboards: true,
        supportsReports: false,
        plan: {
          planId: "pro",
          planName: "Pro",
        },
      }),
      fetchBlueDashboards: vi.fn().mockResolvedValue({
        items: [
          {
            id: "dashboard_1",
            title: "Ops Dashboard",
            createdAt: "2026-04-01T00:00:00.000Z",
            updatedAt: "2026-04-01T00:00:00.000Z",
            createdBy: { id: "user_1", email: "admin@example.com", fullName: "Admin User" },
            dashboardUsers: [],
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }),
      fetchBlueReports: vi.fn().mockResolvedValue({
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      }),
    };
  });

  const { initializeDatabase } = await import("../../src/db.js");
  const { requestContextPlugin } = await import("../../src/app/plugins/request-context.js");
  const { authPlugin } = await import("../../src/app/plugins/auth.js");
  const { errorHandlerPlugin } = await import("../../src/app/plugins/error-handler.js");
  const { adminRoutes } = await import("../../src/routes/admin.js");

  await initializeDatabase();

  const app = Fastify({ logger: false });
  await app.register(cookie);
  await app.register(requestContextPlugin);
  await app.register(authPlugin);
  await app.register(errorHandlerPlugin);
  await app.register(adminRoutes);

  return app;
}
