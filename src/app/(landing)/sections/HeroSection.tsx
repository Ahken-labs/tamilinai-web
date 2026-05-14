"use client";
import { FlowerIcon, GlobeIcon, TrustPrivacyIcon, TrustVerifiedIcon } from "@/src/assets/Icons";
import RegisterForm from "@/src/components/auth/RegisterForm";
import Button from "@/src/components/common-layout/Button";
import { useLang } from "@/src/context/LangContext";
import Image from "next/image";
import { useState } from "react";


export default function HeroSection() {
    const { t } = useLang();
    const form = <RegisterForm variant="hero" />;
    const [openForm, setOpenForm] = useState(false);

    return (
        <section className="w-full bg-light font-poppins">
            <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-10 xl:mx-[40px]">
                <div className="relative w-full overflow-hidden rounded-[32px] md:rounded-[40px] lg:rounded-[60px]
                h-[513px] md:h-[462px] lg:h-[850px] select-none" >
                    <Image
                        src="/images/hero_image.png"
                        alt="Tamil matrimony couple"
                        fill priority
                        className="object-cover object-[25%_20%] md:object-[30%_100%] lg:object-center md:translate-y-0 translate-y-[-80px]"
                        sizes="(max-width: 1024px) 100vw, 1400px"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(38,2,3,0.9)_0%,rgba(230,39,99,0.3)_50%,#260203_100%)]" />

                    <div className="absolute inset-0 flex flex-col justify-between pt-4 sm:pt-6 lg:pt-10 pb-4 sm:pb-6 lg:pb-10 px-4 sm:px-6 md:px-10">
                        <div className="flex justify-between items-center h-full">
                            {/* Trust badge */}
                            <div className="flex flex-col justify-between items-center lg:items-start h-full w-full">
                                <TrustBadge />
                                <div className="relative mx-auto lg:mx-0 text-center lg:text-left">
                                    {/* background shadow */}
                                    <div className="absolute inset-x-[-24px] md:top-[-32px] top-[-62px] left-[-200px] right-[-200px] bottom-[-24px]
                                                    rounded-[32px] lg:hidden 
                                                    bg-[linear-gradient(180deg,rgba(38,2,3,0)_0%,rgba(38,2,3,0.95)_50%,#260203_100%)]
                                                    blur-[14px] z-0" />
                                    <div className=" max-w-[640px]">

                                        <div className="relative z-10">
                                            <h1 className="font-semibold text-light font-32">
                                                {t("Inai_lk_Sri_Lankan_Tamil_matrimony")}
                                            </h1>

                                            <h1 className="mb-2 font-medium italic text-light font-32">
                                                {t("wherever_you_are")}
                                            </h1>

                                            <p className="lg:text-[16px] text-[14px] leading-[1.5] text-white">
                                                {t("hero_section_parah")}
                                            </p>

                                            <div className="lg:hidden">
                                                <Button className="mt-2 w-full !md:text-[16px] !text-[15px]" text={t("Find_your_matches")}
                                                    onPress={() => setOpenForm(true)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* Form — desktop only, right side */}
                            <div className="hidden lg:block w-[400px] shrink-0">
                                {form}
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Form below image on mobile/tablet only ── */}
                <div className="lg:hidden mt-4 px-0">
                    {form}
                </div>
            </div>

            {/* ── Trust bar ── */}
            <div className="lg:pt-15 lg:pb-15 pt-10 py-8 border-b border-[#D8D8D8]">
                <div className="max-w-[1260px] mx-auto">
                    {/* Desktop */}
                    <div className="hidden lg:grid grid-cols-3 gap-x-10 gap-y-6">
                        <div className="flex items-center justify-center">
                            <TrustItem icon={<TrustVerifiedIcon className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                text={t("Verified_Profiles")} />
                        </div>
                        <div className="flex items-center justify-center">
                            <TrustItem icon={<GlobeIcon  className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                text={t("12_countries")} />
                        </div>
                        <div className="flex items-center justify-center">
                            <TrustItem icon={<TrustPrivacyIcon className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                text={t("Free_to_join")} />
                        </div>
                    </div>

                    {/* Mobile / tablet marquee */}
                    <div className="lg:hidden overflow-hidden">
                        <div className="flex w-max animate-trust-marquee">
                            {/* Track 1 */}
                            <div className="flex items-center gap-[48px] pr-[48px] shrink-0">
                                <TrustItem icon={<TrustVerifiedIcon className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                    text={t("Verified_Profiles")} />
                                <TrustItem icon={<GlobeIcon className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                    text={t("12_countries")} />
                                <TrustItem icon={<TrustPrivacyIcon className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                    text={t("Free_to_join")} />
                            </div>
                            {/* Track 2 */}
                            <div className="flex items-center gap-[48px] pr-[48px] shrink-0">
                                <TrustItem icon={<TrustVerifiedIcon className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                    text={t("Verified_Profiles")} />
                                <TrustItem icon={<GlobeIcon  className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                    text={t("12_countries")} />
                                <TrustItem icon={<TrustPrivacyIcon className="w-4 lg:w-6 h-4 lg:h-6"/>}
                                    text={t("Free_to_join")} />
                            </div>
                        </div>
                    </div>
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

function TrustBadge() {
    const { t } = useLang();
    return (
        <div className="flex justify-center lg:justify-start items-center">
            <FlowerIcon className="mr-2 shrink-0 h-12 w-6 md:h-12 md:w-6" />
            <div className="flex flex-col">
                <p className="font-medium leading-[1.5] text-light lg:text-[18px] md:text-[16px] text-[15px] text-center">
                    {t("Built_exclusively_for")}
                </p>
                <p className="font-medium leading-[1.5] text-light lg:text-[18px] md:text-[16px] text-[15px] text-center">
                    {t("Sri_Lankan_Tamils")}
                </p>
            </div>
            <FlowerIcon className="ml-2 shrink-0 scale-x-[-1] h-12 w-6 md:h-12 md:w-6" />
        </div>
    );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex shrink-0 items-center text-[#767676] lg:text-[#222222] gap-2 lg:gap-3 min-w-max">
            <div className="shrink-0 ">
                {icon}
            </div>
            <span className="leading-none text-[16px] lg:text-[20px] whitespace-nowrap">
                {text}
            </span>
        </div>
    );
}