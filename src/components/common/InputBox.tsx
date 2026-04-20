"use client";

import { useState } from "react";

interface InputBoxProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  type?: string;
}

export default function InputBox({
  value,
  onChange,
  label,
  type = "text",
}: InputBoxProps) {
  const [focused, setFocused] = useState(false);

  const isActive = focused || value.length > 0;

  return (
    <div
      className={`relative flex h-[60px] items-center rounded-xl border px-4 transition-colors
        ${focused ? "border-[#B31B38]" : "border-[#8C8C8C]"}`}
    >
      {/* Floating label */}
      <label
        className={`absolute left-4 transition-all duration-300 ease-in-out pointer-events-none select-none
          ${
            isActive
              ? "top-2 text-[12px] text-[#6C6C6C]"
              : "top-1/2 -translate-y-1/2 text-[16px] text-[#222222]"
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
        className="w-full bg-transparent text-[16px] text-[#222222] outline-none pt-4"
      />
    </div>
  );
}