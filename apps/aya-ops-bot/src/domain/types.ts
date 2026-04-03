export type ActivitySource =
  | "blue"
  | "bot"
  | "web"
  | "whatsapp"
  | "email"
  | "calendar"
  | "phone"
  | "drive"
  | "slack";

export type IntentName =
  | "records.list_assigned"
  | "records.search"
  | "records.create"
  | "records.move"
  | "comments.list_recent"
  | "comments.create"
  | "activity.list"
  | "summary.employee_day"
  | "summary.team_day"
  | "summary.no_activity_day"
  | "reporting.overview"
  | "reporting.question";

export interface EmployeeIdentity {
  employeeId: string;
  displayName: string;
  roleName?: string;
  blueUserId?: string;
  email?: string;
}

export interface IntentRequest {
  actor: EmployeeIdentity;
  message: string;
  nowIso: string;
}

export interface IntentMatch {
  intent: IntentName;
  confidence: number;
  parameters: Record<string, string | number | boolean | undefined>;
}

export interface NormalizedActivityEvent {
  id: string;
  employeeId?: string;
  source: ActivitySource;
  sourceEventId?: string;
  actionType: string;
  entityType?: string;
  entityId?: string;
  entityTitle?: string;
  occurredAt: string;
  summary: string;
  rawPayload: unknown;
}
