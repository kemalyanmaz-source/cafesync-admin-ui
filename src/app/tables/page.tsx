"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
  DataTableState,
} from "../ui/datatable";
import { Button } from "../ui/button";
import { Dropdown } from "../ui/dropdown";

/** Örnek veri tipi */
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

/** Örnek data */
const userData: User[] = [
  { id: 1, name: "Ahmet", email: "ahmet@example.com", role: "Admin" },
  { id: 2, name: "Ayşe", email: "ayse@example.com", role: "User" },
  { id: 3, name: "Mehmet", email: "mehmet@example.com", role: "User" },
];

/** TableColumnsDropdown (en az 2 sütun) */
function TableColumnsDropdown({
  columns,
  onChange,
}: {
  columns: DataTableColumn<User>[];
  onChange: (newCols: DataTableColumn<User>[]) => void;
}) {
  const visibleCount = columns.filter((c) => c.visible !== false).length;

  function toggleColumn(key: keyof User) {
    const col = columns.find((c) => c.key === key);
    if (!col) return;
    const isVisible = col.visible !== false;
    // min 2 sütun kuralı
    if (isVisible && visibleCount === 2) {
      return;
    }
    const updated = columns.map((c) => {
      if (c.key === key) {
        return { ...c, visible: !isVisible };
      }
      return c;
    });
    onChange(updated);
  }

  return (
    <div>
      <h4 className="font-bold mb-1">Table Columns</h4>
      {columns.map((col) => {
        const isVisible = col.visible !== false;
        const shouldDisable = isVisible && visibleCount === 2;
        return (
          <label key={col.key.toString()} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isVisible}
              disabled={shouldDisable}
              onChange={() => toggleColumn(col.key)}
            />
            <span>{col.header}</span>
          </label>
        );
      })}
    </div>
  );
}

/** ExportColumnsDropdown (bağımsız, tablo gizli sütunları da ekleyebilirsin) */
function ExportColumnsDropdown({
  allColumns,
  exportCols,
  onChange,
  onExport,
}: {
  allColumns: DataTableColumn<User>[];
  exportCols: Record<keyof User, boolean>;
  onChange: (x: Record<keyof User, boolean>) => void;
  onExport: () => void;
}) {
  return (
    <div>
      <h4 className="font-bold mb-1">Export Columns</h4>
      {allColumns.map((col) => {
        const isSelected = exportCols[col.key] ?? false;
        return (
          <label key={col.key.toString()} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {
                const copy = { ...exportCols };
                copy[col.key] = !isSelected;
                onChange(copy);
              }}
            />
            <span>{col.header}</span>
          </label>
        );
      })}

      <button
        className="border px-2 py-1 rounded text-sm mt-2"
        onClick={onExport}
      >
        Export CSV
      </button>
    </div>
  );
}

/** Asıl Sayfa Bileşeni */
export default function UsersPage() {
  const router = useRouter();

  // Tablo sütunları (en az 2 visible)
  const [tableColumns, setTableColumns] = useState<DataTableColumn<User>[]>([
    { key: "name", header: "Name", sortable: true, visible: true },
    { key: "email", header: "Email", sortable: true, visible: true },
    { key: "role", header: "Role", sortable: true, visible: true },
  ]);

  // Export sütun seçimi (ID dahil istersen ekleyebilirsin)
  const [exportCols, setExportCols] = useState<Record<keyof User, boolean>>({
    id: false,
    name: true,
    email: true,
    role: true,
  });

  // DataTable’tan gelen (finalData + visibleColumns)
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
      onClick: (row) => console.log("Deleting user:", row),
    },
  ];

  // Row selection
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  function handleBulkDelete() {
    console.log("Bulk delete selected:", selectedIds);
  }

  // Export CSV -> tablo finalData + exportCols
  function handleExportCSV() {
    const { finalData } = tableState; 
    // Tüm tablo sütunları (tableColumns) da olabilir. 
    // ID gibi tabloda yoksa da ekleyebilirsin. 
    // Şimdilik tableColumns ile yetiniyoruz:
    const allCols = [...tableColumns];

    // Hangileri seçili?
    const selectedExportCols = allCols.filter((c) => exportCols[c.key] === true);

    // CSV başlık
    const headers = selectedExportCols.map((c) => c.header).join(",");
    let csv = headers + "\n";

    // Satırlar
    finalData.forEach((row) => {
      const rowVals = selectedExportCols.map((c) => {
        const val = row[c.key];
        return val !== undefined ? val.toString() : "";
      });
      csv += rowVals.join(",") + "\n";
    });

    // İndirt
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "export.csv";
    link.click();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Table with 2 Dropdowns</h1>

      <div className="flex gap-4 mb-3">
        {/* (1) Table Columns => Dropdown */}
        <Dropdown buttonLabel="Table Columns">
          <TableColumnsDropdown
            columns={tableColumns}
            onChange={setTableColumns}
          />
        </Dropdown>

        {/* (2) Export Columns => Dropdown */}
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
        // Filtre (hem global hem column)
        filterMode="both"
        filterPlaceholder="Search..."
        // Sıralama
        enableSorting
        // Sayfalama
        enablePagination
        // Row selection
        enableRowSelection
        onSelectionChange={setSelectedIds}
        // Tablonun final durumunu aldığımız yer
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
