import { describe, expect, it } from "vitest";

import { detectIntent } from "../../src/router/intents.js";

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
      message: "add note to sheraz: client sent docs",
      nowIso: new Date().toISOString(),
    });

    expect(result).toMatchObject({
      intent: "comments.create",
      parameters: {
        recordQuery: "sheraz",
        text: "client sent docs",
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

  it("returns null for unsupported phrases", () => {
    const result = detectIntent({
      actor,
      message: "please brainstorm improvements for next quarter",
      nowIso: new Date().toISOString(),
    });

    expect(result).toBeNull();
  });
});
