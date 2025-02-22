"use client";

import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  buttonLabel: string;
  children: React.ReactNode;
}

export function Dropdown({ buttonLabel, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 🔸 Dışarı tıklayınca kapatma
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // e.target, ref.current'in dışındaysa menüyü kapat
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        className="border px-2 py-1 rounded"
        onClick={() => setOpen((prev) => !prev)}
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="absolute left-0 top-full w-48 border bg-white shadow p-2 z-50">
          {children}
        </div>
      )}
    </div>
  );
}
