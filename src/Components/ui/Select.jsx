import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const SelectContext = createContext(null);

function useSelect() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used inside <Select>"
  );
  return ctx;
}

export function Select({ children, defaultValue = null, onChange }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemsRef = useRef([]);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (open) {
      // when opening, reset active index to currently-selected or first
      const idx = itemsRef.current.findIndex((it) => it?.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [open]);

  useEffect(() => {
    if (typeof onChange === "function") onChange(value);
  }, [value]);

  const registerItem = (el, item) => {
    // ensure unique list
    const idx = itemsRef.current.findIndex((i) => i?.value === item.value);
    if (idx === -1) itemsRef.current.push({ el, ...item });
    else itemsRef.current[idx] = { el, ...item };
  };

  const unregisterItem = (val) => {
    itemsRef.current = itemsRef.current.filter((it) => it.value !== val);
  };

  const selectItemByIndex = (idx) => {
    const it = itemsRef.current[idx];
    if (!it) return;
    setValue(it.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const valueLabel = () => {
    const it = itemsRef.current.find((i) => i.value === value);
    return it?.label ?? null;
  };

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value,
        setValue,
        activeIndex,
        setActiveIndex,
        registerItem,
        unregisterItem,
        selectItemByIndex,
        itemsRef,
        triggerRef,
        valueLabel,
      }}
    >
      <div className="relative inline-block" data-select>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = "", ...props }) {
  const { open, setOpen, triggerRef, valueLabel } = useSelect();
  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      ref={triggerRef}
      className={`flex items-center justify-between gap-2 px-3 py-2 border rounded-lg shadow-sm min-w-[180px] ${className}`}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4 opacity-70"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder = "Select...", className = "" }) {
  const { valueLabel, value } = useSelect();
  return (
    <span className={`truncate ${className}`}>
      {value ? valueLabel() : <span className="text-sm text-muted-foreground">{placeholder}</span>}
    </span>
  );
}

export function SelectContent({ children, className = "", maxHeight = 220 }) {
  const {
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    itemsRef,
    selectItemByIndex,
    setValue,
    triggerRef,
  } = useSelect();
  const contentRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, itemsRef.current.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        selectItemByIndex(activeIndex);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, activeIndex]);

  useEffect(() => {
    if (open) {
      // ensure active item is scrolled into view
      const node = itemsRef.current[activeIndex]?.el;
      if (node && contentRef.current) {
        const nodeTop = node.offsetTop;
        const nodeBottom = nodeTop + node.offsetHeight;
        const viewTop = contentRef.current.scrollTop;
        const viewBottom = viewTop + contentRef.current.clientHeight;
        if (nodeTop < viewTop) contentRef.current.scrollTop = nodeTop;
        else if (nodeBottom > viewBottom) contentRef.current.scrollTop = nodeBottom - contentRef.current.clientHeight;
      }
    }
  }, [activeIndex, open]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="listbox"
      tabIndex={-1}
      className={`absolute z-50 mt-2 w-full max-w-xs rounded-lg border bg-white shadow-lg overflow-auto py-1 ${className}`}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className = "" }) {
  const { registerItem, unregisterItem, activeIndex, setActiveIndex, itemsRef, setValue } = useSelect();
  const ref = useRef(null);

  useEffect(() => {
    registerItem(ref.current, { value, label: typeof children === "string" ? children : null });
    return () => unregisterItem(value);
  }, [value]);

  const idx = itemsRef.current.findIndex((i) => i.value === value);
  const isActive = idx === activeIndex;

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isActive}
      onMouseEnter={() => setActiveIndex(idx)}
      onClick={() => setValue(value)}
      className={`px-3 py-2 cursor-pointer hover:bg-slate-100 ${isActive ? "bg-slate-100" : ""} ${className}`}
      data-value={value}
    >
      {children}
    </div>
  );
}

export default Select;

