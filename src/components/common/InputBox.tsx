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
}

export default function InputBox({
  value,
  onChange,
  label,
  type = "text",
  error,
  className,
  suffix,
}: InputBoxProps) {
  const [focused, setFocused] = useState(false);

  const isActive = focused || value.length > 0;

  return (
    <div className="flex flex-col">
      <div
        className={`relative flex h-[55px] md:h-[60px] items-center rounded-xl border px-4 transition-colors
        ${focused ? "border-[#B31B38]" : "border-[#8C8C8C]"} ${className ?? ""}`}
      >
        {/* Floating label */}
        <label
          className={`absolute left-4 transition-all duration-300 ease-in-out pointer-events-none select-none
          ${isActive
              ? "top-2 text-[12px] text-[#525252]"
              : "top-1/2 -translate-y-1/2 text-[14px] md:text-[16px] text-[#525252]"
            }`}
        >
          {label}
        </label>

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-[14px] md:text-[16px] text-[#222222] outline-none pt-4"
        />

        {suffix && <div className="shrink-0 ml-2 flex items-center">{suffix}</div>}
      </div>

      {error && <p className="mt-0.5 text-[12px] text-[#B31B38]">{error}</p>}
    </div>
  );
}