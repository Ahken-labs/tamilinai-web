"use client";

import { useLang } from "@/src/context/LangContext";
import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import BizCard from "@/src/components/common-layout/BizCard";
import { useState, useRef } from "react";
import { useDragScroll } from "@/src/hooks/useDragScroll";

const CATEGORIES = [
    "Bridal Makeup", "Bridal Dressing", "Wedding Cakes", "Photography & Video",
    "Nail Art & Salon", "Mehendi & Maruthani", "Wedding Halls", "Groom Grooming",
    "Groom Dressing", "Wedding Decor & Florists", "Jewellery", "Wedding Car Rentals",
    "Wedding Gifts", "Home Decor & Cleaning", "Sweets", "Beverage Supply",
    "Honeymoon Packages", "+ more",
] as const;

interface MockService {
    id: string;
    title: string;
    location: string;
    rating: number;
    type: string;
    image: string | null;
    featured: boolean;
}

const SERVICES: MockService[] = [
    { id: "1",  title: "Green Grass Wedding Halls", location: "29 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: "/images/GreenGrassWeddingHalls.webp", featured: true },
    { id: "2",  title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: "/images/NSRWeddingHall.webp", featured: true },
    { id: "3",  title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "4",  title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "5",  title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "6",  title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "7",  title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "8",  title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "9",  title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "10", title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "11", title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "12", title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "13", title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "14", title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
    { id: "15", title: "NSR Wedding Hall",          location: "16 Stanley Rd, Jaffna", rating: 4.1, type: "Wedding venue", image: null, featured: true },
];

function ChipScroll() {
    const ref = useRef<HTMLDivElement>(null);
    useDragScroll(ref);
    return (
        <div className="md:hidden mt-5 w-full overflow-x-auto no-scrollbar" ref={ref}>
            <div className="flex flex-col gap-3 px-4 w-max">
                {[CATEGORIES.slice(0, 9), CATEGORIES.slice(9)].map((row, ri) => (
                    <div key={ri} className="flex flex-row gap-2">
                        {row.map((cat, i) => (
                            <div key={i} className="rounded-full bg-[#F0F0F0] px-3 py-1 text-[14px] sm:text-[15px] text-[#222] whitespace-nowrap hover:bg-[#E5E5E5] transition-colors">
                                {cat}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MobileScroll() {
    const scrollRef = useRef<HTMLDivElement>(null);
    useDragScroll(scrollRef);
    const [currentIdx, setCurrentIdx] = useState(0);
    const CARD_WIDTH = 192;
    const GAP = 16;

    function handleScroll() {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
            setCurrentIdx(SERVICES.length - 1);
            return;
        }
        const idx = Math.round(scrollLeft / (CARD_WIDTH + GAP));
        setCurrentIdx(Math.min(idx, SERVICES.length - 1));
    }

    function goTo(idx: number) {
        scrollRef.current?.scrollTo({ left: idx * (CARD_WIDTH + GAP), behavior: "smooth" });
        setCurrentIdx(idx);
    }

    return (
        <div className="md:hidden mt-9">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="overflow-x-auto no-scrollbar"
                style={{ scrollbarWidth: "none" }}
            >
                <div className="flex flex-row px-4 w-max" style={{ gap: GAP }}>
                    {SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
                </div>
            </div>

            <div className="sm:mt-10 mt-9 mx-auto w-fit h-[26px] rounded-full px-3 bg-[#F2F2F2] flex items-center gap-3 max-[500px]:gap-2">
                {SERVICES.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to card ${i + 1}`}
                        style={{
                            width: i === currentIdx ? 10 : 8,
                            height: i === currentIdx ? 10 : 8,
                            borderRadius: "50%",
                            background: i === currentIdx ? "#222" : "#B8B8B8",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            flexShrink: 0,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function ServiceCard({ service }: { service: MockService }) {
    return (
        <BizCard
            title={service.title}
            location={service.location}
            rating={service.rating}
            image={service.image}
            featured={service.featured}
            type={service.type}
            className="min-w-[192px] max-w-[192px] min-[500px]:max-w-[244px] w-full"
            imageClassName="w-full min-h-[192px] max-h-[244px] aspect-square"
        />
    );
}

export default function ServicesSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);

    const xlCards = SERVICES.slice(0, 15); // xl: 5×3
    const lgCards = SERVICES.slice(0, 12); // lg: 4×3
    const mdCards = SERVICES.slice(0, 9);  // md: 3×3

    return (
        <section className="w-full bg-white font-poppins py-10 sm:py-14 md:py-18 lg:py-20">
            <div className="md:px-10 flex flex-col items-center">

                {/* Eyebrow */}
                <p className="text-[#222] text-center font-poppins text-[16px] font-normal leading-[150%]">
                    {t("Services_eyebrow")}
                </p>

                {/* Heading */}
                <h2 className="mt-2 text-[#191C1D] text-center text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-bold leading-[135%] max-w-[300px] sm:max-w-[360px] md:max-w-[460px] lg:max-w-[500px]">
                    {t("Services_heading")}
                </h2>

                {/* Category chips — sm+: wrap all */}
                <div className="hidden md:flex md:mt-8 lg:mt-10 flex-wrap justify-center gap-3 max-w-[1400px]">
                    {CATEGORIES.map((cat, i) => (
                        <div key={i} className="rounded-full bg-[#F0F0F0] md:px-4 lg:px-5 py-[7px] text-[16px] text-[#222] whitespace-nowrap cursor-pointer hover:bg-[#E5E5E5] transition-colors">
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Category chips — below md: 2 rows scroll together */}
                <ChipScroll />

                {/* CTA — mobile only */}
                <div className="md:hidden flex mt-7">
                    <Button text={t("Services_cta")} onPress={() => setOpenForm(true)} />
                </div>
            </div>

            {/* xl: 5 cols × 3 rows = 15 cards */}
            <div className="hidden xl:grid mt-20 px-10 grid-cols-5 max-w-[1400px] mx-auto w-full" style={{ gap: "clamp(24px, 2.5vw, 40px)" }}>
                {xlCards.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>

            {/* lg: 4 cols × 3 rows = 12 cards */}
            <div className="hidden lg:grid xl:hidden mt-18 px-10 grid-cols-4 mx-auto w-full" style={{ gap: "clamp(24px, 2.5vw, 40px)", maxWidth: "1108px" }}>
                {lgCards.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>

            {/* md: 3 cols × 3 rows = 9 cards */}
            <div className="hidden md:grid lg:hidden mt-16 px-6 grid-cols-3 mx-auto w-full" style={{ gap: "clamp(24px, 2.5vw, 40px)", maxWidth: "828px" }}>
                {mdCards.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
            

            {/* Cards — mobile: horizontal scroll + dots */}
            <MobileScroll />

            {/* CTA — sm+ below cards */}
            <div className="hidden md:flex justify-center mt-8 lg:mt-10">
                <Button text={t("Services_cta")} onPress={() => setOpenForm(true)} />
            </div>

            <RegisterForm variant="modal" open={openForm} onClose={() => setOpenForm(false)} />
        </section>
    );
}
