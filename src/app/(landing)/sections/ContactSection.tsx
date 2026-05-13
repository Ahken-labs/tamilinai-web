"use client";

import Image from "next/image";
import { useLang } from "@/src/context/LangContext";
import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { useState } from "react";

const COUNTRIES = [
    "Sri Lanka",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Switzerland",
    "Norway",
    "Denmark",
    "Netherlands",
    "Italy",
    "UAE",
    "Qatar",
    "Saudi Arabia",
    "Kuwait",
    "Singapore",
    "Malaysia",
    "United States",
    "New Zealand",
    "+ More",
] as const;

export default function ContactSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);

    return (
        <section className="w-full bg-light overflow-hidden font-poppins mt-14 md:mt-16 lg:mt-20">
            <div className="mx-4 sm:mx-6 md:mx-10">
                <h1 className="font-32 font-bold text-dark1 text-center mx-auto max-w-[260px] sm:max-w-[300px] md:max-w-[390px] lg:max-w-[420px]">{t("The_SriLankan_Tamil_diaspora_is_our_home_too")}</h1>
                <p className="mt-2 md:mt-4 lg:mt-6 font-16 text-dark text-center md:max-w-[640px] lg:max-w-[800px] mx-auto">{t("Wherever_life_has_taken_your_family_Inai_connects_you_with_Eelam_Tamil_partners_who_share_your_heritage_across_every_country_every_city_every_timezone")}</p>

                <div className="mt-5 md:mt-6 lg:mt-8 flex flex-wrap justify-center gap-2 mx-auto md:max-w-[640px] lg:max-w-[800px] ">
                    {COUNTRIES.map((country, i) => (
                        <div
                            key={i}
                            className={`rounded-[48px] bg-[#F0F0F0] px-3 py-1
                                font-14 text-dark whitespace-nowrap
                                ${i > 9 && country !== "+ More" ? "hidden lg:block" : ""}`}>
                            {country}
                        </div>
                    ))}
                </div>
                <div className="justify-center flex mt-5 lg:mt-8">
                    <Button
                        text={t("Find_Matches")}
                        onPress={() => setOpenForm(true)}
                    />
                </div>
            </div>



            <div className="mt-14 lg:mt-18 relative px-5 py-5 bg-[linear-gradient(180deg,_#FFEBEB_0%,_#FFF7F0_100%)]">
                {/* ── LEFT PILLAR ── */}
                <div className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 select-none lg:block">
                    <Image
                        src="/images/piller.png"
                        alt=""
                        width={156}
                        height={412}
                        className="w-[156px] h-[412px]"
                        priority
                    />
                </div>

                {/* ── RIGHT PILLAR (MIRRORED) ── */}
                <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 select-none lg:block">
                    <Image
                        src="/images/piller.png"
                        alt=""
                        width={156}
                        height={412}
                        className="w-[156px] h-[412px] scale-x-[-1]"
                        priority
                    />
                </div>

                {/* ── CENTER CONTENT ── */}
                <div className="relative z-10 mx-auto max-w-[640px] text-center">
                    <div className="lg:hidden flex justify-center mb-5">
                        <Image
                            src="/images/piller_mobile.png"
                            alt=""
                            width={320}
                            height={110}
                            className="w-[320px] h-[110px]"
                            priority
                        />
                    </div>
                    <p className="font-16 font-medium text-dark">
                        {t("Our_story")}
                    </p>
                    <h2
                        className="mt-2 font-medium text-dark1 italic text-center leading-[150%] 
                    font-28
                    max-w-[328px] md:max-w-[640px] mx-auto" >
                        <span className="block">"{t("More_than_just_matchmaking")}</span>
                        <span className="block">{t("We_are_your_bridge_to_home")}"</span>

                    </h2>
                    <p className="mt-5 font-16 leading-[150%] text-dark font-normal text-center">
                        {t("vision_parah1")} <br /><br />
                        {t("vision_parah2")}
                    </p>
                    <Button
                        text={t("Begin_your_journey")}
                        className="mt-5"
                        onPress={() => setOpenForm(true)}
                    />
                    <div className="scale-y-[-1] lg:hidden flex justify-center mt-5">
                        <Image
                            src="/images/piller_mobile.png"
                            alt=""
                            width={320}
                            height={110}
                            className="w-[320px] h-[110px]"
                            priority
                        />
                    </div>
                </div>
                <RegisterForm
                    variant="modal"
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                />
            </div>
            <div className="mt-10 lg:mt-18 font-tamil text-dark font-20 mx-auto text-center">
                தமிழால் இணைவதால்,<br />
                தமிழ் மணங்களை இணைப்பதால்,<br />
                இணைகளை இணைப்பதால்,<br />
                நாம் - இணை.lk
            </div>

        </section>
    );
}