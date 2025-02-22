"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/ui/button";
import { TableColumnsDropdown } from "@/app/ui/datatable/columns-dropdown";
import { DataTableColumn, DataTableState, DataTableAction, DataTable } from "@/app/ui/datatable/datatable";
import { Dropdown } from "@/app/ui/dropdown/Dropdown";
import { ExportColumnsDropdown } from "@/app/ui/datatable/export-dropdown";


type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const userData: User[] = [
  { id: 1, name: "Ahmet", email: "ahmet@example.com", role: "Admin" },
  { id: 2, name: "Ayşe", email: "ayse@example.com", role: "User" },
  // ...
];

export default function UsersPage() {
  const router = useRouter();

  // Table columns
  const [tableColumns, setTableColumns] = useState<DataTableColumn<User>[]>([
    { key: "name", header: "Name", sortable: true, visible: true },
    { key: "email", header: "Email", sortable: true, visible: true },
    { key: "role", header: "Role", sortable: true, visible: true },
  ]);

  // Export columns
  const [exportCols, setExportCols] = useState<Record<keyof User, boolean>>({
    id: false,
    name: true,
    email: true,
    role: true,
  });

  // Tablonun state'i
  const [tableState, setTableState] = useState<DataTableState<User>>({
    finalData: [],
    visibleColumns: tableColumns,
  });

  // Row actions
  const actions: DataTableAction<User>[] = [
    {
      label: "Edit",
      onClick: (row) => router.push(`/users/edit/${row.id}`),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Deleting:", row),
    },
  ];

  // Row selection
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  function handleBulkDelete() {
    console.log("Bulk deleting:", selectedIds);
  }

  // Export CSV
  function handleExportCSV() {
    const { finalData } = tableState;
    const allCols = [...tableColumns];
    const selectedExportCols = allCols.filter((c) => exportCols[c.key] === true);

    let csv = selectedExportCols.map((c) => c.header).join(",") + "\n";
    finalData.forEach((row) => {
      const rowVals = selectedExportCols.map((c) => {
        const val = row[c.key];
        return val !== undefined ? val.toString() : "";
      });
      csv += rowVals.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "export.csv";
    link.click();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Table (Modular Setup)</h1>

      <div className="flex gap-4 mb-3">
        {/* Table columns dropdown */}
        <Dropdown buttonLabel="Table Columns">
          <TableColumnsDropdown columns={tableColumns} onChange={setTableColumns} />
        </Dropdown>

        {/* Export columns dropdown */}
        <Dropdown buttonLabel="Export Columns">
          <ExportColumnsDropdown
            allColumns={tableColumns}
            exportCols={exportCols}
            onChange={setExportCols}
            onExport={handleExportCSV}
          />
        </Dropdown>
      </div>

      <DataTable
        columns={tableColumns}
        data={userData}
        actions={actions}
        filterMode="both"
        enableSorting
        enablePagination
        enableRowSelection
        onSelectionChange={setSelectedIds}
        onDataChange={(state) => setTableState(state)}
      />

      {selectedIds.length > 0 && (
        <Button variant="destructive" className="mt-4" onClick={handleBulkDelete}>
          Bulk Delete ({selectedIds.length})
        </Button>
      )}
    </div>
  );
}
