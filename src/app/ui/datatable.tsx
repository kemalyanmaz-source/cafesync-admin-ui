"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./button";  // Adjust to your actual path
import { Input } from "./input";

// For columns, we allow optional sorting & rendering
export type DataTableColumn<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

// For row actions (Edit, Delete, etc.)
export type DataTableAction<T> = {
  label: string;
  variant?: "default" | "outline" | "destructive";
  onClick: (rowData: T) => void;
};

// Various filter modes
export type FilterMode = "none" | "global" | "column" | "both";

/**
 * T must be an object with an "id" (for rowKey) and
 * also allow Object.values(...) calls (Record<string, unknown>).
 */
export interface DataTableProps<T extends { id: string | number } & Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  actions?: DataTableAction<T>[];

  // Filtering
  filterMode?: FilterMode;              // "none" | "global" | "column" | "both"
  filterPlaceholder?: string;           // For global search input

  // Sorting / Pagination toggles
  enableSorting?: boolean;
  enablePagination?: boolean;

  // Pagination
  initialPageSize?: number;
  pageSizeOptions?: number[];

  // Row key (defaults to "id")
  rowKey?: keyof T;
}

// -------------------------
// Helper: apply column-based filters
// -------------------------
function applyColumnFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: { [key: string]: string }
): T[] {
  return data.filter((row) =>
    Object.entries(filters).every(([colKey, filterVal]) => {
      if (!filterVal) return true; // no filter set for this column
      const cellVal = row[colKey];
      if (cellVal == null) return false;
      return cellVal.toString().toLowerCase().includes(filterVal.toLowerCase());
    })
  );
}

// -------------------------
// Helper: apply global filter across all columns
// -------------------------
function applyGlobalFilter<T extends Record<string, unknown>>(
  data: T[],
  globalValue: string
): T[] {
  if (!globalValue) return data;
  const lower = globalValue.toLowerCase();

  return data.filter((row) =>
    Object.values(row).some((val) => {
      if (val == null) return false;
      return val.toString().toLowerCase().includes(lower);
    })
  );
}

// -------------------------
// The DataTable component
// -------------------------
export function DataTable<
  T extends { id: string | number } & Record<string, unknown>
>({
  columns,
  data,
  actions,
  filterMode = "none",
  filterPlaceholder = "Search...",
  enableSorting = true,
  enablePagination = true,
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
  rowKey = "id",
}: DataTableProps<T>) {
  // Column-based filters
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>(
    {}
  );
  // Global filter
  const [globalFilter, setGlobalFilter] = useState("");

  // Sorting (single column, 3-state)
  type SortingState = {
    key: keyof T;
    desc: boolean;
  } | null;
  const [sorting, setSorting] = useState<SortingState>(null);

  const toggleSorting = (key: keyof T) => {
    if (!enableSorting) return;
    setSorting((prev) => {
      if (!prev || prev.key !== key) {
        // No sort or different column → Asc
        return { key, desc: false };
      } else if (!prev.desc) {
        // Asc → Desc
        return { key, desc: true };
      } else {
        // Desc → reset
        return null;
      }
    });
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.ceil(data.length / pageSize);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // 1) Column-based filters
  let filteredData = data;
  if (filterMode === "column" || filterMode === "both") {
    filteredData = applyColumnFilters(filteredData, columnFilters);
  }

  // 2) Global filter
  if (filterMode === "global" || filterMode === "both") {
    filteredData = applyGlobalFilter(filteredData, globalFilter);
  }

  // 3) Sorting
  let sortedData = [...filteredData];
  if (enableSorting && sorting) {
    sortedData.sort((a, b) => {
      const valA = a[sorting.key];
      const valB = b[sorting.key];
      // numeric?
      if (typeof valA === "number" && typeof valB === "number") {
        return sorting.desc ? valB - valA : valA - valB;
      }
      // string
      const strA = valA?.toString().toLowerCase() || "";
      const strB = valB?.toString().toLowerCase() || "";
      if (strA < strB) return sorting.desc ? 1 : -1;
      if (strA > strB) return sorting.desc ? -1 : 1;
      return 0;
    });
  }

  // 4) Pagination
  let finalData = sortedData;
  if (enablePagination) {
    const startIndex = (currentPage - 1) * pageSize;
    finalData = finalData.slice(startIndex, startIndex + pageSize);
  }
  const finalTotalPages = enablePagination
    ? Math.ceil(sortedData.length / pageSize)
    : 1;

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      {/* Global filter input */}
      {(filterMode === "global" || filterMode === "both") && (
        <div className="mb-4">
          <Input
            placeholder={filterPlaceholder}
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      <table className="w-full border-collapse">
        {/* Column-based filter row */}
        {(filterMode === "column" || filterMode === "both") && (
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={`filter-${col.key.toString()}`} className="p-2">
                  <Input
                    placeholder={`Filter ${col.header}`}
                    value={columnFilters[col.key as string] || ""}
                    onChange={(e) => {
                      setColumnFilters((prev) => ({
                        ...prev,
                        [col.key]: e.target.value,
                      }));
                      setCurrentPage(1);
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
        )}

        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key.toString()}
                className={`text-left p-2 ${
                  col.sortable && enableSorting ? "cursor-pointer select-none" : ""
                }`}
                onClick={() => col.sortable && toggleSorting(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {sorting && sorting.key === col.key && (
                    sorting.desc ? <ArrowDown size={14} /> : <ArrowUp size={14} />
                  )}
                </div>
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="text-left p-2">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {finalData.length > 0 ? (
            finalData.map((row, rowIndex) => {
              // unique row key
              const uniqueKey = row[rowKey] ?? rowIndex;
              return (
                <tr key={uniqueKey.toString()} className="border-b hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key.toString()} className="p-2">
                      {col.render ? col.render(row) : row[col.key]?.toString()}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="p-2">
                      <div className="flex gap-2">
                        {actions.map((action, i) => (
                          <Button
                            key={i}
                            variant={action.variant || "outline"}
                            onClick={() => action.onClick(row)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions?.length ? 1 : 0)}
                className="text-center p-4"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {enablePagination && (
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
              Page {currentPage} of {finalTotalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, finalTotalPages))}
              disabled={currentPage === finalTotalPages}
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
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
        </div>
      )}
    </div>
  );
}
