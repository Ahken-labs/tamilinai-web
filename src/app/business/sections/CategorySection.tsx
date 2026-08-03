"use client";

import Link from "next/link";
import { useRef } from "react";
import { useDragScroll } from "@/src/hooks/useDragScroll";
import BizCard from "@/src/components/common-layout/BizCard";
import { BackChevronIcon, ChevronRight, ChevronRightIcon } from "@/src/assets/Icons";
import type { BizCategorySlug as CategorySlug } from "@/src/constants/bizCategories";

export interface BizListing {
  id: string;
  username: string;
  title: string;
  location: string;
  rating: number;
  image: string | null;
  featured: boolean;
}

interface CategorySectionProps {
  title: string;
  slug: CategorySlug;
  items: BizListing[];
}

export default function CategorySection({ title, slug, items }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragScroll(scrollRef);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  }

  return (
    <section id={`section-${slug}`} className="w-full">
      {/* Section heading */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="font-poppins text-[18px] md:text-[20px] font-semibold text-[#222]">{title}</h2>
        <Link
          href={`/business/category/${slug}`}
          className="hover:bg-[#ccc] min-[500px]:pl-3 pr-2 pl-2 py-1 rounded-full bg-[#F2F2F2] flex items-center gap-1.5"
        >
          <span className="font-poppins text-[16px] text-[#222] flex max-[500px]:hidden">See all</span>
          <ChevronRight className="w-[14px] h-[14px] shrink-0" stroke="#222" />
        </Link>
      </div>

      {/* Scrollable cards row */}
      <div className="relative">
        {/* Left fade + arrow */}
        <div
          className="pointer-events-none absolute -left-[1px] top-0 bottom-0 w-10 z-10 hidden min-[500px]:block"
          style={{ background: "linear-gradient(90deg, #ffffff 0%, #ffffff 35%, rgba(255,255,255,0.00) 100%)" }}
        />
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.06] absolute left-[2px] lg:-left-2 top-[68px] -translate-y-1/2 z-20 p-1.5 hidden min-[500px]:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-[25px]"
        >
          <BackChevronIcon className="w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]" stroke="#fff" strokeWidth={3} />
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-4 px-4 md:px-8">
            {items.map((biz) => (
              <Link key={biz.id} href={`/business/${biz.username}`} className="shrink-0">
                <BizCard
                  title={biz.title}
                  location={biz.location}
                  rating={biz.rating}
                  image={biz.image}
                  featured={biz.featured}
                  className="w-[156px]"
                  imageClassName="w-[156px] h-[156px]"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Right fade + arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.06] absolute right-[1px] lg:-right-2 top-[68px] -translate-y-1/2 z-20 p-1.5 hidden min-[500px]:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-[25px]"
        >
          <BackChevronIcon className="w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)] rotate-180" stroke="#fff" strokeWidth={3} />
        </button>
        <div
          className="pointer-events-none absolute -right-[1px] top-0 bottom-0 w-10 z-10 hidden min-[500px]:block"
          style={{ background: "linear-gradient(270deg, #ffffff 0%, #ffffff 35%, rgba(255,255,255,0.00) 100%)" }}
        />
      </div>
    </section>
  );
}
