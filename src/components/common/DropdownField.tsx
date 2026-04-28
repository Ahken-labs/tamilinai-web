"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "../../assets/Icons";

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
  textClassName?: string;
  typeable?: boolean; // true = input + dropdown
  compact?: boolean;  // 40px height, no floating label — for profile forms
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
  height = "auto",
  borderClassName,
  openBorderClassName,
  textClassName,
  typeable = false,
  compact = false,
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
    if (e.key === "Enter" && items.length > 0) {
      e.preventDefault();
      onSelect(items[0]);
      setOpen(false);
      setFocused(false);
    }
  }

  // Blur: auto-complete when exactly one match remains (unambiguous).
  function handleBlur() {
    setFocused(false);
    if (value && !items.includes(value) && items.length === 1) {
      onSelect(items[0]);
    }
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {typeable ? (
        <div
          className={`flex ${compact ? "h-[40px]" : "h-[55px] md:h-[60px]"} items-center rounded-[12px] border bg-[#F2F2F2] px-4 transition-colors ${borderClass}`}
        >
          {compact ? (
            <>
              <input
                value={value ?? ""}
                placeholder={placeholder}
                onFocus={() => { setFocused(true); setOpen(true); }}
                onBlur={handleBlur}
                onChange={(e) => { onSelect(e.target.value); setOpen(true); }}
                onKeyDown={handleKeyDown}
                className={`w-full min-w-8 bg-transparent font-16 outline-none placeholder:text-[#525252] ${textClassName ?? "text-dark"}`}
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
                className={`absolute left-0 transition-all duration-300 ease-in-out pointer-events-none select-none ${
                  isActive
                    ? "top-[-2px] text-[12px] text-[#525252]"
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
          className={`flex w-full items-center justify-between rounded-[12px] border bg-[#F2F2F2] pl-4 pr-[18px] py-[10px] text-left transition-colors cursor-pointer focus:outline-none ${borderClass} ${className}`}
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
          {items.map((item, index) => {
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
                className={`flex w-full items-center px-4 py-2 md:py-3 text-left text-[13px] md:text-[15px] transition-colors ${
                  isSelected
                    ? "bg-[#FFF0F3] text-[#B31B38]"
                    : isSuggested
                    ? "bg-[#FFF8F9] text-[#222222] font-medium"
                    : "text-[#222222] hover:bg-[#FFF0F3] hover:text-[#B31B38]"
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
