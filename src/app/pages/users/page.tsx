"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TableColumnsDropdown } from "@/components/ui/datatable/columns-dropdown";
import { DataTableColumn, DataTableState, DataTableAction, DataTable } from "@/components/ui/datatable/datatable";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { ExportColumnsDropdown } from "@/components/ui/datatable/export-dropdown";
import { useSession } from "next-auth/react";
import { GET, POST } from "@/app/api/auth/[...nextauth]/route";


type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Token ={
  token: string
}
export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // session.customAppToken => Kendi JWT'miz


      const token = session?.user.customAppToken 
      console.log(1);
      if (!token) return;
      // fetch
      console.log(2);
      fetch("https://localhost:44368/api/system-admin/list", {
        method: "GET",
        headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}` }
      })
        .then((res) => {
          if(res.ok){
            return res.json()
          }else{
            console.log("Hata: " +token+"\n"+JSON.stringify(res.body))
          }
        })
        .then((data) => {
          console.log("Backend verification:", data);
          setUsers(data);
          // data.appJwt vb. geldiyse ister localStorage'a kaydet
        })
        .catch((err) => console.error("Error verifying token:", err))
    }
  }, [status, session, router]);



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
      onClick: (row) => router.push(`/pages/users/edit/${row.id}`),
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
        data={users}
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
