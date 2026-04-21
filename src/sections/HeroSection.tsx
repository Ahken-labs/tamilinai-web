"use client";
import Image from "next/image";
import {
    TrustPrivacyIcon,
    TrustVerifiedIcon,
    FlowerIcon,
    GlobeIcon,
} from "../assets/Icons";
import { useLang } from "../context/LangContext";
import ProfileForm from "../components/form/ProfileForm";

export default function HeroSection() {
    const { t } = useLang();
    const form = <ProfileForm variant="hero" />;

    return (
        <section className="w-full bg-white font-poppins">
            {/* ── Image + content wrapper ── */}
            <div className="mx-3 md:mx-5 lg:mx-10 xl:mx-[40px]">

                {/* ── Image + overlay ── */}
                <div
                    className="relative w-full overflow-hidden rounded-[60px]
            h-[320px] sm:h-[380px] md:h-[420px] lg:h-[850px] select-none"
                >
                    <Image
                        src="/images/hero_image.png"
                        alt="Tamil matrimony couple"
                        fill priority
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 1400px"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(38,2,3,0.9)_0%,rgba(230,39,99,0.3)_50%,#260203_100%)]" />

                    {/* Content inside the overlay — badge + (desktop-only form) + headline */}
                    <div
                        className="absolute inset-0 flex flex-col justify-between"
                        style={{ padding: "40px 40px" }}
                    >
                        {/* Top row: badge left + form right (form hidden on mobile/tablet) */}
                        <div className="flex justify-between items-center h-full">

                            {/* Trust badge */}
                            <div className="flex flex-col justify-between h-full w-full">
                                <TrustBadge />

                                {/* Bottom text */}
                                <div className="mr-2">
                                    <h1 className="mb-2 font-semibold leading-[1.5] text-white
                                                text-[18px] sm:text-[20px] md:text-[26px] lg:text-[32px]">
                                        {t("Find_your_Tamil_life_partner_wherever_in_the_world_you_are")}
                                    </h1>
                                    <p className="text-[12px] leading-[1.5] text-white/85 md:text-[14px] lg:text-[16px]">
                                        {t("Sri_Lankan_Tamil_matrimony_site_trusted_by_families_in_Sri_Lanka_London_Toronto_and_Sydney_verified_profiles")}
                                    </p>
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
            <div className="lg:pt-15 pt-10 px-6">
                <div className="max-w-[1260px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">

                        {/* 1 */}
                        <div className="flex items-center justify-center md:col-span-2 lg:col-span-1">
                            <TrustItem
                                icon={<TrustVerifiedIcon />}
                                text={t("Verified_Profiles")}
                            />
                        </div>

                        {/* 2 */}
                        <div className="flex items-center justify-center">
                            <TrustItem
                                icon={<GlobeIcon className="w-6 h-6 text-[#222222] shrink-0" />}
                                text={t("Global_Tamil_Network")}
                            />
                        </div>

                        {/* 3 */}
                        <div className="flex items-center justify-center">
                            <TrustItem
                                icon={<TrustPrivacyIcon />}
                                text={t("Absolute_Data_Privacy")}
                            />
                        </div>

                    </div>
                </div>
            </div>

        </section>
    );
}

// ─── TrustBadge ───────────────────────────────────────────────────────────────
function TrustBadge() {
    const { t } = useLang();
    return (
        <div className="flex items-center">
            <FlowerIcon className="mr-3 shrink-0 h-[48px] w-[24px] md:h-[72px] md:w-[37px]" />
            <div className="flex flex-col">
                <p className="font-medium leading-[1.5] text-white text-[15px] sm:text-[18px] md:text-[21px] lg:text-[24px] text-center">
                    {t("2026_MOST_TRUSTED")}
                </p>
                <p className="font-medium leading-[1.5] text-white text-[15px] sm:text-[18px] md:text-[21px] lg:text-[24px]">
                    {t("Eelam_Tamil_Matrimony")}
                </p>
            </div>
            <FlowerIcon className="ml-3 shrink-0 scale-x-[-1] h-[48px] w-[24px] md:h-[72px] md:w-[37px]" />
        </div>
    );
}

// ─── TrustItem ────────────────────────────────────────────────────────────────
function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-start justify-center gap-3 text-left md:text-left max-w-[420px] mx-auto">
            <div className="shrink-0">{icon}</div>

            <span className="leading-[1.6] break-words">
                {text}
            </span>
        </div>
    );
}