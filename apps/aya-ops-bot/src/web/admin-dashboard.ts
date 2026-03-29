export function renderAdminDashboardPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Aya Admin Dashboard</title>
    <style>
      body {
        margin: 16px;
        background: #fff;
        color: #111;
        font-family: sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }

      h1, h2, h3, p {
        margin: 0 0 12px;
      }

      .block {
        margin-bottom: 24px;
      }

      .row {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 12px;
      }

      input, select, button {
        font: inherit;
        padding: 6px 8px;
        border: 1px solid #999;
        background: #fff;
        color: #111;
      }

      button {
        cursor: pointer;
      }

      .grid {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 24px;
      }

      .box {
        border: 1px solid #999;
        padding: 12px;
      }

      .metric {
        margin-bottom: 8px;
      }

      .metric strong {
        display: inline-block;
        min-width: 180px;
      }

      .employee-item {
        border: 1px solid #ccc;
        padding: 8px;
        margin-bottom: 8px;
        cursor: pointer;
      }

      .employee-item:hover {
        background: #f3f3f3;
      }

      .muted {
        color: #555;
      }

      .ok {
        color: #0a6b1f;
        font-weight: 700;
      }

      .bad {
        color: #8b1e1e;
        font-weight: 700;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
        vertical-align: top;
      }

      th {
        background: #f0f0f0;
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        font: inherit;
      }

      .login-shell {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.15);
      }

      .login-card {
        width: 360px;
        margin: 80px auto 0;
        background: #fff;
        border: 1px solid #999;
        padding: 16px;
      }

      @media (max-width: 960px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="login-shell" id="login-shell">
      <div class="login-card">
        <h2>Admin Login</h2>
        <p class="muted">Aya admin only.</p>
        <form id="login-form">
          <div class="block">
            <input id="login-name" placeholder="Hamza Paracha" style="width: 100%;" />
          </div>
          <div class="block">
            <input id="login-password" type="password" placeholder="Password" style="width: 100%;" />
          </div>
          <div class="row">
            <button type="submit">Sign In</button>
          </div>
        </form>
        <div id="login-error" class="muted"></div>
      </div>
    </div>

    <div class="block">
      <h1>Aya Admin Dashboard</h1>
      <p class="muted">Admin-only audit view for employee prompts, replies, and execution logs. Times are shown in America/Toronto.</p>
      <div class="row">
        <div id="current-admin">Not signed in</div>
        <button type="button" id="refresh-button">Refresh</button>
        <button type="button" id="logout-button">Logout</button>
      </div>
    </div>

    <div class="block box">
      <h2>Overview</h2>
      <div class="metric"><strong>Interactions Today</strong><span id="metric-total">0</span></div>
      <div class="metric"><strong>Successful Actions</strong><span id="metric-success">0</span></div>
      <div class="metric"><strong>Failed Actions</strong><span id="metric-failure">0</span></div>
      <div class="metric"><strong>Active Employees</strong><span id="metric-employees">0</span></div>
      <div class="metric"><strong>Latest Bot Activity</strong><span id="metric-latest">None</span></div>
    </div>

    <div class="grid">
      <div class="box">
        <h2>Employee Activity</h2>
        <div id="employee-list"></div>
      </div>

      <div class="box">
        <div class="row">
          <h2 style="margin: 0;">Recent Logs</h2>
          <select id="employee-filter">
            <option value="">All employees</option>
          </select>
          <select id="limit-filter">
            <option value="25">25 rows</option>
            <option value="50" selected>50 rows</option>
            <option value="100">100 rows</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Employee</th>
              <th>Intent</th>
              <th>Prompt</th>
              <th>Reply</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody id="logs-body"></tbody>
        </table>
      </div>
    </div>

    <div class="block box">
      <div class="row">
        <h2 style="margin: 0;">LibreChat Conversations</h2>
        <select id="transcript-limit-filter">
          <option value="10">10 conversations</option>
          <option value="20" selected>20 conversations</option>
          <option value="50">50 conversations</option>
        </select>
      </div>
      <p class="muted">Raw LibreChat conversations and message previews. This is separate from Aya's tool execution log.</p>
      <table>
        <thead>
          <tr>
            <th>Conversation</th>
            <th>Employee</th>
            <th>Model</th>
            <th>Messages</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody id="transcripts-body"></tbody>
      </table>
    </div>

    <script>
      const loginShell = document.getElementById("login-shell");
      const loginForm = document.getElementById("login-form");
      const loginName = document.getElementById("login-name");
      const loginPassword = document.getElementById("login-password");
      const loginError = document.getElementById("login-error");
      const currentAdmin = document.getElementById("current-admin");
      const refreshButton = document.getElementById("refresh-button");
      const logoutButton = document.getElementById("logout-button");
      const employeeFilter = document.getElementById("employee-filter");
      const limitFilter = document.getElementById("limit-filter");
      const employeeList = document.getElementById("employee-list");
      const logsBody = document.getElementById("logs-body");
      const transcriptsBody = document.getElementById("transcripts-body");
      const transcriptLimitFilter = document.getElementById("transcript-limit-filter");
      const metricTotal = document.getElementById("metric-total");
      const metricSuccess = document.getElementById("metric-success");
      const metricFailure = document.getElementById("metric-failure");
      const metricEmployees = document.getElementById("metric-employees");
      const metricLatest = document.getElementById("metric-latest");

      async function ensureAdminSession() {
        const response = await fetch("/auth/me");
        const data = await response.json();

        if (!data.authenticated || !data.employee || data.employee.roleName !== "admin") {
          loginShell.style.display = "block";
          currentAdmin.textContent = "Not signed in";
          return false;
        }

        loginShell.style.display = "none";
        currentAdmin.textContent = data.employee.displayName + " (" + data.employee.roleName + ")";
        loginError.textContent = "";
        return true;
      }

      function formatTime(value) {
        if (!value) {
          return "None";
        }
        const normalized = String(value).includes("T")
          ? String(value)
          : String(value).replace(" ", "T") + "Z";

        return new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Toronto",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date(normalized)) + " ET";
      }

      function escapeHtml(value) {
        return String(value || "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
      }

      function renderOverview(data) {
        metricTotal.textContent = String(data.overview.totalInteractions || 0);
        metricSuccess.textContent = String(data.overview.successCount || 0);
        metricFailure.textContent = String(data.overview.failureCount || 0);
        metricEmployees.textContent = String(data.overview.activeEmployees || 0);
        metricLatest.textContent = formatTime(data.overview.latestInteractionAt);

        employeeList.innerHTML = "";
        employeeFilter.innerHTML = "<option value=''>All employees</option>";

        for (const item of data.employees || []) {
          const row = document.createElement("div");
          row.className = "employee-item";
          row.innerHTML =
            "<div><strong>" + escapeHtml(item.display_name) + "</strong></div>" +
            "<div class='muted'>Role: " + escapeHtml(item.role_name || "employee") + "</div>" +
            "<div class='muted'>Interactions: " + String(item.interaction_count || 0) + "</div>" +
            "<div class='muted'>Success: " + String(item.success_count || 0) + "</div>" +
            "<div class='muted'>Last bot activity: " + formatTime(item.latest_interaction_at) + "</div>";
          row.addEventListener("click", () => {
            employeeFilter.value = item.employee_id;
            loadLogs();
          });
          employeeList.appendChild(row);

          const option = document.createElement("option");
          option.value = item.employee_id;
          option.textContent = item.display_name;
          employeeFilter.appendChild(option);
        }
      }

      function renderLogs(rows) {
        logsBody.innerHTML = "";

        if (!rows.length) {
          logsBody.innerHTML = "<tr><td colspan='6'>No logs found.</td></tr>";
          return;
        }

        for (const row of rows) {
          const tr = document.createElement("tr");
          tr.innerHTML =
            "<td>" + formatTime(row.created_at) + "</td>" +
            "<td><div><strong>" + escapeHtml(row.display_name || "Unknown") + "</strong></div><div class='muted'>" + escapeHtml(row.transport || "") + "</div></td>" +
            "<td><div>" + escapeHtml(row.detected_intent || "Unmatched") + "</div><div class='muted'>" + escapeHtml(row.adapter || "") + (row.command_name ? " / " + escapeHtml(row.command_name) : "") + "</div></td>" +
            "<td><pre>" + escapeHtml(row.inbound_text || "") + "</pre></td>" +
            "<td><pre>" + escapeHtml(row.response_text || "") + "</pre></td>" +
            "<td><span class='" + (row.outcome === "success" ? "ok" : "bad") + "'>" + escapeHtml(row.outcome || "") + "</span></td>";
          logsBody.appendChild(tr);
        }
      }

      function renderTranscripts(rows) {
        transcriptsBody.innerHTML = "";

        if (!rows.length) {
          transcriptsBody.innerHTML = "<tr><td colspan='5'>No LibreChat conversations yet.</td></tr>";
          return;
        }

        for (const row of rows) {
          const preview = (row.messages || [])
            .slice(0, 4)
            .map((message) => {
              const label = message.isCreatedByUser ? "user" : (message.sender || "assistant");
              return label + ": " + (message.text || "");
            })
            .join("\\n\\n");

          const tr = document.createElement("tr");
          tr.innerHTML =
            "<td><div><strong>" + escapeHtml(row.title || "New Chat") + "</strong></div><div class='muted'>" + escapeHtml(row.conversationId || "") + "</div></td>" +
            "<td><div>" + escapeHtml(row.employeeName || "Unknown") + "</div><div class='muted'>" + escapeHtml(row.employeeEmail || "") + "</div></td>" +
            "<td><div>" + escapeHtml(row.endpoint || "") + "</div><div class='muted'>" + escapeHtml(row.model || "") + "</div></td>" +
            "<td><pre>" + escapeHtml(preview) + "</pre></td>" +
            "<td>" + formatTime(row.updatedAt || row.createdAt) + "</td>";
          transcriptsBody.appendChild(tr);
        }
      }

      async function loadOverview() {
        const response = await fetch("/admin/api/overview");
        if (!response.ok) {
          throw new Error("Failed to load admin overview");
        }
        renderOverview(await response.json());
      }

      async function loadLogs() {
        const params = new URLSearchParams();
        if (employeeFilter.value) {
          params.set("employeeId", employeeFilter.value);
        }
        params.set("limit", limitFilter.value);

        const response = await fetch("/admin/api/logs?" + params.toString());
        if (!response.ok) {
          throw new Error("Failed to load audit logs");
        }

        const data = await response.json();
        renderLogs(data.items || []);
      }

      async function loadTranscripts() {
        const params = new URLSearchParams();
        params.set("limit", transcriptLimitFilter.value);

        const response = await fetch("/admin/api/transcripts?" + params.toString());
        if (!response.ok) {
          throw new Error("Failed to load LibreChat transcripts");
        }

        const data = await response.json();
        renderTranscripts(data.items || []);
      }

      async function refreshAll() {
        await loadOverview();
        await loadLogs();
        await loadTranscripts();
      }

      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        loginError.textContent = "";

        const response = await fetch("/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            employeeName: loginName.value,
            password: loginPassword.value,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          loginError.textContent = data.error || "Login failed.";
          return;
        }

        loginPassword.value = "";
        await ensureAdminSession();
        await refreshAll();
      });

      logoutButton.addEventListener("click", async () => {
        await fetch("/auth/logout", { method: "POST" });
        loginShell.style.display = "block";
        currentAdmin.textContent = "Not signed in";
        employeeList.innerHTML = "";
        logsBody.innerHTML = "";
      });

      refreshButton.addEventListener("click", refreshAll);
      employeeFilter.addEventListener("change", loadLogs);
      limitFilter.addEventListener("change", loadLogs);
      transcriptLimitFilter.addEventListener("change", loadTranscripts);

      (async () => {
        if (await ensureAdminSession()) {
          await refreshAll();
        }
      })();
    </script>
  </body>
</html>`;
}
