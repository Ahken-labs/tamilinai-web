"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../context/LangContext";
import { BackChevronIcon, ChevronIcon, Icon, ShareIcon, TamilLanguageIcon } from "../assets/Icons";
import Link from "next/link";
import ShareModal from "./ui/ShareModal";

const LANGUAGES = [
  { label: "English", value: "en" as const },
  { label: "தமிழ்", value: "ta" as const },
];

export default function BusinessHeader() {
  const { lang, setLang } = useLang();
  const router = useRouter();

  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  function handleShare() {
    setShareOpen(true);
  }

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
    <>
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] lg:h-[76px] max-w-[1920px] items-center justify-between px-4 lg:px-10 xl:px-[120px]">
        {/* Logo */}
        <div className="flex items-center max-[500px]:gap-2 gap-3">
          <Link href="/" className="flex items-center gap-[7.2px] min-[500px]:gap-[8px]">
            <Icon className="max-[500px]:w-10 w-10 lg:w-10 max-[500px]:h-10 h-10 lg:h-10" />
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="h-10 w-10 flex shrink-0 max-[500px]:p-0.5 p-0 cursor-pointer select-none items-center justify-center"
          >
            <div className="rounded-full max-[500px]:p-1.5 p-2 bg-[#F0F0F0]">
              <BackChevronIcon />
            </div>
          </button>
        </div>

        {/* Desktop right */}
        <div className="hidden items-center lg:flex">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="h-10 w-10 flex shrink-0 p-0 cursor-pointer select-none items-center justify-center"
          >
            <div className="rounded-full p-2 bg-[#F0F0F0]">
              <ShareIcon className="w-6 h-6" stroke="#525252" />
            </div>
          </button>
          {/* Language selector */}
          <div ref={desktopRef} className="relative ml-3">
            <button
              type="button"
              onClick={() => setDesktopOpen(!desktopOpen)}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="font-tamil text-[16px] font-medium text-dark">
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

        {/* Mobile right: share + language icon */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="h-10 w-10 flex shrink-0 max-[500px]:p-0.5 p-0 cursor-pointer select-none items-center justify-center"
          >
            <div className="rounded-full max-[500px]:p-1.5 p-2 bg-[#F0F0F0]">
              <ShareIcon className="w-6 h-6" stroke="#525252" />
            </div>
          </button>
          <div ref={mobileRef} className="relative">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-10 w-10 flex shrink-0 max-[500px]:p-0.5 p-0 cursor-pointer select-none items-center justify-center"
              aria-label="Toggle language"
            >
              <div className="rounded-full max-[500px]:p-1.5 p-2 bg-[#F0F0F0]">
                <TamilLanguageIcon />
              </div>
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
    {shareOpen && (
      <ShareModal
        url={typeof window !== "undefined" ? window.location.href : ""}
        title={typeof document !== "undefined" ? document.title : "Check this out on Inai"}
        onClose={() => setShareOpen(false)}
      />
    )}
  </>
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

export function BusinessLoginButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="https://business.inai.lk/login"
      className="max-[500px]:py-[5.5px] py-0"
    >
      <div className={`cursor-pointer select-none items-center justify-center border border-[#B31B38]
        font-poppins text-[14px] md:text-[16px] font-medium text-[#B31B38] transition-colors duration-150 hover:bg-[#B31B38] hover:text-white
        ${className} py-[5px] sm:py-2 px-2 sm:px-4 rounded-[8px]`}>
        Business
      </div>
    </Link>
  );
}

export function LoginButton({ className = "" }: { className?: string }) {
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
      className="max-[500px]:py-[5.5px] py-0"
    >
      <div className={`cursor-pointer select-none items-center justify-center bg-[#B31B38] hover:bg-[#8E162D] active:bg-[#6F1023]
        font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#FFFFFF] transition-colors duration-150 
        ${className} py-1.5 sm:py-2 px-2 sm:px-4 rounded-[8px]`}>
        {t("Log_In")}
      </div>
    </button>
  );
}