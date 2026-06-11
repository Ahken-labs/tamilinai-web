"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronIcon } from "../../assets/Icons";

export type MultiSelectDropdownProps = {
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  showAll?: boolean;
  typeable?: boolean;
  className?: string;
  dropdownClassName?: string;
};

type DropdownFieldProps = {
  value?: string;
  placeholder: string;
  open: boolean;
  setOpen: (val: boolean) => void;
  onSelect: (value: string) => void;
  items: string[];
  className?: string;
  dropdownClassName?: string;
  itemClassName?: string;
  height?: string;
  borderClassName?: string;
  openBorderClassName?: string;
  bgClassName?: string;
  textClassName?: string;
  typeable?: boolean; // true = input + dropdown
  compact?: boolean;  // 40px height, no floating label — for profile forms
  numberOnly?: boolean; // strip non-numeric characters on input
};

export default function DropdownField({
  value,
  placeholder,
  open,
  setOpen,
  onSelect,
  items,
  className = "",
  dropdownClassName = "",
  itemClassName = "",
  height = "h-[40px]",
  borderClassName,
  openBorderClassName,
  bgClassName = "bg-[#F2F2F2]",
  textClassName,
  typeable = false,
  compact = false,
  numberOnly = false,
}: DropdownFieldProps) {
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = focused || open || (value?.length ?? 0) > 0;
  // True when user has typed a partial query that isn't an exact match in the list.
  const isFiltering = !!value && !items.includes(value);

  const borderClass = open
    ? (openBorderClassName ?? borderClassName ?? "border-[#F2F2F2]")
    : (borderClassName ?? "border-[#F2F2F2]");

  // Close when user clicks outside this component.
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, setOpen]);

  // Enter: confirm the first suggestion in the filtered list.
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      onSelect(filteredItems[0]);
      setOpen(false);
      setFocused(false);
    }
  }

  // Blur: auto-complete when exactly one match remains (unambiguous).
  function handleBlur() {
    setFocused(false);
    if (
      value &&
      !filteredItems.includes(value) &&
      filteredItems.length === 1
    ) {
      onSelect(filteredItems[0]);
    }
    setOpen(false);
  }

  const filteredItems = isFiltering
    ? [...items]
      .filter((item) =>
        item.toLowerCase().includes((value ?? "").toLowerCase())
      )
      .sort((a, b) => {
        const q = (value ?? "").toLowerCase();
        const aStarts = a.toLowerCase().startsWith(q);
        const bStarts = b.toLowerCase().startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      })
    : items;
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {typeable ? (
        <div
          className={`flex ${compact ? "h-[40px]" : "h-[55px] md:h-[60px]"} items-center rounded-[12px] border ${bgClassName} px-4 transition-colors ${borderClass}`}
        >
          {compact ? (
            <>
              <input
                value={value ?? ""}
                placeholder={placeholder}
                onFocus={() => { setFocused(true); setOpen(true); }}
                onBlur={handleBlur}
                onChange={(e) => { const v = numberOnly ? e.target.value.replace(/\D/g, "") : e.target.value; onSelect(v); setOpen(true); }}
                onKeyDown={handleKeyDown}
                className={`w-full min-w-8 bg-transparent text-[16px] outline-none placeholder:text-[#525252] ${textClassName ?? "text-dark"}`}
              />
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="shrink-0 cursor-pointer pl-2 focus:outline-none"
              >
                <ChevronIcon open={open} />
              </button>
            </>
          ) : (
            <div className="relative flex w-full items-center">
              <label
                className={`absolute left-0 border transition-all duration-300 ease-in-out pointer-events-none select-none ${isActive
                  ? "top-[-2px] text-[14px] text-[#525252]"
                  : "top-1/2 -translate-y-1/2 text-[14px] md:text-[16px] text-[#525252]"
                  }`}
              >
                {placeholder}
              </label>
              <input
                value={value ?? ""}
                onFocus={() => { setFocused(true); setOpen(true); }}
                onBlur={handleBlur}
                onChange={(e) => { onSelect(e.target.value); setOpen(true); }}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent pt-4 text-[14px] md:text-[16px] outline-none ${textClassName ?? "text-[#222222]"}`}
              />
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="shrink-0 cursor-pointer pl-2 focus:outline-none"
              >
                <ChevronIcon open={open} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex w-full items-center justify-between rounded-[12px] border ${bgClassName} pl-4 pr-[18px] py-[10px] text-left transition-colors cursor-pointer focus:outline-none ${borderClass} ${className}`}
        >
          <span className={`text-[14px] md:text-[16px] font-normal leading-[125%] ${textClassName ?? "text-[#656565]"}`}>
            {value || placeholder}
          </span>
          <ChevronIcon open={open} />
        </button>
      )}

      {open && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className={`absolute left-0 right-0 top-[calc(100%+4px)] z-30 overflow-y-auto rounded-xl border border-[#E0E0E0] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)] ${dropdownClassName}`}
          style={{ maxHeight: height }}
        >
          {filteredItems.length === 0 ? (
            <p className="px-4 py-3 text-[14px] text-center text-[#999]">No results</p>
          ) : filteredItems.map((item, index) => {
            const isSelected = item === value;
            const isSuggested = isFiltering && index === 0;

            return (
              <button
                key={item}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                  setFocused(false);
                }}
                className={`flex w-full items-center px-4 py-2 md:py-3 text-left text-[14px] md:text-[15px] transition-colors ${isSelected
                  ? "bg-[#FFF0F3] text-[#B31B38]"
                  : isSuggested
                    ? "bg-[#FFF8F9] text-[#222222] font-medium"
                    : "text-[#222222] hover:bg-[#EAEAEA] hover:text-[#222222]"
                  } ${itemClassName}`}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MultiSelectDropdown({
  placeholder,
  options,
  selected,
  onChange,
  open,
  setOpen,
  showAll = false,
  typeable = false,
  className = "",
  dropdownClassName = "",
}: MultiSelectDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  function handleClose() {
    setOpen(false);
    setSearch("");
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpen]);

  function toggle(item: string) {
    if (item === "Show all") { onChange([]); handleClose(); return; }
    onChange(selected.includes(item) ? selected.filter((s) => s !== item) : [...selected, item]);
  }

  const listItems = useMemo(() => {
    const base = showAll ? ["Show all", ...options] : options;
    if (!typeable || !search) return base;
    const q = search.toLowerCase();
    return base.filter((item) => item === "Show all" || item.toLowerCase().includes(q));
  }, [showAll, options, search, typeable]);

  return (
    <div ref={containerRef} className={`md:mb-1 relative ${className}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => { if (open) { handleClose(); } else { setOpen(true); } }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { if (open) { handleClose(); } else { setOpen(true); } } }}
        className="flex w-full min-h-[48px] items-start justify-between rounded-[12px] bg-[#F2F2F2] px-4 py-2.5 cursor-pointer gap-2"
      >
        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#222222] text-[14px] md:text-[16px] font-normal">
              {placeholder}
            </span>
          ) : (
            selected.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#222222] text-[14px] md:text-[16px] font-normal"
              >
                {item}
                <button
                  type="button"
                  onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                  onClick={(e) => { e.stopPropagation(); onChange(selected.filter((s) => s !== item)); }}
                  className="cursor-pointer leading-none hover:opacity-70"
                  aria-label={`Remove ${item}`}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        <span className="shrink-0 self-center pt-[3px]">
          <ChevronIcon open={open} />
        </span>
      </div>

      {open && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className={`absolute left-0 right-0 top-[calc(100%+4px)] z-30 rounded-xl border border-[#E0E0E0] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)] ${dropdownClassName}`}
        >
          {typeable && (
            <div className="px-3 pt-2 pb-1">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="Search..."
                className="w-full rounded-[8px] bg-[#F2F2F2] px-3 py-1.5 text-[14px] md:text-[15px] text-dark outline-none placeholder:text-[#525252]"
              />
            </div>
          )}
          <div className={`overflow-y-auto ${typeable ? "max-h-[180px]" : "max-h-[220px]"}`}>
            {listItems.map((item) => {
              const isSelected = item === "Show all" ? selected.length === 0 : selected.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggle(item)}
                  className={`flex w-full items-center px-4 py-2 md:py-3 text-left text-[14px] md:text-[15px] transition-colors ${isSelected ? "bg-[#FFF0F3] text-[#B31B38]" : "text-[#222222] hover:bg-[#EAEAEA] hover:text-[#222222]"
                    }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
