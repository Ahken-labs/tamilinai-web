"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import BizCard from "@/src/components/common-layout/BizCard";
import Link from "next/link";
import { BIZ_CATEGORIES, type BizCategorySlug } from "@/src/constants/bizCategories";
import ListingHeader from "@/src/app/business/sections/ListingHeader";
import type { BizListing } from "@/src/app/business/sections/CategorySection";

// ── Mock data — replace with real API fetch ───────────────────────────────────
const MOCK: BizListing[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  username: `business-${i + 1}`,
  title: i === 0 ? "Green Grass Wedding Halls" : "NSR Wedding Hall",
  location: "Jaffna",
  rating: 4.1,
  image: i === 0 ? "/images/GreenGrassWeddingHalls.webp" : i === 1 ? "/images/NSRWeddingHall.webp" : null,
  featured: i < 2,
}));
// ─────────────────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const category = BIZ_CATEGORIES.find((c) => c.slug === slug && c.slug !== "all" && c.slug !== "more");
  if (!category) notFound();

  function handleCategoryChange(s: BizCategorySlug) {
    if (s === "all") router.push("/business");
    else if (s !== "more") router.push(`/business/category/${s}`);
  }

  return (
    <main className="min-h-screen bg-[#FFF] font-poppins">
      <ListingHeader
        activeCategory={slug as BizCategorySlug}
        onCategoryChange={handleCategoryChange}
        chipsVisible={true}
      />

      <div className="max-w-[976px] mx-auto px-4 pt-6 pb-30">
        <h1 className="font-poppins text-[18px] sm:text-[19px] md:text-[20px] font-semibold text-[#222] mb-4">
          {category.label}
        </h1>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] max-[400px]:gap-x-3 gap-x-4 max-[400px]:gap-y-5 gap-y-6">
          {MOCK.map((biz) => (
            <Link key={biz.id} href={`/business/${biz.username}`}>
              <BizCard
                title={biz.title}
                location={biz.location}
                rating={biz.rating}
                image={biz.image}
                featured={biz.featured}
                className="w-full"
                imageClassName="w-full h-[176px]"
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
