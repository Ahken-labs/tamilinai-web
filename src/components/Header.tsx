"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLang } from "../context/LangContext";
import { ChevronIcon, Logo, TamilLanguageIcon } from "../assets/Icons";
import Link from "next/link";

const LANGUAGES = [
  { label: "English", value: "en" as const },
  { label: "தமிழ்", value: "ta" as const },
];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

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


  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] lg:h-[76px] max-w-[1920px] items-center justify-between px-4 lg:px-10 xl:px-[120px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[7.2px] min-[500px]:gap-[8px]">
          <Logo className="max-[500px]:w-8 w-9 lg:w-10 max-[500px]:h-8 h-9 lg:h-10" />
          <span className="min-[360px]:flex hidden font-tamil text-[15.429px] sm:text-[16px] font-semibold leading-[150%] min-[500px]:tracking-[0.7px] text-dark">
            இணை.lk
          </span>
        </Link>

        {/* Desktop right */}
        <div className="hidden items-center lg:flex">
          {!isLoginPage && <span className="font-poppins text-[16px] font-medium text-dark pr-2">
            {t("Already_a_member")}
          </span>}
          {!isLoginPage && <div className="mr-5"><LoginButton className="flex" /> </div>}
          <div className="mr-5 flex"><BusinessLoginButton className="flex" /></div>


          {/* Language selector */}
          <div ref={desktopRef} className="relative">
            <button
              type="button"
              onClick={() => setDesktopOpen(!desktopOpen)}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className=" font-tamil text-[16px] font-medium text-dark">
                {lang === "en" ? "ஆங்கிலம்" : "Tamil"}
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
        <div className="flex items-center gap-2 lg:hidden">
          {!isLoginPage && <LoginButton className="flex lg:hidden" />}
          <BusinessLoginButton className={`flex lg:hidden ${isLoginPage ? "mr-1" : ""}`} />

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
          className={`cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.03] my-0.5 w-full rounded-[8px] px-5 py-2 text-left font-tamil text-[15px] font-medium transition-colors ${lang === l.value
            ? "bg-[#fdf0f2] text-[#B31B38]"
            : "text-dark hover:bg-[#EAEAEA] hover:text-dark"
            }`} >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function BusinessLoginButton({ className = "" }: { className?: string }) {
  const { t } = useLang();
  return (
    <Link
      href="https://business.inai.lk/login"
      className="max-[500px]:py-[5.5px] py-0 transition-transform duration-300 ease-out hover:scale-[1.05]"
    >
      <div className={`sm:h-[32px] cursor-pointer select-none items-center justify-center border border-[#B31B38]
        font-poppins text-[14px] md:text-[16px] font-medium text-[#B31B38] transition-colors duration-150 hover:bg-[#B31B38] hover:text-white
        ${className} py-[5px] sm:py-2 px-2 sm:px-4 rounded-[8px]`}>
        {t("Business")}
      </div>
    </Link>
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
      className="transition-transform duration-300 ease-out hover:scale-[1.06] max-[500px]:py-[5.5px] py-0"
    >
      <div className={`sm:h-[32px] cursor-pointer select-none items-center justify-center bg-[#B31B38] hover:bg-[#8E162D] active:bg-[#6F1023]
        font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#FFFFFF] transition-colors duration-150 
        ${className} py-1.5 sm:py-[9px] px-2 sm:px-4 rounded-[8px]`}>
        {t("Log_In")}
      </div>
    </button>
  );
}