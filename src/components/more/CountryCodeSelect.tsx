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
  buttonClassName?: string;
};

export default function CountryCodeSelect({ value, onChange, open, setOpen, label, className, buttonClassName }: Props) {
  const [search, setSearch] = useState("");
  const [isWide, setIsWide] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCodeOnly = (val: string) => {
    const match = val.match(/\(\+\d+\)/);
    return match ? match[0] : val;
  };

  const filtered = search.trim()
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setIsWide(entry.contentRect.width >= 260));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch("");
    }
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative flex max-[500px]:h-[52px] h-[55px] md:h-[60px] w-full items-center justify-between rounded-[12px] border px-4 text-left transition-colors focus:outline-none cursor-pointer
          ${buttonClassName ?? "bg-white border-[#8C8C8C]"}`}
      >
        {label ? (
          isWide ? (
            /* wide: label + value stacked, chevron centred on right */
            <>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[12px] font-normal leading-[150%] max-[500px]:tracking-[-0.23px] text-[#747474]">{label}</span>
                <span className="truncate mt-0.5 text-[16px] font-normal leading-[125%] text-[#242424]">{value || getCodeOnly(value)}</span>
              </div>
              <ChevronIcon open={open} />
            </>
          ) : (
            /* narrow: label on top row, code + chevron on bottom row */
            <div className="flex flex-col w-full min-w-0">
              <span className="text-[12px] font-normal leading-[150%] min-[500px]:tracking-[-0.23px] text-[#747474]">{label}</span>
              <div className="mt-0.5 flex items-center justify-between gap-1">
                <span className="text-[16px] font-normal leading-[125%] text-[#242424]">{getCodeOnly(value)}</span>
                <ChevronIcon open={open} />
              </div>
            </div>
          )
        ) : (
          <>
            <span className="text-[16px] font-normal leading-[125%] text-[#525252]">
              {getCodeOnly(value)}
            </span>
            <ChevronIcon open={open} />
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full min-w-[220px] rounded-xl border border-[#E0E0E0] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
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
              <p className="px-4 py-3 text-[14px] text-center text-[#999]">No results</p>
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
                      ${isSelected ? "bg-[#FFF0F3] text-[#B31B38]" : "text-[#222222] hover:bg-[#EAEAEA] hover:text-dark"}`}
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
