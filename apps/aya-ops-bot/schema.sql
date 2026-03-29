CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  role_name TEXT,
  timezone TEXT DEFAULT 'America/Toronto',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS identity_links (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  external_label TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source, external_id),
  FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS employee_credentials (
  employee_id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  must_reset INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS blue_lists_cache (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  title TEXT NOT NULL,
  normalized_title TEXT NOT NULL,
  stage_key TEXT,
  stage_label TEXT,
  task_count INTEGER,
  position REAL,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blue_lists_cache_workspace
  ON blue_lists_cache(workspace_id);

CREATE INDEX IF NOT EXISTS idx_blue_lists_cache_normalized
  ON blue_lists_cache(workspace_id, normalized_title);

CREATE TABLE IF NOT EXISTS blue_records_cache (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  list_id TEXT NOT NULL,
  list_title TEXT NOT NULL,
  title TEXT NOT NULL,
  normalized_title TEXT NOT NULL,
  status TEXT,
  due_at TEXT,
  synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blue_records_cache_workspace
  ON blue_records_cache(workspace_id);

CREATE INDEX IF NOT EXISTS idx_blue_records_cache_list
  ON blue_records_cache(workspace_id, list_id);

CREATE INDEX IF NOT EXISTS idx_blue_records_cache_normalized
  ON blue_records_cache(workspace_id, normalized_title);

CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY,
  employee_id TEXT,
  source TEXT NOT NULL,
  source_event_id TEXT,
  action_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  entity_title TEXT,
  occurred_at TEXT NOT NULL,
  summary TEXT NOT NULL,
  raw_payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source, source_event_id),
  FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS bot_audit_logs (
  id TEXT PRIMARY KEY,
  employee_id TEXT,
  transport TEXT NOT NULL,
  inbound_text TEXT NOT NULL,
  detected_intent TEXT,
  adapter TEXT NOT NULL,
  command_name TEXT,
  command_args TEXT,
  outcome TEXT NOT NULL,
  response_text TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS daily_summaries (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  summary_date TEXT NOT NULL,
  source_counts TEXT NOT NULL,
  action_counts TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, summary_date),
  FOREIGN KEY(employee_id) REFERENCES employees(id)
);
