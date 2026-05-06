"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRightIcon,
    CloseCircleIcon,
    HeroButtonSideIcon,
    RadioCircleIcon,
} from "../../assets/Icons";
import { useLang } from "../../context/LangContext";
import InputBox from "../common-layout/InputBox";
import CountryCodeSelect from "../more/CountryCodeSelect";
import { COUNTRIES } from "../../constants/countries";
import DropdownField from "../common-layout/DropdownField";
import Link from "next/link";
import { AUTO_GENDER, PROFILES } from "@/src/constants/profiles";

type RegisterFormProps = {
    variant?: "hero" | "modal";
    open?: boolean;
    onClose?: () => void;
};

export default function RegisterForm({
    variant = "hero",
    open = true,
    onClose,
}: RegisterFormProps) {
    const { t } = useLang();
    const router = useRouter();

    const [mounted, setMounted] = useState(variant === "hero" ? true : open);
    const [animateIn, setAnimateIn] = useState(open);

    const [profileFor, setProfileFor] = useState("");
    const [gender, setGender] = useState<"" | "Male" | "Female">("");
    const [countryCode, setCountryCode] = useState(COUNTRIES[0]);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [activeDropdown, setActiveDropdown] = useState<"" | "profile" | "country">("");

    const [errors, setErrors] = useState<{
        gender?: string;
        name?: string;
        phone?: string;
        email?: string;
    }>({});

    const HERO_BTN_ICON_COLOR =
        "text-[#B31B38] group-hover:text-[#8E162D] group-active:text-[#6F1023] transition-colors duration-150";

    useEffect(() => {
        if (variant === "hero") return;

        if (open) {
            const frame = requestAnimationFrame(() => {
                setMounted(true);
                setAnimateIn(true);
            });
            return () => cancelAnimationFrame(frame);
        }

        const frame = requestAnimationFrame(() => setAnimateIn(false));
        const timer = window.setTimeout(() => setMounted(false), 300);

        return () => {
            cancelAnimationFrame(frame);
            window.clearTimeout(timer);
        };
    }, [open, variant]);

    if (variant === "modal" && !mounted) return null;

    const validate = () => {
        const nextErrors: typeof errors = {};

        if (!profileFor) {
            setActiveDropdown("profile");
            return false;
        }

        if (!gender) nextErrors.gender = "*Gender is Required";
        if (!fullName.trim()) nextErrors.name = "*Name is Required";
        if (!phone.trim()) nextErrors.phone = "*Phone number is required";
        if (!email.trim()) nextErrors.email = "*Email is Required";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        const code = countryCode.match(/\(\+\d+\)/)?.[0] ?? countryCode;
        const params = new URLSearchParams({ phone, countryCode: code, email });
        sessionStorage.setItem("otp_sent_at", String(Date.now()));
        router.push(`/verify-otp?${params.toString()}`);
    };

    const body = (
        <div className="flex flex-col gap-6 px-4 md:px-6 pb-6 pt-6 md:pt-8">
            {variant === "modal" ? (
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-left text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[1.5] text-dark">
                            {t("Create_your_free_profile")}
                        </h2>
                        <p className="text-[12px] mt-1 md:text-[14px] font-normal leading-[150%] text-secondary3">
                            Find your life partner - rooted in Tamil values
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 transition hover:opacity-80 cursor-pointer"
                        aria-label="Close"
                    >
                       <CloseCircleIcon className="h-8 w-8 transition-transform duration-200 hover:scale-110 active:scale-95 " />
                    </button>
                </div>
            ) : (
                <h2 className="text-center text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[1.5] text-dark">
                    {t("Create_your_free_profile")}
                </h2>
            )}

            <DropdownField
                value={profileFor}
                placeholder={t("This_profile_is_for")}
                open={activeDropdown === "profile"}
                setOpen={(val) => setActiveDropdown(val ? "profile" : "")}
                onSelect={(value) => {
                    setProfileFor(value);
                    setGender(AUTO_GENDER[value] ?? "");
                    setErrors((prev) => ({ ...prev, gender: undefined }));
                }}
                items={PROFILES}
                className="h-[55px] md:h-[60px] bg-white"
                borderClassName="border-[#8C8C8C]"
                openBorderClassName="border-[#B31B38]"
                textClassName="text-[#525252]"
                height="290px"
            />

            {profileFor && (
                <>
                    <div className="flex flex-col gap-[2px]">
                        <div className="flex items-center gap-6">
                            <span className="shrink-0 text-[14px] md:text-[16px] font-normal leading-[125%] text-[#222222]">
                                {t("Gender")}
                            </span>

                            <div className="flex items-center gap-6">
                                <GenderOption
                                    label={t("Male")}
                                    checked={gender === "Male"}
                                    onClick={() => {
                                        setGender("Male");
                                        setErrors((prev) => ({ ...prev, gender: undefined }));
                                    }}
                                />

                                <GenderOption
                                    label={t("Female")}
                                    checked={gender === "Female"}
                                    onClick={() => {
                                        setGender("Female");
                                        setErrors((prev) => ({ ...prev, gender: undefined }));
                                    }}
                                />
                            </div>
                        </div>
                        {errors.gender && (
                            <p className="text-[12px] mt-1 text-[#B31B38]">{errors.gender}</p>
                        )}
                    </div>
                </>
            )}
            <InputBox
                value={fullName}
                onChange={setFullName}
                label={t("Name")}
                error={errors.name}
            />
            <div className="grid grid-cols-1 gap-5 min-[370px]:grid-cols-[120px_1fr]">
                <CountryCodeSelect
                    value={countryCode}
                    onChange={setCountryCode}
                    open={activeDropdown === "country"}
                    setOpen={(val) => setActiveDropdown(val ? "country" : "")}
                />
                <InputBox
                    value={phone}
                    onChange={(val) => {
                        setPhone(val);
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    label={t("Phone_number")}
                    type="tel"
                    error={errors.phone}
                />
            </div>

            <InputBox
                value={email}
                onChange={(val) => {
                    setEmail(val);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                label={t("Email")}
                type="email"
                error={errors.email}
            />

            <div className="flex flex-col gap-5">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="group relative mt-2 flex w-full items-center justify-center py-3 text-[14px] font-semibold text-white transition-all active:scale-[0.99] md:text-[16px] cursor-pointer"
                >
                    <div className="absolute left-[28px] right-[28px] top-0 bottom-0 z-0 bg-[#B31B38] transition-colors duration-150 group-hover:bg-[#8E162D] group-active:bg-[#6F1023]" />

                    <HeroButtonSideIcon
                        className={`absolute left-0 top-0 z-10 h-full w-auto ${HERO_BTN_ICON_COLOR}`}
                    />
                    <HeroButtonSideIcon
                        className={`absolute right-0 top-0 z-10 h-full w-auto scale-x-[-1] ${HERO_BTN_ICON_COLOR}`}
                    />

                    <span className="relative z-20 flex select-none items-center gap-2 px-4">
                        {t("Create_my_free_profile")}
                        <ArrowRightIcon />
                    </span>
                </button>
                <div className="flex flex-col gap-2">
                    <p className="text-center text-[10px] md:text-[12px] leading-[1.5] text-secondary1">
                        {t("Takes_2_minutes_Your_data_is_never_shared_without_your_permission")}
                    </p>
                    {variant === "modal" && (
                        <p className="font-poppins text-center text-[12px] md:text-[14px] font-normal leading-[150%] text-primary">
                            Already registered? {" "}
                            <Link
                                href="/login"
                                prefetch
                                className="underline cursor-pointer select-none">
                                Sign in
                            </Link>
                        </p>

                    )}
                </div>
            </div>
        </div>
    );

    if (variant === "hero") {
        return (
            <div className="w-full flex justify-center">
                <div className="w-full max-w-[800px] lg:w-[400px] rounded-[20px] bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.12)]">
                    {body}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 pb-4 sm:items-center sm:pb-0 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
        >
            <button
                type="button"
                aria-label="Close form"
                onClick={onClose}
                className="absolute inset-0 bg-black/60"
            />

            <div
                className={`relative w-full max-w-[420px] md:max-w-[616px] overflow-hidden rounded-[20px] bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
            >
                {body}
            </div>
        </div>
    );
}

function GenderOption({
    label,
    checked,
    onClick,
}: {
    label: string;
    checked: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 text-left"
        >
            <RadioCircleIcon checked={checked} />
            <span className="text-[14px] md:text-[16px] font-normal leading-[125%] text-[#222222]">{label}</span>
        </button>
    );
}