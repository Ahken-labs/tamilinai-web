"use client";

import { useRef, useState } from "react";
import { useLang } from "../context/LangContext";
import { ChevronIcon, Logo, TamilLanguageIcon } from "../assets/Icons";

const LANGUAGES = [
  { label: "English", value: "en" as const },
  { label: "தமிழ்", value: "ta" as const },
];

function LanguageDropdown({ open, lang, setLang, close }: {
  open: boolean; lang: "en" | "ta"; setLang: (l: "en" | "ta") => void; close: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute right-0 z-50 mt-2 w-[148px] overflow-hidden rounded-[16px] border border-[#f0e8ea] bg-white p-1 shadow-lg">
      {LANGUAGES.map((l) => (
        <button key={l.value} type="button" onClick={() => { setLang(l.value); close(); }}
          className={`my-0.5 w-full rounded-[8px] px-5 py-2 text-left font-tamil text-[15px] font-medium transition-colors ${lang === l.value ? "bg-[#fdf0f2] text-[#B31B38]" : "text-dark hover:bg-[#EAEAEA]"}`}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default function FocusedHeader() {
  const { lang, setLang } = useLang();
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] lg:h-[76px] max-w-[1920px] items-center justify-between px-4 lg:px-10 xl:px-[120px]">
        {/* Logo — no link, no navigation */}
        <div className="flex items-center gap-[7.2px] min-[500px]:gap-[8px] select-none">
          <Logo className="max-[500px]:w-8 w-9 lg:w-10 max-[500px]:h-8 h-9 lg:h-10" />
          <span className="min-[360px]:flex hidden font-tamil text-[15.429px] sm:text-[16px] font-semibold leading-[150%] min-[500px]:tracking-[0.7px] text-dark">
            இணை.lk
          </span>
        </div>

        {/* Desktop right — language only */}
        <div className="hidden items-center lg:flex">
          <div ref={desktopRef} className="relative">
            <button type="button" onClick={() => setDesktopOpen(!desktopOpen)}
              className="flex items-center gap-2 cursor-pointer select-none">
              <span className="font-tamil text-[16px] font-medium text-dark">
                {lang === "en" ? "ஆங்கிலம்" : "Tamil"}
              </span>
              <ChevronIcon open={desktopOpen} />
            </button>
            <LanguageDropdown open={desktopOpen} lang={lang} setLang={setLang} close={() => setDesktopOpen(false)} />
          </div>
        </div>

        {/* Mobile right — language icon only */}
        <div className="flex items-center gap-2 lg:hidden">
          <div ref={mobileRef} className="relative">
            <button type="button" onClick={() => setMobileOpen(!mobileOpen)}
              className="cursor-pointer flex items-center justify-center rounded-full select-none"
              aria-label="Toggle language">
              <TamilLanguageIcon />
            </button>
            <LanguageDropdown open={mobileOpen} lang={lang} setLang={setLang} close={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}
