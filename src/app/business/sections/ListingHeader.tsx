"use client";

import { ChevronIcon, Logo, SearchIcon, TamilLanguageIcon } from "@/src/assets/Icons";
import { useLang } from "@/src/context/LangContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiMenuLine } from "react-icons/ri";
import { useDragScroll } from "@/src/hooks/useDragScroll";
import { BIZ_CATEGORIES as CATEGORIES, type BizCategorySlug as CategorySlug } from "@/src/constants/bizCategories";

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

interface ListingHeaderProps {
  activeCategory: CategorySlug;
  onCategoryChange: (slug: CategorySlug) => void;
  chipsVisible: boolean;
}

export default function ListingHeader({ activeCategory, onCategoryChange, chipsVisible }: ListingHeaderProps) {
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  useDragScroll(chipRef);

  // Auto-scroll chip row so active chip is always visible
  useEffect(() => {
    const container = chipRef.current;
    const btn = activeButtonRef.current;
    if (!container || !btn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const scrollLeft = container.scrollLeft + (btnRect.left - containerRect.left) - containerRect.width / 2 + btnRect.width / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [activeCategory]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm">
      {/* Top row: logo + icons */}
      <div className="mx-auto flex h-[54px] lg:h-[76px] max-w-[1920px] items-center justify-between px-4 lg:px-10">
        <Link href="/" className="flex items-center gap-[7.2px] min-[500px]:gap-[8px]">
          <Logo className="max-[500px]:w-8 w-9 lg:w-10 max-[500px]:h-8 h-9 lg:h-10" />
          <span className="min-[390px]:flex hidden font-tamil text-[15.429px] sm:text-[16px] font-semibold leading-[150%] min-[500px]:tracking-[0.7px] text-dark">
            இணை.lk
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search"
            className="transition-transform duration-300 ease-out hover:scale-[1.03] w-10 h-10 hover:rounded-full cursor-pointer flex items-center justify-center hover:bg-[#F5F5F5]">
            <SearchIcon className="w-6 h-6 text-[#525252]" />
          </button>
          <div ref={mobileRef} className="relative">
            <button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle language"
              className="transition-transform duration-300 ease-out hover:scale-[1.03] w-10 h-10 cursor-pointer flex items-center justify-center select-none">
              <TamilLanguageIcon color="#525252" />
            </button>
            <LanguageDropdown open={mobileOpen} lang={lang} setLang={setLang} close={() => setMobileOpen(false)} />
          </div>
          <button type="button" aria-label="Menu"
            className="transition-transform duration-300 ease-out hover:scale-[1.03] cursor-pointer w-10 h-10 flex items-center justify-center hover:rounded-full hover:bg-[#F5F5F5]">
            <RiMenuLine className="text-[#525252] w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chip row — hidden on mobile until stories scroll away */}
      <div ref={chipRef}
        className="overflow-x-auto no-scrollbar transition-all duration-300 min-[500px]:!max-h-[50px] min-[500px]:!opacity-100"
        style={{
          scrollbarWidth: "none",
          maxHeight: chipsVisible ? "30px" : "0px",
          opacity: chipsVisible ? 1 : 0,
          pointerEvents: chipsVisible ? "auto" : "none",
        }}>
        <div className="flex items-center w-max px-4 lg:px-10 gap-[14px] sm:gap-[16px] md:gap-[18px] lg:gap-[20px]">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                ref={isActive ? activeButtonRef : null}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={`
                  cursor-pointer cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.03] shrink-0 whitespace-nowrap
                  max-[500px]:px-0 px-2
                  pt-[2px] pb-1 sm:pb-1.5 md:pb-2
                  min-h-[26px] max-h-[30px]
                  font-poppins font-16 font-normal leading-[125%] tracking-[-0.2px]
                  transition-colors duration-200
                  ${isActive
                    ? "text-[#B31B38] border-b-2 border-[#B31B38]"
                    : "text-[#222] border-b-2 border-transparent"
                  }
                `}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
