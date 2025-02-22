"use client";

import React, { useState, useEffect, useRef } from "react";

interface DropdownProps {
  buttonLabel: string;
  children: React.ReactNode;
}

/** Basit Manuel Dropdown */
export function Dropdown({ buttonLabel, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="border px-2 py-1 rounded"
        onClick={() => setOpen((prev) => !prev)}
      >
        {buttonLabel}
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 border bg-white shadow p-2 z-50"
        >
          {children}
        </div>
      )}
    </div>
  );
}
