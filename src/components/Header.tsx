"use client";

import { useEffect, useRef, useState } from "react";

const languages = [
  { label: "ஆங்கிலம்", value: "en" },
  { label: "Tamil", value: "ta" },
];

export default function Header() {
  const [selected, setSelected] = useState(languages[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-10 xl:px-[120px] h-[76px]">

        {/* Logo */}
        <span className="font-arima text-2xl font-black text-[#222222] cursor-pointer hover:text-[#B31B38] transition-colors">
          தமிழ் இணை
        </span>

        {/* Desktop right */}
        <div className="hidden md:flex items-center">

          {/* Already a member? */}
          <span className="font-poppins font-medium text-[16px] text-[#222222]">
            Already a member?
          </span>

          {/* Log In — ml-4 = 16px gap */}
          <button
            className="font-poppins cursor-pointer font-medium text-[16px] text-[#B31B38] ml-4 rounded border border-[#B31B38] hover:bg-[#B31B38] hover:text-white transition-colors duration-150"
            style={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 24, paddingRight: 24, borderRadius:8, borderWidth:1.4 }}
          >
            Log In
          </button>

          {/* Language — ml-11 = 44px gap */}
          <div ref={ref} className="relative ml-11">
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="font-tamil font-medium text-[16px] text-[#222222]">
                {selected.label}
              </span>
              <Arrow open={open} />
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-[148px] bg-white border border-[#f0e8ea] rounded-lg shadow-lg overflow-hidden z-50">
                {languages.map((l) => (
                  <div
                    key={l.value}
                    onClick={() => { setSelected(l); setOpen(false); }}
                    className={`px-5 py-3 font-tamil text-[15px] font-medium cursor-pointer transition-colors
                      ${selected.value === l.value
                        ? "text-[#B31B38] bg-[#fdf0f2]"
                        : "text-[#222222] hover:bg-[#fdf0f2] hover:text-[#B31B38]"
                      }`}
                  >
                    {l.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <MobileMenu selected={selected} setSelected={setSelected} />
      </div>
    </header>
  );
}

/* ── Arrow ── */
const Arrow = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{
      transition: "transform 0.2s ease",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      flexShrink: 0,
    }}
  >
    <path
      d="M3.5 6L8 10.5L12.5 6"
      stroke="#222222"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Mobile menu ── */
function MobileMenu({
  selected,
  setSelected,
}: {
  selected: { label: string; value: string };
  setSelected: (l: { label: string; value: string }) => void;
}) {
  const [menu, setMenu] = useState(false);
  const [lang, setLang] = useState(false);

  return (
    <>
      <button
        onClick={() => setMenu(!menu)}
        className="md:hidden flex flex-col justify-center gap-[5px] p-1"
        aria-label="Toggle menu"
      >
        <span
          className="block w-6 h-[2px] bg-[#222222] rounded"
          style={{
            transition: "transform 0.2s",
            transform: menu ? "translateY(7px) rotate(45deg)" : "none",
          }}
        />
        <span
          className="block w-6 h-[2px] bg-[#222222] rounded"
          style={{ transition: "opacity 0.2s", opacity: menu ? 0 : 1 }}
        />
        <span
          className="block w-6 h-[2px] bg-[#222222] rounded"
          style={{
            transition: "transform 0.2s",
            transform: menu ? "translateY(-7px) rotate(-45deg)" : "none",
          }}
        />
      </button>

      {menu && (
        <div className="fixed top-[76px] left-0 right-0 bg-white border-t border-[#f0e8ea] shadow-lg flex flex-col gap-5 p-6 md:hidden z-50">

          <span className="font-poppins font-medium text-[16px] text-[#222222]">
            Already a member?
          </span>

          <button
            className="font-poppins font-medium text-[16px] text-[#B31B38] border border-[#B31B38] rounded w-full hover:bg-[#B31B38] hover:text-white transition-colors"
            style={{ paddingTop: 8, paddingBottom: 8 }}
          >
            Log In
          </button>

          <div
            onClick={() => setLang(!lang)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <span className="font-tamil font-medium text-[16px] text-[#222222]">
              {selected.label}
            </span>
            <Arrow open={lang} />
          </div>

          {lang && (
            <div className="border border-[#f0e8ea] rounded-lg overflow-hidden">
              {languages.map((l) => (
                <div
                  key={l.value}
                  onClick={() => { setSelected(l); setMenu(false); setLang(false); }}
                  className={`px-4 py-3 font-tamil text-[15px] font-medium cursor-pointer transition-colors
                    ${selected.value === l.value
                      ? "bg-[#fdf0f2] text-[#B31B38]"
                      : "text-[#222222] hover:bg-[#fdf0f2] hover:text-[#B31B38]"
                    }`}
                >
                  {l.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}