"use client";

import { ReactNode, useState } from "react";

interface InputBoxProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  type?: string;
  error?: string;
  className?: string;
  suffix?: ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  compact?: boolean; // 40px height, plain placeholder — matches compact DropdownField
}

export default function InputBox({
  value,
  onChange,
  label,
  type = "text",
  error,
  className,
  suffix,
  onFocus,
  onBlur,
  compact = false,
}: InputBoxProps) {
  const [focused, setFocused] = useState(false);

  const isActive = focused || value.length > 0;

  if (compact) {
    return (
      <div className="flex flex-col w-full">
        <div
          className={`flex h-[40px] items-center rounded-[12px] border bg-[#F2F2F2] px-4 transition-colors
            ${focused ? "border-[#F2F2F2]" : "border-[#F2F2F2]"} ${className ?? ""}`}
        >
          <input
            type={type}
            value={value}
            placeholder={label}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => { setFocused(true); onFocus?.(); }}
            onBlur={() => { setFocused(false); onBlur?.(); }}
            className="w-full bg-transparent font-16 outline-none placeholder:text-[#525252] text-dark"
          />
          {suffix && <div className="shrink-0 ml-2 flex items-center">{suffix}</div>}
        </div>
        {error && <p className="mt-2 text-[12px] text-[#B31B38]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        className={`relative flex h-[55px] md:h-[60px] items-center rounded-xl border px-4 transition-colors
          ${focused ? "border-[#B31B38]" : "border-[#8C8C8C]"} ${className ?? ""}`}
      >
        <label
          className={`absolute left-4 transition-all duration-300 ease-in-out pointer-events-none select-none
            ${isActive
              ? "top-2 text-[12px] text-[#525252]"
              : "top-1/2 -translate-y-1/2 text-[14px] md:text-[16px] text-[#525252]"
            }`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setFocused(true); onFocus?.(); }}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          className="w-full bg-transparent text-[14px] md:text-[16px] text-[#222222] outline-none pt-4"
        />
        {suffix && <div className="shrink-0 ml-2 flex items-center">{suffix}</div>}
      </div>
      {error && <p className="mt-0.5 text-[12px] text-[#B31B38]">{error}</p>}
    </div>
  );
}
