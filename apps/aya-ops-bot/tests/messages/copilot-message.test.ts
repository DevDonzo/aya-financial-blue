import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestEnvironment } from "../helpers/test-env.js";

describe("Aya copilot message flow", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("keeps active client context across detail and comment follow-ups", async () => {
    const env = createTestEnvironment();

    try {
      vi.doMock("../../src/blue/record-detail.js", () => ({
        getBlueRecordDetail: vi.fn().mockResolvedValue({
          id: "record_1",
          title: "Hamza Client",
          list: "Leads",
          status: "Active",
          description: "",
          startedAt: null,
          dueAt: null,
          commentsCount: 2,
          createdAt: "2026-04-01T00:00:00.000Z",
          updatedAt: "2026-04-02T00:00:00.000Z",
          customFields: [],
          assignees: [],
          tags: [],
          contact: {
            firstName: "Hamza",
            lastName: "Client",
            phone: "4165550123",
            email: "hamza.client@example.com",
            uniqueId: "",
          },
          recentActivity: [
            {
              id: "comment_2",
              category: "COMMENT_CREATED",
              occurredAt: "2026-04-02T10:00:00.000Z",
              actor: "Aya Ops",
              commentText: "Docs received and ready for underwriting.",
              summary: "Docs received and ready for underwriting.",
            },
            {
              id: "comment_1",
              category: "COMMENT_CREATED",
              occurredAt: "2026-04-01T09:00:00.000Z",
              actor: "Aya Ops",
              commentText: "Client called to confirm income details.",
              summary: "Client called to confirm income details.",
            },
          ],
        }),
      }));

      const {
        ensureEmployee,
        initializeDatabase,
        upsertBlueRecordsCache,
      } = await import("../../src/db.js");

      await initializeDatabase();
      await ensureEmployee({
        employeeId: "employee_1",
        displayName: "Hamza Paracha",
        email: "hamza@ayafinancial.com",
        roleName: "employee",
      });
      await upsertBlueRecordsCache({
        workspaceId: "cmn524yr800e101mh7kn44mhf",
        items: [
          {
            id: "record_1",
            listId: "list_leads",
            listTitle: "Leads",
            title: "Hamza Client",
            normalizedTitle: "hamza client",
            contactEmail: "hamza.client@example.com",
            normalizedContactEmail: "hamza.client@example.com",
            contactPhone: "4165550123",
            normalizedContactPhone: "4165550123",
            status: "Active",
            rawJson: "{}",
          },
        ],
      });

      const { handleInboundMessage } = await import(
        "../../src/messages/handle-message.js"
      );

      const detailResponse = await handleInboundMessage({
        actorEmployeeId: "employee_1",
        message: "show me Hamza",
      });

      expect(detailResponse).toMatchObject({
        matched: true,
        intent: "records.detail",
      });
      expect(detailResponse.responseText).toContain(
        "Hamza Client is in Leads. Status: Active.",
      );

      const commentsResponse = await handleInboundMessage({
        actorEmployeeId: "employee_1",
        message: "comments on this client",
      });

      expect(commentsResponse).toMatchObject({
        matched: true,
        intent: "comments.list_recent",
      });
      expect(commentsResponse.responseText).toContain(
        "Recent comments for Hamza Client:",
      );
      expect(commentsResponse.responseText).toContain(
        "Docs received and ready for underwriting.",
      );
    } finally {
      env.cleanup();
    }
  });

  it("returns a call-prep style client briefing", async () => {
    const env = createTestEnvironment();

    try {
      vi.doMock("../../src/blue/record-detail.js", () => ({
        getBlueRecordDetail: vi.fn().mockResolvedValue({
          id: "record_1",
          title: "Hamza Client",
          list: "Underwriting",
          status: "Active",
          description: "",
          startedAt: null,
          dueAt: null,
          commentsCount: 2,
          createdAt: "2026-04-01T00:00:00.000Z",
          updatedAt: "2026-04-02T00:00:00.000Z",
          customFields: [],
          assignees: [
            {
              id: "employee_1",
              name: "Hamza Paracha",
              email: "hamza@ayafinancial.com",
            },
          ],
          tags: ["Priority"],
          contact: {
            firstName: "Hamza",
            lastName: "Client",
            phone: "4165550123",
            email: "hamza.client@example.com",
            uniqueId: "",
          },
          recentActivity: [
            {
              id: "comment_2",
              category: "COMMENT_CREATED",
              occurredAt: "2026-04-02T10:00:00.000Z",
              actor: "Aya Ops",
              commentText: "Client confirmed employment letter is ready.",
              summary: "Client confirmed employment letter is ready.",
            },
            {
              id: "comment_1",
              category: "COMMENT_CREATED",
              occurredAt: "2026-04-01T09:00:00.000Z",
              actor: "Aya Ops",
              commentText: "Waiting on updated bank statements.",
              summary: "Waiting on updated bank statements.",
            },
          ],
        }),
      }));

      const {
        ensureEmployee,
        initializeDatabase,
        upsertBlueRecordsCache,
      } = await import("../../src/db.js");

      await initializeDatabase();
      await ensureEmployee({
        employeeId: "employee_1",
        displayName: "Hamza Paracha",
        email: "hamza@ayafinancial.com",
        roleName: "employee",
      });
      await upsertBlueRecordsCache({
        workspaceId: "cmn524yr800e101mh7kn44mhf",
        items: [
          {
            id: "record_1",
            listId: "list_underwriting",
            listTitle: "Underwriting",
            title: "Hamza Client",
            normalizedTitle: "hamza client",
            contactEmail: "hamza.client@example.com",
            normalizedContactEmail: "hamza.client@example.com",
            contactPhone: "4165550123",
            normalizedContactPhone: "4165550123",
            status: "Active",
            rawJson: "{}",
          },
        ],
      });

      const { handleInboundMessage } = await import(
        "../../src/messages/handle-message.js"
      );

      const response = await handleInboundMessage({
        actorEmployeeId: "employee_1",
        message: "prep me for a call with Hamza",
      });

      expect(response).toMatchObject({
        matched: true,
        intent: "records.detail",
      });
      expect(response.responseText).toContain("Call prep for Hamza Client");
      expect(response.responseText).toContain(
        "Latest note: Aya Ops (2026-04-02): Client confirmed employment letter is ready.",
      );
      expect(response.responseText).toContain("Recent thread:");
      expect(response.responseText).toContain("Owner: Hamza Paracha");
    } finally {
      env.cleanup();
    }
  });

  it("returns a general file briefing with blockers and missing docs", async () => {
    const env = createTestEnvironment();

    try {
      vi.doMock("../../src/blue/record-detail.js", () => ({
        getBlueRecordDetail: vi.fn().mockResolvedValue({
          id: "record_1",
          title: "Hamza Client",
          list: "Underwriting",
          status: "Active",
          description:
            "Awaiting updated bank statements and employment letter from client.",
          startedAt: null,
          dueAt: "2026-04-10T00:00:00.000Z",
          commentsCount: 2,
          createdAt: "2026-04-01T00:00:00.000Z",
          updatedAt: "2026-04-09T10:00:00.000Z",
          customFields: [
            {
              id: "field_1",
              label: "Employment letter",
              type: "text",
              value: "pending",
            },
            {
              id: "field_2",
              label: "Bank statements",
              type: "text",
              value: "missing",
            },
          ],
          assignees: [
            {
              id: "employee_1",
              name: "Hamza Paracha",
              email: "hamza@ayafinancial.com",
            },
          ],
          tags: ["Urgent"],
          contact: {
            firstName: "Hamza",
            lastName: "Client",
            phone: "4165550123",
            email: "hamza.client@example.com",
            uniqueId: "",
          },
          recentActivity: [
            {
              id: "comment_2",
              category: "COMMENT_CREATED",
              occurredAt: "2026-04-09T10:00:00.000Z",
              actor: "Aya Ops",
              commentText: "Waiting on updated bank statements from client.",
              summary: "Waiting on updated bank statements from client.",
            },
            {
              id: "comment_1",
              category: "COMMENT_CREATED",
              occurredAt: "2026-04-08T09:00:00.000Z",
              actor: "Aya Ops",
              commentText: "Employment letter still needed before we can proceed.",
              summary: "Employment letter still needed before we can proceed.",
            },
          ],
        }),
      }));

      const {
        ensureEmployee,
        initializeDatabase,
        upsertBlueRecordsCache,
      } = await import("../../src/db.js");

      await initializeDatabase();
      await ensureEmployee({
        employeeId: "employee_1",
        displayName: "Hamza Paracha",
        email: "hamza@ayafinancial.com",
        roleName: "employee",
      });
      await upsertBlueRecordsCache({
        workspaceId: "cmn524yr800e101mh7kn44mhf",
        items: [
          {
            id: "record_1",
            listId: "list_underwriting",
            listTitle: "Underwriting",
            title: "Hamza Client",
            normalizedTitle: "hamza client",
            contactEmail: "hamza.client@example.com",
            normalizedContactEmail: "hamza.client@example.com",
            contactPhone: "4165550123",
            normalizedContactPhone: "4165550123",
            status: "Active",
            rawJson: "{}",
          },
        ],
      });

      const { handleInboundMessage } = await import(
        "../../src/messages/handle-message.js"
      );

      const response = await handleInboundMessage({
        actorEmployeeId: "employee_1",
        message: "what's going on with Hamza",
      });

      expect(response).toMatchObject({
        matched: true,
        intent: "records.detail",
      });
      expect(response.responseText).toContain("Briefing for Hamza Client");
      expect(response.responseText).toContain(
        "Stage: Underwriting | Status: Active | Due: 2026-04-10 | Updated: 2026-04-09",
      );
      expect(response.responseText).toContain("Owner: Hamza Paracha");
      expect(response.responseText).toContain("Current blockers:");
      expect(response.responseText).toContain(
        "- Waiting on updated bank statements from client.",
      );
      expect(response.responseText).toContain("Still needed from client:");
      expect(response.responseText).toContain("- Employment Letter");
      expect(response.responseText).toContain("- Bank Statements");
      expect(response.responseText).toContain("Next best action:");
    } finally {
      env.cleanup();
    }
  });

  it("returns a prioritized follow-up queue for the signed-in employee", async () => {
    const env = createTestEnvironment();

    try {
      vi.doMock("../../src/modules/blue/graphql/client.js", async () => {
        const actual =
          await vi.importActual<
            typeof import("../../src/modules/blue/graphql/client.js")
          >("../../src/modules/blue/graphql/client.js");

        return {
          ...actual,
          listAssignedOpenRecords: vi.fn().mockResolvedValue({
            items: [
              {
                id: "record_overdue",
                title: "Hamza overdue file",
                text: "",
                html: "",
                createdAt: "2026-04-01T00:00:00.000Z",
                updatedAt: "2026-04-01T00:00:00.000Z",
                startedAt: null,
                duedAt: "2026-04-08T23:59:59.999Z",
                archived: false,
                done: false,
                commentCount: 0,
                todoList: {
                  id: "list_1",
                  title: "Leads",
                  position: 1,
                  updatedAt: "2026-04-01T00:00:00.000Z",
                },
              },
              {
                id: "record_today",
                title: "Hamza due today",
                text: "",
                html: "",
                createdAt: "2026-04-01T00:00:00.000Z",
                updatedAt: "2026-04-08T00:00:00.000Z",
                startedAt: null,
                duedAt: "2026-04-09T23:59:59.999Z",
                archived: false,
                done: false,
                commentCount: 0,
                todoList: {
                  id: "list_2",
                  title: "Underwriting",
                  position: 2,
                  updatedAt: "2026-04-08T00:00:00.000Z",
                },
              },
              {
                id: "record_stale",
                title: "Hamza stale file",
                text: "",
                html: "",
                createdAt: "2026-03-28T00:00:00.000Z",
                updatedAt: "2026-04-02T00:00:00.000Z",
                startedAt: null,
                duedAt: null,
                archived: false,
                done: false,
                commentCount: 0,
                todoList: {
                  id: "list_3",
                  title: "Docs",
                  position: 3,
                  updatedAt: "2026-04-02T00:00:00.000Z",
                },
              },
            ],
            pageInfo: {
              totalItems: 3,
              hasNextPage: false,
              hasPreviousPage: false,
              page: 1,
              perPage: 50,
            },
          }),
        };
      });

      const { ensureEmployee, initializeDatabase } = await import("../../src/db.js");

      await initializeDatabase();
      await ensureEmployee({
        employeeId: "employee_1",
        displayName: "Hamza Paracha",
        email: "hamza@ayafinancial.com",
        roleName: "employee",
      });

      const { handleInboundMessage } = await import(
        "../../src/messages/handle-message.js"
      );

      const response = await handleInboundMessage({
        actorEmployeeId: "employee_1",
        message: "what needs follow up today",
      });

      expect(response).toMatchObject({
        matched: true,
        intent: "records.follow_up",
      });
      expect(response.responseText).toContain(
        "Follow-up queue for Hamza Paracha on 2026-04-09",
      );
      expect(response.responseText).toContain("Overdue: 1 | Due today: 1 | Stale: 1");
      expect(response.responseText).toContain(
        "Hamza overdue file (Leads) - overdue since 2026-04-08",
      );
      expect(response.responseText).toContain(
        "Hamza due today (Underwriting) - due today (2026-04-09)",
      );
      expect(response.responseText).toContain(
        "Hamza stale file (Docs) - stale, last updated 2026-04-02",
      );
    } finally {
      env.cleanup();
    }
  });

  it("moves the active client context through the shared execution service", async () => {
    const env = createTestEnvironment();

    try {
      vi.doMock("../../src/blue/record-detail.js", () => ({
        getBlueRecordDetail: vi.fn().mockResolvedValue({
          id: "record_1",
          title: "Hamza Client",
          list: "Leads",
          status: "Active",
          description: "",
          startedAt: null,
          dueAt: null,
          commentsCount: 0,
          createdAt: "2026-04-01T00:00:00.000Z",
          updatedAt: "2026-04-02T00:00:00.000Z",
          customFields: [],
          assignees: [],
          tags: [],
          contact: {
            firstName: "Hamza",
            lastName: "Client",
            phone: "",
            email: "",
            uniqueId: "",
          },
          recentActivity: [],
        }),
      }));

      vi.doMock("../../src/blue/workspace-index.js", async () => {
        const actual =
          await vi.importActual<typeof import("../../src/blue/workspace-index.js")>(
            "../../src/blue/workspace-index.js",
          );

        return {
          ...actual,
          syncWorkspaceIndex: vi.fn().mockResolvedValue({
            workspaceId: "cmn524yr800e101mh7kn44mhf",
            mode: "incremental",
            listsSynced: 1,
            recordsSynced: 1,
            lastSeenUpdatedAt: "2026-04-02T00:00:00.000Z",
          }),
        };
      });

      vi.doMock("../../src/modules/blue/graphql/client.js", async () => {
        const actual =
          await vi.importActual<
            typeof import("../../src/modules/blue/graphql/client.js")
          >("../../src/modules/blue/graphql/client.js");

        return {
          ...actual,
          moveRecord: vi.fn().mockResolvedValue({ ok: true }),
        };
      });

      const {
        ensureEmployee,
        initializeDatabase,
        upsertBlueListsCache,
        upsertBlueRecordsCache,
      } = await import("../../src/db.js");

      await initializeDatabase();
      await ensureEmployee({
        employeeId: "employee_1",
        displayName: "Hamza Paracha",
        email: "hamza@ayafinancial.com",
        roleName: "employee",
      });
      await upsertBlueListsCache({
        workspaceId: "cmn524yr800e101mh7kn44mhf",
        items: [
          {
            id: "list_leads",
            title: "Leads",
            normalizedTitle: "leads",
            position: 1,
          },
          {
            id: "list_underwriting",
            title: "Underwriting",
            normalizedTitle: "underwriting",
            position: 2,
          },
        ],
      });
      await upsertBlueRecordsCache({
        workspaceId: "cmn524yr800e101mh7kn44mhf",
        items: [
          {
            id: "record_1",
            listId: "list_leads",
            listTitle: "Leads",
            title: "Hamza Client",
            normalizedTitle: "hamza client",
            status: "Active",
            rawJson: "{}",
          },
        ],
      });

      const { handleInboundMessage } = await import(
        "../../src/messages/handle-message.js"
      );

      await handleInboundMessage({
        actorEmployeeId: "employee_1",
        message: "show me Hamza",
      });

      const moveResponse = await handleInboundMessage({
        actorEmployeeId: "employee_1",
        message: "move this to underwriting",
      });

      expect(moveResponse).toMatchObject({
        matched: true,
        intent: "records.move",
      });
      expect(moveResponse.responseText).toBe(
        "Moved Hamza Client to Underwriting.",
      );
    } finally {
      env.cleanup();
    }
  });
});
