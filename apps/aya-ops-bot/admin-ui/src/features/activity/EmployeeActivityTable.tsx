import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";

import { DataTable } from "../../components/DataTable";
import type { EmployeeActivityRow } from "../../lib/api";
import { formatAdminTime } from "../../lib/time";

const columnHelper = createColumnHelper<EmployeeActivityRow>();

export function EmployeeActivityTable(input: { data: EmployeeActivityRow[] }) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("display_name", {
        header: "Employee",
      }),
      columnHelper.accessor("role_name", {
        header: "Role",
        cell: (info) => info.getValue() ?? "employee",
      }),
      columnHelper.accessor("interaction_count", {
        header: "Interactions",
        cell: (info) => info.getValue() ?? 0,
      }),
      columnHelper.accessor("success_count", {
        header: "Success",
        cell: (info) => info.getValue() ?? 0,
      }),
      columnHelper.accessor("failure_count", {
        header: "Failure",
        cell: (info) => info.getValue() ?? 0,
      }),
      columnHelper.accessor("success_rate", {
        header: "Success Rate",
        cell: (info) => `${Number(info.getValue() ?? 0).toFixed(2)}%`,
      }),
      columnHelper.accessor("latest_interaction_at", {
        header: "Latest",
        cell: (info) => formatAdminTime(info.getValue()),
      }),
    ],
    [],
  );

  return (
    <DataTable
      title="Employee Activity"
      columns={columns}
      data={input.data}
      emptyText="No employee activity has been recorded yet."
    />
  );
}
