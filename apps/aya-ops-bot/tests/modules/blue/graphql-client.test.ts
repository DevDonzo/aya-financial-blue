import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import { createTestEnvironment } from "../../helpers/test-env.js";

const requests: Array<{ query: string; variables: Record<string, unknown> }> = [];
const server = setupServer(
  http.post("https://blue.test/graphql", async ({ request }) => {
    const body = (await request.json()) as {
      query: string;
      variables: Record<string, unknown>;
    };
    requests.push(body);

    if (body.query.includes("mutation MoveTodo")) {
      return HttpResponse.json({ data: { moveTodo: true } });
    }

    if (body.query.includes("mutation CreateComment")) {
      return HttpResponse.json({
        data: {
          createComment: {
            id: "comment_1",
            uid: "comment_uid_1",
            text: body.variables.input && (body.variables.input as { text: string }).text,
            html: "<p>Hello</p>",
            createdAt: "2026-03-25T00:00:00.000Z",
            updatedAt: "2026-03-25T00:00:00.000Z",
            deletedAt: null,
            user: null,
          },
        },
      });
    }

    if (body.query.includes("query AssignedOpenRecords")) {
      return HttpResponse.json({
        data: {
          todoQueries: {
            todos: {
              items: [
                {
                  id: "todo_1",
                  uid: "todo_uid_1",
                  title: "Follow up with Sheraz",
                  text: "",
                  html: "",
                  startedAt: null,
                  duedAt: "2026-03-26T00:00:00.000Z",
                  commentCount: 0,
                  archived: false,
                  done: false,
                  createdAt: "2026-03-25T00:00:00.000Z",
                  updatedAt: "2026-03-25T00:00:00.000Z",
                  users: [],
                  tags: [],
                  customFields: [],
                  todoList: {
                    id: "list_1",
                    uid: "list_uid_1",
                    title: "Leads",
                    position: 1,
                    updatedAt: "2026-03-25T00:00:00.000Z",
                  },
                },
              ],
              pageInfo: {
                totalItems: 101,
                hasNextPage: true,
                hasPreviousPage: false,
                page: 1,
                perPage: 50,
              },
            },
          },
        },
      });
    }

    if (body.query.includes("query ReportingCapability")) {
      return HttpResponse.json({
        data: {
          company: {
            id: "test-company",
            name: "Test Company",
            slug: "test-company",
            subscriptionStatus: "active",
            subscriptionActive: true,
            subscriptionTrialing: false,
            isEnterprise: true,
            subscriptionPlan: {
              planId: "enterprise",
              planName: "Enterprise",
              status: "active",
              isPaid: true,
              currentPeriodEnd: "2026-12-31T00:00:00.000Z",
              trialEnd: null,
            },
          },
        },
      });
    }

    if (body.query.includes("query ReportingDashboards")) {
      return HttpResponse.json({
        data: {
          dashboards: {
            items: [
              {
                id: "dashboard_1",
                title: "Revenue Dashboard",
                createdAt: "2026-03-25T00:00:00.000Z",
                updatedAt: "2026-03-26T00:00:00.000Z",
                createdBy: {
                  id: "user_1",
                  email: "owner@example.com",
                  fullName: "Owner",
                },
                dashboardUsers: [],
              },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      });
    }

    if (body.query.includes("query ReportingReportById")) {
      const reportId = String(body.variables.id ?? "report_fallback");
      return HttpResponse.json({
        data: {
          report: {
            id: reportId,
            title: reportId.endsWith("_1")
              ? "AYA x Hamza Workspace Overview"
              : "AYA x Hamza Employee Workload Tracker",
            description: "Fallback report",
            createdAt: "2026-03-25T00:00:00.000Z",
            updatedAt: "2026-03-26T00:00:00.000Z",
            lastGeneratedAt: "2026-03-27T00:00:00.000Z",
            projectIds: ["cmn524yr800e101mh7kn44mhf"],
            createdBy: {
              id: "user_1",
              email: "owner@example.com",
              fullName: "Owner",
            },
            reportUsers: [],
            dataSources: [
              {
                id: "source_fallback_1",
                name: "Leads",
                sourceType: "TODOS",
                projectIds: ["cmn524yr800e101mh7kn44mhf"],
                order: 1,
              },
            ],
          },
        },
      });
    }

    if (body.query.includes("query ReportingReports")) {
      return HttpResponse.json({
        data: {
          reports: {
            items: [
              {
                id: "report_1",
                title: "Weekly Funnel",
                description: "Tracks weekly conversion flow",
                createdAt: "2026-03-25T00:00:00.000Z",
                updatedAt: "2026-03-26T00:00:00.000Z",
                lastGeneratedAt: "2026-03-27T00:00:00.000Z",
                createdBy: {
                  id: "user_1",
                  email: "owner@example.com",
                  fullName: "Owner",
                },
                reportUsers: [],
                dataSources: [
                  {
                    id: "source_1",
                    name: "Leads",
                    sourceType: "TODOS",
                    projectIds: ["cmn524yr800e101mh7kn44mhf"],
                    order: 1,
                  },
                ],
              },
            ],
            totalCount: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      });
    }

    return HttpResponse.json({ data: {} });
  }),
);

describe("blue graphql client mutations and workload query", () => {
  beforeAll(() => server.listen());
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    server.resetHandlers();
    requests.length = 0;
  });
  afterAll(() => server.close());

  it("moves a record through moveTodo", async () => {
    const env = createTestEnvironment();
    try {
      const { moveRecord } = await import("../../../src/modules/blue/graphql/client.js");
      const result = await moveRecord({
        workspaceId: "cmn524yr800e101mh7kn44mhf",
        recordId: "todo_123",
        targetListId: "list_456",
      });

      expect(result).toEqual({ ok: true });
      expect(requests[0]?.variables).toEqual({
        input: {
          todoId: "todo_123",
          todoListId: "list_456",
        },
      });
    } finally {
      env.cleanup();
    }
  });

  it("creates a comment through createComment", async () => {
    const env = createTestEnvironment();
    try {
      const { createComment } = await import("../../../src/modules/blue/graphql/client.js");
      const result = await createComment({
        workspaceId: "cmn524yr800e101mh7kn44mhf",
        recordId: "todo_123",
        text: "Hello",
      });

      expect(result.id).toBe("comment_1");
      expect(requests[0]?.variables).toEqual({
        input: {
          html: "<p>Hello</p>",
          text: "Hello",
          category: "TODO",
          categoryId: "todo_123",
          tiptap: false,
        },
      });
    } finally {
      env.cleanup();
    }
  });

  it("queries assigned open records with a default limit of 50", async () => {
    const env = createTestEnvironment();
    try {
      const { listAssignedOpenRecords } = await import(
        "../../../src/modules/blue/graphql/client.js"
      );
      const result = await listAssignedOpenRecords({
        workspaceId: "cmn524yr800e101mh7kn44mhf",
        companyId: "test-company",
        assigneeId: "user_1",
      });

      expect(result.items).toHaveLength(1);
      expect(result.pageInfo.totalItems).toBe(101);
      expect((requests[0]?.variables.limit as number) ?? 0).toBe(50);
    } finally {
      env.cleanup();
    }
  });

  it("reads reporting capability, dashboards, and reports", async () => {
    const env = createTestEnvironment();
    try {
      const {
        fetchBlueDashboards,
        fetchBlueReportingCapability,
        fetchBlueReports,
      } = await import("../../../src/modules/blue/graphql/client.js");

      const capability = await fetchBlueReportingCapability("test-company");
      const dashboards = await fetchBlueDashboards({ companyId: "test-company" });
      const reports = await fetchBlueReports({ companyId: "test-company" });

      expect(capability.supportsReports).toBe(true);
      expect(capability.plan?.planName).toBe("Enterprise");
      expect(dashboards.items[0]?.title).toBe("Revenue Dashboard");
      expect(reports.items[0]?.title).toBe("Weekly Funnel");
    } finally {
      env.cleanup();
    }
  });

  it("merges fallback report ids when the company report list is empty", async () => {
    const env = createTestEnvironment({
      BLUE_REPORT_FALLBACK_IDS: "report_fallback_1,report_fallback_2",
    });

    server.use(
      http.post("https://blue.test/graphql", async ({ request }) => {
        const body = (await request.json()) as {
          query: string;
          variables: Record<string, unknown>;
        };
        requests.push(body);

        if (body.query.includes("query ReportingReports")) {
          return HttpResponse.json({
            data: {
              reports: {
                items: [],
                totalCount: 0,
                hasNextPage: false,
                hasPreviousPage: false,
              },
            },
          });
        }

        if (body.query.includes("query ReportingReportById")) {
          const reportId = String(body.variables.id ?? "report_fallback_1");
          return HttpResponse.json({
            data: {
              report: {
                id: reportId,
                title: reportId.endsWith("_1")
                  ? "AYA x Hamza Workspace Overview"
                  : "AYA x Hamza Employee Workload Tracker",
                description: "Fallback report",
                createdAt: "2026-03-25T00:00:00.000Z",
                updatedAt: "2026-03-26T00:00:00.000Z",
                lastGeneratedAt: "2026-03-27T00:00:00.000Z",
                projectIds: ["cmn524yr800e101mh7kn44mhf"],
                createdBy: {
                  id: "user_1",
                  email: "owner@example.com",
                  fullName: "Owner",
                },
                reportUsers: [],
                dataSources: [
                  {
                    id: `source_${reportId}`,
                    name: "Leads",
                    sourceType: "TODOS",
                    projectIds: ["cmn524yr800e101mh7kn44mhf"],
                    order: 1,
                  },
                ],
              },
            },
          });
        }

        return HttpResponse.json({ data: {} });
      }),
    );

    try {
      const { fetchBlueReports } = await import(
        "../../../src/modules/blue/graphql/client.js"
      );

      const reports = await fetchBlueReports({ companyId: "test-company", take: 12 });

      expect(reports.items.map((item) => item.title)).toEqual([
        "AYA x Hamza Workspace Overview",
        "AYA x Hamza Employee Workload Tracker",
      ]);
      expect(
        requests.filter((request) => request.query.includes("query ReportingReportById")),
      ).toHaveLength(2);
    } finally {
      env.cleanup();
    }
  });
});
