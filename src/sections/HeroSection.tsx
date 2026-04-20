"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRightIcon,
  HeroButtonSideIcon,
  TrustPrivacyIcon,
  TrustVerifiedIcon,
  ChevronIcon,
  FlowerIcon,
  GlobeIcon,
} from "../assets/Icons";
import { useLang } from "../context/LangContext";
import InputBox from "../components/common/InputBox";

// ─── Constants ────────────────────────────────────────────────────────────────
const PROFILES = ["Myself", "Son", "Daughter", "Brother", "Sister", "Friend"];
const COUNTRIES = ["Sri Lanka (+94)", "India (+91)", "UK (+44)", "Canada (+1)", "Australia (+61)"];

// ─── Root export ──────────────────────────────────────────────────────────────
export default function HeroSection() {
    const [profileFor, setProfileFor] = useState("");
    const [countryCode, setCountryCode] = useState(COUNTRIES[0]);
    const [profileOpen, setProfileOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const { t } = useLang();

    const form = (
        <FormCard>
            {/* Box 1 — Profile created for */}
            <DropdownField
                label={profileFor || t("This_profile_is_for")}
                open={profileOpen}
                onToggle={() => { setProfileOpen(v => !v); setCountryOpen(false); }}
            >
                {PROFILES.map(item => (
                    <OptionItem
                        key={item}
                        active={profileFor === item}
                        onClick={() => { setProfileFor(item); setProfileOpen(false); }}
                    >
                        {item}
                    </OptionItem>
                ))}
            </DropdownField>

            {/* Full name */}
            <InputBox
                value={fullName}
                onChange={setFullName}
                label={t("Name")}
            />
            {/* Box 3 — Country code */}
            <DropdownField
                open={countryOpen}
                onToggle={() => { setCountryOpen(v => !v); setProfileOpen(false); }}
                label={
                    <span className="flex flex-col">
                        <span className="text-[12px] leading-[1.2] text-[#6C6C6C] mb-0.5">{t("Country_code")}</span>
                        <span className="text-[16px] leading-[1.25] text-[#222222]">{countryCode}</span>
                    </span>
                }
            >
                {COUNTRIES.map(item => (
                    <OptionItem
                        key={item}
                        active={countryCode === item}
                        onClick={() => { setCountryCode(item); setCountryOpen(false); }}
                    >
                        {item}
                    </OptionItem>
                ))}
            </DropdownField>

            {/* Email address */}
            <InputBox
                value={phone}
                onChange={setPhone}
                label={t("Email")}
                type="email"
            />
            {/* CTA */}
            <button
                type="button"
                className="relative mt-2 flex h-[48px] w-full items-center justify-center
    text-[14px] md:text-[16px] font-semibold text-white
    transition hover:opacity-85 active:scale-[0.99] cursor-pointer"
            >
                {/* CENTER BACKGROUND ONLY */}
                <div className="absolute left-[28px] right-[28px] top-0 bottom-0 bg-[#B31B38] z-0" />

     <HeroButtonSideIcon className="absolute left-0 top-0 h-full w-auto z-10" />
<HeroButtonSideIcon className="absolute right-0 top-0 h-full w-auto scale-x-[-1] z-10" />

                {/* TEXT */}
                <span className="relative z-20 flex items-center gap-2 px-4">
                    {t("Continue_for_Free")}
                    <ArrowRightIcon />
                </span>
            </button>
            <p className="text-center text-[12px] leading-[1.5] text-[#666666]">
                {t("Takes_2_minutes_Your_data_is_never_shared_without_your_permission")}
            </p>
        </FormCard>
    );

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

// ─── FormCard wrapper ─────────────────────────────────────────────────────────
function FormCard({ children }: { children: React.ReactNode }) {
    const { t } = useLang();
    return (
        <div className="w-full rounded-[20px] bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.12)]">
            <div className="flex flex-col gap-6 px-4 pb-10 pt-8 md:px-6">
                <h2 className="text-center text-[20px] font-semibold leading-[1.5] text-[#222222]">
                    {t("Create_your_free_profile")}
                </h2>
                {children}
            </div>
        </div>
    );
}

// ─── DropdownField ────────────────────────────────────────────────────────────
function DropdownField({
    label,
    children,
    open,
    onToggle,
}: {
    label: React.ReactNode;
    children: React.ReactNode;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="flex h-[60px] w-full items-center justify-between rounded-xl
          border border-[#8C8C8C] bg-white px-4 text-left
          focus:outline-none focus:border-[#B31B38] transition-colors cursor-pointer"
            >
                <span className="text-[16px] leading-[1.25] text-[#222222]">{label}</span>
                <ChevronIcon open={open} />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30
          overflow-hidden rounded-xl border border-[#E0E0E0] bg-white
          shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                    {children}
                </div>
            )}
        </div>
    );
}

// ─── OptionItem ───────────────────────────────────────────────────────────────
function OptionItem({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-center px-4 py-3 text-left text-[15px] transition-colors
        ${active
                    ? "bg-[#fdf0f2] text-[#B31B38]"
                    : "text-[#222222] hover:bg-[#fdf0f2] hover:text-[#B31B38]"
                }`}
        >
            {children}
        </button>
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