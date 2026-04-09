interface EmployeeAuditLogRow {
  id: string;
  created_at: string;
  employee_id: string | null;
  display_name: string | null;
  role_name: string | null;
  transport: string;
  detected_intent: string | null;
  adapter: string;
  command_name: string | null;
  command_args: string | null;
  outcome: string;
  inbound_text: string;
  response_text: string | null;
  request_json: string | null;
  response_json: string | null;
}

export type EmployeeActivityFocus =
  | "all"
  | "comments"
  | "moves"
  | "creates"
  | "timeline";

export type WorkspaceActivityFocus =
  | "all"
  | "comments"
  | "moves"
  | "creates"
  | "timeline";

interface ParsedActivityItem {
  kind: "comment" | "move" | "create" | "read" | "other";
  occurredAt: string;
  outcome: string;
  intent: string | null;
  employeeName: string;
  summary: string;
  inboundText: string;
  recordTitle: string | null;
  targetListTitle: string | null;
  text: string | null;
  listTitle: string | null;
}

export function buildEmployeeActivityReport(input: {
  employeeName: string;
  date: string;
  rows: EmployeeAuditLogRow[];
  focus?: EmployeeActivityFocus;
}) {
  const parsed = input.rows.map(parseAuditRow);
  const successful = parsed.filter((item) => item.outcome === "success");
  const comments = successful.filter((item) => item.kind === "comment");
  const moves = successful.filter((item) => item.kind === "move");
  const creates = successful.filter((item) => item.kind === "create");
  const reads = successful.filter((item) => item.kind === "read");
  const clarifications = input.rows.filter(
    (row) => row.outcome === "needs_clarification",
  ).length;
  const failures = input.rows.filter(
    (row) => row.outcome !== "success" && row.outcome !== "needs_clarification",
  ).length;

  return {
    employeeName: input.employeeName,
    date: input.date,
    totalInteractions: input.rows.length,
    successfulActions: successful.length,
    clarificationCount: clarifications,
    failureCount: failures,
    writeCount: comments.length + moves.length + creates.length,
    readCount: reads.length,
    comments,
    moves,
    creates,
    recentActions: parsed.slice(0, 12),
    responseText: buildReportText({
      employeeName: input.employeeName,
      date: input.date,
      focus: input.focus ?? "all",
      totalInteractions: input.rows.length,
      successfulActions: successful.length,
      clarificationCount: clarifications,
      failureCount: failures,
      writeCount: comments.length + moves.length + creates.length,
      readCount: reads.length,
      comments,
      moves,
      creates,
      recentActions: parsed.slice(0, 8),
    }),
  };
}

export function buildWorkspaceActivityReport(input: {
  date: string;
  rows: EmployeeAuditLogRow[];
  focus?: WorkspaceActivityFocus;
}) {
  const parsed = input.rows.map(parseAuditRow);
  const successful = parsed.filter((item) => item.outcome === "success");
  const comments = successful.filter((item) => item.kind === "comment");
  const moves = successful.filter((item) => item.kind === "move");
  const creates = successful.filter((item) => item.kind === "create");
  const reads = successful.filter((item) => item.kind === "read");
  const clarifications = input.rows.filter(
    (row) => row.outcome === "needs_clarification",
  ).length;
  const failures = input.rows.filter(
    (row) => row.outcome !== "success" && row.outcome !== "needs_clarification",
  ).length;
  const employeeStats = summarizeWorkspaceEmployees(successful);
  const focus = input.focus ?? "all";

  return {
    date: input.date,
    totalInteractions: input.rows.length,
    successfulActions: successful.length,
    clarificationCount: clarifications,
    failureCount: failures,
    activeEmployees: employeeStats.length,
    writeCount: comments.length + moves.length + creates.length,
    readCount: reads.length,
    comments,
    moves,
    creates,
    employeeStats,
    recentActions: parsed.slice(0, 12),
    responseText: buildWorkspaceReportText({
      date: input.date,
      focus,
      totalInteractions: input.rows.length,
      successfulActions: successful.length,
      clarificationCount: clarifications,
      failureCount: failures,
      activeEmployees: employeeStats.length,
      writeCount: comments.length + moves.length + creates.length,
      readCount: reads.length,
      comments,
      moves,
      creates,
      employeeStats,
      recentActions: parsed.slice(0, 8),
    }),
  };
}

function buildReportText(input: {
  employeeName: string;
  date: string;
  focus: EmployeeActivityFocus;
  totalInteractions: number;
  successfulActions: number;
  clarificationCount: number;
  failureCount: number;
  writeCount: number;
  readCount: number;
  comments: ParsedActivityItem[];
  moves: ParsedActivityItem[];
  creates: ParsedActivityItem[];
  recentActions: ParsedActivityItem[];
}) {
  if (input.totalInteractions === 0) {
    return `${input.employeeName} has no logged Aya activity for ${input.date}.`;
  }

  if (input.focus === "comments") {
    return buildFocusedSectionText(
      `${input.employeeName} added ${input.comments.length} comment${
        input.comments.length === 1 ? "" : "s"
      } on ${input.date}.`,
      input.comments,
      "No successful comments were logged for that day.",
    );
  }

  if (input.focus === "moves") {
    return buildFocusedSectionText(
      `${input.employeeName} moved ${input.moves.length} client file${
        input.moves.length === 1 ? "" : "s"
      } on ${input.date}.`,
      input.moves,
      "No successful client moves were logged for that day.",
    );
  }

  if (input.focus === "creates") {
    return buildFocusedSectionText(
      `${input.employeeName} created ${input.creates.length} lead${
        input.creates.length === 1 ? "" : "s"
      } on ${input.date}.`,
      input.creates,
      "No successful lead creation was logged for that day.",
    );
  }

  if (input.focus === "timeline") {
    return buildFocusedSectionText(
      `${input.employeeName} had ${input.totalInteractions} Aya interaction${
        input.totalInteractions === 1 ? "" : "s"
      } on ${input.date}.`,
      input.recentActions,
      "No recent activity was logged for that day.",
    );
  }

  return [
    `${input.employeeName} had ${input.totalInteractions} Aya interaction${
      input.totalInteractions === 1 ? "" : "s"
    } on ${input.date}.`,
    `Successful: ${input.successfulActions} | Clarifications: ${input.clarificationCount} | Failures: ${input.failureCount}`,
    `Writes: ${input.writeCount} | Reads: ${input.readCount} | Comments: ${input.comments.length} | Moves: ${input.moves.length} | Leads created: ${input.creates.length}`,
    buildSection("Exact comments", input.comments, "No successful comments logged."),
    buildSection("Client moves", input.moves, "No successful client moves logged."),
    buildSection("Leads created", input.creates, "No successful lead creation logged."),
    buildSection(
      "Recent activity",
      input.recentActions,
      "No recent activity logged.",
    ),
  ]
    .filter(Boolean)
    .join("\n");
}

function buildFocusedSectionText(
  headline: string,
  items: ParsedActivityItem[],
  emptyLine: string,
) {
  return [headline, buildSection("Details", items, emptyLine)]
    .filter(Boolean)
    .join("\n");
}

function buildSection(
  title: string,
  items: ParsedActivityItem[],
  emptyLine: string,
) {
  return items.length > 0
    ? [title + ":", ...items.map((item) => `- ${formatActivityLine(item)}`)].join(
        "\n",
      )
    : `${title}: ${emptyLine}`;
}

function buildWorkspaceReportText(input: {
  date: string;
  focus: WorkspaceActivityFocus;
  totalInteractions: number;
  successfulActions: number;
  clarificationCount: number;
  failureCount: number;
  activeEmployees: number;
  writeCount: number;
  readCount: number;
  comments: ParsedActivityItem[];
  moves: ParsedActivityItem[];
  creates: ParsedActivityItem[];
  employeeStats: WorkspaceEmployeeStats[];
  recentActions: ParsedActivityItem[];
}) {
  if (input.totalInteractions === 0) {
    return `No Aya activity is logged for ${input.date}.`;
  }

  if (input.focus === "comments") {
    return [
      `Workspace comments for ${input.date}: ${input.comments.length} successful comment${
        input.comments.length === 1 ? "" : "s"
      } by ${countDistinctEmployees(input.comments)} employee${
        countDistinctEmployees(input.comments) === 1 ? "" : "s"
      }.`,
      buildLeaderboard(
        "Top commenters",
        input.employeeStats.filter((item) => item.comments > 0),
        (item) => `${item.employeeName} (${item.comments})`,
        "No successful comments logged.",
      ),
      buildSection("Exact comments", input.comments, "No successful comments logged."),
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (input.focus === "moves") {
    return [
      `Workspace moves for ${input.date}: ${input.moves.length} successful move${
        input.moves.length === 1 ? "" : "s"
      } by ${countDistinctEmployees(input.moves)} employee${
        countDistinctEmployees(input.moves) === 1 ? "" : "s"
      }.`,
      buildLeaderboard(
        "Top movers",
        input.employeeStats.filter((item) => item.moves > 0),
        (item) => `${item.employeeName} (${item.moves})`,
        "No successful client moves logged.",
      ),
      buildSection("Exact client moves", input.moves, "No successful client moves logged."),
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (input.focus === "creates") {
    return [
      `Workspace lead creation for ${input.date}: ${input.creates.length} successful lead${
        input.creates.length === 1 ? "" : "s"
      } created by ${countDistinctEmployees(input.creates)} employee${
        countDistinctEmployees(input.creates) === 1 ? "" : "s"
      }.`,
      buildLeaderboard(
        "Top lead creators",
        input.employeeStats.filter((item) => item.creates > 0),
        (item) => `${item.employeeName} (${item.creates})`,
        "No successful lead creation logged.",
      ),
      buildSection("Exact leads created", input.creates, "No successful lead creation logged."),
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (input.focus === "timeline") {
    return [
      `Workspace activity for ${input.date}: ${input.totalInteractions} Aya interaction${
        input.totalInteractions === 1 ? "" : "s"
      } across ${input.activeEmployees} active employee${
        input.activeEmployees === 1 ? "" : "s"
      }.`,
      buildSection("Recent workspace activity", input.recentActions, "No recent activity logged."),
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Workspace activity for ${input.date}: ${input.totalInteractions} Aya interaction${
      input.totalInteractions === 1 ? "" : "s"
    } across ${input.activeEmployees} active employee${
      input.activeEmployees === 1 ? "" : "s"
    }.`,
    `Successful: ${input.successfulActions} | Clarifications: ${input.clarificationCount} | Failures: ${input.failureCount}`,
    `Writes: ${input.writeCount} | Reads: ${input.readCount} | Comments: ${input.comments.length} | Moves: ${input.moves.length} | Leads created: ${input.creates.length}`,
    buildLeaderboard(
      "Top employee activity",
      input.employeeStats,
      (item) =>
        `${item.employeeName} (${item.totalActions} total, ${item.comments} comments, ${item.moves} moves, ${item.creates} leads)`,
      "No employee activity logged.",
    ),
    buildSection(
      "Recent workspace activity",
      input.recentActions,
      "No recent activity logged.",
    ),
  ]
    .filter(Boolean)
    .join("\n");
}

interface WorkspaceEmployeeStats {
  employeeName: string;
  totalActions: number;
  comments: number;
  moves: number;
  creates: number;
  reads: number;
}

function summarizeWorkspaceEmployees(items: ParsedActivityItem[]) {
  const stats = new Map<string, WorkspaceEmployeeStats>();

  for (const item of items) {
    const employeeName = item.employeeName;
    const current =
      stats.get(employeeName) ?? {
        employeeName,
        totalActions: 0,
        comments: 0,
        moves: 0,
        creates: 0,
        reads: 0,
      };
    current.totalActions += 1;
    if (item.kind === "comment") {
      current.comments += 1;
    } else if (item.kind === "move") {
      current.moves += 1;
    } else if (item.kind === "create") {
      current.creates += 1;
    } else if (item.kind === "read") {
      current.reads += 1;
    }
    stats.set(employeeName, current);
  }

  return Array.from(stats.values()).sort(
    (left, right) =>
      right.totalActions - left.totalActions ||
      right.moves - left.moves ||
      right.comments - left.comments ||
      right.creates - left.creates ||
      left.employeeName.localeCompare(right.employeeName),
  );
}

function buildLeaderboard(
  title: string,
  items: WorkspaceEmployeeStats[],
  formatItem: (item: WorkspaceEmployeeStats) => string,
  emptyLine: string,
) {
  const topItems = items.slice(0, 5);
  return topItems.length > 0
    ? [title + ":", ...topItems.map((item) => `- ${formatItem(item)}`)].join("\n")
    : `${title}: ${emptyLine}`;
}

function countDistinctEmployees(items: ParsedActivityItem[]) {
  return new Set(items.map((item) => item.employeeName)).size;
}

function formatActivityLine(item: ParsedActivityItem) {
  const timestamp = item.occurredAt.slice(11, 16);
  return `${timestamp} ${item.employeeName}: ${item.summary}`;
}

function parseAuditRow(row: EmployeeAuditLogRow): ParsedActivityItem {
  const responseJson = safeParseJson(row.response_json);
  const data = isObject(responseJson) && isObject(responseJson.data)
    ? responseJson.data
    : null;
  const intent = row.detected_intent ?? null;
  const employeeName = row.display_name?.trim() || "Unknown employee";

  if (intent === "comments.create") {
    const recordTitle =
      typeof data?.recordTitle === "string" ? data.recordTitle : null;
    const text = typeof data?.text === "string" ? data.text : null;
    return {
      kind: "comment",
      occurredAt: row.created_at,
      outcome: row.outcome,
      intent,
      employeeName,
      summary:
        row.outcome === "success"
          ? `commented on ${recordTitle ?? "a client"}${text ? `: ${text}` : ""}`
          : `tried to add a client comment`,
      inboundText: row.inbound_text,
      recordTitle,
      targetListTitle: null,
      text,
      listTitle: null,
    };
  }

  if (intent === "records.move") {
    const recordTitle =
      typeof data?.recordTitle === "string" ? data.recordTitle : null;
    const targetListTitle =
      typeof data?.targetListTitle === "string" ? data.targetListTitle : null;
    return {
      kind: "move",
      occurredAt: row.created_at,
      outcome: row.outcome,
      intent,
      employeeName,
      summary:
        row.outcome === "success"
          ? `moved ${recordTitle ?? "a client"} to ${targetListTitle ?? "another stage"}`
          : `tried to move ${recordTitle ?? "a client file"}`,
      inboundText: row.inbound_text,
      recordTitle,
      targetListTitle,
      text: null,
      listTitle: null,
    };
  }

  if (intent === "records.create") {
    const recordTitle =
      typeof data?.recordTitle === "string" ? data.recordTitle : null;
    const listTitle = typeof data?.listTitle === "string" ? data.listTitle : null;
    return {
      kind: "create",
      occurredAt: row.created_at,
      outcome: row.outcome,
      intent,
      employeeName,
      summary:
        row.outcome === "success"
          ? `created ${recordTitle ?? "a lead"}${listTitle ? ` in ${listTitle}` : ""}`
          : `tried to create a lead`,
      inboundText: row.inbound_text,
      recordTitle,
      targetListTitle: null,
      text: null,
      listTitle,
    };
  }

  if (intent === "records.detail" || intent === "comments.list_recent") {
    const recordTitle =
      typeof data?.recordTitle === "string" ? data.recordTitle : null;
    return {
      kind: "read",
      occurredAt: row.created_at,
      outcome: row.outcome,
      intent,
      employeeName,
      summary:
        intent === "records.detail"
          ? `reviewed ${recordTitle ?? "a client file"}`
          : `reviewed comments for ${recordTitle ?? "a client file"}`,
      inboundText: row.inbound_text,
      recordTitle,
      targetListTitle: null,
      text: null,
      listTitle: null,
    };
  }

  if (intent === "records.follow_up") {
    return {
      kind: "read",
      occurredAt: row.created_at,
      outcome: row.outcome,
      intent,
      employeeName,
      summary: "checked the follow-up queue",
      inboundText: row.inbound_text,
      recordTitle: null,
      targetListTitle: null,
      text: null,
      listTitle: null,
    };
  }

  if (intent === "records.list_assigned") {
    return {
      kind: "read",
      occurredAt: row.created_at,
      outcome: row.outcome,
      intent,
      employeeName,
      summary: "checked workload",
      inboundText: row.inbound_text,
      recordTitle: null,
      targetListTitle: null,
      text: null,
      listTitle: null,
    };
  }

  return {
    kind: "other",
    occurredAt: row.created_at,
    outcome: row.outcome,
    intent,
    employeeName,
    summary: summarizeFallback(row),
    inboundText: row.inbound_text,
    recordTitle: null,
    targetListTitle: null,
    text: null,
    listTitle: null,
  };
}

function summarizeFallback(row: EmployeeAuditLogRow) {
  if (row.outcome === "needs_clarification") {
    return `needed clarification: ${row.inbound_text}`;
  }

  if (row.outcome !== "success") {
    return `attempted: ${row.inbound_text}`;
  }

  if (row.detected_intent === "summary.employee_day") {
    return "checked an employee day summary";
  }

  if (row.detected_intent === "summary.team_day") {
    return "checked the team day summary";
  }

  if (row.detected_intent === "summary.no_activity_day") {
    return "checked the inactive employee summary";
  }

  return row.inbound_text.trim();
}

function safeParseJson(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
