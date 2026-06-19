"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/common-layout/Button";
import { CheckmarkIcon, EliteCrownIcon, EliteProIcon, EliteVIPIcon, ProfileVisibilityIcon, ResponseIcon, StepPreferencesIcon } from "@/src/assets/Icons";
import { FaWhatsapp } from "react-icons/fa";
import { readMeCache } from "@/src/components/AppHeader";
import { ELITE_PLANS, getPricing, ElitePlan, PlanPricing } from "@/src/constants/elitePlans";
import ReviewSection from "@/src/components/review/ReviewSection";
import ReviewFAQSection from "@/src/components/review/ReviewFAQSection";
import { getPendingBankTransfer } from "@/src/lib/api/billing";

const PLAN_UI = [
    {
        badge: null as null | { text: string; bg: string; color: string },
        btnClass: "!bg-[#725E4C] hover:!bg-[#5c4c3d]",
        Icon: EliteCrownIcon,
        iconFill: "#ffffff",
        shadow: undefined as string | undefined,
    },
    {
        badge: { text: "Most popular", bg: "linear-gradient(90deg, #432D09 0%, #A36805 49.52%, #432D09 100%)", color: "#ffffff" },
        btnClass: "",
        Icon: EliteProIcon,
        iconFill: "#ffffff",
        shadow: "0 0 20px 0 rgba(255,213,170,0.60)",
    },
    {
        badge: { text: "Crown VIP", bg: "linear-gradient(0deg, #FFDED3 0%, #FFDED3 100%)", color: "#222" },
        btnClass: "!bg-[#141514] !text-[#FFCE2D] hover:!bg-[#2a2a2a]",
        Icon: EliteVIPIcon,
        iconFill: "#FFCE2D",
        shadow: undefined as string | undefined,
    },
];

const BENEFITS = [
    { icon: <FaWhatsapp className="h-6 w-6" />, text: "Talk to matches directly" },
    { icon: <StepPreferencesIcon className="h-6 w-6" />, text: "Send unlimited interests" },
    { icon: <ProfileVisibilityIcon className="h-6 w-6" />, text: "Enhanced profile visibility" },
    { icon: <ResponseIcon className="h-6 w-6" />, text: "Get more responses" },
];

function PlanCard({
    plan, pricing, ui, onCheckout, desktop,
}: {
    plan: ElitePlan;
    pricing: PlanPricing;
    ui: typeof PLAN_UI[number];
    onCheckout: () => void;
    desktop?: boolean;
}) {
    return (
        <div
            className={`max-[400px]:px-3 max-[500px]:px-4 px-5 pt-8 pb-6 relative flex-1 flex flex-col rounded-[20px] bg-white${desktop ? " transition-all duration-300 hover:scale-[1.02] active:scale-[1.02] hover:shadow-[0_0_24px_rgba(0,0,0,0.08)]" : ""}`}
            style={{ boxShadow: ui.shadow }}
        >
            {ui.badge && (
                <div className="absolute left-1/2 flex justify-center" style={{ top: 0, transform: "translate(-50%, -50%)" }}>
                    <span className="inline-flex items-center px-3 py-1 rounded-[20px] font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] whitespace-nowrap"
                        style={{ background: ui.badge.bg, color: ui.badge.color }}>
                        {ui.badge.text}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-1 self-start">
                <ui.Icon className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 shrink-0" fill="#A97216" />
                <span className="font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] text-[#A97216]">{plan.label}</span>
            </div>

            <div className="flex items-baseline gap-0 mt-4 sm:mt-4.5 md:mt-5">
                <span className="font-poppins text-[24px] sm:text-[26px] md:text-[28px] font-semibold leading-[100%] text-dark">{pricing.symbol} {pricing.perMonth}</span>
                <span className="font-poppins text-[16px] sm:text-[18px] md:text-[20px] font-normal leading-[100%] text-dark">/month</span>
            </div>

            {plan.tagLine ? (
                <span className="mt-2 italic font-poppins text-[16px] leading-[150%] text-[#8D5900]">{plan.tagLine}</span>
            ) : (
                <div className="h-8" />
            )}

            <div className="flex flex-col w-full mt-6 sm:mt-7 md:mt-8">
                <div className="flex w-full items-center justify-between">
                    <span className="font-poppins text-[16px] font-normal leading-[150%] text-dark">Total cost</span>
                    <span className="font-poppins text-[16px] font-semibold leading-[150%] text-dark">{pricing.symbol} {pricing.total}</span>
                </div>
                <div className="flex w-full items-center justify-between">
                    <span className="font-poppins text-[16px] font-normal leading-[150%] text-dark">Active duration</span>
                    <span className="font-poppins text-[16px] font-semibold leading-[150%] text-dark">{plan.months} months</span>
                </div>
            </div>

            <Button
                text={`Get ${plan.label}`}
                onPress={onCheckout}
                className={`mt-4 w-full md:!px-4 ${ui.btnClass}`}
                iconLeft={<ui.Icon className="w-4 h-4 shrink-0" fill={ui.iconFill} />}
            />

            <div className="flex flex-col gap-3 mt-4 sm:mt-4.5 md:mt-5 flex-1">
                {plan.features.map((f, i) => {
                    const parts = f.split(/\*\*(.+?)\*\*/g);
                    return (
                        <div key={i} className="flex items-center gap-1">
                            <CheckmarkIcon className="h-5 w-5 shrink-0" />
                            <span className="font-poppins text-[14px] font-normal leading-[150%] text-dark">
                                {parts.map((p, j) => j % 2 === 1 ? <span key={j} className="font-semibold">{p}</span> : p)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function EliteUpgradeBody() {
    const router = useRouter();
    const [countryCode] = useState<string | undefined>(() => readMeCache()?.countryCode);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [carouselIdx, setCarouselIdx] = useState(1);

    useEffect(() => {
        scrollToCard(1);
        getPendingBankTransfer().then((pending) => {
            if (pending) router.replace(`/elite-upgrade/checkout?plan=${pending.planKey}`);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function scrollToCard(idx: number) {
        const el = carouselRef.current;
        if (!el) return;
        const card = el.children[idx] as HTMLElement;
        if (!card) return;
        el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
        setCarouselIdx(idx);
    }

    function goToCheckout(planKey: string) {
        router.push(`/elite-upgrade/checkout?plan=${planKey}&autoRenew=true`);
    }

    const pricings = ELITE_PLANS.map((p) => getPricing(p, countryCode));

    return (
        <main className="font-poppins select-none min-h-screen bg-[#F8F5F2] pb-20">
            <div className="mx-auto flex max-w-[1024px] flex-col px-0 min-[860px]:px-4 lg:px-10">
                <div className="justify-center text-center pt-5 sm:pt-7 md:pt-7 lg:pt-10 mx-auto">
                    <h1 className="font-medium text-[20px] sm:text-[24px] text-[#000]">This is One of Life&apos;s Most Precious Decisions.</h1>
                    <p className="text-[#525252] mt-1 text-[14px] sm:text-[15px] md:text-[16px]">Give your journey the time and quality it truly deserves to discover your perfect match.</p>
                </div>

                <div className="mx-auto mt-6 sm:mt-7 md:mt-9 lg:mt-10 w-full">

                    {/* Mobile carousel — below 860px */}
                    <div className="relative min-[860px]:hidden">
                        <button type="button" onClick={() => scrollToCard(Math.max(0, carouselIdx - 1))}
                            className="absolute left-0 top-1/2 z-10" style={{ transform: "translateY(-50%)" }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="18" transform="matrix(-1 0 0 1 36 0)" fill="black" fillOpacity="0.3" />
                                <path d="M21.0938 25.9201L14.5737 19.4001C13.8037 18.6301 13.8037 17.3701 14.5737 16.6001L21.0938 10.0801" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button type="button" onClick={() => scrollToCard(Math.min(2, carouselIdx + 1))}
                            className="absolute right-0 top-1/2 z-10" style={{ transform: "translateY(-50%)" }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="18" fill="black" fillOpacity="0.3" />
                                <path d="M14.9062 10.0801L21.4263 16.6001C22.1963 17.3701 22.1963 18.6301 21.4263 19.4001L14.9062 25.9201" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div ref={carouselRef}
                            onScroll={() => {
                                const el = carouselRef.current;
                                if (!el) return;
                                const cards = Array.from(el.children) as HTMLElement[];
                                let closest = 0, minDist = Infinity;
                                cards.forEach((c, i) => {
                                    const dist = Math.abs(c.offsetLeft - el.scrollLeft - (el.clientWidth - c.clientWidth) / 2);
                                    if (dist < minDist) { minDist = dist; closest = i; }
                                });
                                setCarouselIdx(closest);
                            }}
                            className="flex overflow-x-auto snap-x snap-mandatory px-10"
                            style={{ gap: 16, scrollbarWidth: "none" }}>
                            {ELITE_PLANS.map((plan, i) => (
                                <div key={plan.key} className="flex flex-col flex-shrink-0 snap-center max-[500px]:w-[256px]"
                                    style={{ width: "calc(100% - 80px)", maxWidth: "298.66px", minWidth: "256px" }}>
                                    <div className="h-5" />
                                    <PlanCard plan={plan} pricing={pricings[i]} ui={PLAN_UI[i]} onCheckout={() => goToCheckout(plan.key)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop flex row — 860px and above */}
                    <div className="hidden min-[860px]:flex items-stretch justify-center gap-6">
                        {ELITE_PLANS.map((plan, i) => (
                            <div key={plan.key} className="flex flex-col flex-1" style={{ maxWidth: "298.66px", minWidth: "256px" }}>
                                <div className="h-5" />
                                <PlanCard plan={plan} pricing={pricings[i]} ui={PLAN_UI[i]} onCheckout={() => goToCheckout(plan.key)} desktop />
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <div className="mt-10 sm:mt-12 md:mt-13 lg:mt-14">
                <ReviewSection />
            </div>
            <ReviewFAQSection />

            <div className="mx-auto flex max-w-[1024px] flex-col px-4 lg:px-10">
                <div className="max-[500px]:mt-6 mt-8 sm:mt-10 md:mt-12 lg:mt-14">
                    <h1 className="text-center text-dark font-semibold fonts-24">Why Elite membership?</h1>
                    <div className="mt-4 md:mt-6 grid grid-cols-2 max-[500px]:gap-2 gap-3">
                        {BENEFITS.map((b, i) => (
                            <div key={i} className="bg-light flex justify-center items-start max-[500px]:rounded-[8px] rounded-[20px] max-[500px]:px-2 px-4 md:px-6 py-4 md:py-6">
                                <div className="flex flex-col items-center justify-center text-center">
                                    {b.icon}
                                    <span className="mt-1 font-18 text-dark">{b.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
