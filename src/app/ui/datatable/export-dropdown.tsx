"use client";

import React from "react";
import { DataTableColumn } from "./datatable";

type Props<T> = {
  allColumns: DataTableColumn<T>[];
  exportCols: Record<keyof T, boolean>;
  onChange: (x: Record<keyof T, boolean>) => void;
  onExport: () => void;
};

export function ExportColumnsDropdown<T>({
  allColumns,
  exportCols,
  onChange,
  onExport,
}: Props<T>) {
  return (
    <div>
      <h4 className="font-bold mb-1">Export Columns</h4>
      {allColumns.map((col) => {
        const isSelected = exportCols[col.key as keyof T] ?? false;
        return (
          <label key={col.key.toString()} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {
                const copy = { ...exportCols };
                copy[col.key as keyof T] = !isSelected;
                onChange(copy);
              }}
            />
            <span>{col.header}</span>
          </label>
        );
      })}

      <button className="border px-2 py-1 rounded text-sm mt-2" onClick={onExport}>
        Export CSV
      </button>
    </div>
  );
}
