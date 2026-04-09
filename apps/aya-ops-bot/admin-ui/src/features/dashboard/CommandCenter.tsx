import type { CSSProperties } from "react";

import type {
  EmployeeActivityRow,
  LogRow,
  OverviewResponse,
  SyncStateRow,
} from "../../lib/api";
import { formatAdminTime, timestampMs } from "../../lib/time";

export type CommandCenterEmployee = {
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

type CommandCenterProps = {
  overview: OverviewResponse["overview"] | null | undefined;
  employees: CommandCenterEmployee[];
  activity: EmployeeActivityRow[];
  logs: LogRow[];
  syncStates: SyncStateRow[];
};

type DashboardEmployee = {
  employeeId: string;
  displayName: string;
  roleName: string | null;
  score: number;
  successRate: number;
  interactionCount: number;
  successCount: number;
  failureCount: number;
  logCount: number;
  transcriptCount: number;
  latestInteractionAt: string | null;
  freshnessHours: number | null;
  loadState: "steady" | "watch" | "critical" | "idle";
  loadLabel: string;
};

type DashboardAlert = {
  id: string;
  level: "critical" | "watch" | "healthy";
  title: string;
  detail: string;
  meta: string;
};

type DashboardMixItem = {
  label: string;
  count: number;
  share: number;
};

type DashboardActivityItem = {
  id: string;
  actor: string;
  label: string;
  timestamp: string;
  outcome: string;
};

type DashboardSyncItem = {
  key: string;
  label: string;
  status: "healthy" | "watch" | "critical";
  detail: string;
  timestamp: string | null;
};

type DashboardRoutingItem = {
  intent: string;
  count: number;
  share: number;
};

export function CommandCenter(input: CommandCenterProps) {
  const model = buildCommandCenterModel(input);

  return (
    <div className="command-center">
      <section className="command-strip">
        <article className="panel cockpit-card cockpit-card-primary">
          <div className="cockpit-card-head">
            <div>
              <div className="sidebar-label">Command Readiness</div>
              <h2>{model.readiness.label}</h2>
            </div>
            <span className={`status-chip ${chipTone(model.readiness.state)}`}>
              {model.readiness.state}
            </span>
          </div>
          <div className="cockpit-primary-value">{model.readiness.score}</div>
          <p className="muted">
            Weighted from team activity, reliability, employee coverage, and sync freshness.
          </p>
        </article>

        <MetricStack
          label="Team Throughput"
          value={model.throughput}
          note={`${model.successRate}% success rate`}
        />
        <MetricStack
          label="Planner Quality"
          value={`${model.routing.score}%`}
          note={`${model.routing.clarificationRate}% clarification rate`}
          tone={chipTone(model.routing.state)}
        />
        <MetricStack
          label="Active Crew"
          value={`${model.activeEmployees}/${model.totalEmployees}`}
          note="Employees with recorded activity today"
        />
        <MetricStack
          label="Alert Load"
          value={model.alertLoad}
          note={`${model.criticalCount} critical, ${model.watchCount} watch`}
          tone={model.criticalCount > 0 ? "bad" : model.watchCount > 0 ? "warn" : "ok"}
        />
        <MetricStack
          label="Last Sync"
          value={formatCompactTimestamp(model.latestSyncAt)}
          note={model.syncSummary}
          tone={chipTone(model.syncState)}
        />
      </section>

      <section className="command-grid">
        <section className="panel command-hero-panel">
          <div className="panel-head">
            <div>
              <h2>Team Control Panel</h2>
              <p className="muted">
                A fast read on pace, reliability, and where management attention is needed.
              </p>
            </div>
          </div>
          <div className="command-hero-layout">
            <DialMeter
              value={model.readiness.score}
              label="Readiness"
              tone={model.readiness.state}
              caption={model.readiness.caption}
              size="large"
            />
            <div className="command-hero-stats">
              <StatLine
                label="Reliability"
                value={`${model.successRate}%`}
                tone={model.successRate >= 85 ? "ok" : model.successRate >= 70 ? "warn" : "bad"}
              />
              <StatLine
                label="Coverage"
                value={`${model.activeEmployees} active`}
                tone={
                  model.activeEmployees >= Math.max(1, Math.ceil(model.totalEmployees * 0.7))
                    ? "ok"
                    : "warn"
                }
              />
              <StatLine
                label="Critical Issues"
                value={String(model.criticalCount)}
                tone={model.criticalCount > 0 ? "bad" : "ok"}
              />
              <StatLine
                label="Overdue Risk"
                value={String(model.overdueRiskCount)}
                tone={model.overdueRiskCount > 0 ? "warn" : "ok"}
              />
            </div>
          </div>
        </section>

        <section className="panel command-alert-panel">
          <div className="panel-head">
            <div>
              <h2>Alerts Center</h2>
              <p className="muted">
                The highest-signal warnings first, including inactivity and overdue follow-up risk.
              </p>
            </div>
          </div>
          <div className="alert-stack">
            {model.alerts.length === 0 ? (
              <div className="empty-state">No alerts are currently firing.</div>
            ) : (
              model.alerts.map((alert) => (
                <article key={alert.id} className={`alert-card ${alert.level}`}>
                  <div className="alert-card-head">
                    <strong>{alert.title}</strong>
                    <span className={`status-chip ${chipTone(alert.level)}`}>
                      {alert.level}
                    </span>
                  </div>
                  <p>{alert.detail}</p>
                  <div className="alert-meta">{alert.meta}</div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="panel command-contribution-panel">
          <div className="panel-head">
            <div>
              <h2>Contribution Board</h2>
              <p className="muted">
                Ranked by blended score across throughput, reliability, and freshness.
              </p>
            </div>
          </div>
          <div className="contribution-stack">
            {model.topContributors.map((employee, index) => (
              <article key={employee.employeeId} className="contribution-row">
                <div className="contribution-rank">{index + 1}</div>
                <div className="contribution-copy">
                  <div className="contribution-title-row">
                    <strong>{employee.displayName}</strong>
                    <span className={`status-chip ${chipTone(employee.loadState)}`}>
                      {employee.loadLabel}
                    </span>
                  </div>
                  <div className="contribution-bar-shell">
                    <div
                      className={`contribution-bar ${employee.loadState}`}
                      style={{ width: `${employee.score}%` }}
                    />
                  </div>
                  <div className="contribution-meta">
                    <span>{employee.interactionCount} interactions</span>
                    <span>{employee.successRate}% reliability</span>
                    <span>{formatFreshness(employee.freshnessHours)}</span>
                  </div>
                </div>
                <div className="contribution-score">{employee.score}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel command-crew-panel">
          <div className="panel-head">
            <div>
              <h2>Employee Gauges</h2>
              <p className="muted">
                A dashboard card per employee so you can scan load and contribution in seconds.
              </p>
            </div>
          </div>
          <div className="crew-grid">
            {model.employees.map((employee) => (
              <article key={employee.employeeId} className="crew-card">
                <div className="crew-card-head">
                  <div>
                    <strong>{employee.displayName}</strong>
                    <div className="crew-meta">
                      {employee.roleName ?? "employee"}
                    </div>
                  </div>
                  <span className={`status-chip ${chipTone(employee.loadState)}`}>
                    {employee.loadLabel}
                  </span>
                </div>
                <div className="crew-card-body">
                  <DialMeter
                    value={employee.score}
                    label="Contribution"
                    tone={employee.loadState}
                    caption={`${employee.successRate}% reliable`}
                  />
                  <div className="crew-stats">
                    <StatLine label="Interactions" value={String(employee.interactionCount)} />
                    <StatLine label="Success" value={String(employee.successCount)} tone="ok" />
                    <StatLine
                      label="Failures"
                      value={String(employee.failureCount)}
                      tone={employee.failureCount > 0 ? "bad" : "ok"}
                    />
                    <StatLine
                      label="Last Seen"
                      value={formatCompactTimestamp(employee.latestInteractionAt)}
                      tone={employee.freshnessHours !== null && employee.freshnessHours > 24 ? "warn" : "info"}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel command-activity-panel">
          <div className="panel-head">
            <div>
              <h2>Recent Critical Activity</h2>
              <p className="muted">
                The latest actions across the team so a manager can drill in immediately.
              </p>
            </div>
          </div>
          <div className="activity-stack">
            {model.recentActivity.map((item) => (
              <article key={item.id} className="activity-card">
                <div>
                  <strong>{item.actor}</strong>
                  <p>{item.label}</p>
                </div>
                <div className="activity-meta">
                  <span className={`status-chip ${item.outcome === "success" ? "ok" : "bad"}`}>
                    {item.outcome}
                  </span>
                  <span>{formatAdminTime(item.timestamp)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel command-mix-panel">
          <div className="panel-head">
            <div>
              <h2>Routing Watch</h2>
              <p className="muted">
                Planner health, clarification pressure, and the intents Aya is routing most often.
              </p>
            </div>
          </div>
          <div className="routing-metric-grid">
            <StatLine
              label="Average Confidence"
              value={`${model.routing.averageConfidence}%`}
              tone={chipTone(model.routing.state)}
            />
            <StatLine
              label="Clarifications"
              value={`${model.routing.clarificationRate}%`}
              tone={
                model.routing.clarificationRate <= 12
                  ? "ok"
                  : model.routing.clarificationRate <= 22
                    ? "warn"
                    : "bad"
              }
            />
            <StatLine
              label="Low Confidence"
              value={String(model.routing.lowConfidenceCount)}
              tone={model.routing.lowConfidenceCount === 0 ? "ok" : "warn"}
            />
            <StatLine
              label="Context Follow-ups"
              value={String(model.routing.activeRecordFollowUps)}
              tone={model.routing.activeRecordFollowUps > 0 ? "ok" : "info"}
            />
          </div>
          <div className="mix-stack">
            {model.routing.topIntents.map((item) => (
              <article key={item.label} className="mix-row">
                <div className="mix-row-head">
                  <strong>{item.label}</strong>
                  <span>{item.count}</span>
                </div>
                <div className="contribution-bar-shell">
                  <div
                    className={`contribution-bar ${
                      model.routing.state === "critical"
                        ? "critical"
                        : model.routing.state === "watch"
                          ? "watch"
                          : "steady"
                    }`}
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
          <div className="routing-footnote">
            Work mix still reflects real logs, but the routing panel shows whether Aya is classifying confidently enough to trust at scale.
          </div>
        </section>

        <section className="panel command-sync-panel">
          <div className="panel-head">
            <div>
              <h2>System Watch</h2>
              <p className="muted">
                Sync freshness and data health, because the dashboard is only useful if the feed is fresh.
              </p>
            </div>
          </div>
          <div className="sync-watch-grid">
            {model.syncItems.map((item) => (
              <article key={item.key} className={`sync-watch-card ${item.status}`}>
                <div className="sync-state-head">
                  <strong>{item.label}</strong>
                  <span className={`status-chip ${chipTone(item.status)}`}>{item.status}</span>
                </div>
                <div className="sync-watch-detail">{item.detail}</div>
                <div className="sync-watch-time">{formatAdminTime(item.timestamp)}</div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function MetricStack(input: {
  label: string;
  value: string | number;
  note: string;
  tone?: "ok" | "warn" | "bad" | "info";
}) {
  return (
    <article className="panel cockpit-card">
      <div className="metric-label">{input.label}</div>
      <div className="cockpit-metric-value">{input.value}</div>
      <div className="cockpit-note-row">
        <span className={`status-dot ${input.tone ?? "info"}`} />
        <span>{input.note}</span>
      </div>
    </article>
  );
}

function DialMeter(input: {
  value: number;
  label: string;
  tone: "steady" | "watch" | "critical" | "idle";
  caption: string;
  size?: "normal" | "large";
}) {
  const style = {
    "--dial-value": `${Math.max(0, Math.min(100, input.value))}%`,
    "--dial-color": dialColor(input.tone),
  } as CSSProperties;

  return (
    <div className={`dial-card ${input.size === "large" ? "large" : ""}`}>
      <div className="dial-shell" style={style}>
        <div className="dial-center">
          <div className="dial-value">{Math.round(input.value)}</div>
          <div className="dial-caption">/100</div>
        </div>
      </div>
      <div className="dial-copy">
        <div className="metric-label">{input.label}</div>
        <strong>{input.caption}</strong>
      </div>
    </div>
  );
}

function StatLine(input: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "bad" | "info";
}) {
  return (
    <div className="stat-line">
      <span>{input.label}</span>
      <span className={`status-chip ${input.tone ?? "info"}`}>{input.value}</span>
    </div>
  );
}

function buildCommandCenterModel(input: CommandCenterProps) {
  const activityById = new Map(input.activity.map((row) => [row.employee_id, row]));
  const latestSyncAt = latestSyncTimestamp(input.syncStates);
  const peakInteractions =
    Math.max(1, ...input.employees.map((employee) => employee.interactionCount || 0));
  const averageInteractions =
    input.employees.reduce((total, employee) => total + employee.interactionCount, 0) /
    Math.max(1, input.employees.length);

  const employees: DashboardEmployee[] = input.employees
    .map((employee) => {
      const activity = activityById.get(employee.employeeId);
      const interactionCount = activity?.interaction_count ?? employee.interactionCount ?? 0;
      const successCount = activity?.success_count ?? 0;
      const failureCount = activity?.failure_count ?? 0;
      const successRate = Math.round(
        Number(activity?.success_rate ?? employee.successRate ?? 0),
      );
      const freshnessHours = ageHours(employee.latestInteractionAt);
      const freshnessScore =
        freshnessHours === null
          ? 0
          : freshnessHours <= 4
            ? 100
            : freshnessHours <= 24
              ? 72
              : freshnessHours <= 48
                ? 42
                : 18;
      const activityScore = Math.round((interactionCount / peakInteractions) * 100);
      const score = Math.round(
        activityScore * 0.45 + successRate * 0.35 + freshnessScore * 0.2,
      );

      let loadState: DashboardEmployee["loadState"] = "steady";
      let loadLabel = "Cruising";

      if (freshnessHours === null || freshnessHours > 48) {
        loadState = "idle";
        loadLabel = "Idle";
      } else if (failureCount >= 2 || (interactionCount >= 3 && successRate < 70)) {
        loadState = "critical";
        loadLabel = "Needs Review";
      } else if (
        interactionCount > averageInteractions * 1.5 ||
        (freshnessHours !== null && freshnessHours > 24)
      ) {
        loadState = "watch";
        loadLabel = "Watch";
      }

      return {
        employeeId: employee.employeeId,
        displayName: employee.displayName,
        roleName: employee.roleName,
        score,
        successRate,
        interactionCount,
        successCount,
        failureCount,
        logCount: employee.logCount,
        transcriptCount: employee.transcriptCount,
        latestInteractionAt: employee.latestInteractionAt,
        freshnessHours,
        loadState,
        loadLabel,
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return timestampMs(right.latestInteractionAt) - timestampMs(left.latestInteractionAt);
    });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (employee) => employee.freshnessHours !== null && employee.freshnessHours <= 24,
  ).length;
  const successRate = input.overview
    ? percentage(input.overview.successCount, input.overview.successCount + input.overview.failureCount)
    : Math.round(
        employees.reduce((total, employee) => total + employee.successRate, 0) /
          Math.max(1, employees.length),
      );
  const syncScore = syncHealthScore(latestSyncAt);
  const coverageScore = Math.round((activeEmployees / Math.max(1, totalEmployees)) * 100);
  const throughput = input.overview?.totalInteractions ?? input.logs.length;
  const throughputScore = Math.min(
    100,
    Math.round((throughput / Math.max(1, totalEmployees * 6)) * 100),
  );
  const routing = buildRoutingModel(input.overview, throughput);
  const readinessScore = Math.round(
    successRate * 0.28 +
      coverageScore * 0.22 +
      syncScore * 0.16 +
      throughputScore * 0.14 +
      routing.score * 0.2,
  );
  const readinessState =
    readinessScore >= 80 ? "steady" : readinessScore >= 62 ? "watch" : "critical";

  const syncItems = input.syncStates.map((state) => {
    const timestamp =
      state.last_incremental_sync_at ??
      state.last_webhook_event_at ??
      state.updated_at ??
      null;
    const age = ageHours(timestamp);
    const status =
      age === null ? "critical" : age <= 2 ? "healthy" : age <= 8 ? "watch" : "critical";
    return {
      key: state.entity_type,
      label: state.entity_type,
      status,
      detail:
        age === null
          ? "No sync recorded"
          : age <= 2
            ? "Fresh feed"
            : age <= 8
              ? "Needs a quick check"
              : "Stale feed",
      timestamp,
    } satisfies DashboardSyncItem;
  });

  const alerts = buildAlerts({
    employees,
    overview: input.overview,
    syncItems,
    routing,
  });

  const recentActivity = [...input.logs]
    .sort((left, right) => timestampMs(right.created_at) - timestampMs(left.created_at))
    .slice(0, 6)
    .map((row) => ({
      id: row.id,
      actor: row.display_name ?? "Unknown employee",
      label: describeLog(row),
      timestamp: row.created_at,
      outcome: row.outcome ?? "unknown",
    }));

  return {
    readiness: {
      score: readinessScore,
      state: readinessState,
      label:
        readinessState === "steady"
          ? "Cruising"
          : readinessState === "watch"
            ? "Watch Closely"
            : "Intervene Now",
      caption:
        readinessState === "steady"
          ? "Team pace and reliability are holding."
          : readinessState === "watch"
            ? "Good momentum, but there are pressure points."
            : "Critical issues are reducing team speed.",
    },
    throughput,
    successRate,
    totalEmployees,
    activeEmployees,
    latestSyncAt,
    syncState: syncItems.some((item) => item.status === "critical")
      ? "critical"
      : syncItems.some((item) => item.status === "watch")
        ? "watch"
        : "steady",
    syncSummary:
      syncItems.length === 0
        ? "No sync states yet"
        : `${syncItems.filter((item) => item.status === "healthy").length}/${syncItems.length} healthy feeds`,
    criticalCount: alerts.filter((alert) => alert.level === "critical").length,
    watchCount: alerts.filter((alert) => alert.level === "watch").length,
    overdueRiskCount: alerts.filter((alert) => alert.title.includes("Overdue")).length,
    alertLoad: alerts.length,
    alerts,
    employees,
    topContributors: employees.slice(0, 5),
    recentActivity,
    routing,
    syncItems,
  };
}

function buildAlerts(input: {
  employees: DashboardEmployee[];
  overview: OverviewResponse["overview"] | null | undefined;
  syncItems: DashboardSyncItem[];
  routing: {
    clarificationRate: number;
    lowConfidenceCount: number;
    unmatchedRate: number;
    state: "steady" | "watch" | "critical";
  };
}) {
  const alerts: DashboardAlert[] = [];

  if ((input.overview?.failureCount ?? 0) > 0) {
    alerts.push({
      id: "failed-actions",
      level: "critical",
      title: "Failed actions require review",
      detail: `${input.overview?.failureCount ?? 0} Aya actions failed in the current reporting window.`,
      meta: "Review the failing prompts before they turn into silent workflow gaps.",
    });
  }

  if (input.routing.state !== "steady") {
    alerts.push({
      id: "planner-health",
      level: input.routing.state === "critical" ? "critical" : "watch",
      title: "Planner quality needs attention",
      detail: `${input.routing.clarificationRate}% clarification rate, ${input.routing.lowConfidenceCount} low-confidence plans, ${input.routing.unmatchedRate}% unmatched prompts.`,
      meta: "This is the best early signal that Aya routing quality is slipping before employees lose trust.",
    });
  }

  for (const item of input.syncItems.filter((entry) => entry.status !== "healthy")) {
    alerts.push({
      id: `sync-${item.key}`,
      level: item.status === "critical" ? "critical" : "watch",
      title: `${item.label} sync is ${item.status}`,
      detail: item.detail,
      meta: `Last feed: ${formatCompactTimestamp(item.timestamp)}`,
    });
  }

  for (const employee of input.employees) {
    if (employee.freshnessHours === null) {
      alerts.push({
        id: `idle-${employee.employeeId}`,
        level: "watch",
        title: `${employee.displayName} has no recorded activity`,
        detail: "No chat, bot action, or synced movement has been recorded yet.",
        meta: "Verify whether this employee is inactive, missing identity links, or simply not routed through Aya.",
      });
      continue;
    }

    if (employee.freshnessHours > 24) {
      alerts.push({
        id: `overdue-${employee.employeeId}`,
        level: employee.freshnessHours > 48 ? "critical" : "watch",
        title: `Overdue follow-up risk: ${employee.displayName}`,
        detail: `No recent activity for ${formatFreshness(employee.freshnessHours)}.`,
        meta: "Use this as the fast warning light for stalled queues or missed follow-up.",
      });
    }

    if (employee.failureCount > 0) {
      alerts.push({
        id: `failure-${employee.employeeId}`,
        level: employee.failureCount >= 2 ? "critical" : "watch",
        title: `${employee.displayName} has action failures`,
        detail: `${employee.failureCount} failed action${employee.failureCount === 1 ? "" : "s"} recorded.`,
        meta: `${employee.successRate}% reliability with ${employee.interactionCount} total interactions.`,
      });
    }
  }

  return alerts
    .sort((left, right) => severityWeight(right.level) - severityWeight(left.level))
    .slice(0, 7);
}

function classifyLog(log: LogRow) {
  const text = `${log.detected_intent ?? ""} ${log.command_name ?? ""} ${log.inbound_text}`.toLowerCase();

  if (/(find|search|look up|lookup)/.test(text)) {
    return "Search";
  }
  if (/(comment|note)/.test(text)) {
    return "Notes";
  }
  if (/(move|stage|underwriting|pending review|workflow)/.test(text)) {
    return "Workflow";
  }
  if (/(summary|what changed|what did|workload)/.test(text)) {
    return "Summaries";
  }
  if (/(create|new lead|add a client|lead)/.test(text)) {
    return "Intake";
  }
  return "Other";
}

function describeLog(log: LogRow) {
  if (log.detected_intent) {
    return log.detected_intent.replaceAll("_", " ");
  }
  if (log.command_name) {
    return log.command_name.replaceAll("_", " ");
  }
  return log.inbound_text.length > 72
    ? `${log.inbound_text.slice(0, 72).trim()}...`
    : log.inbound_text;
}

function buildRoutingModel(
  overview: OverviewResponse["overview"] | null | undefined,
  throughput: number,
) {
  const planner = overview?.planner ?? {
    plannedCount: 0,
    averageConfidence: 0,
    clarificationCount: 0,
    unmatchedCount: 0,
    lowConfidenceCount: 0,
    activeRecordFollowUps: 0,
    topIntents: [],
  };
  const averageConfidence = Math.round((planner.averageConfidence ?? 0) * 100);
  const clarificationRate = percentage(
    planner.clarificationCount,
    Math.max(1, planner.plannedCount),
  );
  const unmatchedRate = percentage(
    planner.unmatchedCount,
    Math.max(1, throughput),
  );
  const routingScore = clamp(
    Math.round(
      averageConfidence * 0.7 +
        Math.max(0, 100 - clarificationRate * 2) * 0.18 +
        Math.max(0, 100 - unmatchedRate * 3) * 0.12,
    ),
    0,
    100,
  );
  const state =
    routingScore >= 82
      ? "steady"
      : routingScore >= 66
        ? "watch"
        : "critical";

  const topIntents = planner.topIntents.map((item) => ({
    label: formatIntentLabel(item.intent),
    count: item.count,
    share: Math.round((item.count / Math.max(1, planner.plannedCount)) * 100),
  })) satisfies DashboardMixItem[];

  return {
    score: routingScore,
    state,
    averageConfidence,
    clarificationRate,
    unmatchedRate,
    lowConfidenceCount: planner.lowConfidenceCount,
    activeRecordFollowUps: planner.activeRecordFollowUps,
    topIntents:
      topIntents.length > 0
        ? topIntents
        : ([{ label: "No planned intents yet", count: 0, share: 0 }] satisfies DashboardRoutingItem[]),
  };
}

function formatIntentLabel(intent: string) {
  return intent
    .replaceAll(".", " / ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function chipTone(
  tone: "steady" | "watch" | "critical" | "idle" | "healthy" | "ok" | "warn" | "bad" | "info",
) {
  switch (tone) {
    case "steady":
    case "healthy":
    case "ok":
      return "ok";
    case "watch":
    case "warn":
    case "idle":
      return "warn";
    case "critical":
    case "bad":
      return "bad";
    default:
      return "info";
  }
}

function dialColor(tone: "steady" | "watch" | "critical" | "idle") {
  switch (tone) {
    case "steady":
      return "#74d7b0";
    case "watch":
      return "#f3c96a";
    case "critical":
      return "#ff6b6b";
    case "idle":
      return "#89bcff";
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function latestSyncTimestamp(states: SyncStateRow[]) {
  return states
    .map((state) => state.last_incremental_sync_at ?? state.updated_at)
    .filter(Boolean)
    .sort((left, right) => timestampMs(right) - timestampMs(left))[0] ?? null;
}

function syncHealthScore(timestamp: string | null) {
  const age = ageHours(timestamp);
  if (age === null) {
    return 15;
  }
  if (age <= 1) {
    return 100;
  }
  if (age <= 4) {
    return 82;
  }
  if (age <= 12) {
    return 58;
  }
  return 24;
}

function ageHours(timestamp: string | null) {
  if (!timestamp) {
    return null;
  }
  const milliseconds = Date.now() - new Date(timestamp).getTime();
  return Math.max(0, Math.round(milliseconds / (1000 * 60 * 60)));
}

function percentage(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }
  return Math.round((numerator / denominator) * 100);
}

function severityWeight(level: DashboardAlert["level"]) {
  switch (level) {
    case "critical":
      return 3;
    case "watch":
      return 2;
    case "healthy":
      return 1;
  }
}

function formatFreshness(hours: number | null) {
  if (hours === null) {
    return "No activity yet";
  }
  if (hours < 1) {
    return "Active this hour";
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function formatCompactTimestamp(timestamp: string | null) {
  if (!timestamp) {
    return "No signal";
  }
  const hours = ageHours(timestamp);
  if (hours === null) {
    return formatAdminTime(timestamp);
  }
  if (hours <= 1) {
    return "Within 1h";
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  return formatAdminTime(timestamp);
}
