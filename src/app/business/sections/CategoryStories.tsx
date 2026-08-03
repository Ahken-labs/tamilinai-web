"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useDragScroll } from "@/src/hooks/useDragScroll";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { BackChevronIcon, ChevronRight } from "@/src/assets/Icons";
import { BIZ_CATEGORIES as CATEGORIES, type BizCategorySlug as CategorySlug } from "@/src/constants/bizCategories";

const STORY_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "all");
const SCROLL_STEP = 340;

interface CategoryStoriesProps {
  onCategoryClick: (slug: CategorySlug) => void;
}

export default function CategoryStories({ onCategoryClick }: CategoryStoriesProps) {
  const ref = useRef<HTMLDivElement>(null);
  useDragScroll(ref);
  const [openRegister, setOpenRegister] = useState(false);

  function scrollByCard(dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
  }

  return (
    <>
      <div className="relative bg-white max-w-[974px] mx-auto">
        {/* Left fade + arrow */}
        <div
          className="pointer-events-none absolute -left-[1px] top-0 bottom-0 w-10 z-10 hidden min-[500px]:block"
          style={{ background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 35%, rgba(255,255,255,0.00) 100%)" }}
        />
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Scroll left"
          className="cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.06] absolute left-[2px] lg:-left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 hidden min-[500px]:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-[25px] cursor-pointer"
        >
          <BackChevronIcon className="w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]" stroke="#fff" strokeWidth={3} />
        </button>

        {/* Scrollable row */}
        <div ref={ref} className="overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-2 px-4 md:px-8 pt-2 sm:pt-4 md:pt-5 lg:pt-6 w-max">

            {/* Start now card */}
            <button
              type="button"
              onClick={() => setOpenRegister(true)}
              className="cursor-pointer relative shrink-0 rounded-[16px] overflow-hidden bg-[#B31B38]"
              style={{ width: "clamp(120px, 11vw, 140px)", aspectRatio: "3/4" }}
            >
              <Image src="/images/Biz/Biz_matrimony.webp" alt="Start now" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-[2px] m-2">
                <span className="font-poppins text-[16px] font-normal leading-[120%] text-white flex-1 text-left">Start now</span>
                <ChevronRight className="w-[14px] h-[14px] shrink-0 text-white" />
              </div>
            </button>

            {/* Category cards */}
            {STORY_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onCategoryClick(cat.slug)}
                className="cursor-pointer relative shrink-0 rounded-[16px] overflow-hidden bg-[#D9D9D9]"
                style={{ width: "clamp(120px, 11vw, 140px)", aspectRatio: "3/4" }}
              >
                {cat.image && (
                  <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-[2px] m-2">
                  <div className="max-w-22 font-poppins text-[16px] font-normal leading-[120%] text-white flex-1 text-left">{cat.label}</div>
                  <ChevronRight className="w-[14px] h-[14px] shrink-0 text-white" />
                </div>
              </button>
            ))}

          </div>
        </div>

        {/* Right fade + arrow */}
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Scroll right"
          className="cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.06] absolute right-[1px] lg:-right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 hidden min-[500px]:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-[25px] cursor-pointer"
        >
          <BackChevronIcon className="w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)] rotate-180" stroke="#fff" strokeWidth={3} />
        </button>
        <div
          className="pointer-events-none absolute -right-[1px] top-0 bottom-0 w-10 z-10 hidden min-[500px]:block"
          style={{ background: "linear-gradient(270deg, #FFFFFF 0%, #FFFFFF 35%, rgba(255,255,255,0.00) 100%)" }}
        />
      </div>

      <RegisterForm variant="modal" open={openRegister} onClose={() => setOpenRegister(false)} />
    </>
  );
}
