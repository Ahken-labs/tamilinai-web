"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "../../constants/countries";
import { ChevronIcon } from "../../assets/Icons";

type Props = {
  value: string;
  onChange: (val: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  label?: string;
  className?: string;
};

export default function CountryCodeSelect({ value, onChange, open, setOpen, label, className }: Props) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const getCodeOnly = (val: string) => {
    const match = val.match(/\(\+\d+\)/);
    return match ? match[0] : val;
  };

  const filtered = search.trim()
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  const isLabelled = !!label;

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-[55px] md:h-[60px] w-full items-center justify-between rounded-[12px] border px-4 text-left transition-colors focus:outline-none cursor-pointer
          ${isLabelled ? "bg-[#F2F2F2] border-[#F2F2F2]" : "bg-white border-[#8C8C8C] focus:border-[#B31B38]"}`}
      >
        {isLabelled ? (
          <div className="flex flex-col gap-[2px] md:gap-[4px]">
            <span className="text-[12px] md:text-[14px] font-normal leading-[125%] text-[#525252]">{label}</span>
            <span className="text-[14px] md:text-[16px] font-medium leading-[125%] text-[#222222]">{getCodeOnly(value)}</span>
          </div>
        ) : (
          <span className="text-[14px] md:text-[16px] font-normal leading-[125%] text-[#525252]">
            {getCodeOnly(value)}
          </span>
        )}
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 rounded-xl border border-[#E0E0E0] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          {/* Search box */}
          <div className="p-2 border-b border-[#F0F0F0]">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 rounded-[8px] bg-[#F0F0F0] text-[13px] md:text-[14px] text-[#222] placeholder:text-[#999] outline-none focus:bg-[#F0F0F0] transition-colors"
            />
          </div>

          {/* List */}
          <div className="max-h-[200px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-[13px] text-[#999]">No results</p>
            ) : (
              filtered.map((item) => {
                const isSelected = item === value;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center px-4 py-2 md:py-3 text-left text-[14px] md:text-[15px] transition-colors
                      ${isSelected ? "bg-[#FFF0F3] text-[#B31B38]" : "text-[#222222] hover:bg-[#FFF0F3] hover:text-[#B31B38]"}`}
                  >
                    {item}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
