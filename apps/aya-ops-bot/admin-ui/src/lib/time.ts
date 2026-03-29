const sqliteUtcPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export function parseTimestamp(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (sqliteUtcPattern.test(value)) {
    return new Date(value.replace(" ", "T") + "Z");
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function timestampMs(value: string | null | undefined) {
  return parseTimestamp(value)?.getTime() ?? 0;
}

export function formatAdminTime(value: string | null | undefined) {
  const parsed = parseTimestamp(value);
  if (!parsed) {
    return "None";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(parsed);
}
