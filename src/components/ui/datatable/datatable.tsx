"use client";

import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";

/** Tablo sütun tanımı */
export type DataTableColumn<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  visible?: boolean; // default true
};

/** Satır aksiyon tanımı (Edit, Delete vb.) */
export type DataTableAction<T> = {
  label: string;
  variant?: "default" | "outline" | "destructive";
  onClick: (rowData: T) => void;
};

/** Filtre modları */
export type FilterMode = "none" | "global" | "column" | "both";

/** Çoklu sütun sıralama: bir dizi rule */
export type SortingRule<T> = {
  key: keyof T;
  desc: boolean;
};

/** DataTable’ın parent’a yollayacağı durum */
export interface DataTableState<T> {
  finalData: T[];                      // Filtre + sıralama + sayfalama sonrası satırlar
  visibleColumns: DataTableColumn<T>[]; // tabloda gerçekten gösterilen sütunlar
}

/** DataTable props */
export interface DataTableProps<T extends { id: string | number } & Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  actions?: DataTableAction<T>[];

  // Filtre
  filterMode?: FilterMode;
  filterPlaceholder?: string;

  // Sıralama & Sayfalama
  enableSorting?: boolean;
  enablePagination?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];

  // Row key
  rowKey?: keyof T;

  // Row selection
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedIds: Array<string | number>) => void;

  // Parent, tabloda neler olduğunu bilsin diye
  onDataChange?: (state: DataTableState<T>) => void;
}

// ------------------- Yardımcı Fonksiyonlar -------------------
function applyColumnFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: { [key: string]: string }
): T[] {
  return data.filter((row) =>
    Object.entries(filters).every(([colKey, filterVal]) => {
      if (!filterVal) return true;
      const val = row[colKey];
      if (val == null) return false;
      return val.toString().toLowerCase().includes(filterVal.toLowerCase());
    })
  );
}

function applyGlobalFilter<T extends Record<string, unknown>>(
  data: T[],
  visibleColumns: DataTableColumn<T>[],
  globalValue: string
): T[] {
  if (!globalValue) return data;
  const lower = globalValue.toLowerCase();

  // sadece görünür sütunlarda ara
  return data.filter((row) =>
    visibleColumns.some((col) => {
      const val = row[col.key];
      if (val == null) return false;
      return val.toString().toLowerCase().includes(lower);
    })
  );
}

function shallowEqualArrays<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function shallowEqualColumns<T extends Record<string, unknown>>(
  a: DataTableColumn<T>[],
  b: DataTableColumn<T>[]
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].key !== b[i].key) return false;
    if (a[i].visible !== b[i].visible) return false;
  }
  return true;
}

// ------------------- DATA TABLE -------------------
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

  onDataChange,
}: DataTableProps<T>) {
  // Row selection
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  // Filtre state
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Çoklu sütun sıralama
  const [sorting, setSorting] = useState<SortingRule<T>[]>([]);

  // Sayfalama
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // ------------------- ROW SELECTION -------------------
  function toggleRow(row: T) {
    const rowId = row[rowKey] as string | number;
    setSelectedIds((prev) => {
      let newSelected;
      if (prev.includes(rowId)) {
        newSelected = prev.filter((id) => id !== rowId);
      } else {
        newSelected = [...prev, rowId];
      }
      return newSelected;
    });
  }
  useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [onSelectionChange, selectedIds]);
  

  function toggleSelectAllVisible(
    e: React.ChangeEvent<HTMLInputElement>,
    visibleIds: Array<string | number>
  ) {
    if (e.target.checked) {
      const newSelected = Array.from(new Set([...selectedIds, ...visibleIds]));
      setSelectedIds(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      const newSelected = selectedIds.filter((id) => !visibleIds.includes(id));
      setSelectedIds(newSelected);
      onSelectionChange?.(newSelected);
    }
  }

  // ------------------- Sıralama (Header Click) -------------------
  function handleHeaderClick(key: keyof T, e: MouseEvent) {
    if (!enableSorting) return;
    const shift = e.shiftKey;
    setSorting((prev) => {
      let newSort = [...prev];
      if (!shift) {
        // Tek sütun
        if (newSort[0]?.key === key) {
          if (!newSort[0].desc) {
            newSort[0].desc = true; // asc->desc
          } else {
            newSort = [];          // desc->none
          }
        } else {
          newSort = [{ key, desc: false }];
        }
        return newSort;
      }
      // shift -> multi-col
      const idx = newSort.findIndex((r) => r.key === key);
      if (idx === -1) {
        newSort.push({ key, desc: false });
      } else {
        if (!newSort[idx].desc) {
          newSort[idx].desc = true;
        } else {
          newSort.splice(idx, 1);
        }
      }
      return newSort;
    });
  }

  // ------------------- Görünür Sütunlar -------------------
  const visibleColumns = columns.filter((c) => c.visible !== false);

  // ------------------- Filtre / Sıralama / Sayfalama -------------------
  // 1) Column-based filtre
  let filteredData = data;
  if (filterMode === "column" || filterMode === "both") {
    filteredData = applyColumnFilters(filteredData, columnFilters);
  }
  // 2) Global filtre
  if (filterMode === "global" || filterMode === "both") {
    filteredData = applyGlobalFilter(filteredData, visibleColumns, globalFilter);
  }
  // 3) Sıralama
  let sortedData = [...filteredData];
  if (enableSorting && sorting.length > 0) {
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
  // 4) Sayfalama
  let finalData = sortedData;
  let totalPages = 1;
  if (enablePagination) {
    totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    finalData = sortedData.slice(startIndex, startIndex + pageSize);
  }

  // "Select All Visible"
  const visibleIds = finalData.map((row) => row[rowKey] as string | number);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  // ------------------- Parent’a Bildirim (onDataChange) -------------------
  const prevFinalDataRef = useRef<T[]>([]);
  const prevColsRef = useRef<DataTableColumn<T>[]>([]);

  useEffect(() => {
    if (!onDataChange) return;

    const oldData = prevFinalDataRef.current;
    const oldCols = prevColsRef.current;

    const dataChanged = !shallowEqualArrays(oldData, finalData);
    const colsChanged = !shallowEqualColumns(oldCols, visibleColumns);

    if (dataChanged || colsChanged) {
      onDataChange({
        finalData,
        visibleColumns,
      });
      prevFinalDataRef.current = finalData;
      prevColsRef.current = visibleColumns;
    }
  }, [onDataChange, finalData, visibleColumns]);

  // ------------------- RENDER -------------------
  return (
    <div className="bg-white p-4 rounded shadow w-full">
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
        {(filterMode === "column" || filterMode === "both") && (
          <thead>
            <tr>
              {enableRowSelection && <th className="p-2"></th>}
              {visibleColumns.map((col) => (
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
              {actions && actions.length > 0 && <th className="p-2"></th>}
            </tr>
          </thead>
        )}

        <thead className="bg-gray-100">
          <tr>
            {enableRowSelection && (
              <th className="p-2">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(e) => toggleSelectAllVisible(e, visibleIds)}
                />
              </th>
            )}

            {visibleColumns.map((col) => {
              const idx = sorting.findIndex((r) => r.key === col.key);
              const isSorted = idx !== -1;
              let arrow = null;
              if (isSorted) {
                arrow = sorting[idx].desc ? <ArrowDown size={14} /> : <ArrowUp size={14} />;
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
                        ({idx + 1}) {arrow}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
            {actions && actions.length > 0 && (
              <th className="text-left p-2">Actions</th>
            )}
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

                  {visibleColumns.map((col) => (
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
                  visibleColumns.length +
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
              Page {currentPage} of {Math.ceil(sortedData.length / pageSize)}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(sortedData.length / pageSize))
                )
              }
              disabled={currentPage === Math.ceil(sortedData.length / pageSize)}
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
