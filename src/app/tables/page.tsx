"use client";

import { useState } from "react";
import { SortingState } from "@tanstack/react-table";
import { FilterModel } from "../models/FilterModel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Accordion } from "../ui/accordion";
import { ArrowUp, ArrowDown } from "lucide-react"; // Icons for sorting
import { useRouter } from "next/navigation";

// User data type
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// Default User Data
const defaultData: User[] = [
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

export default function TablesPage() {
  const [data, setData] = useState<User[]>(defaultData);
  const [filters, setFilters] = useState(new FilterModel());

  // ✅ Pagination & Sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [sorting, setSorting] = useState<SortingState>([]);

  const router = useRouter();

  // ---------------------------------------
  // Actions: Edit & Delete
  // ---------------------------------------
  const handleEdit = (rowData: User) => {
    // Navigate to /users/edit/[id]
    router.push(`/users/edit/${rowData.id}`);
  };
  
  const handleDelete = (rowData: User) => {
    console.log("Deleting user:", rowData);
    // Remove from data
    setData((prevData) => prevData.filter((user) => user.id !== rowData.id));
  };

  // ---------------------------------------
  // 1) Filter
  // ---------------------------------------
  const filteredData = filters.applyFilters(data);

  // ---------------------------------------
  // 2) Sort
  // ---------------------------------------
  const sortedData = [...filteredData].sort((a, b) => {
    if (sorting.length === 0) return 0;
  
    const { id, desc } = sorting[0];
    const valA = a[id as keyof User];
    const valB = b[id as keyof User];
  
    // 🏷 Numeric Sort if the column is a number
    if (typeof valA === "number" && typeof valB === "number") {
      return desc ? valB - valA : valA - valB;
    }
  
    // 🏷 Otherwise, do string-based sorting
    const strA = valA?.toString().toLowerCase() || "";
    const strB = valB?.toString().toLowerCase() || "";
  
    if (strA < strB) return desc ? 1 : -1;
    if (strA > strB) return desc ? -1 : 1;
    return 0;
  });

  // ---------------------------------------
  // 3) Paginate
  // ---------------------------------------
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // ---------------------------------------
  // Sorting Handler (Asc → Desc → Default)
  // ---------------------------------------
  const toggleSorting = (column: keyof User) => {
    setSorting((prev) => {
      if (prev.length === 0 || prev[0]?.id !== column) {
        // No sort yet, or different column → Asc
        return [{ id: column, desc: false }];
      } else if (!prev[0].desc) {
        // Asc → Desc
        return [{ id: column, desc: true }];
      } else {
        // Desc → Reset
        return [];
      }
    });
  };

  // ---------------------------------------
  // Filter Handlers
  // ---------------------------------------
  const handleColumnFilterChange = (field: keyof FilterModel, value: string) => {
    setFilters((prevFilters) => new FilterModel(
      field === "name" ? value : prevFilters.name,
      field === "email" ? value : prevFilters.email,
      field === "role" ? value : prevFilters.role
    ));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(new FilterModel());
    setCurrentPage(1);
  };

  // ---------------------------------------
  // Page Size Handler
  // ---------------------------------------
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Users Table</h1>

      {/* ✅ Accordion for Filters */}
      <Accordion title="Filter Options">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Filter Name"
            value={filters.name}
            onChange={(e) => handleColumnFilterChange("name", e.target.value)}
          />
          <Input
            placeholder="Filter Email"
            value={filters.email}
            onChange={(e) => handleColumnFilterChange("email", e.target.value)}
          />
          <Input
            placeholder="Filter Role"
            value={filters.role}
            onChange={(e) => handleColumnFilterChange("role", e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="destructive" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </Accordion>

      {/* ✅ Table */}
      <table className="w-full border-collapse mt-4">
        <thead className="bg-gray-100">
          <tr>
            {["name", "email", "role"].map((column) => (
              <th
                key={column}
                className="text-left p-2 cursor-pointer select-none"
                onClick={() => toggleSorting(column as keyof User)}
              >
                <div className="flex items-center gap-2">
                  {column.toUpperCase()}
                  {sorting[0]?.id === column && (
                    sorting[0].desc ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                  )}
                </div>
              </th>
            ))}
            {/* ACTIONS COLUMN */}
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>

                {/* ACTION BUTTONS */}
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(user)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Pagination & Page Size */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            className="border border-gray-300 rounded p-1"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>
    </div>
  );
}
