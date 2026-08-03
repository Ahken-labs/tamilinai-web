"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ListingHeader from "./ListingHeader";
import CategoryStories from "./CategoryStories";
import BizCardsPromo from "./BizCardsPromo";
import CategorySection, { type BizListing } from "./CategorySection";
import { BIZ_CATEGORIES as CATEGORIES, type BizCategorySlug as CategorySlug } from "@/src/constants/bizCategories";

// ── Mock data — replace with real API fetch ───────────────────────────────────

const MOCK: BizListing[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  username: `business-${i + 1}`,
  title: i === 0 ? "Green Grass Wedding Halls" : "NSR Wedding Hall",
  location: "Jaffna",
  rating: 4.1,
  image: i === 0 ? "/images/GreenGrassWeddingHalls.webp" : i === 1 ? "/images/NSRWeddingHall.webp" : null,
  featured: i < 2,
}));

const SECTION_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "all" && c.slug !== "more");

// ─────────────────────────────────────────────────────────────────────────────

export default function BusinessPage() {
  const [activeCategory, setActiveCategory] = useState<CategorySlug>("all");
  const [chipsVisible, setChipsVisible] = useState(true);
  const storiesRef = useRef<HTMLDivElement>(null);
  const pauseScrollSpy = useRef(false);

  // Mobile only: hide chips initially, show when stories scroll out of view
  useEffect(() => {
    const el = storiesRef.current;
    if (!el) return;
    const isMobile = window.matchMedia("(max-width: 500px)").matches;
    if (!isMobile) return;
    // Hide immediately on mobile before observer fires
    setChipsVisible(false);
    const observer = new IntersectionObserver(
      ([entry]) => setChipsVisible(!entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll spy: on each scroll find which section top is closest above the viewport midpoint
  useEffect(() => {
    const onScroll = () => {
      if (pauseScrollSpy.current) return;
      if (window.scrollY < 80) { setActiveCategory("all"); return; }
      const offset = 54 + 44 + 20; // header + chips + buffer
      let active: CategorySlug = "all";
      for (const cat of SECTION_CATEGORIES) {
        const el = document.getElementById(`section-${cat.slug}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) active = cat.slug;
      }
      setActiveCategory(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCategoryChange = useCallback((slug: CategorySlug) => {
    setActiveCategory(slug);
    if (slug === "all") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (slug === "more") return;
    const el = document.getElementById(`section-${slug}`);
    if (!el) return;
    pauseScrollSpy.current = true;
    const offset = 54 + 44;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setTimeout(() => { pauseScrollSpy.current = false; }, 800);
  }, []);

  return (
    <main className="min-h-screen bg-[#fff] font-poppins pb-40">
      <ListingHeader activeCategory={activeCategory} onCategoryChange={handleCategoryChange} chipsVisible={chipsVisible} />

      <div ref={storiesRef}>
        <CategoryStories onCategoryClick={handleCategoryChange} />
      </div>

      <div className="py-6 sm:py-7 md:py-8 lg:py-10">
        <BizCardsPromo />
      </div>

      <div className="flex flex-col gap-8 md:gap-9 lg:gap-10 max-w-[984px] mx-auto">
        {SECTION_CATEGORIES.map((cat) => (
          <CategorySection key={cat.slug} title={cat.label} slug={cat.slug} items={MOCK} />
        ))}
      </div>
    </main>
  );
}
