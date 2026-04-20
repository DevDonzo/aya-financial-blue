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
  | "identity.self"
  | "activity.employee_report"
  | "activity.record_report"
  | "activity.workspace_report"
  | "records.exception_report"
  | "records.list_assigned"
  | "records.follow_up"
  | "records.search"
  | "records.detail"
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

export interface BlueRequestAuth {
  tokenId: string;
  tokenSecret: string;
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

export interface IntentPlan extends IntentMatch {
  requiresClarification: boolean;
  clarificationQuestion?: string;
  matchedSignals: string[];
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
