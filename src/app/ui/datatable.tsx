"use client";

import React, { useState, MouseEvent } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./button";  // or wherever your Button is
import { Input } from "./input";

/**
 * Basic column definition for DataTable:
 * - key: field in T to display
 * - header: column title
 * - sortable: can user sort by this column?
 * - render?: custom cell renderer
 */
export type DataTableColumn<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

/**
 * Row action definition (Edit, Delete, etc.)
 */
export type DataTableAction<T> = {
  label: string;
  variant?: "default" | "outline" | "destructive";
  onClick: (rowData: T) => void;
};

/**
 * Possible filtering modes:
 * - "none": no filtering
 * - "global": single input for all columns
 * - "column": individual input per column
 * - "both": both global & column filters
 */
export type FilterMode = "none" | "global" | "column" | "both";

/**
 * Multi-column sorting: an array of these rules
 */
export type SortingRule<T> = {
  key: keyof T;
  desc: boolean;
};

/**
 * T must have an "id" field & be an object so we can do Object.values(...) safely
 */
export interface DataTableProps<T extends { id: string | number } & Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  actions?: DataTableAction<T>[];

  // Filters
  filterMode?: FilterMode;             // "none" | "global" | "column" | "both"
  filterPlaceholder?: string;          // for global filter input

  // Sorting & Pagination
  enableSorting?: boolean;
  enablePagination?: boolean;

  // Page size controls
  initialPageSize?: number;
  pageSizeOptions?: number[];

  // Row key (defaults to "id")
  rowKey?: keyof T;

  // Row Selection
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedIds: Array<string | number>) => void;
}

// -------------------------
// Helpers: Filters
// -------------------------
function applyColumnFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: { [key: string]: string }
): T[] {
  return data.filter((row) =>
    Object.entries(filters).every(([colKey, filterVal]) => {
      if (!filterVal) return true; // no filter set
      const cellVal = row[colKey];
      if (cellVal == null) return false;
      return cellVal.toString().toLowerCase().includes(filterVal.toLowerCase());
    })
  );
}

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

  enableRowSelection = false,
  onSelectionChange,
}: DataTableProps<T>) {

  // (A) Row Selection State
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  // (B) Column / Global Filters
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});
  const [globalFilter, setGlobalFilter] = useState("");

  // (C) Multi-Column Sorting
  const [sorting, setSorting] = useState<SortingRule<T>[]>([]);

  // (D) Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // -------------------------
  // Row selection logic
  // -------------------------
  function toggleRow(row: T) {
    const rowId = row[rowKey] as string | number;
    setSelectedIds((prev) => {
      let newSelected;
      if (prev.includes(rowId)) {
        newSelected = prev.filter((id) => id !== rowId);
      } else {
        newSelected = [...prev, rowId];
      }
      onSelectionChange?.(newSelected);
      return newSelected;
    });
  }

  function toggleSelectAllVisible(e: React.ChangeEvent<HTMLInputElement>, visibleIds: Array<string | number>) {
    if (e.target.checked) {
      // add all visible
      const newSelected = Array.from(new Set([...selectedIds, ...visibleIds]));
      setSelectedIds(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      // remove visible
      const newSelected = selectedIds.filter((id) => !visibleIds.includes(id));
      setSelectedIds(newSelected);
      onSelectionChange?.(newSelected);
    }
  }

  // -------------------------
  // Sorting: shift-click => multi-col
  // -------------------------
  function handleHeaderClick(key: keyof T, e: MouseEvent) {
    if (!enableSorting) return;

    const isShiftPressed = e.shiftKey;
    setSorting((prev) => {
      let newSorting = [...prev];

      // If SHIFT not pressed, single-col logic
      if (!isShiftPressed) {
        if (newSorting[0]?.key === key) {
          if (!newSorting[0].desc) {
            // asc -> desc
            newSorting[0].desc = true;
          } else {
            // desc -> remove
            newSorting = [];
          }
        } else {
          // new single-col asc
          newSorting = [{ key, desc: false }];
        }
        return newSorting;
      }

      // SHIFT pressed -> multi-col logic
      const existingIndex = newSorting.findIndex((rule) => rule.key === key);
      if (existingIndex === -1) {
        // add asc
        newSorting.push({ key, desc: false });
      } else {
        // toggle asc->desc->remove
        if (!newSorting[existingIndex].desc) {
          // asc->desc
          newSorting[existingIndex].desc = true;
        } else {
          // remove
          newSorting.splice(existingIndex, 1);
        }
      }
      return newSorting;
    });
  }

  // -------------------------
  // Filter & Sort & Paginate Data
  // -------------------------
  // 1) Column-based filters
  let filteredData = data;
  if (filterMode === "column" || filterMode === "both") {
    filteredData = applyColumnFilters(filteredData, columnFilters);
  }
  // 2) Global filter
  if (filterMode === "global" || filterMode === "both") {
    filteredData = applyGlobalFilter(filteredData, globalFilter);
  }
  // 3) Multi-column sort
  let sortedData = [...filteredData];
  if (enableSorting && sorting.length > 0) {
    // stable multi-pass
    for (let i = 0; i < sorting.length; i++) {
      const { key, desc } = sorting[i];
      sortedData.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (typeof valA === "number" && typeof valB === "number") {
          return desc ? valB - valA : valA - valB;
        }
        const strA = valA?.toString().toLowerCase() || "";
        const strB = valB?.toString().toLowerCase() || "";
        if (strA < strB) return desc ? 1 : -1;
        if (strA > strB) return desc ? -1 : 1;
        return 0;
      });
    }
  }
  // 4) Pagination
  let finalData = sortedData;
  let totalPages = 1;
  if (enablePagination) {
    totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    finalData = sortedData.slice(startIndex, startIndex + pageSize);
  }

  // compute visible IDs for "select all visible" logic
  const visibleIds = finalData.map((row) => row[rowKey] as string | number);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="bg-white p-4 rounded shadow w-full">
      {/* Global filter input (if "global" or "both") */}
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
        {/* Column-based filter row (if "column" or "both") */}
        {(filterMode === "column" || filterMode === "both") && (
          <thead>
            <tr>
              {/* Row selection column (no filter) */}
              {enableRowSelection && <th className="p-2"></th>}

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
              {/* actions column (no filter) */}
              {actions && actions.length > 0 && <th className="p-2"></th>}
            </tr>
          </thead>
        )}

        <thead className="bg-gray-100">
          <tr>
            {/* Row selection header (select all visible) */}
            {enableRowSelection && (
              <th className="p-2">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(e) => toggleSelectAllVisible(e, visibleIds)}
                />
              </th>
            )}

            {columns.map((col) => {
              const indexOfRule = sorting.findIndex((rule) => rule.key === col.key);
              const isSorted = indexOfRule !== -1;

              let arrow = null;
              if (isSorted) {
                const { desc } = sorting[indexOfRule];
                arrow = desc ? <ArrowDown size={14} /> : <ArrowUp size={14} />;
              }

              return (
                <th
                  key={col.key.toString()}
                  className={`text-left p-2 ${
                    col.sortable && enableSorting ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={(e) => col.sortable && handleHeaderClick(col.key, e)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {isSorted && (
                      <span className="flex items-center gap-1">
                        ({indexOfRule + 1}) {arrow}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}

            {actions && actions.length > 0 && <th className="text-left p-2">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {finalData.length > 0 ? (
            finalData.map((row, rowIndex) => {
              const uniqueKey = (row[rowKey] ?? rowIndex) as string | number;

              return (
                <tr key={uniqueKey.toString()} className="border-b hover:bg-gray-50">
                  {enableRowSelection && (
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(uniqueKey)}
                        onChange={() => toggleRow(row)}
                      />
                    </td>
                  )}

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
                colSpan={
                  columns.length +
                  (actions?.length ? 1 : 0) +
                  (enableRowSelection ? 1 : 0)
                }
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
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
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
