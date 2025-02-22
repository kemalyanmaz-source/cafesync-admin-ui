"use client";

import { useRouter } from "next/navigation";
import { DataTableColumn, DataTableAction, DataTable } from "../ui/datatable";
import { useState } from "react";
import { Button } from "../ui/button";

type User = {
  id: number; // or string if you want GUID
  name: string;
  email: string;
  role: string;
};

const userData: User[] = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", role: "Admin" },
  { id: 2, name: "Ayşe Demir", email: "ayse@example.com", role: "User" },
  { id: 3, name: "Mehmet Akar", email: "mehmet@example.com", role: "User" },
  { id: 4, name: "Zeynep Şahin", email: "zeynep@example.com", role: "Editor" },
  { id: 5, name: "Ali Çelik", email: "ali@example.com", role: "User" },
  { id: 6, name: "Fatma Koç", email: "fatma@example.com", role: "Admin" },
  { id: 7, name: "Emre Güneş", email: "emre@example.com", role: "Editor" },
  { id: 8, name: "Burak Yıldız", email: "burak@example.com", role: "User" },
  { id: 9, name: "Cem Özkan", email: "cem@example.com", role: "Admin" },
  { id: 10, name: "Selin Arslan", email: "selin@example.com", role: "User" },
];

export default function UsersPage() {
  const router = useRouter();


  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  function handleBulkDelete() {
    console.log("Deleting selected rows:", selectedIds);
    // e.g., remove them from data or call an API
  }

  // columns
  const columns: DataTableColumn<User>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "role", header: "Role", sortable: true },
  ];

  // row actions
  const actions: DataTableAction<User>[] = [
    {
      label: "Edit",
      onClick: (row: User) => {
        console.log("Editing user:", row);
        router.push(`/users/edit/${row.id}`);
      },
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row: User) => console.log("Deleting user:", row),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <DataTable
        columns={columns}
        data={userData}
        actions={actions}

        // Filter: "both" = global + column filters
        filterMode="column"
        filterPlaceholder="Search all columns..."

        // Sorting (multi-column)
        enableSorting
        // Pagination
        enablePagination
        initialPageSize={20}
        pageSizeOptions={[5, 10, 20, 50]}
      // rowKey defaults to "id"
      />
      
      {selectedIds.length > 1 && 
      <div className="flex items-center gap-2 mt-5">
        <Button
          variant="destructive"
          onClick={handleBulkDelete}
          disabled={selectedIds.length === 0}
        >
          Bulk Delete
        </Button>
      </div>
      }
    </div>
  );
}
