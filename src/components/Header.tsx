"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";
import Image from "next/image";
import { ChevronIcon } from "../assets/Icons";
import Link from "next/link";

const LANGUAGES = [
  { label: "ஆங்கிலம்", value: "en" as const },
  { label: "Tamil", value: "ta" as const },
];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.value === lang) ?? LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-5 md:px-10 xl:px-[120px] h-[76px]">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={40}
            height={40}
            className="w-[36px] h-[36px] lg:w-[40px] lg:h-[40px] select-none"
          />
          <span className="font-tamil font-semibold text-[20px] lg:text-[22px] leading-[1.5] tracking-[0.7px] text-[#222222]">
            இணை.com
          </span>
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center">
          <span className="font-poppins font-medium text-[16px] text-[#222222]">
            {t("Already_a_member")}
          </span>

          <Link
            href="/login"
            prefetch
            className="font-poppins cursor-pointer font-medium text-[16px] text-[#B31B38] ml-4 select-none
    rounded border border-[#B31B38] hover:bg-[#B31B38] hover:text-white transition-colors duration-150"
            style={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 24, paddingRight: 24, borderRadius: 8, borderWidth: 1.4 }}
          >
            {t("Log_In")}
          </Link>

          {/* Language selector */}
          <div ref={ref} className="relative ml-11">
            <div onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer select-none">
              <span className="font-tamil font-medium text-[16px] text-[#222222]">
                {currentLang.label}
              </span>
              <ChevronIcon open={open} />
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-[148px] bg-white border border-[#f0e8ea] rounded-lg shadow-lg overflow-hidden z-50">
                {LANGUAGES.map((l) => (
                  <div
                    key={l.value}
                    onClick={() => { setLang(l.value); setOpen(false); }}
                    className={`px-5 py-3 font-tamil text-[15px] font-medium cursor-pointer transition-colors
                      ${lang === l.value ? "text-[#B31B38] bg-[#fdf0f2]" : "text-[#222222] hover:bg-[#fdf0f2] hover:text-[#B31B38]"}`}
                  >
                    {l.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <MobileMenu currentLang={currentLang} lang={lang} setLang={setLang} t={t} />
      </div>
    </header>
  );
}
function MobileMenu({
  currentLang, lang, setLang, t,
}: {
  currentLang: { label: string; value: "en" | "ta" };
  lang: "en" | "ta";
  setLang: (l: "en" | "ta") => void;
  t: (key: keyof typeof import("../assets/translation.json")["en"]) => string;
}) {
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <>
      <button onClick={() => setMenu(!menu)} className="md:hidden flex flex-col justify-center gap-[5px] p-1" aria-label="Toggle menu">
        <span className="block w-6 h-[2px] bg-[#222222] rounded" style={{ transition: "transform 0.2s", transform: menu ? "translateY(7px) rotate(45deg)" : "none" }} />
        <span className="block w-6 h-[2px] bg-[#222222] rounded" style={{ transition: "opacity 0.2s", opacity: menu ? 0 : 1 }} />
        <span className="block w-6 h-[2px] bg-[#222222] rounded" style={{ transition: "transform 0.2s", transform: menu ? "translateY(-7px) rotate(-45deg)" : "none" }} />
      </button>

      {menu && (
        <div className="fixed top-[76px] left-0 right-0 bg-white/98 backdrop-blur-md shadow-lg flex flex-col gap-5 p-6 md:hidden z-50">
          <span className="font-poppins font-medium text-[16px] text-[#222222]">{t("Already_a_member")}</span>

          <Link
            href="/login"
            prefetch
            className="font-poppins font-medium text-[16px] text-[#B31B38] border border-[#B31B38] rounded w-full hover:bg-[#B31B38] hover:text-white transition-colors cursor-pointer text-center"
            style={{ paddingTop: 8, paddingBottom: 8 }}
          >
            {t("Log_In")}
          </Link>
          <div onClick={() => setLangOpen(!langOpen)} className="flex items-center justify-between cursor-pointer select-none">
            <span className="font-tamil font-medium text-[16px] text-[#222222]">{currentLang.label}</span>
            <ChevronIcon open={langOpen} />
          </div>

          {langOpen && (
            <div className="border border-[#f0e8ea] rounded-lg overflow-hidden">
              {LANGUAGES.map((l) => (
                <div key={l.value}
                  onClick={() => { setLang(l.value); setMenu(false); setLangOpen(false); }}
                  className={`px-4 py-3 font-tamil text-[15px] font-medium cursor-pointer transition-colors
                    ${lang === l.value ? "bg-[#fdf0f2] text-[#B31B38]" : "text-[#222222] hover:bg-[#fdf0f2] hover:text-[#B31B38]"}`}
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