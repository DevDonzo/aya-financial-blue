export type AuthMeResponse = {
  authenticated: boolean;
  employee: {
    employeeId: string;
    displayName: string;
    roleName: "employee" | "admin";
  } | null;
};

export type SyncStateRow = {
  workspace_id: string;
  entity_type: string;
  last_cursor: string | null;
  last_full_sync_at: string | null;
  last_incremental_sync_at: string | null;
  last_seen_updated_at: string | null;
  last_webhook_event_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WebhookSubscriptionRow = {
  id: string;
  workspace_id: string;
  blue_webhook_id: string;
  url: string;
  events_json: string;
  status: string | null;
  secret_ref: string | null;
  enabled: number;
  created_at: string;
  updated_at: string;
};

export type EmployeeActivityRow = {
  employee_id: string;
  display_name: string;
  role_name: string | null;
  interaction_count: number | null;
  success_count: number | null;
  failure_count: number | null;
  success_rate: number | null;
  latest_interaction_at: string | null;
};

export type OverviewResponse = {
  overview: {
    date: string;
    totalInteractions: number;
    successCount: number;
    failureCount: number;
    activeEmployees: number;
    latestInteractionAt: string | null;
  };
  employees: EmployeeActivityRow[];
  sync: {
    states: SyncStateRow[];
    webhooks: WebhookSubscriptionRow[];
  };
};

export type LogRow = {
  id: string;
  created_at: string;
  employee_id: string | null;
  display_name: string | null;
  role_name: string | null;
  transport: string;
  detected_intent: string | null;
  adapter: string;
  command_name: string | null;
  outcome: string;
  inbound_text: string;
  response_text: string | null;
};

export type LogDetailRow = LogRow & {
  command_args: string | null;
  request_json: unknown;
  response_json: unknown;
};

export type TranscriptMessage = {
  sender: string;
  text: string;
  createdAt: string | null;
  isCreatedByUser: boolean;
};

export type TranscriptRow = {
  conversationId: string;
  title: string;
  employeeName: string;
  employeeEmail: string;
  endpoint: string;
  model: string;
  createdAt: string | null;
  updatedAt: string | null;
  messageCount: number;
  messages: TranscriptMessage[];
};

export type IdentityLinkRow = {
  id: string;
  employee_id: string;
  display_name: string;
  source: string;
  external_id: string;
  external_label: string | null;
};

export type EmployeeRow = {
  id: string;
  display_name: string;
  email: string | null;
  role_name: string | null;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function fetchAuthMe() {
  return await request<AuthMeResponse>("/auth/me");
}

export async function login(input: { employeeName: string; password: string }) {
  return await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function logout() {
  return await request("/auth/logout", {
    method: "POST",
  });
}

export async function fetchOverview() {
  return await request<OverviewResponse>("/admin/api/overview");
}

export async function fetchLogs(params?: { employeeId?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.employeeId) {
    search.set("employeeId", params.employeeId);
  }
  if (params?.limit) {
    search.set("limit", String(params.limit));
  }
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return await request<{ items: LogRow[] }>(`/admin/api/logs${suffix}`);
}

export async function fetchLogDetail(id: string) {
  return await request<{ item: LogDetailRow }>(`/admin/api/logs/${id}`);
}

export async function fetchEmployeeActivity() {
  return await request<{ items: EmployeeActivityRow[] }>(
    "/admin/api/employee-activity",
  );
}

export async function fetchTranscripts(params?: {
  employeeEmail?: string;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.employeeEmail) {
    search.set("employeeEmail", params.employeeEmail);
  }
  if (params?.limit) {
    search.set("limit", String(params.limit));
  }
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return await request<{ items: TranscriptRow[] }>(
    `/admin/api/transcripts${suffix}`,
  );
}

export async function runWorkspaceIndexSync(input?: { forceFull?: boolean }) {
  return await request("/admin/api/sync/workspace-index", {
    method: "POST",
    body: JSON.stringify(input ?? {}),
  });
}

export async function runEmployeeSync() {
  return await request("/admin/api/sync/employees", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function runBlueActivitySync() {
  return await request("/admin/api/sync/blue-activity", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function fetchIdentityLinks() {
  return await request<{ items: IdentityLinkRow[] }>("/identity-links");
}

export async function createIdentityLink(input: {
  employeeId?: string;
  employeeName?: string;
  source: string;
  externalId: string;
  externalLabel?: string;
}) {
  return await request("/identity-links", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteIdentityLink(id: string) {
  return await request<{ ok: true; deletedId: string }>(`/identity-links/${id}`, {
    method: "DELETE",
  });
}

export async function fetchEmployees() {
  return await request<{ items: EmployeeRow[] }>("/employees");
}
