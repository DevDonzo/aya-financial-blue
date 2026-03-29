import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
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

    return HttpResponse.json({ data: {} });
  }),
);

describe("blue graphql client mutations and workload query", () => {
  beforeAll(() => server.listen());
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
});

