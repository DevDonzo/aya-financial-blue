import { ingestBlueActivity } from "../activity/blue-ingest.js";
import { syncWorkspaceIndex } from "../blue/workspace-index.js";
import { config } from "../config.js";
import { logger } from "../lib/logger.js";

let bluePoller: NodeJS.Timeout | null = null;
let inFlight = false;

export async function runBlueIngestionOnce() {
  if (inFlight) {
    return {
      skipped: true,
      reason: "ingest already running"
    };
  }

  inFlight = true;
  try {
    const [activity, index] = await Promise.all([
      ingestBlueActivity(),
      syncWorkspaceIndex(),
    ]);

    return {
      activity,
      index,
    };
  } finally {
    inFlight = false;
  }
}

export function startBluePoller() {
  if (!config.ENABLE_BLUE_POLLING || bluePoller) {
    return;
  }

  bluePoller = setInterval(() => {
    void runBlueIngestionOnce().catch((error) => {
      logger.error({ err: error }, "Scheduled Blue ingest failed");
    });
  }, config.BLUE_INGEST_INTERVAL_MS);
}

export function stopBluePoller() {
  if (!bluePoller) {
    return;
  }

  clearInterval(bluePoller);
  bluePoller = null;
}
