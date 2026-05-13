"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/src/components/common-layout/Button";
import { CheckboxIcon, CheckmarkIcon, EliteCrownIcon, ProfileVisibilityIcon, ResponseIcon, StepPreferencesIcon } from "@/src/assets/Icons";
import { GoHeartFill } from "react-icons/go";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const eliteBenefits = [
    { icon: <FaWhatsapp className="h-4 md:h-6 w-4 md:w-6" />, text: "Talk to matches directly", },
    { icon: <StepPreferencesIcon className="h-4 md:h-6 w-4 md:w-6" />, text: "Send unlimited interests", },
    { icon: <ProfileVisibilityIcon className="h-4 md:h-6 w-4 md:w-6" />, text: "Enhanced profile visibility", },
    { icon: <ResponseIcon className="h-4 md:h-6 w-4 md:w-6" />, text: "Get more responses", },
];

export default function EliteUpgradePage() {
    const [agreed, setAgreed] = useState({
        basic: true,
        pro: true,
        max: true,
    });

    return (
        <main className="select-none min-h-screen bg-[#F8F5F2] pb-20">
            <div className="mx-auto flex max-w-[1024px] flex-col px-4 pb-4 pt-[27px] lg:px-10">
                <div className="flex justify-center">
                    <Image src="/icons/elite_Badge.png" alt="elite" width={42} height={40} />
                </div>

                <div className="mx-auto mt-4 md:mt-5 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start lg:gap-[26px] md:gap-5 gap-5">
                        {/* Box 1 */}
                        <div className="w-full rounded-[20px] bg-white px-4 md:px-5 py-4 md:py-6 md:mt-10 flex flex-col items-start gap-4 md:gap-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                                <EliteCrownIcon className="h-4 md:h-5 w-4 md:w-5 shrink-0 text-[#A97216]" />
                                <span className="font-poppins font-16 font-normal leading-[150%] text-[#A97216]">
                                    Elite basic
                                </span>
                            </div>

                            <div className="flex items-start gap-1">
                                <span className="font-inter font-28 font-medium leading-[100%] text-dark">
                                    Rs 1,725
                                </span>
                                <span className="font-inter font-16 font-normal leading-[100%] text-dark">
                                    /month
                                </span>
                            </div>

                            <div className="flex-col w-full ">
                                <div className="flex w-full items-center justify-between">
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Total cost
                                    </span>
                                    <span className="font-inter font-16 font-semibold leading-[150%] text-dark">
                                        Rs 3,450
                                    </span>
                                </div>

                                <div className="flex w-full items-center justify-between">
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Duration
                                    </span>
                                    <span className="font-inter font-16 font-semibold leading-[150%] text-dark">
                                        2 months
                                    </span>
                                </div>
                            </div>

                            <Button text="Get Elite" iconLeft={<GoHeartFill className="w-3 md:w-4 h-3 md:h-4" />} className="w-full" />

                            <div className="flex items-start gap-2 text-left">
                                <CheckboxIcon
                                    className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 cursor-pointer"
                                    checked={agreed.basic}
                                    onClick={() =>
                                        setAgreed((prev) => ({
                                            ...prev,
                                            basic: !prev.basic,
                                        }))
                                    }
                                />
                                <span className="font-inter text-[14px] font-normal leading-[150%] text-[#525252]">
                                    Auto-renew my plan and save 25% on future renewals.
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 md:gap-3">
                                <div className="flex items-start gap-1">
                                    <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Boost your profile <span className="font-semibold">1 week</span>
                                    </span>
                                </div>

                                <div className="flex items-start gap-1">
                                    <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Send unlimited interest requests
                                    </span>
                                </div>

                                <div className="flex items-start gap-1">
                                    <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Connect with any Inai user with WhatsApp
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="w-full rounded-[20px] bg-white px-4 md:px-5 py-4 md:py-6 mt-0 md:mt-10 flex flex-col items-start gap-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                                <EliteCrownIcon className="h-4 md:h-5 w-4 md:w-5 shrink-0 text-[#A97216]" />
                                <span className="font-poppins font-16 font-normal leading-[150%] text-[#A97216]">
                                    Elite pro
                                </span>
                            </div>

                            <div className="flex items-end gap-1">
                                <span className="font-inter font-28 font-medium leading-[100%] text-dark">
                                    Rs 1,483
                                </span>
                                <span className="font-inter font-16 font-normal leading-[100%] text-dark">
                                    /month
                                </span>
                            </div>

                            <div className="flex-col w-full ">
                                <div className="flex w-full items-center justify-between">
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Total cost
                                    </span>
                                    <span className="font-inter font-16 font-semibold leading-[150%] text-dark">
                                        Rs 4,450
                                    </span>
                                </div>

                                <div className="flex w-full items-center justify-between">
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Duration
                                    </span>
                                    <span className="font-inter font-16 font-semibold leading-[150%] text-dark">
                                        3 months
                                    </span>
                                </div>
                            </div>

                            <Button text="Get Elite" iconLeft={<GoHeartFill className="w-3 md:w-4 h-3 md:h-4" />} className="w-full" />

                            <div className="flex md:items-start items-center items-center gap-2 text-left" >
                                <CheckboxIcon
                                    className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 cursor-pointer"
                                    checked={agreed.pro}
                                    onClick={() =>
                                        setAgreed((prev) => ({
                                            ...prev,
                                            pro: !prev.pro,
                                        }))
                                    }
                                />

                                <span className="font-inter text-[14px] font-normal leading-[150%] text-[#525252]">
                                    Auto-renew my plan and save 25% on future renewals.
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 md:gap-3">
                                <div className="flex items-start gap-1">
                                    <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Boost your profile <span className="font-semibold">2 weeks</span>
                                    </span>
                                </div>

                                <div className="flex items-start gap-1">
                                    <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Send unlimited interest requests
                                    </span>
                                </div>

                                <div className="flex items-start gap-1">
                                    <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Connect with any Inai user with WhatsApp
                                    </span>
                                </div>

                                <div className="flex items-start gap-1">
                                    <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                    <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                        Priority customer service
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Box 3 */}
                        {/* <div className="sm:col-span-2 lg:col-span-1 sm:max-w-[calc(50%-10px)] lg:max-w-full sm:mx-auto lg:mx-0 w-full transition-all duration-300 hover:scale-[1.03]"> */}
                        <div className="sm:col-span-2 md:col-span-1 sm:max-w-[calc(50%-10px)] md:max-w-full sm:mx-auto md:mx-0 w-full transition-all duration-300 hover:scale-[1.03]">
                            <div className="flex items-start gap-2 self-stretch rounded-t-[32px] bg-[#8D5900] px-4 md:px-5 py-2 shadow-[0_0_20px_0_rgba(255,213,170,0.60)]">
                                <span className="font-poppins font-16 font-medium italic leading-[150%] text-[#FFDED3]">
                                    Best value
                                </span>
                            </div>

                            <div className="w-full flex flex-col items-start gap-5 rounded-b-[32px] bg-white px-4 md:px-5 py-4 md:py-6 shadow-[0_0_20px_0_rgba(255,213,170,0.60)]">
                                <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                                    <EliteCrownIcon className="h-4 md:h-5 w-4 md:w-5 shrink-0 text-[#A97216]" />
                                    <span className="font-poppins font-16 font-normal leading-[150%] text-[#A97216]">
                                        Elite max
                                    </span>
                                </div>

                                <div className="flex items-end gap-1">
                                    <span className="font-inter font-28 font-medium leading-[100%] text-dark">
                                        Rs 1,241
                                    </span>
                                    <span className="font-inter font-16 font-normal leading-[100%] text-dark">
                                        /month
                                    </span>
                                </div>
                                <div className="flex-col w-full ">

                                    <div className="flex w-full items-center justify-between">
                                        <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                            Total cost
                                        </span>
                                        <span className="font-inter font-16 font-semibold leading-[150%] text-dark">
                                            Rs 7,450
                                        </span>
                                    </div>

                                    <div className="flex w-full items-center justify-between">
                                        <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                            Duration
                                        </span>
                                        <span className="font-inter font-16 font-semibold leading-[150%] text-dark">
                                            6 months
                                        </span>
                                    </div>
                                </div>
                                <Button text="Get Elite" iconLeft={<GoHeartFill className="w-3 md:w-4 h-3 md:h-4" />} className="w-full" />

                                <div className="flex md:items-start items-center gap-2 text-left" >
                                    <CheckboxIcon
                                        className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 cursor-pointer"
                                        checked={agreed.max}
                                        onClick={() =>
                                            setAgreed((prev) => ({
                                                ...prev,
                                                max: !prev.max,
                                            }))
                                        }
                                    />
                                    <span className="font-inter text-[14px] font-normal leading-[150%] text-[#525252]">
                                        Auto-renew my plan and save 25% on future renewals.
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 md:gap-3">
                                    <div className="flex items-start gap-1">
                                        <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                        <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                            Boost your profile <span className="font-semibold">4 weeks</span>
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-1">
                                        <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                        <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                            Send unlimited interest requests
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-1">
                                        <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                        <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                            Connect with any Inai user with WhatsApp
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-1">
                                        <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                        <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                            Priority customer service
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-1">
                                        <CheckmarkIcon className="mt-[2px] h-4 w-4 shrink-0" />
                                        <span className="font-inter font-16 font-normal leading-[150%] text-dark">
                                            Dedicated support from Inai team
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:mt-10 mt-8">
                        <h1 className="text-center text-dark font-semibold font-24">why Elite membership?</h1>
                        <div className="mt-4 md:mt-6">
                            {/* box */}
                            <div className="mt-4 md:mt-6 grid grid-cols-2 gap-3">
                                {eliteBenefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="bg-light flex justify-center items-center rounded-[20px] p-4 md:p-6"
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
                        <div className="mt-8 sm:mt-10 md:mt-14 justify-center items-center flex gap-3 md:gap-4" >
                            <span className="font-16 text-dark text-center">Have any queries or need help in making payment?</span>
                            <Link
                                href="https://wa.me/94750207507"
                                className="font-16 py-0.5 px-3 text-dark border rounded-[41px] transition-colors duration-200 hover:bg-[#25D366] hover:border-[#075e54] hover:text-white active:bg-[#075e54] active:border-[#075e54] active:text-white"
                            >
                                WhatsApp us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}