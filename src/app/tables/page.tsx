"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FilterModel } from "../models/FilterModel";
import { Accordion } from "../ui/accordion";

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
];

export default function TablesPage() {
  const [data, setData] = useState<User[]>(defaultData);
  const [filters, setFilters] = useState(new FilterModel());

  // Function to update filter values
  const handleColumnFilterChange = (field: keyof FilterModel, value: string) => {
    setFilters((prevFilters) => new FilterModel(
      field === "name" ? value : prevFilters.name,
      field === "email" ? value : prevFilters.email,
      field === "role" ? value : prevFilters.role
    ));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(new FilterModel());
  };

  // Apply filters to data
  const filteredData = filters.applyFilters(data);

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Users Table</h1>

      {/* Accordion for Filters */}
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

      {/* Table */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="text-left p-2">ID</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((user : User) => (
              <tr key={user.id}>
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
