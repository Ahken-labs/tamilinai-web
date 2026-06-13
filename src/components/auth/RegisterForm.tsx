"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScrollLock } from "../../hooks/useScrollLock";
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
import { useLoadingText } from "../../hooks/useLoadingText";
import { register } from "../../lib/api/auth";
import { ApiError } from "../../lib/api/client";
import { sanitizePhoneInput, validatePhone, validateEmail } from "../../utils/validation";
import { useToast } from "../ui/Toast";

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
    const { toast } = useToast();
    useScrollLock(variant === "modal" && open);

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
        emailWarning?: string;
        submit?: string;
    }>({});
    const [loading, setLoading] = useState(false);
    const loadingText = useLoadingText(loading, "register");

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
        const phoneErr = validatePhone(phone, countryCode);
        if (phoneErr) nextErrors.phone = phoneErr;
        const { error: emailErr, warning: emailWarn } = validateEmail(email);
        if (emailErr) nextErrors.email = emailErr;
        if (emailWarn && !errors.emailWarning) nextErrors.emailWarning = emailWarn;

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast({ type: "error", title: "Please fill in all required fields" });
            return;
        }
        const code = countryCode.match(/\+\d+/)?.[0] ?? countryCode;
        setLoading(true);
        setErrors((prev) => ({ ...prev, submit: undefined }));
        try {
            const res = await register({
                profileType: profileFor.toLowerCase(),
                gender: gender.toLowerCase() as "male" | "female",
                name: fullName.trim(),
                phone: phone.trim(),
                countryCode: code,
                email: email.trim(),
                channel: "sms",
            });
            sessionStorage.setItem("inai_reg_key", res.registrationKey);
            sessionStorage.setItem("otp_sms_sent_at", String(Date.now()));
            sessionStorage.setItem("otp_sms_cd", String(res.cooldownSeconds ?? 60));
            sessionStorage.setItem("inai_setup_gender", gender.toLowerCase());
            const params = new URLSearchParams({ phone, countryCode: code, email: email.trim() });
            router.replace(`/verify-otp?${params.toString()}`);
        } catch (err) {
            if (err instanceof ApiError) {
                const msg = err.message.toLowerCase();
                if (msg.includes('email already exists')) {
                    setErrors((prev) => ({ ...prev, email: "*An account with this email already exists. Try logging in." }));
                } else if (msg.includes('phone') && msg.includes('already exists')) {
                    setErrors((prev) => ({ ...prev, phone: "*This number already exists." }));
                } else if (msg.includes('not eligible')) {
                    setErrors((prev) => ({ ...prev, submit: "*This account is not eligible for registration. Please contact support." }));
                } else {
                    setErrors((prev) => ({ ...prev, submit: err.message }));
                }
            } else {
                setErrors((prev) => ({ ...prev, submit: "*Registration failed. Please try again." }));
            }
        } finally {
            setLoading(false);
        }
    };

    const formFields = (
        <>
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
                className="max-[500px]:h-[52px] h-[55px] md:h-[60px] bg-white"
                borderClassName="border-[#8C8C8C]"
                openBorderClassName="border-[#B31B38]"
                textClassName="text-[#525252]"
                height="290px"
            />

            {profileFor && !(profileFor in AUTO_GENDER) && (
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
                        <p className="text-[14px] mt-1 text-[#B31B38]">{errors.gender}</p>
                    )}
                </div>
            )}

            <InputBox
                value={fullName}
                onChange={(val) => {
                    const sanitized = val.replace(/[^a-zA-Z]/g, "");
                    setFullName(sanitized);
                    setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                label={t("Name")}
                error={errors.name}
            />

            <div className="grid grid-cols-1 max-[500px]:gap-4 gap-5 min-[500px]:grid-cols-[120px_1fr]">
                <CountryCodeSelect
                    value={countryCode}
                    onChange={(val) => { setCountryCode(val); setPhone(""); setErrors((prev) => ({ ...prev, phone: undefined })); }}
                    open={activeDropdown === "country"}
                    setOpen={(val) => setActiveDropdown(val ? "country" : "")}
                />
                <InputBox
                    value={phone}
                    onChange={(val) => {
                        const sanitized = sanitizePhoneInput(val, countryCode);
                        setPhone(sanitized);
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    label={t("Phone_number")}
                    type="tel"
                    error={errors.phone}
                />
            </div>

            <div className="flex flex-col gap-1">
                <InputBox
                    value={email}
                    onChange={(val) => {
                        const sanitized = val.toLowerCase().replace(/\s/g, '').replace(/\+[^@]*(?=@)/, '');
                        setEmail(sanitized);
                        const { warning } = validateEmail(sanitized);
                        setErrors((prev) => ({ ...prev, email: undefined, emailWarning: warning ?? undefined }));
                    }}
                    label={t("Email")}
                    type="email"
                    error={errors.email}
                />
                {errors.emailWarning && (
                    <p className="text-[13px] text-primary">*{errors.emailWarning}</p>
                )}
            </div>

            {errors.submit && (
                <p className="text-[14px] text-[#B31B38]">{errors.submit}</p>
            )}

            <div className="flex flex-col gap-5">
                <button
                    type="button"
                    disabled={loading}
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
                        {loading ? loadingText : t("Create_my_free_profile")}
                        {!loading && <ArrowRightIcon />}
                    </span>
                </button>
                <div className="flex flex-col max-[500px]:gap-0 gap-2">
                    <p className="text-center text-[12px] md:text-[14px] leading-[1.5] text-secondary1">
                        {t("Takes_2_minutes_Your_data_is_never_shared_without_your_permission")}
                    </p>
                    {variant === "modal" && (
                        <p className="font-poppins text-center text-[12px] md:text-[14px] font-normal leading-[150%] text-primary">
                            Already registered?{" "}
                            <Link href="/login" prefetch className="underline cursor-pointer select-none">
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </>
    );

    if (variant === "hero") {
        return (
            <div className="w-full flex justify-center">
                <div className="w-full lg:w-[400px] rounded-[20px] bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.12)]">
                    <div className="flex flex-col gap-6 px-4 md:px-6 pb-6 pt-6 md:pt-8 max-w-[640px] mx-auto">
                        <h2 className="text-center text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[1.5] text-dark">
                            {t("Create_your_free_profile")}
                        </h2>
                        {formFields}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-end min-[500px]:items-center justify-center min-[500px]:px-4 min-[500px]:pb-4 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
        >
            <button
                type="button"
                aria-label="Close form"
                onClick={onClose}
                className="absolute inset-0 bg-black/60"
            />

            <div
                className={`relative w-full min-[500px]:max-w-[420px] md:max-w-[616px] rounded-t-[24px] min-[500px]:rounded-[20px] bg-white shadow-[0px_2px_16px_0px_rgba(0,0,0,0.18)] flex flex-col max-h-[85dvh] min-[500px]:max-h-none overflow-hidden transition-all duration-300 ease-out ${animateIn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
            >
                {/* Header — fixed inside the sheet on mobile */}
                <div className="shrink-0 flex items-start justify-between gap-4 px-4 md:px-6 pt-6 pb-3 min-[500px]:pb-0">
                    <div className="flex flex-col">
                        <h2 className="text-left fonts-24 font-semibold leading-[1.5] text-dark">
                            {t("Create_your_free_profile")}
                        </h2>
                        <p className="text-[14px] mt-1 md:text-[16px] font-normal leading-[150%] text-secondary3">
                            Find your life partner — rooted in Tamil values
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 transition hover:opacity-80 cursor-pointer"
                        aria-label="Close"
                    >
                        <CloseCircleIcon className="h-8 w-8 transition-transform duration-200 hover:scale-110 active:scale-95" />
                    </button>
                </div>

                {/* Scrollable form content */}
                <div className="flex-1 overflow-y-auto min-[500px]:overflow-visible min-[500px]:flex-none flex flex-col max-[500px]:gap-4 gap-6 px-4 md:px-6 pb-6 pt-4 min-[500px]:pt-6">
                    {formFields}
                </div>
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