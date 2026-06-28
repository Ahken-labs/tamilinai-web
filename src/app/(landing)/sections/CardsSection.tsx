"use client";

import { useLang } from "@/src/context/LangContext";
import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { CheckmarkIcon, EliteProIcon } from "@/src/assets/Icons";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function CardsSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full font-poppins"
            style={{ background: "linear-gradient(180deg, #FFEBEB 0%, #FFF7F0 100%)" }}
        >
            {/* Cards animate in only once the section enters the viewport */}
            <style>{`
                @keyframes cardSlideIn {
                    from { opacity: 0; transform: translateY(80px); }
                    to   { opacity: 1; transform: translateY(0px); }
                }
                .card-1 { opacity: 0; }
                .card-2 { opacity: 0; }
                .card-3 { opacity: 0; }
                .cards-visible .card-1 {
                    animation: cardSlideIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s both;
                }
                .cards-visible .card-2 {
                    animation: cardSlideIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.70s both;
                }
                .cards-visible .card-3 {
                    animation: cardSlideIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
                }
            `}</style>

            <div className="py-10 sm:py-16 md:py-20 lg:py-25 px-4 sm:px-6 md:px-10 flex flex-col items-center">

                {/* Eyebrow */}
                <p className="text-[#222] text-center text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-normal leading-[150%]">
                    {t("Cards_eyebrow")}
                </p>

                {/* Heading */}
                <h2 className="max-[350px]:px-0 max-[500px]:px-4 px-0 mt-2 sm:mt-3 md:mt-4 lg:mt-5 text-[#222] text-center text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-bold leading-[125%]">
                    {t("Cards_heading_line1")}
                    <br className="hidden min-[500px]:flex"/>
                    {t("Cards_heading_line2")}
                </h2>

                {/* Card fan — landscape 1200x882 cards, fanned from center bottom */}
                <div className={`mt-6 sm:mt-7 md:mt-8 lg:mt-10 relative flex items-center justify-center w-full min-w-[320px] max-w-[1200px] aspect-[1200/882]${visible ? " cards-visible" : ""}`} style={{ overflow: "visible" }}>
                    {/* card3 — back, rotated right */}
                    <div
                        className="card-1 absolute inset-0 flex items-center justify-center"
                        style={{ transform: "rotate(22deg)", transformOrigin: "center bottom", zIndex: 1 }}
                    >
                        <Image
                            src="/images/card3.webp"
                            alt="Wedding invitation card design 3"
                            width={1200}
                            height={882}
                            className="w-full h-auto drop-shadow-lg"
                        />
                    </div>
                    {/* card2 — middle, slight tilt */}
                    <div
                        className="card-2 absolute inset-0 flex items-center justify-center"
                        style={{ transform: "rotate(-5deg)", transformOrigin: "center bottom", zIndex: 2 }}
                    >
                        <Image
                            src="/images/card2.webp"
                            alt="Wedding invitation card design 2"
                            width={1200}
                            height={882}
                            className="w-full h-auto drop-shadow-xl"
                        />
                    </div>
                    {/* card1 — front, rotated left */}
                    <div
                        className="card-3 absolute inset-0 flex items-center justify-center"
                        style={{ transform: "rotate(-22deg)", transformOrigin: "center bottom", zIndex: 3 }}
                    >
                        <Image
                            src="/images/card1.webp"
                            alt="Wedding invitation card design 1"
                            width={1200}
                            height={882}
                            className="w-full h-auto drop-shadow-xl"
                        />
                    </div>
                </div>

                {/* Subtext */}
                <p className="md:-mt-6 lg:-mt-8 text-[#222] text-center text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-normal leading-[150%] max-w-[640px]">
                    {t("Cards_subtext")}
                </p>

                {/* Bullets */}
                <div className="mt-5 flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-[#FFDDDD] rounded-full items-center flex"> <CheckmarkIcon className="text-[#B31B38] w-6 h-4.5" /> </div>
                        
                        <span className="text-[#222] text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-normal leading-[150%]">
                            {t("Cards_bullet1")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-[#FFDDDD] rounded-full items-center flex"> <CheckmarkIcon className="text-[#B31B38] w-6 h-4.5" /> </div>
                        <span className="text-[#222] text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-normal leading-[150%]">
                            {t("Cards_bullet2")}
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-6">
                    <Button
                        text={t("Cards_cta")}
                        onPress={() => setOpenForm(true)}
                    />
                </div>

                {/* Ad Publisher Benefits box */}
                <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 w-full max-w-[640px] rounded-[24px] bg-white max-[500px]:px-2 px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-6">
                    <div className="flex items-center justify-center gap-1">
                        <EliteProIcon className="w-6 h-6" />
                        <span className="text-[#A97216] text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold leading-[150%]">
                            {t("Cards_benefits_title")}
                        </span>
                    </div>
                    <p className="mt-2 text-[#222] text-center text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-normal leading-[150%]">
                        Verified vendors,{" "}
                        <span className="font-semibold">Elite Pro Ad Publishers</span>{" "}
                        get 5% off, and{" "}
                        <span className="font-semibold">Elite VIP Ad Publishers</span>{" "}
                        get 10% off all custom card orders.
                    </p>
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

