import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "../../components/DataTable";
import type { EmployeeRow, IdentityLinkRow } from "../../lib/api";

const columnHelper = createColumnHelper<IdentityLinkRow>();

export function IdentityLinksManager(input: {
  links: IdentityLinkRow[];
  employees: EmployeeRow[];
  onCreate: (payload: {
    employeeId?: string;
    source: string;
    externalId: string;
    externalLabel?: string;
  }) => void;
  onDelete: (id: string) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState({
    employeeId: "",
    source: "email",
    externalId: "",
    externalLabel: "",
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("display_name", {
        header: "Employee",
      }),
      columnHelper.accessor("source", {
        header: "Source",
      }),
      columnHelper.accessor("external_id", {
        header: "External ID",
      }),
      columnHelper.accessor("external_label", {
        header: "Label",
        cell: (info) => info.getValue() ?? "None",
      }),
      columnHelper.display({
        id: "delete",
        header: "Delete",
        cell: (info) =>
          ["email", "manual"].includes(info.row.original.source) ? (
            <button
              type="button"
              className="link-button"
              onClick={() => input.onDelete(info.row.original.id)}
            >
              Delete
            </button>
          ) : (
            <span className="muted">Protected</span>
          ),
      }),
    ],
    [input],
  );

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>Identity Mapping Manager</h2>
          <p className="muted">
            Link employee identities to LibreChat emails or manual transport ids.
          </p>
        </div>
        <form
          className="identity-form"
          onSubmit={(event) => {
            event.preventDefault();
            input.onCreate({
              employeeId: form.employeeId || undefined,
              source: form.source,
              externalId: form.externalId,
              externalLabel: form.externalLabel || undefined,
            });
            setForm((current) => ({
              ...current,
              externalId: "",
              externalLabel: "",
            }));
          }}
        >
          <select
            value={form.employeeId}
            onChange={(event) =>
              setForm((current) => ({ ...current, employeeId: event.target.value }))
            }
          >
            <option value="">Select employee</option>
            {input.employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.display_name}
              </option>
            ))}
          </select>
          <select
            value={form.source}
            onChange={(event) =>
              setForm((current) => ({ ...current, source: event.target.value }))
            }
          >
            <option value="email">email</option>
            <option value="manual">manual</option>
          </select>
          <input
            value={form.externalId}
            onChange={(event) =>
              setForm((current) => ({ ...current, externalId: event.target.value }))
            }
            placeholder="External ID or email"
          />
          <input
            value={form.externalLabel}
            onChange={(event) =>
              setForm((current) => ({ ...current, externalLabel: event.target.value }))
            }
            placeholder="Optional label"
          />
          <button type="submit" className="primary-button" disabled={input.isSubmitting}>
            {input.isSubmitting ? "Saving..." : "Create Link"}
          </button>
        </form>
      </section>

      <DataTable
        title="Identity Links"
        columns={columns}
        data={input.links}
        emptyText="No identity links found."
      />
    </>
  );
}

