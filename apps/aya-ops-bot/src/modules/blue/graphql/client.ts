import { config } from "../../../config.js";
import { ExternalServiceError, ValidationError } from "../../../app/errors.js";
import { logger } from "../../../lib/logger.js";
import type {
  BlueActivityEvent,
  BlueComment,
  BlueCustomFieldDefinition,
  BlueRecord,
  BlueTodoList,
  BlueUser,
  BlueWebhook,
  BlueWebhookEventType,
} from "../../../types/blue.js";

type GraphqlResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
};

class RequestQueue {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(private readonly concurrency: number) {}

  async run<T>(task: () => Promise<T>) {
    if (this.active >= this.concurrency) {
      await new Promise<void>((resolve) => {
        this.waiters.push(resolve);
      });
    }

    this.active += 1;
    try {
      return await task();
    } finally {
      this.active -= 1;
      this.waiters.shift()?.();
    }
  }
}

const requestQueue = new RequestQueue(config.BLUE_GRAPHQL_MAX_CONCURRENCY);

export async function blueGraphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: {
    projectId?: string;
  },
): Promise<T> {
  ensureGraphqlConfig();

  return await requestQueue.run(async () => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.BLUE_GRAPHQL_RETRY_ATTEMPTS; attempt += 1) {
      const startedAt = Date.now();
      try {
        const response = await fetch(config.BLUE_API_URL, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-bloo-token-id": config.BLUE_CLIENT_ID,
            "x-bloo-token-secret": config.BLUE_AUTH_TOKEN,
            "x-bloo-company-id": config.BLUE_COMPANY_ID,
            ...(options?.projectId
              ? { "x-bloo-project-id": options.projectId }
              : {}),
          },
          body: JSON.stringify({ query, variables }),
        });
        const payload = (await response.json()) as GraphqlResponse<T>;

        if (response.status === 429 || response.status >= 500) {
          throw new ExternalServiceError(
            `Blue GraphQL request failed with status ${response.status}`,
            payload.errors,
          );
        }

        if (payload.errors?.length) {
          const first = payload.errors[0];
          const message = first?.message ?? "Blue GraphQL request failed";
          const code = String(first?.extensions?.code ?? "");
          if (isRetryableGraphqlError(code, message)) {
            throw new ExternalServiceError(message, first);
          }

          throw new ExternalServiceError(message, first);
        }

        if (!payload.data) {
          throw new ExternalServiceError("Blue GraphQL response had no data");
        }

        const elapsedMs = Date.now() - startedAt;
        logger.info(
          {
            blueGraphql: {
              elapsedMs,
              projectId: options?.projectId ?? null,
              operation: getOperationLabel(query),
            },
          },
          "blue graphql ok",
        );
        return payload.data;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Unknown Blue GraphQL error");

        logger.warn(
          {
            err: lastError,
            blueGraphql: {
              attempt,
              projectId: options?.projectId ?? null,
              operation: getOperationLabel(query),
            },
          },
          "blue graphql request failed",
        );

        if (attempt >= config.BLUE_GRAPHQL_RETRY_ATTEMPTS) {
          break;
        }

        const retryAfterMs = getRetryAfterMs(lastError);
        const delayMs =
          retryAfterMs ??
          config.BLUE_GRAPHQL_RETRY_BASE_MS * 2 ** (attempt - 1) +
            Math.floor(Math.random() * 150);
        await sleep(delayMs);
      }
    }

    throw new ExternalServiceError(
      lastError?.message ?? "Blue GraphQL request failed",
    );
  });
}

export async function fetchWorkspaceUsers(workspaceId: string) {
  const items: BlueUser[] = [];
  let skip = 0;
  const pageSize = 100;

  while (true) {
    const data = await blueGraphqlRequest<{
      projectUserList: {
        users: BlueUser[];
        totalCount: number;
        pageInfo: {
          hasNextPage: boolean;
        };
      };
    }>(
      `
        query WorkspaceUsers($projectId: String!, $skip: Int!, $first: Int!) {
          projectUserList(projectId: $projectId, skip: $skip, first: $first, orderBy: firstName_ASC) {
            users {
              id
              uid
              email
              firstName
              lastName
              fullName
              timezone
              updatedAt
            }
            totalCount
            pageInfo {
              hasNextPage
            }
          }
        }
      `,
      {
        projectId: workspaceId,
        skip,
        first: pageSize,
      },
      { projectId: workspaceId },
    );

    const pageItems = data.projectUserList.users;
    items.push(...pageItems);
    if (!data.projectUserList.pageInfo.hasNextPage || pageItems.length < pageSize) {
      break;
    }
    skip += pageSize;
  }

  return items;
}

export async function fetchWorkspaceLists(input: {
  workspaceId: string;
  updatedAfter?: string | null;
}) {
  const data = await blueGraphqlRequest<{
    todoLists: Array<BlueTodoList & { todosCount: number }>;
  }>(
    `
      query WorkspaceLists($projectId: String!) {
        todoLists(projectId: $projectId) {
          id
          uid
          title
          position
          createdAt
          updatedAt
          todosCount
        }
      }
    `,
    {
      projectId: input.workspaceId,
    },
    { projectId: input.workspaceId },
  );

  return data.todoLists;
}

export async function fetchWorkspaceListRecords(input: {
  workspaceId: string;
  listId: string;
  updatedAfter?: string | null;
}) {
  const items: BlueRecord[] = [];
  let skip = 0;

  while (true) {
    const data = await blueGraphqlRequest<{
      todoList: {
        id: string;
        title: string;
        todos: BlueRecord[];
      } | null;
    }>(
      `
        query WorkspaceListRecords(
          $listId: String!,
          $skip: Int!,
          $first: Int!
        ) {
          todoList(id: $listId) {
            id
            title
            todos(orderBy: updatedAt_DESC, skip: $skip, first: $first) {
              id
              uid
              title
              text
              html
              startedAt
              duedAt
              commentCount
              archived
              done
              createdAt
              updatedAt
              users {
                id
                uid
                email
                firstName
                lastName
                fullName
                timezone
                updatedAt
              }
              tags {
                id
                title
                color
              }
              customFields {
                id
                name
                type
                value
              }
              todoList {
                id
                uid
                title
                position
                updatedAt
              }
            }
          }
        }
      `,
      {
        listId: input.listId,
        skip,
        first: config.BLUE_GRAPHQL_PAGE_SIZE,
      },
      { projectId: input.workspaceId },
    );

    const rawPageItems = data.todoList?.todos ?? [];
    const pageItems = rawPageItems.filter((item) =>
      input.updatedAfter ? item.updatedAt >= input.updatedAfter : true,
    );
    items.push(...pageItems);
    if (rawPageItems.length < config.BLUE_GRAPHQL_PAGE_SIZE) {
      break;
    }
    if (
      input.updatedAfter &&
      rawPageItems[rawPageItems.length - 1] &&
      rawPageItems[rawPageItems.length - 1]!.updatedAt < input.updatedAfter
    ) {
      break;
    }
    skip += config.BLUE_GRAPHQL_PAGE_SIZE;
  }

  return items;
}

export async function fetchRecordDetail(workspaceId: string, recordId: string) {
  const data = await blueGraphqlRequest<{
    todo: BlueRecord | null;
    commentList: {
      comments: BlueComment[];
    };
  }>(
    `
      query RecordDetail($recordId: String!) {
        todo(id: $recordId) {
          id
          uid
          title
          text
          html
          startedAt
          duedAt
          commentCount
          archived
          done
          createdAt
          updatedAt
          users {
            id
            uid
            email
            firstName
            lastName
            fullName
            timezone
            updatedAt
          }
          tags {
            id
            title
            color
          }
          customFields {
            id
            name
            type
            value
          }
          todoList {
            id
            uid
            title
            position
            updatedAt
          }
        }
        commentList(categoryId: $recordId, category: TODO, first: 12, orderBy: updatedAt_DESC) {
          comments {
            id
            uid
            text
            html
            createdAt
            updatedAt
            deletedAt
            user {
              id
              uid
              email
              firstName
              lastName
              fullName
              timezone
              updatedAt
            }
          }
        }
      }
    `,
    {
      recordId,
    },
    { projectId: workspaceId },
  );

  return {
    record: data.todo ?? null,
    comments: data.commentList.comments,
  };
}

export async function fetchWorkspaceActivity(input: {
  workspaceId: string;
  limit: number;
  startDate?: string | null;
}) {
  const data = await blueGraphqlRequest<{
    activityList: {
      activities: BlueActivityEvent[];
      totalCount: number;
    };
  }>(
    `
      query ActivityList($projectId: String!, $first: Int!, $startDate: DateTime) {
        activityList(projectId: $projectId, first: $first, startDate: $startDate, orderBy: createdAt_DESC) {
          activities {
            id
            uid
            category
            html
            createdAt
            updatedAt
            createdBy {
              id
              uid
              email
              firstName
              lastName
              fullName
              timezone
              updatedAt
            }
            affectedBy {
              id
              uid
              email
              firstName
              lastName
              fullName
              timezone
              updatedAt
            }
            project {
              id
              name
              slug
            }
            todo {
              id
              title
            }
            comment {
              id
              uid
              text
              html
              createdAt
              updatedAt
              deletedAt
            }
          }
          totalCount
        }
      }
    `,
    {
      projectId: input.workspaceId,
      first: input.limit,
      startDate: input.startDate ?? null,
    },
    { projectId: input.workspaceId },
  );

  return data.activityList.activities;
}

export async function createOrUpdateWebhook(input: {
  workspaceId: string;
  url: string;
  events: BlueWebhookEventType[];
  existingWebhookId?: string;
}) {
  if (input.existingWebhookId) {
    const data = await blueGraphqlRequest<{
      updateWebhook: BlueWebhook;
    }>(
      `
        mutation UpdateWebhook($input: UpdateWebhookInput!) {
          updateWebhook(input: $input) {
            id
            name
            url
            events
            projectIds
            enabled
            status
            createdAt
            updatedAt
          }
        }
      `,
      {
        input: {
          webhookId: input.existingWebhookId,
          url: input.url,
          events: input.events,
          projectIds: [input.workspaceId],
          enabled: true,
        },
      },
    );

    return { webhook: data.updateWebhook, secret: null };
  }

  const data = await blueGraphqlRequest<{
    createWebhook: BlueWebhook;
  }>(
    `
      mutation CreateWebhook($input: CreateWebhookInput!) {
        createWebhook(input: $input) {
          id
          name
          url
          events
          projectIds
          enabled
          status
          createdAt
          updatedAt
          secret
        }
      }
    `,
    {
      input: {
        name: "AyaFinancial FinOps Bot",
        url: input.url,
        events: input.events,
        projectIds: [input.workspaceId],
      },
    },
  );

  return {
    webhook: data.createWebhook,
    secret: data.createWebhook.secret ?? null,
  };
}

export async function fetchWorkspaceCustomFields(workspaceId: string) {
  const data = await blueGraphqlRequest<{
    customFields: {
      items: BlueCustomFieldDefinition[];
      pageInfo: {
        totalItems?: number | null;
        hasNextPage?: boolean | null;
      };
    };
  }>(
    `
      query WorkspaceCustomFields($projectId: String!, $take: Int!) {
        customFields(
          filter: { projectId: $projectId }
          sort: position_ASC
          take: $take
        ) {
          items {
            id
            uid
            name
            type
            position
          }
          pageInfo {
            totalItems
            hasNextPage
          }
        }
      }
    `,
    {
      projectId: workspaceId,
      take: 100,
    },
    { projectId: workspaceId },
  );

  return data.customFields.items;
}

export async function createRecord(input: {
  workspaceId: string;
  listId: string;
  title: string;
  description?: string;
  assigneeIds?: string[];
}) {
  const data = await blueGraphqlRequest<{
    createTodo: BlueRecord;
  }>(
    `
      mutation CreateTodo($input: CreateTodoInput!) {
        createTodo(input: $input) {
          id
          uid
          title
          text
          html
          startedAt
          duedAt
          commentCount
          archived
          done
          createdAt
          updatedAt
          todoList {
            id
            uid
            title
            position
            updatedAt
          }
          users {
            id
            uid
            email
            firstName
            lastName
            fullName
            timezone
            updatedAt
          }
          tags {
            id
            title
            color
          }
          customFields {
            id
            name
            type
            value
          }
        }
      }
    `,
    {
      input: {
        todoListId: input.listId,
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        assigneeIds: input.assigneeIds?.length ? input.assigneeIds : undefined,
      },
    },
    { projectId: input.workspaceId },
  );

  return data.createTodo;
}

export async function setTodoCustomField(input: {
  workspaceId: string;
  todoId: string;
  customFieldId: string;
  text?: string;
  number?: number;
  regionCode?: string;
}) {
  const data = await blueGraphqlRequest<{
    setTodoCustomField: boolean;
  }>(
    `
      mutation SetTodoCustomField($input: SetTodoCustomFieldInput!) {
        setTodoCustomField(input: $input)
      }
    `,
    {
      input: {
        todoId: input.todoId,
        customFieldId: input.customFieldId,
        text: input.text,
        number: input.number,
        regionCode: input.regionCode,
      },
    },
    { projectId: input.workspaceId },
  );

  return data.setTodoCustomField;
}

export async function createLeadRecord(input: {
  workspaceId: string;
  listId: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  financeAmount?: number;
  notes?: string;
  assigneeIds?: string[];
}) {
  const { fullName, firstName, lastName } = resolveLeadName(input);
  const description = [
    input.notes?.trim() ? `Notes: ${input.notes.trim()}` : null,
    input.phone?.trim() ? `Phone: ${input.phone.trim()}` : null,
    input.email?.trim() ? `Email: ${input.email.trim().toLowerCase()}` : null,
    typeof input.financeAmount === "number"
      ? `Finance amount: ${input.financeAmount}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const record = await createRecord({
    workspaceId: input.workspaceId,
    listId: input.listId,
    title: fullName,
    description,
    assigneeIds: input.assigneeIds,
  });

  const customFields = await fetchWorkspaceCustomFields(input.workspaceId);
  const fieldByName = new Map(
    customFields.map((field) => [field.name.trim().toLowerCase(), field]),
  );

  await setOptionalCustomField({
    workspaceId: input.workspaceId,
    todoId: record.id,
    field: fieldByName.get("contact name"),
    text: fullName,
  });
  await setOptionalCustomField({
    workspaceId: input.workspaceId,
    todoId: record.id,
    field: fieldByName.get("first name"),
    text: firstName,
  });
  await setOptionalCustomField({
    workspaceId: input.workspaceId,
    todoId: record.id,
    field: fieldByName.get("last name"),
    text: lastName,
  });
  await setOptionalCustomField({
    workspaceId: input.workspaceId,
    todoId: record.id,
    field: fieldByName.get("email"),
    text: input.email?.trim().toLowerCase(),
  });
  await setOptionalCustomField({
    workspaceId: input.workspaceId,
    todoId: record.id,
    field: fieldByName.get("phone"),
    text: input.phone?.trim(),
    regionCode: "CA",
  });
  await setOptionalCustomField({
    workspaceId: input.workspaceId,
    todoId: record.id,
    field: fieldByName.get("finance amount 1"),
    number: input.financeAmount,
  });

  return record;
}

function resolveLeadName(input: {
  fullName?: string;
  firstName?: string;
  lastName?: string;
}) {
  const normalizedFirstName = normalizeHumanName(input.firstName);
  const normalizedLastName = normalizeHumanName(input.lastName);

  if (normalizedFirstName || normalizedLastName) {
    const fullName = [normalizedFirstName, normalizedLastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!fullName) {
      throw new ValidationError("Lead creation requires a contact name");
    }

    return {
      fullName,
      firstName: normalizedFirstName || undefined,
      lastName: normalizedLastName || undefined,
    };
  }

  const normalizedFullName = normalizeHumanName(input.fullName);
  if (!normalizedFullName) {
    throw new ValidationError("Lead creation requires a contact name");
  }

  const [firstName, ...rest] = normalizedFullName.split(/\s+/);
  const lastName = rest.join(" ").trim();

  return {
    fullName: normalizedFullName,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
  };
}

function normalizeHumanName(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed
    .split(/\s+/)
    .map((part) => normalizeNamePart(part))
    .join(" ");
}

function normalizeNamePart(value: string) {
  return value
    .split(/([-'’])/)
    .map((segment) => {
      if (segment === "-" || segment === "'" || segment === "’") {
        return segment;
      }

      if (!segment) {
        return segment;
      }

      if (/^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(segment)) {
        return segment.toUpperCase();
      }

      if (/^[A-Z][a-z]+(?:[A-Z][a-z]+)+$/.test(segment)) {
        return segment;
      }

      const lower = segment.toLowerCase();
      return `${lower[0]?.toUpperCase() ?? ""}${lower.slice(1)}`;
    })
    .join("");
}

export async function moveRecord(input: {
  workspaceId: string;
  recordId: string;
  targetListId: string;
}) {
  const data = await blueGraphqlRequest<{
    moveTodo: boolean;
  }>(
    `
      mutation MoveTodo($input: MoveTodoInput!) {
        moveTodo(input: $input)
      }
    `,
    {
      input: {
        todoId: input.recordId,
        todoListId: input.targetListId,
      },
    },
    { projectId: input.workspaceId },
  );

  return {
    ok: data.moveTodo,
  };
}

export async function createComment(input: {
  workspaceId: string;
  recordId: string;
  text: string;
}) {
  const text = input.text.trim();
  const html = `<p>${escapeHtml(text)}</p>`;
  const data = await blueGraphqlRequest<{
    createComment: BlueComment;
  }>(
    `
      mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
          id
          uid
          text
          html
          createdAt
          updatedAt
          deletedAt
          user {
            id
            uid
            email
            firstName
            lastName
            fullName
            timezone
            updatedAt
          }
        }
      }
    `,
    {
      input: {
        html,
        text,
        category: "TODO",
        categoryId: input.recordId,
        tiptap: false,
      },
    },
    { projectId: input.workspaceId },
  );

  return data.createComment;
}

export async function listAssignedOpenRecords(input: {
  workspaceId: string;
  companyId: string;
  assigneeId: string;
  limit?: number;
  skip?: number;
}) {
  const data = await blueGraphqlRequest<{
    todoQueries: {
      todos: {
        items: BlueRecord[];
        pageInfo: {
          totalItems?: number | null;
          hasNextPage?: boolean | null;
          hasPreviousPage?: boolean | null;
          page?: number | null;
          perPage?: number | null;
        };
      };
    };
  }>(
    `
      query AssignedOpenRecords(
        $companyIds: [String!]!,
        $projectIds: [String!],
        $assigneeIds: [String!],
        $limit: Int,
        $skip: Int
      ) {
        todoQueries {
          todos(
            filter: {
              companyIds: $companyIds
              projectIds: $projectIds
              assigneeIds: $assigneeIds
              showCompleted: false
              excludeArchivedProjects: true
            }
            sort: [duedAt_ASC, todoListPosition_ASC, position_ASC]
            limit: $limit
            skip: $skip
          ) {
            items {
              id
              uid
              title
              text
              html
              startedAt
              duedAt
              commentCount
              archived
              done
              createdAt
              updatedAt
              users {
                id
                uid
                email
                firstName
                lastName
                fullName
                timezone
                updatedAt
              }
              tags {
                id
                title
                color
              }
              customFields {
                id
                name
                type
                value
              }
              todoList {
                id
                uid
                title
                position
                updatedAt
              }
            }
            pageInfo {
              totalItems
              hasNextPage
              hasPreviousPage
              page
              perPage
            }
          }
        }
      }
    `,
    {
      companyIds: [input.companyId],
      projectIds: [input.workspaceId],
      assigneeIds: [input.assigneeId],
      limit: input.limit ?? 50,
      skip: input.skip ?? 0,
    },
    { projectId: input.workspaceId },
  );

  return data.todoQueries.todos;
}

export async function checkBlueApiConnectivity(workspaceId: string) {
  const data = await blueGraphqlRequest<{
    projectUserList: {
      totalCount: number;
    };
  }>(
    `
      query BlueHealthCheck($projectId: String!) {
        projectUserList(projectId: $projectId, first: 1) {
          totalCount
        }
      }
    `,
    { projectId: workspaceId },
    { projectId: workspaceId },
  );

  return {
    ok: true,
    totalUsers: data.projectUserList.totalCount,
  };
}

function ensureGraphqlConfig() {
  if (!config.BLUE_AUTH_TOKEN || !config.BLUE_CLIENT_ID || !config.BLUE_COMPANY_ID) {
    throw new ExternalServiceError(
      "Blue GraphQL credentials are missing. Set BLUE_AUTH_TOKEN, BLUE_CLIENT_ID, and BLUE_COMPANY_ID.",
    );
  }
}

function isRetryableGraphqlError(code: string, message: string) {
  if (code === "RATE_LIMITED" || code === "TOO_MANY_REQUESTS") {
    return true;
  }

  const normalized = message.toLowerCase();
  return (
    normalized.includes("rate limit") ||
    normalized.includes("temporarily unavailable") ||
    normalized.includes("timeout")
  );
}

function getOperationLabel(query: string) {
  const compact = query.replace(/\s+/g, " ").trim();
  const match = compact.match(/^(query|mutation)\s+([A-Za-z0-9_]+)/);
  return match?.[2] ?? "anonymous";
}

function getRetryAfterMs(error: Error) {
  const match = error.message.match(/retry-after[:=]\s*(\d+)/i);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 1000;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function setOptionalCustomField(input: {
  workspaceId: string;
  todoId: string;
  field: BlueCustomFieldDefinition | undefined;
  text?: string;
  number?: number;
  regionCode?: string;
}) {
  if (!input.field) {
    return;
  }

  if (typeof input.number !== "number" && !input.text?.trim()) {
    return;
  }

  await setTodoCustomField({
    workspaceId: input.workspaceId,
    todoId: input.todoId,
    customFieldId: input.field.id,
    text: input.text?.trim(),
    number: input.number,
    regionCode: input.regionCode,
  });
}
