"use client";

import { useLang } from "@/src/context/LangContext";
import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { GoogleReviewTag, TrustpilotReviewTag, InaiReviewTag } from "@/src/components/review/ReviewTag";
import { useState } from "react";
import Image from "next/image";
import { useCardCarousel } from "@/src/hooks/useCardCarousel";

const CARDS = [
    {
        image: "/images/advantage1.webp",
        titleKey: "Advantage_title1",
        subtextKey: "Advantage_sub1",
    },
    {
        image: "/images/advantage2.webp",
        titleKey: "Advantage_title2",
        subtextKey: "Advantage_sub2",
    },
    {
        image: "/images/advantage3.webp",
        titleKey: "Advantage_title3",
        subtextKey: "Advantage_sub3",
    },
    {
        image: "/images/advantage4.webp",
        titleKey: "Advantage_title4",
        subtextKey: "Advantage_sub4",
    },
] as const;

export default function AdvantageSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);
    const wrapperRef = useCardCarousel({ cardWidth: 266, cardGap: 16, totalCards: CARDS.length });

    return (
        <section className="w-full bg-[#530024] font-poppins">
            <div className="py-10 sm:py-14 md:py-18 lg:py-23 flex flex-col items-center">

                {/* Heading */}
                <h2 className="px-4 text-white text-center text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-bold leading-[150%]">
                    {t("Advantage_heading")}
                </h2>

                {/* Subtext */}
                <p className="mt-4 px-4 text-white text-center text-[16px] font-normal leading-[150%] max-w-[494px]">
                    {t("Advantage_subtext")}
                </p>

                {/* Review tags */}
                <div className="px-4 mt-6 flex flex-wrap justify-center gap-4 min-h-[88px] sm:min-h-[44px] content-center">
                    <GoogleReviewTag />
                    <TrustpilotReviewTag />
                    <InaiReviewTag />
                </div>

                {/* Desktop (lg+): static 4-in-a-row */}
                <div className="hidden lg:flex mt-12 px-4 lg:px-10 w-full max-w-[1138px] flex-row gap-6 justify-center">
                    {CARDS.map((card) => (
                        <div key={card.titleKey} className="relative flex-1 max-w-[266px] min-w-0 aspect-[266/380] rounded-[24px] overflow-hidden">
                            <Image src={card.image} alt={t(card.titleKey)} fill className="object-cover" />
                            <div className="absolute inset-0" />
                            <div className="absolute inset-0 flex flex-col justify-end items-start gap-2 p-4">
                                <p className="text-white text-[20px] font-semibold leading-[150%]">{t(card.titleKey)}</p>
                                <p className="text-[#E5E7EB] text-[14px] font-normal leading-[150%]">{t(card.subtextKey)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Below lg: seamless auto-scroll carousel — pauses on mouse hover or touch */}
                <div
                    ref={wrapperRef}
                    className="lg:hidden mt-12 w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"

                >
                    <div className="flex flex-row w-max">
                        {[...CARDS, ...CARDS].map((card, idx) => (
                            <div key={idx} className="relative w-[266px] h-[380px] shrink-0 rounded-[24px] overflow-hidden ml-4">
                                <Image src={card.image} alt={t(card.titleKey)} fill className="object-cover" />
                                <div className="absolute inset-0" />
                                <div className="absolute inset-0 flex flex-col justify-end items-start gap-2 p-4">
                                    <p className="text-white text-[20px] font-semibold leading-[150%]">{t(card.titleKey)}</p>
                                    <p className="text-[#E5E7EB] text-[14px] font-normal leading-[150%]">{t(card.subtextKey)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                    <Button
                        text={t("Advantage_cta")}
                        onPress={() => setOpenForm(true)}
                    />
                </div>

            </div>

            <RegisterForm
                variant="modal"
                open={openForm}
                onClose={() => setOpenForm(false)}
            />
        </section>
    );
}
