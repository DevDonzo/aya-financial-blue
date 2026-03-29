import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { z } from "zod";

const appRoot = path.resolve(import.meta.dirname, "..");
const workspaceRoot = path.resolve(appRoot, "..", "..");

const blueConfigEnv = readSimpleEnvFile(
  path.join(os.homedir(), ".config", "blue", "config.env"),
);
const localBlueToken = readLocalBlueToken(
  path.join(workspaceRoot, ".local", "blue-api-token.json"),
);

const runtimeEnv = {
  ...blueConfigEnv,
  ...process.env,
  BLUE_API_URL:
    process.env.BLUE_API_URL ?? process.env.API_URL ?? blueConfigEnv.API_URL,
  BLUE_AUTH_TOKEN:
    process.env.BLUE_AUTH_TOKEN ??
    process.env.AUTH_TOKEN ??
    blueConfigEnv.AUTH_TOKEN ??
    localBlueToken.secret,
  BLUE_CLIENT_ID:
    process.env.BLUE_CLIENT_ID ??
    process.env.CLIENT_ID ??
    blueConfigEnv.CLIENT_ID ??
    localBlueToken.tokenId,
  BLUE_COMPANY_ID:
    process.env.BLUE_COMPANY_ID ??
    process.env.COMPANY_ID ??
    blueConfigEnv.COMPANY_ID,
};

const configSchema = z.object({
  BLUE_WORKSPACE_ID: z.string().default("cmn524yr800e101mh7kn44mhf"),
  BLUE_API_URL: z.string().default("https://api.blue.cc/graphql"),
  BLUE_AUTH_TOKEN: z.string().default(""),
  BLUE_CLIENT_ID: z.string().default(""),
  BLUE_COMPANY_ID: z.string().default(""),
  BLUE_INGEST_INTERVAL_MS: z.coerce.number().default(60_000),
  BLUE_RECORD_SYNC_LIMIT_PER_LIST: z.coerce.number().default(500),
  BLUE_GRAPHQL_PAGE_SIZE: z.coerce.number().default(200),
  BLUE_GRAPHQL_MAX_CONCURRENCY: z.coerce.number().default(4),
  BLUE_GRAPHQL_RETRY_ATTEMPTS: z.coerce.number().default(5),
  BLUE_GRAPHQL_RETRY_BASE_MS: z.coerce.number().default(300),
  BLUE_WEBHOOK_PUBLIC_URL: z.string().optional(),
  BLUE_WEBHOOK_SECRET: z.string().optional(),
  WORKSPACE_FULL_RECONCILE_HOURS: z.coerce.number().default(6),
  AUTH_SESSION_TTL_HOURS: z.coerce.number().default(12),
  AUTH_BOOTSTRAP_KEY: z.string().default("aya-dev-bootstrap-key"),
  AYA_DATA_DIR: z.string().optional(),
  AYA_DB_PATH: z.string().optional(),
  AUDIT_STDOUT_MODE: z.enum(["metadata", "full"]).optional(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  LIBRECHAT_MONGO_URI: z
    .string()
    .default("mongodb://127.0.0.1:27018/LibreChat"),
  LIBRECHAT_MONGO_DB_NAME: z.string().default("LibreChat"),
  ENABLE_BLUE_POLLING: z
    .string()
    .default("true")
    .transform((value) => value.toLowerCase() === "true"),
  ALLOW_DEV_DEFAULT_ACTOR: z
    .string()
    .default("false")
    .transform((value) => value.toLowerCase() === "true"),
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3010),
});

export const config = configSchema.parse(runtimeEnv);
export const resolvedAuditStdoutMode =
  config.AUDIT_STDOUT_MODE ??
  (config.NODE_ENV === "production" ? "metadata" : "full");

function readSimpleEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return {} as Record<string, string>;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const entries: Record<string, string> = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    entries[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return entries;
}

function readLocalBlueToken(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return {} as { tokenId?: string; secret?: string };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
      tokenId?: string;
      secret?: string;
    };
    return parsed;
  } catch {
    return {} as { tokenId?: string; secret?: string };
  }
}
