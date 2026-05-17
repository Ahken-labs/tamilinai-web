"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../context/LangContext";
import { ChevronIcon, Logo, TamilLanguageIcon } from "../assets/Icons";

const LANGUAGES = [
  { label: "ஆங்கிலம்", value: "en" as const },
  { label: "Tamil", value: "ta" as const },
];

export default function Header() {
  const { lang, setLang, t } = useLang();

  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target as Node)) {
        setDesktopOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.value === lang) ?? LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] lg:h-[76px] max-w-[1920px] items-center justify-between px-4 lg:px-10 xl:px-[120px]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo className="w-9 lg:w-10 h-9 lg:h-10" />
          <span className="font-tamil text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-[1.5] tracking-[0.7px] text-dark">
            இணை.lk
          </span>
        </div>

        {/* Desktop right */}
        <div className="hidden items-center lg:flex">
          <span className="font-poppins text-[16px] font-medium text-dark">
            {t("Already_a_member")}
          </span>
          <LoginButton className="ml-4 hidden lg:flex" />

          {/* Language selector */}
          <div ref={desktopRef} className="relative ml-11">
            <button
              type="button"
              onClick={() => setDesktopOpen(!desktopOpen)}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="font-tamil text-[16px] font-medium text-dark">
                {currentLang.label}
              </span>
              <ChevronIcon open={desktopOpen} />
            </button>

            <LanguageDropdown
              open={desktopOpen}
              lang={lang}
              setLang={setLang}
              close={() => setDesktopOpen(false)}
            />
          </div>
        </div>

        {/* Mobile right: login + language icon */}
        <div className="flex items-center gap-3 md:gap-4 lg:hidden">
          <LoginButton className="flex lg:hidden" />

          <div ref={mobileRef} className="relative">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="cursor-pointer flex items-center justify-center rounded-full select-none"
              aria-label="Toggle language"
            >
              <TamilLanguageIcon />
            </button>

            <LanguageDropdown
              open={mobileOpen}
              lang={lang}
              setLang={setLang}
              close={() => setMobileOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function LanguageDropdown({ open, lang, setLang, close, }: {
  open: boolean; lang: "en" | "ta"; setLang: (l: "en" | "ta") => void;
  close: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute right-0 z-50 mt-2 w-[148px] overflow-hidden rounded-[16px] border border-[#f0e8ea] bg-white p-1 shadow-lg">
      {LANGUAGES.map((l) => (
        <button key={l.value} type="button" onClick={() => {
          setLang(l.value); close();
        }}
          className={`my-0.5 w-full rounded-[8px] px-5 py-2 text-left font-tamil text-[15px] font-medium transition-colors ${lang === l.value
            ? "bg-[#fdf0f2] text-[#B31B38]"
            : "text-dark hover:bg-[#EAEAEA] hover:text-dark"
            }`} >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function LoginButton({ className = "" }: { className?: string }) {
  const { t } = useLang();
  const router = useRouter();

  function handleLogin() {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("tamilinai_access_token")
      : null;
    router.push(token ? "/matches" : "/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className={`cursor-pointer select-none items-center justify-center rounded border border-[#B31B38]
        font-poppins text-[14px] md:text-[16px] font-medium text-[#B31B38] transition-colors duration-150 hover:bg-[#B31B38] hover:text-white
        ${className} py-1 px-4 rounded-[8px] border-[1.4px]`}
    >
      {t("Log_In")}
    </button>
  );
}