import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";

import { DataTable } from "../../components/DataTable";
import type { LogRow } from "../../lib/api";
import { formatAdminTime } from "../../lib/time";

const columnHelper = createColumnHelper<LogRow>();

export function LogsTable(input: {
  data: LogRow[];
  onViewDetail: (id: string) => void;
}) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "actions",
        header: "Detail",
        cell: (info) => (
          <button
            type="button"
            className="link-button"
            onClick={() => input.onViewDetail(info.row.original.id)}
          >
            View detail
          </button>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Time",
        cell: (info) => formatAdminTime(info.getValue()),
      }),
      columnHelper.accessor("display_name", {
        header: "Employee",
        cell: (info) => info.getValue() ?? "Unknown",
      }),
      columnHelper.accessor("detected_intent", {
        header: "Intent",
        cell: (info) => info.getValue() ?? "unmatched",
      }),
      columnHelper.accessor("inbound_text", {
        header: "Prompt",
        cell: (info) => <div className="multiline-cell">{info.getValue()}</div>,
      }),
      columnHelper.accessor("response_text", {
        header: "Reply",
        cell: (info) => (
          <div className="multiline-cell">{info.getValue() ?? "None"}</div>
        ),
      }),
      columnHelper.accessor("outcome", {
        header: "Outcome",
        cell: (info) => (
          <span
            className={
              info.getValue() === "success" ? "status-chip ok" : "status-chip bad"
            }
          >
            {info.getValue()}
          </span>
        ),
      }),
    ],
    [input.onViewDetail],
  );

  return (
    <DataTable
      title="Recent Logs"
      columns={columns}
      data={input.data}
      emptyText="No logs matched the current filters."
    />
  );
}
