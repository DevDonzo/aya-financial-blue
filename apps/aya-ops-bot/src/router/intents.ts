import type { IntentMatch, IntentRequest } from "../domain/types.js";

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

export function detectIntent(request: IntentRequest): IntentMatch | null {
  const message = normalize(request.message);
  const createLeadParameters = extractCreateLeadParameters(message);
  const whatDidMatch = message.match(/^what did (.+) do today\??$/);
  const workingOnMatch = message.match(/^what is (.+) working on\??$/);
  const openFilesMatch = message.match(
    /^(?:show|list)(?: me)?\s+(.+?)'?s open files[.?!]?$/,
  );
  const whatChangedToday =
    (message.includes("what changed") || message.includes("what happened")) &&
    message.includes("today");
  const noActivityToday =
    message.includes("no activity") ||
    message.includes("did nothing today") ||
    message.includes("inactive today");

  if (
    message === "what did everyone do today" ||
    message === "what did everyone do today?" ||
    message === "what did the team do today" ||
    message === "what did the team do today?" ||
    message === "what did we do today" ||
    message === "what did we do today?"
  ) {
    return {
      intent: "summary.team_day",
      confidence: 0.85,
      parameters: {},
    };
  }

  if (whatChangedToday) {
    return {
      intent: "summary.team_day",
      confidence: 0.8,
      parameters: {},
    };
  }

  if (noActivityToday) {
    return {
      intent: "summary.no_activity_day",
      confidence: 0.82,
      parameters: {},
    };
  }

  if (whatDidMatch) {
    const target = whatDidMatch[1].trim();

    if (["everyone", "the team", "team", "we"].includes(target)) {
      return {
        intent: "summary.team_day",
        confidence: 0.84,
        parameters: {},
      };
    }

    return {
      intent: "summary.employee_day",
      confidence: 0.78,
      parameters: {
        employeeName:
          target === "i" || target === "me"
            ? request.actor.displayName
            : whatDidMatch[1].trim(),
      },
    };
  }

  if (message.includes("what did") && message.includes("today")) {
    return {
      intent: "summary.employee_day",
      confidence: 0.7,
      parameters: {
        employeeName: request.actor.displayName,
      },
    };
  }

  if (message.includes("what changed") || message.includes("activity")) {
    return {
      intent: "activity.list",
      confidence: 0.8,
      parameters: {
        limit: 20,
      },
    };
  }

  if (createLeadParameters) {
    return {
      intent: "records.create",
      confidence: 0.72,
      parameters: createLeadParameters,
    };
  }

  if (message.startsWith("move ")) {
    const moveMatch = message.match(/^move\s+(.+?)\s+to\s+(.+?)[.?!]?$/);
    return {
      intent: "records.move",
      confidence: 0.65,
      parameters: {
        recordQuery: moveMatch?.[1]?.trim(),
        targetListQuery: moveMatch?.[2]?.trim(),
      },
    };
  }

  if (message.startsWith("add note") || message.startsWith("add comment")) {
    const commentMatch = message.match(
      /^add\s+(?:note|comment)\s+to\s+(.+?)(?::|\s+-\s+)\s*(.+)$/i,
    );
    return {
      intent: "comments.create",
      confidence: 0.67,
      parameters: {
        recordQuery: commentMatch?.[1]?.trim(),
        text: commentMatch?.[2]?.trim(),
      },
    };
  }

  const commentQuery =
    message
      .match(
        /^(?:show|list|get)\s+(?:recent\s+)?comments?\s+(?:for|on)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    message.match(/^comments?\s+(?:for|on)\s+(.+?)[.?!]?$/i)?.[1]?.trim() ??
    message
      .match(
        /^(?:what(?:'s| is)\s+in|what are)\s+the\s+comments?\s+(?:for|on)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim() ??
    message
      .match(
        /^(?:show|list|get)\s+(?:me\s+)?the\s+comments?\s+(?:for|on)\s+(.+?)[.?!]?$/i,
      )?.[1]
      ?.trim();

  if (commentQuery) {
    return {
      intent: "comments.list_recent",
      confidence: 0.72,
      parameters: {
        recordQuery: commentQuery,
      },
    };
  }

  if (
    message.includes("what am i working on") ||
    message.includes("my open files")
  ) {
    return {
      intent: "records.list_assigned",
      confidence: 0.84,
      parameters: {
        assigneeId: request.actor.blueUserId,
      },
    };
  }

  if (workingOnMatch) {
    const target = workingOnMatch[1].trim();
    return {
      intent: "records.list_assigned",
      confidence: 0.82,
      parameters: {
        employeeName:
          target === "i" || target === "me"
            ? request.actor.displayName
            : workingOnMatch[1].trim(),
      },
    };
  }

  if (openFilesMatch) {
    return {
      intent: "records.list_assigned",
      confidence: 0.8,
      parameters: {
        employeeName: openFilesMatch[1].trim(),
      },
    };
  }

  if (message.includes("find ") || message.includes("show ")) {
    const searchMatch = message.match(/^(?:find|show)(?: me)?\s+(.+?)[.?!]?$/);
    return {
      intent: "records.search",
      confidence: 0.55,
      parameters: {
        query: searchMatch?.[1]?.trim(),
      },
    };
  }

  return null;
}

function extractCreateLeadParameters(message: string) {
  const startsCreateLead =
    /^(?:create|add)\s+(?:a\s+)?(?:new\s+)?(?:lead|client|record)\b/.test(
      message,
    ) || /^new\s+(?:lead|client|record)\b/.test(message);

  if (!startsCreateLead) {
    return null;
  }

  const email =
    message.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0] ?? undefined;
  const phone =
    message
      .match(/(?:phone|number)\s+(?:is\s+)?([+]?\d[\d\s().-]{6,})/i)?.[1]
      ?.trim() ?? undefined;
  const amount =
    message.match(
      /(?:amount|finance amount|loan amount|mortgage amount)\s+(?:is\s+)?\$?([\d,]+(?:\.\d+)?)/i,
    )?.[1] ?? undefined;
  const notes =
    message.match(/(?:notes?|note)\s*[:\-]\s*(.+)$/i)?.[1]?.trim() ?? undefined;
  const targetListQuery =
    message
      .match(
        /(?:in|to)\s+(?:list|stage)\s+(.+?)(?=,|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ?? undefined;

  const fullName =
    message
      .match(
        /named\s+(.+?)(?=,|\s+with\s+|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+(?:in|to)\s+(?:list|stage)\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ??
    message
      .match(
        /^(?:create|add)\s+(?:a\s+)?(?:new\s+)?(?:lead|client|record)\s+(.+?)(?=,|\s+with\s+|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+(?:in|to)\s+(?:list|stage)\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ??
    message
      .match(
        /^new\s+(?:lead|client|record)\s+(.+?)(?=,|\s+with\s+|\s+phone\s+|\s+email\s+|\s+amount\s+|\s+(?:in|to)\s+(?:list|stage)\s+|\s+notes?\s*[:\-]|$)/i,
      )?.[1]
      ?.trim() ??
    undefined;

  return {
    fullName,
    email,
    phone,
    financeAmount: amount?.replaceAll(",", ""),
    notes,
    targetListQuery,
  };
}
