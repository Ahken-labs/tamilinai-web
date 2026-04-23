"use client";

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
  const getCodeOnly = (val: string) => {
    const match = val.match(/\(\+\d+\)/);
    return match ? match[0] : val;
  };

  const isLabelled = !!label;

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-[55px] md:h-[60px] w-full items-center justify-between rounded-[12px] border px-4 text-left transition-colors focus:outline-none cursor-pointer
          ${isLabelled ? "bg-[#F2F2F2] border-[#F2F2F2] " : "bg-white border-[#8C8C8C] focus:border-[#B31B38]"}`}
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
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 max-h-[230px] overflow-y-auto rounded-xl border border-[#E0E0E0] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          {COUNTRIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className="flex w-full items-center px-4 py-3 text-left text-[15px] text-[#222222] transition-colors hover:bg-[#fdf0f2] hover:text-[#B31B38]"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
