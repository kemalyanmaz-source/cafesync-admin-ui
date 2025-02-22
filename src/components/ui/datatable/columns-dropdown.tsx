    "use client";

import React from "react";
import { DataTableColumn } from "./datatable";
// T mesela "User", ama generic olabilir

type Props<T> = {
  columns: DataTableColumn<T>[];
  onChange: (newCols: DataTableColumn<T>[]) => void;
};

export function TableColumnsDropdown<T>({ columns, onChange }: Props<T>) {
  const visibleCount = columns.filter((c) => c.visible !== false).length;

  function toggleColumn(key: keyof T) {
    const col = columns.find((c) => c.key === key);
    if (!col) return;
    const isVisible = col.visible !== false;
    // en az 2 sütun kuralı
    if (isVisible && visibleCount === 2) {
      return;
    }
    const updated = columns.map((c) => 
      c.key === key ? { ...c, visible: !isVisible } : c
    );
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
              onChange={() => toggleColumn(col.key as keyof T)}
            />
            <span>{col.header}</span>
          </label>
        );
      })}
    </div>
  );
}
