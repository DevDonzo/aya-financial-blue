import { describe, expect, it } from "vitest";

import { detectIntent, planEmployeeIntent } from "../../src/router/intents.js";

const actor = {
  employeeId: "emp_1",
  displayName: "Hamza Paracha",
  blueUserId: "emp_1",
};

describe("detectIntent", () => {
  it("matches workload requests", () => {
    const result = detectIntent({
      actor,
      message: "what am i working on",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.list_assigned",
      parameters: {
        assigneeId: "emp_1",
      },
    });
  });

  it("matches follow-up queue requests", () => {
    const result = detectIntent({
      actor,
      message: "what needs follow up today",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.follow_up",
      parameters: {
        employeeName: "Hamza Paracha",
      },
    });
  });

  it("matches move commands", () => {
    const result = detectIntent({
      actor,
      message: "move sheraz to 0.2",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.move",
      parameters: {
        recordQuery: "sheraz",
        targetListQuery: "0.2",
      },
    });
  });

  it("matches comment creation commands", () => {
    const result = detectIntent({
      actor,
      message: "add note to sheraz: Client sent docs",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "comments.create",
      parameters: {
        recordQuery: "sheraz",
        text: "Client sent docs",
      },
    });
  });

  it("matches recent comment lookup commands", () => {
    const result = detectIntent({
      actor,
      message: "show comments for sheraz",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "comments.list_recent",
      parameters: {
        recordQuery: "sheraz",
      },
    });
  });

  it("maps natural client detail requests to the detail intent", () => {
    const result = planEmployeeIntent({
      actor,
      message: "show me Hamza",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.detail",
      parameters: {
        recordQuery: "Hamza",
      },
      requiresClarification: false,
    });
  });

  it("maps status-style requests to the detail intent", () => {
    const result = planEmployeeIntent({
      actor,
      message: "what's going on with Sheraz",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.detail",
      parameters: {
        recordQuery: "Sheraz",
        detailMode: "briefing",
        briefingFocus: "general",
      },
    });
  });

  it("maps blocker requests to a focused client briefing", () => {
    const result = planEmployeeIntent({
      actor,
      message: "what is blocking Sheraz",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.detail",
      parameters: {
        recordQuery: "Sheraz",
        detailMode: "briefing",
        briefingFocus: "blockers",
      },
      requiresClarification: false,
    });
  });

  it("maps missing-doc requests to a focused client briefing", () => {
    const result = planEmployeeIntent({
      actor,
      message: "what docs are still missing from Sheraz",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.detail",
      parameters: {
        recordQuery: "Sheraz",
        detailMode: "briefing",
        briefingFocus: "missing_docs",
      },
      requiresClarification: false,
    });
  });

  it("maps handoff requests to a focused client briefing", () => {
    const result = planEmployeeIntent({
      actor,
      message: "give me a handoff summary for Sheraz",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.detail",
      parameters: {
        recordQuery: "Sheraz",
        detailMode: "briefing",
        briefingFocus: "handoff",
      },
      requiresClarification: false,
    });
  });

  it("maps call-prep phrasing to the detail planner with call prep mode", () => {
    const result = planEmployeeIntent({
      actor,
      message: "prep me for a call with Sheraz",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.detail",
      parameters: {
        recordQuery: "Sheraz",
        detailMode: "call_prep",
      },
      requiresClarification: false,
    });
  });

  it("uses active record context for comment follow-ups", () => {
    const result = planEmployeeIntent({
      actor,
      message: "comments on this client",
      nowIso: new Date().toISOString(),
      hasActiveRecordContext: true,
    });

    expect(result).toMatchObject({
      intent: "comments.list_recent",
      parameters: {
        useActiveRecordContext: true,
      },
      requiresClarification: false,
    });
  });

  it("asks for clarification when a contextual move has no active record", () => {
    const result = planEmployeeIntent({
      actor,
      message: "move this to underwriting",
      nowIso: new Date().toISOString(),
      hasActiveRecordContext: false,
    });

    expect(result).toMatchObject({
      intent: "records.move",
      parameters: {
        targetListQuery: "underwriting",
        useActiveRecordContext: true,
      },
      requiresClarification: true,
      clarificationQuestion: "Which client should I move?",
    });
  });

  it("uses active record context for contextual moves", () => {
    const result = planEmployeeIntent({
      actor,
      message: "move this to underwriting",
      nowIso: new Date().toISOString(),
      hasActiveRecordContext: true,
    });

    expect(result).toMatchObject({
      intent: "records.move",
      parameters: {
        targetListQuery: "underwriting",
        useActiveRecordContext: true,
      },
      requiresClarification: false,
    });
  });

  it("matches email-based comment lookup commands", () => {
    const result = detectIntent({
      actor,
      message: "comments on hamza@ayafinancial.com ?",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "comments.list_recent",
      parameters: {
        recordQuery: "hamza@ayafinancial.com",
      },
    });
  });

  it("matches lead creation commands", () => {
    const result = detectIntent({
      actor,
      message:
        "create a new lead named test lead with phone +14165550100 email testlead@example.com amount 250000",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.create",
      parameters: {
        fullName: "test lead",
        phone: "+14165550100",
        email: "testlead@example.com",
        financeAmount: "250000",
      },
    });
  });

  it("normalizes obvious amount shorthand in lead creation plans", () => {
    const result = planEmployeeIntent({
      actor,
      message:
        "create a new lead named test lead phone +14165550100 email testlead@example.com amount 275k",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "records.create",
      parameters: {
        fullName: "test lead",
        financeAmount: "275000",
      },
      requiresClarification: false,
    });
  });

  it("matches reporting overview requests", () => {
    const result = detectIntent({
      actor,
      message: "show me dashboards",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "reporting.overview",
    });
  });

  it("matches reporting questions", () => {
    const result = detectIntent({
      actor,
      message: "how many reports do we have and is enterprise reporting enabled?",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "reporting.question",
      parameters: {
        question: "how many reports do we have and is enterprise reporting enabled?",
      },
    });
  });

  it("returns null for unsupported phrases", () => {
    const result = detectIntent({
      actor,
      message: "please brainstorm improvements for next quarter",
      nowIso: new Date().toISOString(),
    });

    expect(result).toBeNull();
  });
});
