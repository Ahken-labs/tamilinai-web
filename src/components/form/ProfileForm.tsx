"use client";

import { useEffect, useState } from "react";
import {
    ArrowRightIcon,
    ChevronIcon,
    CloseCircleIcon,
    HeroButtonSideIcon,
    RadioCircleIcon,
} from "../../assets/Icons";
import { useLang } from "../../context/LangContext";
import InputBox from "../common/InputBox";

const PROFILES = ["Myself", "Son", "Daughter", "Brother", "Sister", "Friend"];
const COUNTRIES = ["Sri Lanka (+94)", "India (+91)", "UK (+44)", "Canada (+1)", "Australia (+61)"];

const AUTO_GENDER: Record<string, "Male" | "Female"> = {
    Son: "Male",
    Brother: "Male",
    Daughter: "Female",
    Sister: "Female",
};

type ProfileFormProps = {
    variant?: "hero" | "modal";
    open?: boolean;
    onClose?: () => void;
};

export default function ProfileForm({
    variant = "hero",
    open = true,
    onClose,
}: ProfileFormProps) {
    const { t } = useLang();

    const [mounted, setMounted] = useState(variant === "hero" ? true : open);
    const [animateIn, setAnimateIn] = useState(open);

    const [profileFor, setProfileFor] = useState("");
    const [gender, setGender] = useState<"" | "Male" | "Female">("");
    const [countryCode, setCountryCode] = useState(COUNTRIES[0]);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [profileOpen, setProfileOpen] = useState(false);
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
            setProfileOpen(true);
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
        console.log("success");
    };

    const body = (
        <div className="flex flex-col gap-6 px-4 md:px-6 pb-6 pt-6 md:pt-8">
            {variant === "modal" ? (
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-left text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[1.5] text-[#222222]">
                            {t("Create_your_free_profile")}
                        </h2>
                        <p className="text-[12px] mt-1 md:text-[14px] font-normal leading-[150%] text-[#767676]">
                            Find your life partner - rooted in Tamil values
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 transition hover:opacity-80 cursor-pointer"
                        aria-label="Close"
                    >
                        <CloseCircleIcon className="h-8 w-8" />
                    </button>
                </div>
            ) : (
                <h2 className="text-center text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[1.5] text-[#222222]">
                    {t("Create_your_free_profile")}
                </h2>
            )}
            <DropdownField
                label={profileFor || t("This_profile_is_for")}
                open={profileOpen}
                onToggle={() => setProfileOpen((v) => !v)}
                onSelect={(value) => {
                    setProfileFor(value);
                    setGender(AUTO_GENDER[value] ?? "");
                    setProfileOpen(false);
                    setErrors((prev) => ({ ...prev, gender: undefined }));
                }}
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
                    className="group relative mt-2 flex w-full items-center justify-center py-3 text-[14px] font-semibold text-white transition-all active:scale-[0.99] md:text-[16px]"
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
                    <p className="text-center text-[10px] md:text-[12px] leading-[1.5] text-[#666666]">
                        {t("Takes_2_minutes_Your_data_is_never_shared_without_your_permission")}
                    </p>
                    {variant === "modal" && (
                        <p className="text-center text-[14px] font-normal leading-[150%] text-[#B31B38]">
                            Already registered? {" "}
                            <button type="button" className="text-[#B31B38] underline cursor-pointer select-none">
                                Sign in
                            </button>
                        </p>

                    )}
                </div>
            </div>
        </div>
    );

    if (variant === "hero") {
        // return <div className="w-full rounded-[20px] bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.12)]">{body}</div>;
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
                className={`relative w-full max-w-[420px] overflow-hidden rounded-[20px] bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
            >
                {body}
            </div>
        </div>
    );
}

function DropdownField({
    label,
    open,
    onToggle,
    onSelect,
}: {
    label: string;
    open: boolean;
    onToggle: () => void;
    onSelect: (value: string) => void;
}) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="flex h-[60px] w-full items-center justify-between rounded-xl border border-[#8C8C8C] bg-white px-4 text-left transition-colors focus:border-[#B31B38] focus:outline-none"
            >
                <span className="text-[14px] md:text-[16px] font-normal leading-[125%] text-[#525252]">{label}</span>
                <ChevronIcon open={open} />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                    {PROFILES.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onSelect(item)}
                            className="flex w-full items-center px-4 py-3 text-left text-[15px] text-[#222222] transition-colors hover:bg-[#fdf0f2] hover:text-[#B31B38]"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function CountryCodeSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);

    const getCodeOnly = (val: string) => {
        const match = val.match(/\(\+\d+\)/);
        return match ? match[0] : val;
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex h-[60px] w-full min-[370px]:w-[120px] items-center justify-between  rounded-[12px] border border-[#8C8C8C] bg-white px-4 text-left transition-colors focus:border-[#B31B38] focus:outline-none"
            >
                <span className="text-[14px] md:text-[16px] font-normal leading-[125%] text-[#525252]">
                    {getCodeOnly(value)}
                </span>
                <ChevronIcon open={open} />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                    {COUNTRIES.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => {
                                onChange(item);
                                setOpen(false);
                            }}
                            className="flex w-full items-center px-4 py-3 text-left text-[15px] text-[#222222] transition-colors hover:bg-[#fdf0f2] hover:text-[#B31B38]"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
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