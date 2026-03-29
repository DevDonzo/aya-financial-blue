import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";

import { DataTable } from "../../components/DataTable";
import type { TranscriptRow } from "../../lib/api";
import { formatAdminTime } from "../../lib/time";

const columnHelper = createColumnHelper<TranscriptRow>();

export function TranscriptsTable(input: {
  data: TranscriptRow[];
  expandedIds: Set<string>;
  onToggleExpanded: (conversationId: string) => void;
}) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "conversation",
        header: "Conversation",
        cell: (info) => {
          const row = info.row.original;
          const expanded = input.expandedIds.has(row.conversationId);
          return (
            <div>
              <button
                type="button"
                className="link-button"
                onClick={() => input.onToggleExpanded(row.conversationId)}
              >
                {expanded ? "Hide" : "Show"} preview
              </button>
              <div className="cell-title">{row.title}</div>
              {expanded ? (
                <div className="preview-stack">
                  {row.messages.map((message, index) => (
                    <div key={`${row.conversationId}-${index}`} className="preview-item">
                      <strong>{message.sender}</strong>: {message.text || "Empty"}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        },
      }),
      columnHelper.accessor("employeeName", {
        header: "Employee",
      }),
      columnHelper.accessor("model", {
        header: "Model",
      }),
      columnHelper.accessor("messageCount", {
        header: "Messages",
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated",
        cell: (info) => formatAdminTime(info.getValue()),
      }),
    ],
    [input.expandedIds, input.onToggleExpanded],
  );

  return (
    <DataTable
      title="LibreChat Transcripts"
      columns={columns}
      data={input.data}
      emptyText="No transcripts matched the current filters."
    />
  );
}
