export interface BlueUser {
  id: string;
  uid?: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  timezone?: string | null;
  updatedAt?: string;
}

export interface BlueTodoList {
  id: string;
  uid?: string;
  title: string;
  position: number;
  createdAt?: string;
  updatedAt: string;
}

export interface BlueTag {
  id: string;
  title: string;
  color?: string | null;
}

export interface BlueComment {
  id: string;
  uid?: string;
  text: string;
  html?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: BlueUser | null;
}

export interface BlueTodoCustomField {
  id: string;
  name?: string;
  type?: string;
  value: unknown;
}

export interface BlueCustomFieldDefinition {
  id: string;
  uid?: string;
  name: string;
  type: string;
  position?: number;
}

export interface BlueRecord {
  id: string;
  uid?: string;
  title: string;
  text?: string;
  html?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  duedAt?: string | null;
  archived: boolean;
  done: boolean;
  commentCount?: number;
  todoList: BlueTodoList;
  users?: BlueUser[];
  tags?: BlueTag[];
  customFields?: BlueTodoCustomField[];
}

export interface BlueActivityEvent {
  id: string;
  uid?: string;
  category: string;
  html?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: BlueUser | null;
  affectedBy?: BlueUser | null;
  project?: {
    id: string;
    name: string;
    slug?: string | null;
  } | null;
  todo?: {
    id: string;
    title: string;
  } | null;
  comment?: BlueComment | null;
}

export interface BlueWebhook {
  id: string;
  name?: string | null;
  url: string;
  events: BlueWebhookEventType[];
  projectIds?: string[] | null;
  enabled: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  secret?: string | null;
}

export interface BluePageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
  totalItems?: number | null;
  totalPages?: number | null;
  page?: number | null;
  perPage?: number | null;
}

export type BlueWebhookEventType =
  | "TODO_CREATED"
  | "TODO_DELETED"
  | "TODO_MOVED"
  | "TODO_NAME_CHANGED"
  | "TODO_DONE_STATUS_UPDATED"
  | "TODO_ASSIGNEE_ADDED"
  | "TODO_ASSIGNEE_REMOVED"
  | "TODO_TAG_ADDED"
  | "TODO_TAG_REMOVED"
  | "TODO_CUSTOM_FIELD_UPDATED"
  | "COMMENT_CREATED"
  | "COMMENT_UPDATED"
  | "COMMENT_DELETED";

export interface IndexedBlueRecord {
  id: string;
  workspaceId: string;
  listId: string;
  listTitle: string;
  title: string;
  normalizedTitle: string;
  status?: string | null;
  dueAt?: string | null;
  updatedAt?: string | null;
  archived: boolean;
  done: boolean;
  rawJson?: string | null;
}

export interface NormalizedActivityEvent {
  id: string;
  employeeId?: string;
  source: string;
  sourceEventId?: string;
  actionType: string;
  entityType?: string;
  entityId?: string;
  entityTitle?: string;
  occurredAt: string;
  summary: string;
  rawPayload: unknown;
}

export interface ResolvedEmployeeIdentity {
  employeeId: string;
  displayName: string;
  roleName: "employee" | "admin";
  blueUserId: string;
  email?: string;
}
