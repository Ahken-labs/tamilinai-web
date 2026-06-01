"use client";

import { ChevronRightIcon, DeleteIcon, EliteIcon, PasswordLockIcon, PrivacyPolicyIcon, SleepIcon, TermsIcon } from "@/src/assets/Icons";
import ChangePasswordPopup from "@/src/components/auth/ChangePasswordPopup";
import TermsPopup from "@/src/components/footer/TermsPopup";
import PrivacyPolicy from "@/src/components/more/PrivacySection";
import Link from "next/link";
import { useState } from "react";
import { useScrollHide } from "@/src/hooks/useScrollHide";

type SettingItem = {
    icon: React.ElementType;
    title: string;
    subtitle: string;
};

const SETTINGS: SettingItem[] = [
    {
        icon: PasswordLockIcon,
        title: "Change password",
        subtitle: "Update your password to keep your account secure.",
    },
    {
        icon: EliteIcon,
        title: "Subscription & Billing",
        subtitle: "Manage your plan, payments, and invoices.",
    },
    {
        icon: SleepIcon,
        title: "Take a break",
        subtitle: "Hide your profile temporarily while you take a break from your search.",
    },
    {
        icon: DeleteIcon,
        title: "Close account",
        subtitle: "Permanently remove your profile and all your data.",
    },
    {
        icon: TermsIcon,
        title: "Terms & conditions",
        subtitle: "Guidelines and legal agreements for using Inai.lk.",
    },
];

export default function SettingsPage() {
    const [openPasswordPopup, setOpenPasswordPopup] = useState(false);
    const [openTermsPopup, setOpenTermsPopup] = useState(false);
    const headerVisible = useScrollHide();

    return (
        <div className="pb-6 font-poppins min-h-screen bg-[#F8F5F2]">
            {/* Header */}
            <div className="sticky top-[66px] md:top-[74px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE] transition-transform duration-300" style={!headerVisible ? { transform: "translateY(-128%)" } : undefined}>
                <div className="flex items-center justify-center px-4 py-3">
                    <span className="select-none fonts-24 font-semibold text-dark">
                        Account settings
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pt-8">
                <div className="select-none py-4 md:py-6 mx-auto flex max-w-[910px] flex-col overflow-hidden rounded-[20px] bg-white">
                    {SETTINGS.map(({ icon: Icon, title, subtitle }, index) => {
                        const content = (
                            <div
                                key={title}
                                className={`flex items-center justify-between gap-4 px-4 py-4 md:py-6 
                                    ${index !== SETTINGS.length - 1 ? "border-b border-[#EAEAEA]" : "border-b border-[#EAEAEA]"}
                                    transition-colors duration-150 hover:bg-[#EAEAEA] active:bg-[#EAEAEA] rounded-[4px]`}
                            >
                                {/* Left section */}
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="flex items-center justify-center rounded-[60px] bg-[#F0F0F0] p-4">
                                        <Icon className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-dark" />
                                    </div>

                                    {/* Text */}
                                    <div >
                                        <div className="font-18 font-medium leading-[150%] text-dark">
                                            {title}
                                        </div>
                                        <div className="mt-[4px] md:mt-[6px] font-16 font-normal leading-[150%] text-secondary3">
                                            {subtitle}
                                        </div>
                                    </div>
                                </div>

                                {/* Right icon */}
                                <ChevronRightIcon className="w-5 md:w-6 h-5 md:h-6" />
                            </div>
                        );
                        if (title === "Subscription & Billing") {
                            return (
                                <Link key={title} href="/invoice" className="block">
                                    {content}
                                </Link>
                            );
                        }
                        if (title === "Take a break") {
                            return (
                                <Link key={title} href="/take-a-break" className="block">
                                    {content}
                                </Link>
                            );
                        }
                        if (title === "Close account") {
                            return (
                                <Link key={title} href="/close-account" className="block">
                                    {content}
                                </Link>
                            );
                        }
                        return (
                            <div
                                key={title}
                                onClick={() => {
                                    if (title === "Change password") {
                                        setOpenPasswordPopup(true);
                                    }

                                    if (title === "Terms & conditions") {
                                        setOpenTermsPopup(true);
                                    }
                                }}
                                className="cursor-pointer"
                            >
                                {content}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="my-6 bg-light py-6 md:py-6 rounded-[20px] mx-4 md:mx-auto max-w-[910px]">
                <div className="mb-4 md:mb-6 flex flex-col items-center justify-center">
                    <PrivacyPolicyIcon className="w-6 h-6" />
                    <span className="fonts-24 font-semibold leading-[150%] text-dark">
                        Privacy policy
                    </span>
                </div>
                <PrivacyPolicy />
            </div>
            <ChangePasswordPopup
                isOpen={openPasswordPopup}
                onClose={() => setOpenPasswordPopup(false)}
            />
            <TermsPopup
                isOpen={openTermsPopup}
                onClose={() => setOpenTermsPopup(false)}
            />
        </div>
    );
}