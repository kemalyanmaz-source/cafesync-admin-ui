"use client";

import { useRouter } from "next/navigation";
import { DataTableColumn, DataTableAction, DataTable } from "../ui/datatable";

type User = {
  id: number; // or string if you use GUID
  name: string;
  email: string;
  role: string;
};

const users: User[] = [
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

  // Table columns
  const columns: DataTableColumn<User>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "role", header: "Role", sortable: true },
  ];

  // Row actions
  const actions: DataTableAction<User>[] = [
    {
      label: "Edit",
      onClick: (row : User) => {
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
        data={users}
        actions={actions}
        filterMode="column" // or "global" | "column" | "none"
        filterPlaceholder="Search all columns..."
        enableSorting
        enablePagination
        initialPageSize={5}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}
