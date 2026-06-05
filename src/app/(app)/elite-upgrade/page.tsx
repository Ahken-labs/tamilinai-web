"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/src/components/common-layout/Button";
import { CheckboxIcon, CheckmarkIcon, EliteCrownIcon, ProfileVisibilityIcon, ResponseIcon, StepPreferencesIcon } from "@/src/assets/Icons";
import { GoHeartFill } from "react-icons/go";
import { FaWhatsapp } from "react-icons/fa";
import { readMeCache } from "@/src/components/AppHeader";
import { ELITE_PLANS, getPricing, getSavePct } from "@/src/constants/elitePlans";

const eliteBenefits = [
    { icon: <FaWhatsapp className="h-6 w-6" />, text: "Talk to matches directly", },
    { icon: <StepPreferencesIcon className="h-6 w-6" />, text: "Send unlimited interests", },
    { icon: <ProfileVisibilityIcon className="h-6 w-6" />, text: "Enhanced profile visibility", },
    { icon: <ResponseIcon className="h-6 w-6" />, text: "Get more responses", },
];

export default function EliteUpgradePage() {
    const router = useRouter();
    // Defer localStorage read to after mount to avoid SSR/client hydration mismatch
    const [countryCode, setCountryCode] = useState<string | undefined>(undefined);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setCountryCode(readMeCache()?.countryCode); }, []);

    const [agreed, setAgreed] = useState({
        basic: true,
        pro: true,
        max: true,
    });

    const [basic, pro, max] = ELITE_PLANS;
    const basicPricing = getPricing(basic, countryCode);
    const proPricing   = getPricing(pro,   countryCode);
    const maxPricing   = getPricing(max,   countryCode);

    function goToCheckout(planKey: string) {
        const autoRenew = agreed[planKey as keyof typeof agreed] ?? true;
        router.push(`/elite-upgrade/checkout?plan=${planKey}&autoRenew=${autoRenew}`);
    }

    return (
        <main className="font-poppins select-none min-h-screen bg-[#F8F5F2] pb-20">
            <div className="mx-auto flex max-w-[1024px] flex-col px-4 pb-4 pt-[27px] lg:px-10">
                <div className="flex justify-center">
                    <Image src="/icons/elite_Badge.png" alt="elite" width={42} height={40} />
                </div>

                <div className="mx-auto mt-4 md:mt-5 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start lg:gap-[26px] md:gap-5 gap-5">
                        {/* Box 1 — Elite basic */}
                        <div className="sm:col-span-2 md:col-span-1 sm:max-w-[486px] sm:mx-auto lg:max-w-full lg:mx-0 w-full rounded-[20px] bg-white px-4 md:px-5 py-4 md:py-6 lg:mt-10 flex flex-col items-start gap-4 md:gap-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                                <EliteCrownIcon className="h-4 md:h-5 w-4 md:w-5 shrink-0 text-[#A97216]" />
                                <span className="font-poppins font-16 font-normal leading-[150%] text-[#A97216]">
                                    {basic.label}
                                </span>
                            </div>

                            <div className="flex items-start gap-1">
                                <span className="font-poppins font-28 font-medium leading-[100%] text-dark">
                                    {basicPricing.symbol} {basicPricing.perMonth}
                                </span>
                                <span className="font-poppins font-16 font-normal leading-[100%] text-dark">
                                    /month
                                </span>
                            </div>

                            <div className="flex-col w-full">
                                <div className="flex w-full items-center justify-between">
                                    <span className="font-poppins font-16 font-normal leading-[150%] text-dark">Total cost</span>
                                    <span className="font-poppins font-16 font-semibold leading-[150%] text-dark">
                                        {basicPricing.symbol} {basicPricing.total}
                                    </span>
                                </div>
                                <div className="flex w-full items-center justify-between">
                                    <span className="font-poppins font-16 font-normal leading-[150%] text-dark">Duration</span>
                                    <span className="font-poppins font-16 font-semibold leading-[150%] text-dark">
                                        {basic.months} months
                                    </span>
                                </div>
                            </div>

                            <Button text={`Get ${basic.label}`} iconLeft={<GoHeartFill className="w-3 md:w-4 h-3 md:h-4" />} className="w-full" onPress={() => goToCheckout(basic.key)} />

                            <div className="flex md:items-start items-center gap-2 text-left">
                                <CheckboxIcon
                                    className="w-6 h-6 cursor-pointer shrink-0"
                                    checked={agreed.basic}
                                    onClick={() => setAgreed((prev) => ({ ...prev, basic: !prev.basic }))}
                                />
                                <span className="font-poppins text-[14px] font-normal leading-[150%] text-[#525252]">
                                    Auto-renew my plan and save 25% on future renewals.
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 md:gap-3">
                                {basic.features.map((f, i) => {
                                    const parts = f.split(/\*\*(.+?)\*\*/g);
                                    return (
                                        <div key={i} className="flex items-start gap-1">
                                            <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                            <span className="font-poppins font-16 font-normal leading-[150%] text-dark">
                                                {parts.map((p, j) => j % 2 === 1 ? <span key={j} className="font-semibold">{p}</span> : p)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Box 2 — Elite pro */}
                        <div className="w-full transition-all duration-300 hover:scale-[1.03]">
                            <div className="flex items-start gap-2 self-stretch rounded-t-[20px] bg-[#FFDED3] px-5 md:px-7 py-2 shadow-[0_0_20px_0_rgba(255,213,170,0.60)]">
                                <span className="font-poppins font-16 font-medium italic leading-[150%] text-[#8D5900]">
                                    Most popular
                                </span>
                            </div>
                            <div className="w-full flex flex-col items-start gap-5 rounded-b-[32px] bg-white px-4 md:px-5 py-4 md:py-6 shadow-[0_0_20px_0_rgba(255,213,170,0.60)]">
                                <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                                    <EliteCrownIcon className="h-4 md:h-5 w-4 md:w-5 shrink-0 text-[#A97216]" />
                                    <span className="font-poppins font-16 font-normal leading-[150%] text-[#A97216]">
                                        {pro.label}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-end gap-1">
                                        <span className="font-poppins font-28 font-medium leading-[100%] text-dark">
                                            {proPricing.symbol} {proPricing.perMonth}
                                        </span>
                                        <span className="font-poppins font-16 font-normal leading-[100%] text-dark">/month</span>
                                    </div>
                                    <span className="mt-2 italic font-poppins font-16 leading-[100%] text-[#8D5900]">
                                        Save {getSavePct(pro, countryCode)}%
                                    </span>
                                </div>

                                <div className="flex-col w-full">
                                    <div className="flex w-full items-center justify-between">
                                        <span className="font-poppins font-16 font-normal leading-[150%] text-dark">Total cost</span>
                                        <span className="font-poppins font-16 font-semibold leading-[150%] text-dark">
                                            {proPricing.symbol} {proPricing.total}
                                        </span>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <span className="font-poppins font-16 font-normal leading-[150%] text-dark">Duration</span>
                                        <span className="font-poppins font-16 font-semibold leading-[150%] text-dark">
                                            {pro.months} months
                                        </span>
                                    </div>
                                </div>

                                <Button text={`Get ${pro.label}`} iconLeft={<GoHeartFill className="w-3 md:w-4 h-3 md:h-4" />} className="w-full" onPress={() => goToCheckout(pro.key)} />

                                <div className="flex md:items-start items-center gap-2 text-left">
                                    <CheckboxIcon
                                        className="w-6 h-6 cursor-pointer shrink-0"
                                        checked={agreed.pro}
                                        onClick={() => setAgreed((prev) => ({ ...prev, pro: !prev.pro }))}
                                    />
                                    <span className="font-poppins text-[14px] font-normal leading-[150%] text-[#525252]">
                                        Auto-renew my plan and save 25% on future renewals.
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 md:gap-3">
                                    {pro.features.map((f, i) => {
                                        const parts = f.split(/\*\*(.+?)\*\*/g);
                                        return (
                                            <div key={i} className="flex items-start gap-1">
                                                <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                                <span className="font-poppins font-16 font-normal leading-[150%] text-dark">
                                                    {parts.map((p, j) => j % 2 === 1 ? <span key={j} className="font-semibold">{p}</span> : p)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Box 3 — Elite max */}
                        <div className="w-full transition-all duration-300 hover:scale-[1.03]">
                            <div className="flex items-start gap-2 self-stretch rounded-t-[20px] bg-[#FFDED3] px-5 md:px-7 py-2">
                                <span className="font-poppins font-16 font-medium italic leading-[150%] text-[#8D5900]">
                                    Best value
                                </span>
                            </div>
                            <div className="w-full flex flex-col items-start gap-5 rounded-b-[32px] bg-white px-4 md:px-5 py-4 md:py-6">
                                <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                                    <EliteCrownIcon className="h-4 md:h-5 w-4 md:w-5 shrink-0 text-[#A97216]" />
                                    <span className="font-poppins font-16 font-normal leading-[150%] text-[#A97216]">
                                        {max.label}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-start gap-1">
                                        <span className="font-poppins font-28 font-medium leading-[100%] text-dark">
                                            {maxPricing.symbol} {maxPricing.perMonth}
                                        </span>
                                        <span className="font-poppins font-16 font-normal leading-[100%] text-dark">/month</span>
                                    </div>
                                    <span className="mt-2 italic font-poppins font-16 leading-[100%] text-[#8D5900]">
                                        Save {getSavePct(max, countryCode)}%
                                    </span>
                                </div>

                                <div className="flex-col w-full">
                                    <div className="flex w-full items-center justify-between">
                                        <span className="font-poppins font-16 font-normal leading-[150%] text-dark">Total cost</span>
                                        <span className="font-poppins font-16 font-semibold leading-[150%] text-dark">
                                            {maxPricing.symbol} {maxPricing.total}
                                        </span>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <span className="font-poppins font-16 font-normal leading-[150%] text-dark">Duration</span>
                                        <span className="font-poppins font-16 font-semibold leading-[150%] text-dark">
                                            {max.months} months
                                        </span>
                                    </div>
                                </div>

                                <Button text={`Get ${max.label}`} iconLeft={<GoHeartFill className="w-3 md:w-4 h-3 md:h-4" />} className="w-full" onPress={() => goToCheckout(max.key)} />

                                <div className="flex md:items-start items-center gap-2 text-left">
                                    <CheckboxIcon
                                        className="w-6 h-6 cursor-pointer shrink-0"
                                        checked={agreed.max}
                                        onClick={() => setAgreed((prev) => ({ ...prev, max: !prev.max }))}
                                    />
                                    <span className="font-poppins text-[14px] font-normal leading-[150%] text-[#525252]">
                                        Auto-renew my plan and save 25% on future renewals.
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 md:gap-3">
                                    {max.features.map((f, i) => {
                                        const parts = f.split(/\*\*(.+?)\*\*/g);
                                        return (
                                            <div key={i} className="flex items-start gap-1">
                                                <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                                <span className="font-poppins font-16 font-normal leading-[150%] text-dark">
                                                    {parts.map((p, j) => j % 2 === 1 ? <span key={j} className="font-semibold">{p}</span> : p)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:mt-10 mt-8">
                        <h1 className="text-center text-dark font-semibold fonts-24">Why Elite membership?</h1>
                        <div className="mt-4 md:mt-6">
                            {/* box */}
                            <div className="mt-4 md:mt-6 grid grid-cols-2 max-[500px]:gap-2 gap-3">
                                {eliteBenefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="bg-light flex justify-center items-start max-[500px]:rounded-[8px] rounded-[20px] max-[500px]:px-2 px-4 md:px-6 py-4 md:py-6"
                                    >
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {benefit.icon}

                                            <span className="mt-1 font-18 text-dark">
                                                {benefit.text}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}