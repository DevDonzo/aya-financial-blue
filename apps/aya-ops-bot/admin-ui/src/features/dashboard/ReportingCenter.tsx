import type { DashboardRow, ReportRow, ReportingCapability } from "../../lib/api";
import { formatAdminTime } from "../../lib/time";

type ReportingCenterProps = {
  capability: ReportingCapability | null | undefined;
  dashboards: DashboardRow[];
  reports: ReportRow[];
  errors: {
    dashboards: string | null;
    reports: string | null;
  };
};

export function ReportingCenter(props: ReportingCenterProps) {
  const capability = props.capability;
  const companyLabel =
    capability?.companyName ?? capability?.companySlug ?? capability?.companyId ?? "Blue company";
  const planLabel =
    capability?.plan?.planName ??
    capability?.plan?.planId ??
    capability?.subscriptionStatus ??
    "Plan unavailable";

  return (
    <section className="reporting-layout">
      <section className="panel reporting-hero">
        <div className="panel-head">
          <div>
            <div className="sidebar-label">Blue Reporting</div>
            <h2>{companyLabel}</h2>
            <p className="muted">
              Enterprise-aware dashboard and report inventory for admins and managers.
            </p>
          </div>
          <span
            className={`status-chip ${
              capability?.supportsReports ? "ok" : capability?.configured ? "warn" : "neutral"
            }`}
          >
            {capability?.supportsReports ? "reports enabled" : "staged"}
          </span>
        </div>

        <div className="reporting-metrics">
          <Metric label="Plan" value={planLabel} />
          <Metric
            label="Subscription"
            value={capability?.subscriptionStatus ?? "unknown"}
          />
          <Metric label="Dashboards" value={String(props.dashboards.length)} />
          <Metric label="Reports" value={String(props.reports.length)} />
        </div>

        {!capability?.supportsReports ? (
          <div className="reporting-callout reporting-callout-warn">
            Reporting is wired and ready, but Blue report APIs are being treated as Enterprise-only.
            Once the Blue company upgrades, this view should start returning live reports without
            additional app changes.
          </div>
        ) : null}

        {props.errors.dashboards || props.errors.reports ? (
          <div className="reporting-callout reporting-callout-danger">
            {props.errors.dashboards ? `Dashboards: ${props.errors.dashboards}` : null}
            {props.errors.dashboards && props.errors.reports ? " " : null}
            {props.errors.reports ? `Reports: ${props.errors.reports}` : null}
          </div>
        ) : null}
      </section>

      <section className="reporting-grid">
        <section className="panel reporting-panel">
          <div className="panel-head">
            <div>
              <h2>Dashboards</h2>
              <p className="muted">
                Shared Blue dashboards available to this organization.
              </p>
            </div>
          </div>
          <div className="reporting-stack">
            {props.dashboards.length === 0 ? (
              <div className="empty-state">No dashboards were returned.</div>
            ) : (
              props.dashboards.map((dashboard) => (
                <article key={dashboard.id} className="report-card">
                  <div className="report-card-head">
                    <strong>{dashboard.title}</strong>
                    <span className="status-chip neutral">
                      {dashboard.dashboardUsers?.length ?? 0} members
                    </span>
                  </div>
                  <div className="report-card-meta">
                    <span>Owner: {dashboard.createdBy.fullName ?? dashboard.createdBy.email ?? "Unknown"}</span>
                    <span>Updated {formatAdminTime(dashboard.updatedAt)}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="panel reporting-panel">
          <div className="panel-head">
            <div>
              <h2>Reports</h2>
              <p className="muted">
                Cross-workspace report objects and their underlying data sources.
              </p>
            </div>
          </div>
          <div className="reporting-stack">
            {props.reports.length === 0 ? (
              <div className="empty-state">
                {capability?.supportsReports
                  ? "No reports were returned."
                  : "Reports will appear here after the Blue account is upgraded."}
              </div>
            ) : (
              props.reports.map((report) => (
                <article key={report.id} className="report-card">
                  <div className="report-card-head">
                    <strong>{report.title}</strong>
                    <span className="status-chip neutral">
                      {report.dataSources.length} data source{report.dataSources.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  {report.description ? (
                    <p className="muted report-card-copy">{report.description}</p>
                  ) : null}
                  <div className="report-card-meta">
                    <span>Owner: {report.createdBy.fullName ?? report.createdBy.email ?? "Unknown"}</span>
                    <span>Generated {formatAdminTime(report.lastGeneratedAt ?? null)}</span>
                  </div>
                  <div className="report-chip-row">
                    {report.dataSources.map((dataSource) => (
                      <span key={dataSource.id} className="report-chip">
                        {dataSource.name ?? dataSource.sourceType}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </section>
  );
}

function Metric(input: { label: string; value: string }) {
  return (
    <article className="metric-card reporting-metric">
      <div className="metric-label">{input.label}</div>
      <div className="metric-value">{input.value}</div>
    </article>
  );
}
