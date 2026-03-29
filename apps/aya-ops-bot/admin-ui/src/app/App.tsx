import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { Modal } from "../components/Modal";
import { EmployeeActivityTable } from "../features/activity/EmployeeActivityTable";
import { CommandCenter } from "../features/dashboard/CommandCenter";
import { IdentityLinksManager } from "../features/identity/IdentityLinksManager";
import { SyncControlCenter } from "../features/sync/SyncControlCenter";
import {
  createIdentityLink,
  deleteIdentityLink,
  fetchAuthMe,
  fetchEmployeeActivity,
  fetchEmployees,
  fetchIdentityLinks,
  fetchLogDetail,
  fetchLogs,
  fetchOverview,
  fetchTranscripts,
  login,
  logout,
  runBlueActivitySync,
  runEmployeeSync,
  runWorkspaceIndexSync,
  type EmployeeActivityRow,
  type EmployeeRow,
  type LogRow,
  type TranscriptRow,
} from "../lib/api";
import { formatAdminTime, timestampMs } from "../lib/time";

type AdminView = "audit" | "employees" | "operations" | "identity";

type DirectoryEmployee = {
  employeeId: string;
  displayName: string;
  email: string | null;
  roleName: string | null;
  interactionCount: number;
  successRate: number;
  latestInteractionAt: string | null;
  transcriptCount: number;
  logCount: number;
};

export function App() {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<AdminView>("operations");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [expandedTranscriptIds, setExpandedTranscriptIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({
    employeeName: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: fetchAuthMe,
  });

  const isAdmin =
    authQuery.data?.authenticated === true &&
    authQuery.data.employee?.roleName === "admin";

  const overviewQuery = useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
    enabled: isAdmin,
  });
  const logsQuery = useQuery({
    queryKey: ["logs"],
    queryFn: () => fetchLogs({ limit: 150 }),
    enabled: isAdmin,
  });
  const transcriptsQuery = useQuery({
    queryKey: ["transcripts"],
    queryFn: () => fetchTranscripts({ limit: 75 }),
    enabled: isAdmin,
  });
  const employeeActivityQuery = useQuery({
    queryKey: ["employee-activity"],
    queryFn: fetchEmployeeActivity,
    enabled: isAdmin,
  });
  const identityLinksQuery = useQuery({
    queryKey: ["identity-links"],
    queryFn: fetchIdentityLinks,
    enabled: isAdmin,
  });
  const employeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    enabled: isAdmin,
  });
  const logDetailQuery = useQuery({
    queryKey: ["log-detail", selectedLogId],
    queryFn: () => fetchLogDetail(selectedLogId!),
    enabled: isAdmin && Boolean(selectedLogId),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      setError(null);
      await refreshAll(queryClient);
    },
    onError: (caught) => {
      setError(caught instanceof Error ? caught.message : "Login failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      setExpandedTranscriptIds(new Set());
      setSelectedEmployeeId("");
      setSelectedLogId(null);
      setError(null);
      queryClient.removeQueries();
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: onMutationError,
  });

  const workspaceSyncMutation = useMutation({
    mutationFn: async (forceFull: boolean) => {
      setRunningAction(forceFull ? "workspace-index-full" : "workspace-index");
      return await runWorkspaceIndexSync({ forceFull });
    },
    onSuccess: async () => {
      setError(null);
      setRunningAction(null);
      await refreshAdminData(queryClient);
    },
    onError: (caught) => {
      setRunningAction(null);
      onMutationError(caught);
    },
  });

  const employeeSyncMutation = useMutation({
    mutationFn: async () => {
      setRunningAction("employees");
      return await runEmployeeSync();
    },
    onSuccess: async () => {
      setError(null);
      setRunningAction(null);
      await refreshAdminData(queryClient);
    },
    onError: (caught) => {
      setRunningAction(null);
      onMutationError(caught);
    },
  });

  const activitySyncMutation = useMutation({
    mutationFn: async () => {
      setRunningAction("activity");
      return await runBlueActivitySync();
    },
    onSuccess: async () => {
      setError(null);
      setRunningAction(null);
      await refreshAdminData(queryClient);
    },
    onError: (caught) => {
      setRunningAction(null);
      onMutationError(caught);
    },
  });

  const createLinkMutation = useMutation({
    mutationFn: createIdentityLink,
    onSuccess: async () => {
      setError(null);
      await refreshAdminData(queryClient);
    },
    onError: onMutationError,
  });

  const deleteLinkMutation = useMutation({
    mutationFn: deleteIdentityLink,
    onSuccess: async () => {
      setError(null);
      await refreshAdminData(queryClient);
    },
    onError: onMutationError,
  });

  const loading =
    authQuery.isLoading ||
    (isAdmin &&
      (overviewQuery.isLoading ||
        logsQuery.isLoading ||
        transcriptsQuery.isLoading ||
        employeeActivityQuery.isLoading ||
        identityLinksQuery.isLoading ||
        employeesQuery.isLoading));

  const employeeDirectory = useMemo(
    () =>
      buildEmployeeDirectory({
        employees: employeesQuery.data?.items ?? [],
        activity: employeeActivityQuery.data?.items ?? [],
        logs: logsQuery.data?.items ?? [],
        transcripts: transcriptsQuery.data?.items ?? [],
        search: employeeSearch,
      }),
    [
      employeeActivityQuery.data?.items,
      employeeSearch,
      employeesQuery.data?.items,
      logsQuery.data?.items,
      transcriptsQuery.data?.items,
    ],
  );

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    if (
      selectedEmployeeId &&
      employeeDirectory.some((employee) => employee.employeeId === selectedEmployeeId)
    ) {
      return;
    }

    setSelectedEmployeeId(employeeDirectory[0]?.employeeId ?? "");
  }, [employeeDirectory, isAdmin, selectedEmployeeId]);

  const selectedEmployee = employeeDirectory.find(
    (employee) => employee.employeeId === selectedEmployeeId,
  );

  const selectedLogs = useMemo(() => {
    const logs = logsQuery.data?.items ?? [];
    return logs
      .filter((row) => {
        if (selectedEmployeeId && row.employee_id !== selectedEmployeeId) {
          return false;
        }
        if (outcomeFilter && row.outcome !== outcomeFilter) {
          return false;
        }
        if (logSearch) {
          const haystack =
            `${row.inbound_text} ${row.response_text ?? ""} ${row.detected_intent ?? ""}`.toLowerCase();
          if (!haystack.includes(logSearch.toLowerCase())) {
            return false;
          }
        }
        return true;
      })
      .sort((left, right) => {
        return timestampMs(right.created_at) - timestampMs(left.created_at);
      });
  }, [logSearch, logsQuery.data?.items, outcomeFilter, selectedEmployeeId]);

  const selectedTranscripts = useMemo(() => {
    const transcripts = transcriptsQuery.data?.items ?? [];
    return transcripts
      .filter((row) => {
        if (!selectedEmployee) {
          return true;
        }
        return matchesTranscriptToEmployee(row, selectedEmployee);
      })
      .sort((left, right) => {
        return (
          timestampMs(right.updatedAt ?? right.createdAt) -
          timestampMs(left.updatedAt ?? left.createdAt)
        );
      });
  }, [selectedEmployee, transcriptsQuery.data?.items]);

  const latestSyncAt = useMemo(() => {
    const states = overviewQuery.data?.sync.states ?? [];
    return states
      .map((state) => state.last_incremental_sync_at ?? state.updated_at)
      .filter(Boolean)
      .sort()
      .at(-1);
  }, [overviewQuery.data?.sync.states]);

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Aya Ops Bot</p>
          <h1>Admin Console</h1>
          <p className="lede">
            Review employee conversations, inspect bot replies, and monitor
            operational state from one internal console.
          </p>
        </div>
        <div className="hero-actions">
          {isAdmin ? (
            <div className="hero-status">
              <div className="hero-status-label">Last sync</div>
              <div className="hero-status-value">
                {formatAdminTime(latestSyncAt ?? null)}
              </div>
            </div>
          ) : null}
          <button
            type="button"
            className="ghost-button"
            onClick={() => void refreshAll(queryClient)}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          {authQuery.data?.authenticated ? (
            <button
              type="button"
              className="ghost-button"
              onClick={() => void logoutMutation.mutateAsync()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          ) : null}
        </div>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}
      {loading ? <div className="loading-bar">Loading Aya admin data…</div> : null}

      {!isAdmin ? (
        <section className="panel login-panel">
          <div className="panel-head">
            <h2>Admin Login</h2>
            <p className="muted">
              Sign in to review employee conversations, bot outputs, and operational status.
            </p>
          </div>
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              loginMutation.mutate(loginForm);
            }}
          >
            <input
              value={loginForm.employeeName}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  employeeName: event.target.value,
                }))
              }
              placeholder="Employee name"
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Password"
            />
            <button
              type="submit"
              className="primary-button"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </section>
      ) : null}

      {isAdmin ? (
        <section className="workspace-shell">
          <aside className="app-sidebar panel">
            <div className="sidebar-section">
              <div className="sidebar-label">Workspace</div>
              <div className="sidebar-title">Aya Internal Admin</div>
              <p className="sidebar-copy">
                Audit conversations, review bot actions, and manage the pilot from one
                dark operator console.
              </p>
            </div>
            <nav className="view-tabs">
              <ViewTab
                label="Audit"
                active={activeView === "audit"}
                onClick={() => setActiveView("audit")}
              />
              <ViewTab
                label="Employees"
                active={activeView === "employees"}
                onClick={() => setActiveView("employees")}
              />
              <ViewTab
                label="Command Center"
                active={activeView === "operations"}
                onClick={() => setActiveView("operations")}
              />
              <ViewTab
                label="Identity"
                active={activeView === "identity"}
                onClick={() => setActiveView("identity")}
              />
            </nav>
            <div className="sidebar-section sidebar-footnote">
              <div className="sidebar-label">Scope</div>
              <p className="sidebar-copy">
                Employee audit trails, Aya bot outputs, and Blue copy-workspace operations.
              </p>
            </div>
            <div className="sidebar-section sidebar-footnote">
              <div className="sidebar-label">Rollout Path</div>
              <ul className="sidebar-list">
                {ROLLOUT_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="sidebar-section sidebar-footnote">
              <div className="sidebar-label">Adoption Priorities</div>
              <ul className="sidebar-list">
                {ADOPTION_PRIORITIES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="workspace-main">
            {activeView === "audit" ? (
              <section className="audit-layout">
                <aside className="panel employee-rail">
                  <div className="panel-head">
                    <div>
                      <h2>Employees</h2>
                      <p className="muted">
                        Pick an employee to review their chats and bot responses.
                      </p>
                    </div>
                    <span className="sidebar-count">{employeeDirectory.length}</span>
                  </div>
                  <input
                    value={employeeSearch}
                    onChange={(event) => setEmployeeSearch(event.target.value)}
                    placeholder="Find employee"
                    className="employee-search"
                  />
                  <div className="employee-list">
                    {employeeDirectory.length === 0 ? (
                      <div className="empty-state">No employees matched that search.</div>
                    ) : (
                      employeeDirectory.map((employee) => (
                        <button
                          type="button"
                          key={employee.employeeId}
                          className={`employee-card ${
                            employee.employeeId === selectedEmployeeId ? "selected" : ""
                          }`}
                          onClick={() => setSelectedEmployeeId(employee.employeeId)}
                        >
                          <div className="employee-card-top">
                            <strong>{employee.displayName}</strong>
                            <span className="status-chip ok">
                              {employee.roleName ?? "employee"}
                            </span>
                          </div>
                          <div className="employee-card-meta">
                            <span>{employee.transcriptCount} conversations</span>
                            <span>{employee.logCount} bot interactions</span>
                          </div>
                          <div className="employee-card-meta">
                            <span>Success rate</span>
                            <span>{employee.successRate.toFixed(0)}%</span>
                          </div>
                          <div className="employee-card-meta">
                            <span>Latest</span>
                            <span>{formatAdminTime(employee.latestInteractionAt)}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </aside>

                <div className="audit-main">
                  <section className="panel selected-summary">
                    <div className="selected-summary-head">
                      <div>
                        <div className="sidebar-label">Selected Employee</div>
                        <h2>{selectedEmployee?.displayName ?? "Select an employee"}</h2>
                        <p className="muted">
                          {selectedEmployee?.email || "No synced email on file"}
                        </p>
                      </div>
                      {selectedEmployee ? (
                        <span className="status-chip ok">
                          {selectedEmployee.roleName ?? "employee"}
                        </span>
                      ) : null}
                    </div>
                    {selectedEmployee ? (
                      <div className="summary-metrics">
                        <MetricCard
                          label="Bot Interactions"
                          value={selectedEmployee.logCount}
                        />
                        <MetricCard
                          label="LibreChat Conversations"
                          value={selectedEmployee.transcriptCount}
                        />
                        <MetricCard
                          label="Success Rate"
                          value={`${selectedEmployee.successRate.toFixed(0)}%`}
                        />
                      </div>
                    ) : (
                      <div className="empty-state">
                        Choose an employee from the left to start auditing.
                      </div>
                    )}
                  </section>

                  <section className="panel">
                    <div className="panel-head">
                      <div>
                        <h2>Bot Replies & Actions</h2>
                        <p className="muted">
                          Every prompt sent to Aya and exactly what Aya returned.
                        </p>
                      </div>
                      <div className="filter-grid compact">
                        <select
                          value={outcomeFilter}
                          onChange={(event) => setOutcomeFilter(event.target.value)}
                        >
                          <option value="">All outcomes</option>
                          <option value="success">success</option>
                          <option value="failure">failure</option>
                          <option value="unmatched">unmatched</option>
                        </select>
                        <input
                          value={logSearch}
                          onChange={(event) => setLogSearch(event.target.value)}
                          placeholder="Search prompt or bot reply"
                        />
                      </div>
                    </div>

                    <div className="audit-stack">
                      {selectedLogs.length === 0 ? (
                        <div className="empty-state">
                          No bot interactions matched the current filters.
                        </div>
                      ) : (
                        selectedLogs.map((row) => (
                          <article className="audit-card" key={row.id}>
                            <div className="audit-card-head">
                              <div>
                                <strong>{row.display_name ?? "Unknown employee"}</strong>
                                <div className="audit-meta">
                                  {formatAdminTime(row.created_at)}
                                  <span>•</span>
                                  <span>{row.detected_intent ?? "unmatched"}</span>
                                </div>
                              </div>
                              <div className="audit-actions">
                                <span
                                  className={`status-chip ${
                                    row.outcome === "success" ? "ok" : "bad"
                                  }`}
                                >
                                  {row.outcome}
                                </span>
                                <button
                                  type="button"
                                  className="link-button"
                                  onClick={() => setSelectedLogId(row.id)}
                                >
                                  View detail
                                </button>
                              </div>
                            </div>
                            <div className="audit-block">
                              <label>Employee Prompt</label>
                              <p>{row.inbound_text}</p>
                            </div>
                            <div className="audit-block reply">
                              <label>Bot Reply</label>
                              <p>{row.response_text ?? "No reply recorded."}</p>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>

                  <section className="panel">
                    <div className="panel-head">
                      <div>
                        <h2>LibreChat Conversations</h2>
                        <p className="muted">
                          Full conversation context from LibreChat for the selected employee.
                        </p>
                      </div>
                    </div>

                    <div className="conversation-stack">
                      {selectedTranscripts.length === 0 ? (
                        <div className="empty-state">
                          No LibreChat conversations were found for this employee.
                        </div>
                      ) : (
                        selectedTranscripts.map((row) => {
                          const expanded = expandedTranscriptIds.has(row.conversationId);
                          const visibleMessages = expanded ? row.messages : row.messages.slice(-4);
                          return (
                            <article className="conversation-card" key={row.conversationId}>
                              <div className="conversation-head">
                                <div>
                                  <strong>{row.title || "Untitled conversation"}</strong>
                                  <div className="audit-meta">
                                    {row.employeeName || row.employeeEmail || "Unknown employee"}
                                    <span>•</span>
                                    <span>{row.model || "Unknown model"}</span>
                                    <span>•</span>
                                    <span>
                                      {formatAdminTime(row.updatedAt ?? row.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="link-button"
                                  onClick={() =>
                                    setExpandedTranscriptIds((current) => {
                                      const next = new Set(current);
                                      if (next.has(row.conversationId)) {
                                        next.delete(row.conversationId);
                                      } else {
                                        next.add(row.conversationId);
                                      }
                                      return next;
                                    })
                                  }
                                >
                                  {expanded ? "Collapse" : "Expand"}
                                </button>
                              </div>
                              <div className="message-thread">
                                {visibleMessages.map((message, index) => (
                                  <div
                                    key={`${row.conversationId}-${index}`}
                                    className={`message-bubble ${
                                      message.isCreatedByUser ? "user" : "assistant"
                                    }`}
                                  >
                                    <div className="message-sender">{message.sender}</div>
                                    <div>{message.text || "Empty message"}</div>
                                  </div>
                                ))}
                              </div>
                            </article>
                          );
                        })
                      )}
                    </div>
                  </section>
                </div>
              </section>
            ) : null}

            {activeView === "employees" ? (
              <>
                <section className="overview-grid compact-grid">
                  <MetricCard
                    label="Employees Synced"
                    value={employeeDirectory.length}
                  />
                  <MetricCard
                    label="Active Today"
                    value={overviewQuery.data?.overview.activeEmployees ?? 0}
                  />
                  <MetricCard
                    label="Interactions Today"
                    value={overviewQuery.data?.overview.totalInteractions ?? 0}
                  />
                </section>
                <EmployeeActivityTable data={employeeActivityQuery.data?.items ?? []} />
              </>
            ) : null}

            {activeView === "operations" ? (
              <>
                <CommandCenter
                  overview={overviewQuery.data?.overview}
                  employees={employeeDirectory}
                  activity={employeeActivityQuery.data?.items ?? []}
                  logs={logsQuery.data?.items ?? []}
                  syncStates={overviewQuery.data?.sync.states ?? []}
                />

                <SyncControlCenter
                  states={overviewQuery.data?.sync.states ?? []}
                  webhooks={overviewQuery.data?.sync.webhooks ?? []}
                  runningAction={runningAction}
                  onWorkspaceIndexSync={(forceFull) => {
                    workspaceSyncMutation.mutate(forceFull);
                  }}
                  onEmployeeSync={() => {
                    employeeSyncMutation.mutate();
                  }}
                  onBlueActivitySync={() => {
                    activitySyncMutation.mutate();
                  }}
                />
              </>
            ) : null}

            {activeView === "identity" ? (
              <IdentityLinksManager
                links={identityLinksQuery.data?.items ?? []}
                employees={employeesQuery.data?.items ?? []}
                isSubmitting={
                  createLinkMutation.isPending || deleteLinkMutation.isPending
                }
                onCreate={(payload) => {
                  createLinkMutation.mutate(payload);
                }}
                onDelete={(id) => {
                  deleteLinkMutation.mutate(id);
                }}
              />
            ) : null}
          </div>
        </section>
      ) : null}

      <Modal
        open={Boolean(selectedLogId)}
        title="Audit Log Detail"
        onClose={() => setSelectedLogId(null)}
      >
        {logDetailQuery.isLoading ? (
          <div className="loading-bar">Loading audit detail…</div>
        ) : (
          <div className="detail-grid">
            <div className="detail-meta">
              <div className="sync-meta-row">
                <span>Created</span>
                <span>
                  {formatAdminTime(logDetailQuery.data?.item.created_at ?? null)}
                </span>
              </div>
              <div className="sync-meta-row">
                <span>Employee</span>
                <span>{logDetailQuery.data?.item.display_name ?? "Unknown"}</span>
              </div>
              <div className="sync-meta-row">
                <span>Intent</span>
                <span>{logDetailQuery.data?.item.detected_intent ?? "unmatched"}</span>
              </div>
              <div className="sync-meta-row">
                <span>Adapter</span>
                <span>{logDetailQuery.data?.item.adapter ?? "Unknown"}</span>
              </div>
              <div className="sync-meta-row">
                <span>Outcome</span>
                <span>{logDetailQuery.data?.item.outcome ?? "Unknown"}</span>
              </div>
            </div>
            <div className="json-block">
              <strong>Prompt JSON</strong>
              <pre>
                {JSON.stringify(logDetailQuery.data?.item.request_json ?? null, null, 2)}
              </pre>
            </div>
            <div className="json-block">
              <strong>Response JSON</strong>
              <pre>
                {JSON.stringify(logDetailQuery.data?.item.response_json ?? null, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );

  function onMutationError(caught: unknown) {
    setError(caught instanceof Error ? caught.message : "Request failed");
  }
}

function ViewTab(input: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`view-tab ${input.active ? "active" : ""}`}
      onClick={input.onClick}
    >
      {input.label}
    </button>
  );
}

function MetricCard(input: { label: string; value: number | string }) {
  return (
    <article className="metric-card">
      <div className="metric-label">{input.label}</div>
      <div className="metric-value">{input.value}</div>
    </article>
  );
}

const ROLLOUT_STEPS = [
  "Start with search, detail, comments, and workload.",
  "Then allow comments, stage moves, and lead creation.",
  "Review audit logs and failed matches every week.",
];

const ADOPTION_PRIORITIES = [
  "Employees should talk to Aya like a coworker, not a command line.",
  "Aya should ask one short follow-up instead of guessing.",
  "Bad financial formula output should trigger clarification, not invention.",
];

function buildEmployeeDirectory(input: {
  employees: EmployeeRow[];
  activity: EmployeeActivityRow[];
  logs: LogRow[];
  transcripts: TranscriptRow[];
  search: string;
}) {
  const byId = new Map<string, DirectoryEmployee>();

  const ensure = (employeeId: string, seed: Partial<DirectoryEmployee>) => {
    const existing = byId.get(employeeId);
    if (existing) {
      byId.set(employeeId, {
        ...existing,
        ...seed,
      });
      return byId.get(employeeId)!;
    }

    const created: DirectoryEmployee = {
      employeeId,
      displayName: seed.displayName ?? "Unknown employee",
      email: seed.email ?? null,
      roleName: seed.roleName ?? null,
      interactionCount: seed.interactionCount ?? 0,
      successRate: seed.successRate ?? 0,
      latestInteractionAt: seed.latestInteractionAt ?? null,
      transcriptCount: seed.transcriptCount ?? 0,
      logCount: seed.logCount ?? 0,
    };
    byId.set(employeeId, created);
    return created;
  };

  for (const employee of input.employees) {
    ensure(employee.id, {
      displayName: employee.display_name,
      email: employee.email,
      roleName: employee.role_name,
    });
  }

  for (const activity of input.activity) {
    ensure(activity.employee_id, {
      displayName: activity.display_name,
      roleName: activity.role_name,
      interactionCount: activity.interaction_count ?? 0,
      successRate: Number(activity.success_rate ?? 0),
      latestInteractionAt: activity.latest_interaction_at,
    });
  }

  for (const log of input.logs) {
    if (!log.employee_id) {
      continue;
    }
    const employee = ensure(log.employee_id, {
      displayName: log.display_name ?? "Unknown employee",
      roleName: log.role_name ?? null,
    });
    employee.logCount += 1;
    employee.latestInteractionAt = latestTimestamp(
      employee.latestInteractionAt,
      log.created_at,
    );
  }

  for (const transcript of input.transcripts) {
    const matchedEmployee = input.employees.find((employee) =>
      matchesTranscriptToEmployee(transcript, {
        employeeId: employee.id,
        displayName: employee.display_name,
        email: employee.email,
        roleName: employee.role_name,
        interactionCount: 0,
        successRate: 0,
        latestInteractionAt: null,
        transcriptCount: 0,
        logCount: 0,
      }),
    );

    if (!matchedEmployee) {
      continue;
    }

    const employee = ensure(matchedEmployee.id, {
      displayName: matchedEmployee.display_name,
      email: matchedEmployee.email,
      roleName: matchedEmployee.role_name,
    });
    employee.transcriptCount += 1;
    employee.latestInteractionAt = latestTimestamp(
      employee.latestInteractionAt,
      transcript.updatedAt ?? transcript.createdAt,
    );
  }

  const search = input.search.trim().toLowerCase();

  return [...byId.values()]
    .filter((employee) => {
      if (!search) {
        return true;
      }
      return `${employee.displayName} ${employee.email ?? ""}`
        .toLowerCase()
        .includes(search);
    })
    .sort((left, right) => {
      const latestDelta =
        timestampMs(right.latestInteractionAt) - timestampMs(left.latestInteractionAt);
      if (latestDelta !== 0) {
        return latestDelta;
      }
      return left.displayName.localeCompare(right.displayName);
    });
}

function matchesTranscriptToEmployee(
  transcript: TranscriptRow,
  employee: Pick<DirectoryEmployee, "displayName" | "email">,
) {
  const transcriptName = transcript.employeeName.trim().toLowerCase();
  const transcriptEmail = transcript.employeeEmail.trim().toLowerCase();
  const employeeName = employee.displayName.trim().toLowerCase();
  const employeeEmail = (employee.email ?? "").trim().toLowerCase();

  return transcriptName === employeeName || Boolean(employeeEmail && transcriptEmail === employeeEmail);
}

function latestTimestamp(left: string | null, right: string | null) {
  if (!left) {
    return right;
  }
  if (!right) {
    return left;
  }
  return new Date(left).getTime() >= new Date(right).getTime() ? left : right;
}

async function refreshAll(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["auth"] }),
    refreshAdminData(queryClient),
  ]);
}

async function refreshAdminData(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["overview"] }),
    queryClient.invalidateQueries({ queryKey: ["logs"] }),
    queryClient.invalidateQueries({ queryKey: ["transcripts"] }),
    queryClient.invalidateQueries({ queryKey: ["employee-activity"] }),
    queryClient.invalidateQueries({ queryKey: ["identity-links"] }),
    queryClient.invalidateQueries({ queryKey: ["employees"] }),
  ]);
}
