import type {
  IntentMatch,
  IntentPlan,
  IntentRequest,
  IntentName,
} from "../../domain/types.js";
import {
  OPTIONAL_ACTIVITY_DATE_SUFFIX_PATTERN,
  resolveActivityDateRangeFromMessage,
} from "./activity-date-range.js";

export interface IntentPlannerRequest extends IntentRequest {
  hasActiveRecordContext?: boolean;
}

interface IntentCandidate {
  intent: IntentName;
  score: number;
  confidence: number;
  parameters: Record<string, string | number | boolean | undefined>;
  matchedSignals: string[];
  requiresClarification?: boolean;
  clarificationQuestion?: string;
}

export function planEmployeeIntent(
  request: IntentPlannerRequest,
): IntentPlan | null {
  const candidates = INTENT_RESOLVERS.map((resolver) => resolver(request)).filter(
    (candidate): candidate is IntentCandidate => Boolean(candidate),
  );

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort(
    (left, right) =>
      right.score - left.score ||
      right.confidence - left.confidence ||
      left.intent.localeCompare(right.intent),
  );

  const best = candidates[0];

  return {
    intent: best.intent,
    confidence: best.confidence,
    parameters: best.parameters,
    requiresClarification: Boolean(best.requiresClarification),
    clarificationQuestion: best.clarificationQuestion,
    matchedSignals: best.matchedSignals,
  };
}

export function detectIntent(request: IntentRequest): IntentMatch | null {
  const plan = planEmployeeIntent(request);
  if (!plan) {
    return null;
  }

  return {
    intent: plan.intent,
    confidence: plan.confidence,
    parameters: plan.parameters,
  };
}

const INTENT_RESOLVERS: Array<
  (request: IntentPlannerRequest) => IntentCandidate | null
> = [
  resolveIdentityIntent,
  resolveReportingOverviewIntent,
  resolveReportingQuestionIntent,
  resolveWorkspaceActivityIntent,
  resolveTeamSummaryIntent,
  resolveNoActivityIntent,
  resolveEmployeeActivityIntent,
  resolveRecordActivityIntent,
  resolveEmployeeSummaryIntent,
  resolveFollowUpIntent,
  resolveWorkloadIntent,
  resolveCommentCreateIntent,
  resolveCommentListIntent,
  resolveMoveIntent,
  resolveCreateIntent,
  resolveFocusedDetailIntent,
  resolveDetailIntent,
  resolveSearchIntent,
];

const OPTIONAL_ACTIVITY_MESSAGE_END_PATTERN =
  String.raw`${OPTIONAL_ACTIVITY_DATE_SUFFIX_PATTERN}[.?!]?$`;

function activityMatch(message: string, source: string) {
  return message.match(new RegExp(`${source}${OPTIONAL_ACTIVITY_MESSAGE_END_PATTERN}`, "i"));
}

function activityTest(message: string, source: string) {
  return new RegExp(`${source}${OPTIONAL_ACTIVITY_MESSAGE_END_PATTERN}`, "i").test(
    message,
  );
}

function resolveIdentityIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const message = normalize(request.message);

  if (!SELF_IDENTITY_MESSAGES.has(message)) {
    return null;
  }

  return candidate("identity.self", 100, 0.99, {}, ["identity:self"]);
}

function resolveReportingOverviewIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const message = normalize(request.message);

  if (!REPORTING_OVERVIEW_MESSAGES.has(message)) {
    return null;
  }

  return candidate("reporting.overview", 95, 0.9, {}, ["reporting:overview"]);
}

function resolveReportingQuestionIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const message = normalize(request.message);
  const isReportingInventoryMessage =
    /(?:dashboard|dashboards|report|reports|reporting)/.test(message) &&
    /(?:how many|what|which|latest|recent|updated|enterprise|plan|enabled|available)/.test(
      message,
    );

  if (!isReportingInventoryMessage) {
    return null;
  }

  return candidate(
    "reporting.question",
    88,
    0.82,
    {
      question: request.message.trim(),
    },
    ["reporting:question"],
  );
}

function resolveTeamSummaryIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const message = normalize(request.message);

  if (
    TEAM_SUMMARY_MESSAGES.has(message) ||
    ((message.includes("what changed") || message.includes("what happened")) &&
      message.includes("today"))
  ) {
    return candidate("summary.team_day", 92, 0.87, {}, ["summary:team"]);
  }

  const employeeMatch = message.match(/^what did (.+) do today\??$/);
  const target = employeeMatch?.[1]?.trim();
  if (target && TEAM_TARGETS.has(target)) {
    return candidate("summary.team_day", 90, 0.86, {}, ["summary:team"]);
  }

  return null;
}

function resolveWorkspaceActivityIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  if (request.actor.roleName !== "admin") {
    return null;
  }

  const rawMessage = request.message.trim();
  const message = normalize(rawMessage);
  const dateRange = resolveActivityDateRangeFromMessage(
    rawMessage,
    request.nowIso,
  );

  if (
    activityTest(rawMessage, String.raw`^what (?:changed|happened)`) ||
    activityTest(rawMessage, String.raw`^(?:show(?: me)? )?workspace activity`) ||
    activityTest(rawMessage, String.raw`^(?:show(?: me)? )?all activity`) ||
    activityTest(rawMessage, String.raw`^(?:show(?: me)? )?everything that happened`)
  ) {
    return candidate(
      "activity.workspace_report",
      96,
      0.92,
      {
        activityFocus: "all",
        ...dateRange,
      },
      ["activity:workspace:all"],
    );
  }

  if (
    activityTest(rawMessage, String.raw`^who (?:made|added|left) comments`) ||
    activityTest(rawMessage, String.raw`^show(?: me)? who commented`)
  ) {
    return candidate(
      "activity.workspace_report",
      96,
      0.92,
      {
        activityFocus: "comments",
        ...dateRange,
      },
      ["activity:workspace:comments"],
    );
  }

  if (
    activityTest(rawMessage, String.raw`^who moved (?:clients|files|records|people)`) ||
    activityTest(
      rawMessage,
      String.raw`^show(?: me)? who moved (?:clients|files|records|people)`,
    )
  ) {
    return candidate(
      "activity.workspace_report",
      96,
      0.92,
      {
        activityFocus: "moves",
        ...dateRange,
      },
      ["activity:workspace:moves"],
    );
  }

  if (
    activityTest(rawMessage, String.raw`^who created leads`) ||
    activityTest(rawMessage, String.raw`^show(?: me)? who created leads`)
  ) {
    return candidate(
      "activity.workspace_report",
      96,
      0.92,
      {
        activityFocus: "creates",
        ...dateRange,
      },
      ["activity:workspace:creates"],
    );
  }

  if (
    activityTest(rawMessage, String.raw`^show(?: me)? the activity timeline for`) ||
    /^show(?: me)? (?:today's|yesterday's|this week's|last week's|this month's|last month's) activity timeline[.?!]?$/i.test(
      rawMessage,
    )
  ) {
    return candidate(
      "activity.workspace_report",
      95,
      0.9,
      {
        activityFocus: "timeline",
        ...dateRange,
      },
      ["activity:workspace:timeline"],
    );
  }

  return null;
}

function resolveNoActivityIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const message = normalize(request.message);

  if (
    message.includes("no activity") ||
    message.includes("did nothing today") ||
    message.includes("inactive today")
  ) {
    return candidate(
      "summary.no_activity_day",
      89,
      0.84,
      {},
      ["summary:no-activity"],
    );
  }

  return null;
}

function resolveEmployeeActivityIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  if (request.actor.roleName !== "admin") {
    return null;
  }

  const rawMessage = request.message.trim();
  const dateRange = resolveActivityDateRangeFromMessage(
    rawMessage,
    request.nowIso,
  );
  const timelineTarget =
    activityMatch(
      rawMessage,
      String.raw`^(?:show(?: me)?|give me)\s+(?:the )?activity timeline for\s+(.+?)`,
    )?.[1]?.trim() ??
    activityMatch(
      rawMessage,
      String.raw`^(?:show(?: me)?|give me)\s+(.+?)'?s activity timeline`,
    )?.[1]?.trim();

  if (timelineTarget && !TEAM_TARGETS.has(normalize(timelineTarget))) {
    return candidate(
      "activity.employee_report",
      95,
      0.91,
      {
        employeeName: normalizeEmployeeTarget(timelineTarget, request),
        activityFocus: "timeline",
        ...dateRange,
      },
      ["activity:employee:timeline"],
    );
  }

  const generalTarget =
    activityMatch(
      rawMessage,
      String.raw`^(?:show(?: me)?|tell me|give me)\s+(?:everything|all activity|the full activity)\s+(.+?)\s+did`,
    )?.[1]?.trim() ??
    activityMatch(
      rawMessage,
      String.raw`^(?:show(?: me)?|tell me|give me)\s+(.+?)'?s activity`,
    )?.[1]?.trim() ??
    activityMatch(rawMessage, String.raw`^what exactly did (.+) do`)?.[1]?.trim() ??
    activityMatch(rawMessage, String.raw`^what did (.+) do`)?.[1]?.trim();

  if (generalTarget && !TEAM_TARGETS.has(normalize(generalTarget))) {
    return candidate(
      "activity.employee_report",
      94,
      0.9,
      {
        employeeName: normalizeEmployeeTarget(generalTarget, request),
        activityFocus: "all",
        ...dateRange,
      },
      ["activity:employee:all"],
    );
  }

  const commentsTarget =
    activityMatch(rawMessage, String.raw`^what comments did (.+) make`)?.[1]?.trim() ??
    activityMatch(rawMessage, String.raw`^(?:show(?: me)?|list)\s+(.+?)'?s comments`)?.[1]?.trim() ??
    activityMatch(rawMessage, String.raw`^how many comments did (.+) make`)?.[1]?.trim();

  if (commentsTarget && !TEAM_TARGETS.has(normalize(commentsTarget))) {
    return candidate(
      "activity.employee_report",
      95,
      0.91,
      {
        employeeName: normalizeEmployeeTarget(commentsTarget, request),
        activityFocus: "comments",
        ...dateRange,
      },
      ["activity:employee:comments"],
    );
  }

  const movesTarget =
    activityMatch(
      rawMessage,
      String.raw`^how many (?:clients|files|records|people) did (.+) move`,
    )?.[1]?.trim() ??
    activityMatch(rawMessage, String.raw`^(?:show(?: me)?|list)\s+(.+?)'?s moves`)?.[1]?.trim();

  if (movesTarget && !TEAM_TARGETS.has(normalize(movesTarget))) {
    return candidate(
      "activity.employee_report",
      95,
      0.91,
      {
        employeeName: normalizeEmployeeTarget(movesTarget, request),
        activityFocus: "moves",
        ...dateRange,
      },
      ["activity:employee:moves"],
    );
  }

  const createsTarget =
    activityMatch(rawMessage, String.raw`^what leads did (.+) create`)?.[1]?.trim() ??
    activityMatch(
      rawMessage,
      String.raw`^(?:show(?: me)?|list)\s+(.+?)'?s created leads`,
    )?.[1]?.trim() ??
    activityMatch(rawMessage, String.raw`^how many leads did (.+) create`)?.[1]?.trim();

  if (createsTarget && !TEAM_TARGETS.has(normalize(createsTarget))) {
    return candidate(
      "activity.employee_report",
      95,
      0.91,
      {
        employeeName: normalizeEmployeeTarget(createsTarget, request),
        activityFocus: "creates",
        ...dateRange,
      },
      ["activity:employee:creates"],
    );
  }

  return null;
}

function resolveRecordActivityIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  if (request.actor.roleName !== "admin") {
    return null;
  }

  const rawMessage = request.message.trim();
  const dateRange = resolveActivityDateRangeFromMessage(
    rawMessage,
    request.nowIso,
  );
  const timelineQuery =
    activityMatch(
      rawMessage,
      String.raw`^(?:show(?: me)?|give me)\s+(?:the )?(?:activity )?timeline (?:for|on)\s+(.+?)`,
    )?.[1]?.trim();

  if (timelineQuery) {
    return buildRecordActivityCandidate(
      timelineQuery,
      request,
      "timeline",
      94,
      0.9,
      "Which client should I check the timeline for?",
      "activity:record:timeline",
      dateRange,
    );
  }

  const generalQuery =
    activityMatch(
      rawMessage,
      String.raw`^(?:who (?:worked on|touched)|who has touched|show(?: me)? activity on|what happened on|what changed on)\s+(.+?)`,
    )?.[1]?.trim() ??
    activityMatch(
      rawMessage,
      String.raw`^(?:show(?: me)?|give me) (?:the )?activity (?:for|on)\s+(.+?)`,
    )?.[1]?.trim();

  if (generalQuery) {
    return buildRecordActivityCandidate(
      generalQuery,
      request,
      "all",
      93,
      0.89,
      "Which client should I check activity for?",
      "activity:record:all",
      dateRange,
    );
  }

  const commentsQuery =
    activityMatch(
      rawMessage,
      String.raw`^(?:who commented on|who left comments on|show(?: me)? comments on)\s+(.+?)`,
    )?.[1]?.trim();

  if (commentsQuery) {
    return buildRecordActivityCandidate(
      commentsQuery,
      request,
      "comments",
      94,
      0.9,
      "Which client should I check comments for?",
      "activity:record:comments",
      dateRange,
    );
  }

  const movesQuery =
    activityMatch(
      rawMessage,
      String.raw`^who moved (this (?:client|file|lead|record))`,
    )?.[1]?.trim() ??
    activityMatch(rawMessage, String.raw`^who moved\s+(.+?)`)?.[1]?.trim();

  if (movesQuery && !/^(?:clients|files|records|people)$/i.test(movesQuery)) {
    return buildRecordActivityCandidate(
      movesQuery,
      request,
      "moves",
      92,
      0.87,
      "Which client should I check moves for?",
      "activity:record:moves",
      dateRange,
    );
  }

  return null;
}

function resolveEmployeeSummaryIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const message = normalize(request.message);
  const directMatch = message.match(/^what did (.+) do today\??$/);

  if (directMatch) {
    const target = directMatch[1].trim();
    if (TEAM_TARGETS.has(target)) {
      return null;
    }

    return candidate(
      "summary.employee_day",
      85,
      0.8,
      {
        employeeName:
          target === "i" || target === "me"
            ? request.actor.displayName
            : directMatch[1].trim(),
      },
      ["summary:employee"],
    );
  }

  if (message.includes("what did") && message.includes("today")) {
    return candidate(
      "summary.employee_day",
      72,
      0.72,
      {
        employeeName: request.actor.displayName,
      },
      ["summary:employee:fallback"],
    );
  }

  return null;
}

function resolveWorkloadIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const message = normalize(request.message);

  if (
    message.includes("what am i working on") ||
    message.includes("my open files")
  ) {
    return candidate(
      "records.list_assigned",
      92,
      0.88,
      {
        assigneeId: request.actor.blueUserId,
      },
      ["workload:self"],
    );
  }

  const workingOnMatch = message.match(/^what is (.+) working on\??$/);
  if (workingOnMatch) {
    const target = workingOnMatch[1].trim();
    return candidate(
      "records.list_assigned",
      87,
      0.84,
      {
        employeeName:
          target === "i" || target === "me"
            ? request.actor.displayName
            : workingOnMatch[1].trim(),
      },
      ["workload:employee"],
    );
  }

  const openFilesMatch = message.match(
    /^(?:show|list)(?: me)?\s+(.+?)'?s open files[.?!]?$/,
  );
  if (!openFilesMatch) {
    return null;
  }

  return candidate(
    "records.list_assigned",
    84,
    0.81,
    {
      employeeName: openFilesMatch[1].trim(),
    },
    ["workload:open-files"],
  );
}

function resolveFollowUpIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const message = normalize(request.message);
  const selfSignals = [
    "what needs follow up today",
    "what do i need to follow up on",
    "which of my files need follow up",
    "which files need follow up today",
    "which of my files are stale",
    "what in my pipeline is stale",
  ];

  if (selfSignals.some((signal) => message.includes(signal))) {
    return candidate(
      "records.follow_up",
      94,
      0.9,
      {
        employeeName: request.actor.displayName,
      },
      ["follow-up:self"],
    );
  }

  const targetMatch = message.match(
    /^what does (.+?) need to follow up on\??$/,
  );
  if (targetMatch) {
    return candidate(
      "records.follow_up",
      88,
      0.84,
      {
        employeeName: targetMatch[1].trim(),
      },
      ["follow-up:employee"],
    );
  }

  const staleTargetMatch = message.match(
    /^which of (.+?)'?s files are stale\??$/,
  );
  if (staleTargetMatch) {
    return candidate(
      "records.follow_up",
      86,
      0.82,
      {
        employeeName: staleTargetMatch[1].trim(),
      },
      ["follow-up:employee:stale"],
    );
  }

  return null;
}

function resolveCommentCreateIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const rawMessage = request.message.trim();
  const message = normalize(rawMessage);

  if (!message.startsWith("add note") && !message.startsWith("add comment")) {
    return null;
  }

  const rawCommentMatch = rawMessage.match(
    /^add\s+(?:note|comment)\s+to\s+(.+?)(?::|\s+-\s+)\s*(.+)$/i,
  );
  const recordQuery = rawCommentMatch?.[1]?.trim();
  const text = rawCommentMatch?.[2]?.trim();
  const useActiveRecordContext = isContextPointer(recordQuery);

  if (!text) {
    return candidate(
      "comments.create",
      80,
      0.74,
      {
        ...(useActiveRecordContext ? { useActiveRecordContext: true } : {}),
        recordQuery: useActiveRecordContext ? undefined : recordQuery,
      },
      ["comments:create"],
      "What comment should I add?",
    );
  }

  if (!recordQuery) {
    return candidate(
      "comments.create",
      78,
      0.7,
      {
        text,
      },
      ["comments:create"],
      "Which client should I add that comment to?",
    );
  }

  if (useActiveRecordContext && !request.hasActiveRecordContext) {
    return candidate(
      "comments.create",
      82,
      0.76,
      {
        text,
        useActiveRecordContext: true,
      },
      ["comments:create:context"],
      "Which client should I add that comment to?",
    );
  }

  return candidate(
    "comments.create",
    84,
    0.77,
    {
      text,
      ...(useActiveRecordContext
        ? { useActiveRecordContext: true }
        : { recordQuery }),
    },
    [
      useActiveRecordContext ? "comments:create:context" : "comments:create",
    ],
  );
}

function resolveCommentListIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const rawMessage = request.message.trim();
  const message = normalize(rawMessage);
  const rawQuery =
    rawMessage
      .match(
        /^(?:show|list|get)\s+(?:recent\s+)?comments?\s+(?:for|on)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    rawMessage.match(/^comments?\s+(?:for|on)\s+(.+?)[.?!]?$/i)?.[1]?.trim() ??
    rawMessage
      .match(
        /^(?:what(?:'s| is)\s+in|what are)\s+the\s+comments?\s+(?:for|on)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    rawMessage
      .match(
        /^(?:show|list|get)\s+(?:me\s+)?the\s+comments?\s+(?:for|on)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim();

  if (!rawQuery) {
    if (!message.includes("comment")) {
      return null;
    }

    if (!request.hasActiveRecordContext) {
      return candidate(
        "comments.list_recent",
        72,
        0.66,
        {},
        ["comments:list"],
        "Which client do you want comments for?",
      );
    }

    return candidate(
      "comments.list_recent",
      78,
      0.72,
      {
        useActiveRecordContext: true,
      },
      ["comments:list:context"],
    );
  }

  const useActiveRecordContext = isContextPointer(rawQuery);
  if (useActiveRecordContext && !request.hasActiveRecordContext) {
    return candidate(
      "comments.list_recent",
      80,
      0.72,
      {
        useActiveRecordContext: true,
      },
      ["comments:list:context"],
      "Which client do you want comments for?",
    );
  }

  return candidate(
    "comments.list_recent",
    82,
    0.75,
    useActiveRecordContext
      ? {
          useActiveRecordContext: true,
        }
      : {
          recordQuery: rawQuery,
        },
    [useActiveRecordContext ? "comments:list:context" : "comments:list"],
  );
}

function resolveMoveIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const rawMessage = request.message.trim();
  const moveMatch = rawMessage.match(
    /^(?:move|put|send)\s+(.+?)\s+(?:to|into|in)\s+(.+?)[.?!]?$/i,
  );

  if (!moveMatch) {
    return null;
  }

  const recordQuery = moveMatch[1]?.trim();
  const targetListQuery = moveMatch[2]?.trim();
  const useActiveRecordContext = isContextPointer(recordQuery);

  if (!targetListQuery) {
    return candidate(
      "records.move",
      83,
      0.75,
      {
        ...(useActiveRecordContext ? { useActiveRecordContext: true } : {}),
        recordQuery: useActiveRecordContext ? undefined : recordQuery,
      },
      ["records:move"],
      "Which stage should I move it to?",
    );
  }

  if ((!recordQuery || useActiveRecordContext) && !request.hasActiveRecordContext) {
    return candidate(
      "records.move",
      85,
      0.76,
      {
        targetListQuery,
        ...(useActiveRecordContext ? { useActiveRecordContext: true } : {}),
      },
      ["records:move:context"],
      "Which client should I move?",
    );
  }

  return candidate(
    "records.move",
    86,
    0.78,
    {
      targetListQuery,
      ...(useActiveRecordContext
        ? { useActiveRecordContext: true }
        : { recordQuery }),
    },
    [useActiveRecordContext ? "records:move:context" : "records:move"],
  );
}

function resolveCreateIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const parameters = extractCreateLeadParameters(request.message);

  if (!parameters) {
    return null;
  }

  const hasName =
    Boolean(parameters.fullName) ||
    Boolean(parameters.firstName && parameters.lastName);

  if (!hasName) {
    return candidate(
      "records.create",
      80,
      0.72,
      parameters,
      ["records:create"],
      "What is the client's full name?",
    );
  }

  return candidate("records.create", 82, 0.74, parameters, ["records:create"]);
}

function resolveFocusedDetailIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const rawMessage = request.message.trim();
  const blockerQuery =
    rawMessage
      .match(
        /^(?:what(?:'s| is)\s+blocking|what(?:'s| is)\s+holding up)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    rawMessage
      .match(/^(?:show|give me)\s+(?:the )?blockers?\s+(?:for|on)\s+(.+?)[.?!]?$/i)?.[1]
      ?.trim();

  if (blockerQuery) {
    return buildBriefingCandidate(
      blockerQuery,
      request,
      "blockers",
      91,
      0.87,
      "Which client should I check for blockers?",
      "records:detail:blockers",
    );
  }

  const missingDocsQuery =
    rawMessage
      .match(
        /^(?:what docs(?: are)?(?: still)? missing (?:from|for)|what(?: do)? we still need from|what is still needed from)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    rawMessage
      .match(/^(?:show|list)\s+(?:the )?missing docs\s+(?:for|on)\s+(.+?)[.?!]?$/i)?.[1]
      ?.trim();

  if (missingDocsQuery) {
    return buildBriefingCandidate(
      missingDocsQuery,
      request,
      "missing_docs",
      92,
      0.88,
      "Which client should I check for missing items?",
      "records:detail:missing-docs",
    );
  }

  const handoffQuery =
    rawMessage
      .match(
        /^(?:give me )?(?:a )?handoff summary\s+(?:for|on)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    rawMessage
      .match(/^(?:handoff|hand off)\s+(?:for|on)\s+(.+?)[.?!]?$/i)?.[1]
      ?.trim();

  if (!handoffQuery) {
    return null;
  }

  return buildBriefingCandidate(
    handoffQuery,
    request,
    "handoff",
    90,
    0.85,
    "Which client should I prepare a handoff for?",
    "records:detail:handoff",
  );
}

function resolveDetailIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const rawMessage = request.message.trim();
  const message = normalize(rawMessage);
  const callPrepQuery =
    rawMessage
      .match(
        /^(?:prep me for a call with|call prep for|brief me on|give me context before (?:a )?call with)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    rawMessage
      .match(
        /^(?:prep me for (this call|this client)|brief me on (this client))[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    rawMessage
      .match(
        /^(?:prep me for (this call|this client)|brief me on (this client))[.?!]?$/i,
      )?.[2]
      ?.trim();

  if (callPrepQuery) {
    const useActiveRecordContext = isContextPointer(callPrepQuery);
    if (useActiveRecordContext && !request.hasActiveRecordContext) {
      return candidate(
        "records.detail",
        90,
        0.82,
        {
          useActiveRecordContext: true,
          detailMode: "call_prep",
        },
        ["records:detail:call-prep:context"],
        "Which client should I prep you for?",
      );
    }

    return candidate(
      "records.detail",
      92,
      0.88,
      useActiveRecordContext
        ? {
            useActiveRecordContext: true,
            detailMode: "call_prep",
          }
        : {
            recordQuery: callPrepQuery,
            detailMode: "call_prep",
          },
      [useActiveRecordContext ? "records:detail:call-prep:context" : "records:detail:call-prep"],
    );
  }

  const briefingQuery =
    rawMessage
      .match(
        /^(?:what(?:'s| is)\s+(?:going on|up)\s+with|status of|update on|tell me about)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    rawMessage
      .match(
        /^(?:give me )?(?:a )?(?:summary|context)\s+(?:for|on)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim();

  if (briefingQuery) {
    return buildBriefingCandidate(
      briefingQuery,
      request,
      "general",
      88,
      0.83,
      "Which client do you want me to brief you on?",
      "records:detail:briefing",
    );
  }

  const detailQuery = rawMessage
    .match(/^(?:show|open|pull up)(?: me)?\s+(.+?)[.?!]?$/i)?.[1]
    ?.trim();

  if (!detailQuery) {
    return null;
  }

  if (isRoutingExclusion(detailQuery) || detailQuery.toLowerCase().includes("open files")) {
    return null;
  }

  const useActiveRecordContext = isContextPointer(detailQuery);
  if (useActiveRecordContext && !request.hasActiveRecordContext) {
    return candidate(
      "records.detail",
      79,
      0.73,
      {
        useActiveRecordContext: true,
      },
      ["records:detail:context"],
      "Which client do you want me to pull up?",
    );
  }

  return candidate(
    "records.detail",
    message.startsWith("show ") || message.startsWith("show me ") ? 78 : 88,
    message.startsWith("show ") || message.startsWith("show me ") ? 0.72 : 0.83,
    useActiveRecordContext
      ? { useActiveRecordContext: true, detailMode: "default" }
      : { recordQuery: detailQuery, detailMode: "default" },
    [useActiveRecordContext ? "records:detail:context" : "records:detail"],
  );
}

function buildBriefingCandidate(
  recordQuery: string,
  request: IntentPlannerRequest,
  focus: "general" | "handoff" | "blockers" | "missing_docs",
  score: number,
  confidence: number,
  clarificationQuestion: string,
  signal: string,
) {
  const useActiveRecordContext = isContextPointer(recordQuery);

  if (useActiveRecordContext && !request.hasActiveRecordContext) {
    return candidate(
      "records.detail",
      score - 5,
      Math.max(0.72, confidence - 0.08),
      {
        useActiveRecordContext: true,
        detailMode: "briefing",
        briefingFocus: focus,
      },
      [`${signal}:context`],
      clarificationQuestion,
    );
  }

  return candidate(
    "records.detail",
    score,
    confidence,
    useActiveRecordContext
      ? {
          useActiveRecordContext: true,
          detailMode: "briefing",
          briefingFocus: focus,
        }
      : {
          recordQuery,
          detailMode: "briefing",
          briefingFocus: focus,
        },
    [useActiveRecordContext ? `${signal}:context` : signal],
  );
}

function resolveSearchIntent(
  request: IntentPlannerRequest,
): IntentCandidate | null {
  const rawMessage = request.message.trim();
  const searchMatch = rawMessage.match(
    /^(?:find|search|look up)(?: me)?\s+(.+?)[.?!]?$/i,
  );

  if (!searchMatch) {
    return null;
  }

  return candidate(
    "records.search",
    70,
    0.62,
    {
      query: searchMatch[1]?.trim(),
    },
    ["records:search"],
  );
}

function candidate(
  intent: IntentName,
  score: number,
  confidence: number,
  parameters: Record<string, string | number | boolean | undefined>,
  matchedSignals: string[],
  clarificationQuestion?: string,
): IntentCandidate {
  return {
    intent,
    score,
    confidence,
    parameters,
    matchedSignals,
    requiresClarification: Boolean(clarificationQuestion),
    clarificationQuestion,
  };
}

function extractCreateLeadParameters(message: string) {
  const startsCreateLead =
    /^(?:create|add)\s+(?:a\s+)?(?:new\s+)?(?:lead|client|record)\b/i.test(
      message,
    ) || /^new\s+(?:lead|client|record)\b/i.test(message);

  if (!startsCreateLead) {
    return null;
  }

  const firstName =
    message.match(/first name\s*[:\-]\s*([a-z][a-z' -]+)/i)?.[1]?.trim() ??
    undefined;
  const lastName =
    message.match(/last name\s*[:\-]\s*([a-z][a-z' -]+)/i)?.[1]?.trim() ??
    undefined;
  const fullName =
    message
      .match(
        /(?:full name|name)\s*[:\-]\s*(.+?)(?=,|\n|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ??
    message
      .match(
        /named\s+(.+?)(?=,|\n|\s+with\s+|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+(?:in|to)\s+(?:list|stage)\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ??
    message
      .match(
        /^(?:create|add)\s+(?:a\s+)?(?:new\s+)?(?:lead|client|record)\s+(.+?)(?=,|\n|\s+with\s+|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+(?:in|to)\s+(?:list|stage)\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ??
    message
      .match(
        /^new\s+(?:lead|client|record)\s+(.+?)(?=,|\n|\s+with\s+|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+(?:in|to)\s+(?:list|stage)\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ??
    undefined;
  const email =
    message.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0] ?? undefined;
  const phone =
    message
      .match(/(?:phone|number|mobile)\s+(?:is\s+)?([+]?\d[\d\s().-]{6,})/i)?.[1]
      ?.trim() ?? undefined;
  const amountMatch = message.match(
    /(?:amount|finance amount|loan amount|mortgage amount)\s+(?:is\s+)?\$?([\d,.]+(?:\.\d+)?[kKmM]?)/i,
  )?.[1];
  const notes =
    message.match(/(?:notes?|note)\s*[:\-]\s*(.+)$/i)?.[1]?.trim() ?? undefined;
  const targetListQuery =
    message
      .match(
        /(?:in|to)\s+(?:list|stage)\s+(.+?)(?=,|\n|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ?? undefined;

  return {
    fullName,
    firstName,
    lastName,
    email,
    phone,
    financeAmount: normalizeAmountShorthand(amountMatch),
    notes,
    targetListQuery,
  };
}

function normalizeAmountShorthand(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const normalized = value.replaceAll(",", "").trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }

  const multiplier = normalized.endsWith("m")
    ? 1_000_000
    : normalized.endsWith("k")
      ? 1_000
      : 1;
  const numeric = Number(normalized.replace(/[km]$/i, ""));
  if (Number.isNaN(numeric)) {
    return undefined;
  }

  return String(Math.round(numeric * multiplier));
}

function isContextPointer(value: string | undefined) {
  if (!value) {
    return false;
  }

  return CONTEXT_POINTERS.has(normalize(value));
}

function isRoutingExclusion(value: string) {
  return ROUTING_EXCLUSIONS.has(normalize(value));
}

function normalizeEmployeeTarget(
  value: string,
  request: IntentPlannerRequest,
) {
  const normalized = normalize(value);
  return normalized === "i" || normalized === "me"
    ? request.actor.displayName
    : value.trim();
}

function buildRecordActivityCandidate(
  value: string,
  request: IntentPlannerRequest,
  focus: "all" | "comments" | "moves" | "timeline",
  score: number,
  confidence: number,
  clarificationQuestion: string,
  signal: string,
  dateRange: { dateStart: string; dateEnd: string; dateLabel: string },
) {
  const useActiveRecordContext = isContextPointer(value);
  if (useActiveRecordContext && !request.hasActiveRecordContext) {
    return candidate(
      "activity.record_report",
      score,
      confidence - 0.05,
      {
        useActiveRecordContext: true,
        activityFocus: focus,
        ...dateRange,
      },
      [`${signal}:context`],
      clarificationQuestion,
    );
  }

  return candidate(
    "activity.record_report",
    score,
    confidence,
    useActiveRecordContext
      ? {
          useActiveRecordContext: true,
          activityFocus: focus,
          ...dateRange,
        }
      : {
          recordQuery: value.trim(),
          activityFocus: focus,
          ...dateRange,
        },
    [useActiveRecordContext ? `${signal}:context` : signal],
  );
}

function normalize(input: string) {
  return input.trim().toLowerCase();
}

const SELF_IDENTITY_MESSAGES = new Set([
  "who am i",
  "who am i?",
  "whoami",
  "who's signed in",
  "who is signed in",
  "what account am i using",
  "which account am i using",
  "what user am i signed in as",
  "which user am i signed in as",
]);

const TEAM_SUMMARY_MESSAGES = new Set([
  "what did everyone do today",
  "what did everyone do today?",
  "what did the team do today",
  "what did the team do today?",
  "what did we do today",
  "what did we do today?",
]);

const REPORTING_OVERVIEW_MESSAGES = new Set([
  "show reporting",
  "show reporting?",
  "show me reporting",
  "show me the reporting",
  "show reports",
  "show me reports",
  "show dashboards",
  "show me dashboards",
]);

const TEAM_TARGETS = new Set(["everyone", "the team", "team", "we"]);

const CONTEXT_POINTERS = new Set([
  "this",
  "this client",
  "this call",
  "this file",
  "this lead",
  "this record",
  "it",
  "them",
  "that client",
  "that file",
  "that lead",
  "that record",
]);

const ROUTING_EXCLUSIONS = new Set([
  "reporting",
  "the reporting",
  "reports",
  "report",
  "dashboards",
  "dashboard",
  "everyone",
  "the team",
  "team",
  "we",
]);
