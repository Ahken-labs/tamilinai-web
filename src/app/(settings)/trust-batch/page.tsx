"use client";

import Image from "next/image";
import FormCardLayout from "@/src/components/common-layout/FormCardLayout";
import { getProgressWidth } from "@/src/utils/getProgressWidth";
import Button from "@/src/components/common-layout/Button";
import { CheckmarkIcon, MailIcon, PhoneIcon, ProfileIcon } from "@/src/assets/Icons";

const trustBatchData = {
    isPhoneVerified: true,
    isEmailVerified: false,
    isProfileVerified: false,
};

export default function TrustBatchPage() {
    const completedCount = [
        trustBatchData.isPhoneVerified,
        trustBatchData.isEmailVerified,
        trustBatchData.isProfileVerified,
    ].filter(Boolean).length;

    const progress = (completedCount / 3) * 100;

    const tasks = [
        {
            text: "Verify your mobile number",
            Icon: PhoneIcon,
            verified: trustBatchData.isPhoneVerified,
            actionLabel: "Verify now",
        },
        {
            text: "Verify your email address",
            Icon: MailIcon,
            verified: trustBatchData.isEmailVerified,
            actionLabel: "Verify now",
        },
        {
            text: "Reach 90% profile completion points",
            Icon: ProfileIcon,
            verified: trustBatchData.isProfileVerified,
            actionLabel: "Add details",
        },
    ] as const;

    return (
        <div className="font-poppins min-h-screen bg-[#F8F5F2]">
            <FormCardLayout
                title="Get trust batch"
                subtitle="Complete 3 quick tasks to show other members you're real and trustworthy."
                subtitleMarginTop="mt-4 sm:mt-5 md:mt-6.5 lg:mt-8"
                childrenTopMargin="mt-4 sm:mt-5 md:mt-6"
                paddingBottom="pb-4 sm:pb-5 md:pb-6"
            >
                <div>
                    <div className="flex flex-col gap-2 rounded-[16px] bg-[#F0F0F0] p-3 md:p-4">
                        <div className="flex items-center justify-between">
                            <span className="font-16 text-dark">Your progress</span>
                            <span className="font-16 text-dark">{completedCount} of 3 completed</span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-[19px] bg-white">
                            <div
                                className="h-full rounded-[19px] bg-[#B31B38]"
                                style={{ width: `${getProgressWidth(progress)}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 sm:mt-5 md:mt-6">
                        {tasks.map(({ text, Icon, verified, actionLabel }) => (
                            <div key={text} className="flex items-center justify-between gap-4 px-4 py-1 md:py-2">
                                <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
                                    <Icon className="h-4 sm:h-4.5 md:h-5.5 lg:h-6 w-4 sm:w-4.5 md:w-5.5 lg:w-6 shrink-0 text-dark" />
                                    <span className="text-dark font-16 font-normal leading-[150%]">
                                        {text}
                                    </span>
                                </div>

                                {verified ? (
                                    <div className="flex shrink-0 items-center gap-[2px] rounded-[41px] bg-[#F0F0F0] py-[2px] pl-3 pr-2">
                                        <span className="font-16 font-normal leading-[150%] text-[#656565]">
                                            Verified
                                        </span>
                                        <CheckmarkIcon className="h-4 sm:h-4.5 md:h-5.5 lg:h-6 w-4 sm:w-4.5 md:w-5.5 lg:w-6 shrink-0 text-[#656565]" />
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="flex shrink-0 items-center rounded-[41px] bg-[#B31B38] px-3 py-[2px]"
                                    >
                                        <span className="font-16 font-normal leading-[150%] text-white">
                                            {actionLabel}
                                        </span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="my-3 h-px self-stretch bg-[#EAEAEA] md:my-4" />

                    <div className="flex flex-col gap-3">
                        {/* Top row: image + text */}
                        <div className="flex items-center gap-4">
                            <Image
                                src="/icons/trust_batch.png"
                                alt=""
                                width={44}
                                height={48}
                                className="h-[48px] w-[44px] shrink-0"
                            />

                            <p className="flex-1 font-16 font-normal leading-[150%] text-secondary3">
                                All three tasks must be completed to unlock your Trust badge.
                            </p>

                            {/* Desktop button */}
                            <div className="hidden min-[520px]:block">
                                <Button
                                    text="Claim trust batch"
                                    className={`!px-6 ${progress === 100
                                        ? "" : "!bg-[#F0F0F0] !text-[#656565] hover:!bg-[#BBBBBB] active:!bg-[#BBBBBB]"}`} />
                            </div>
                        </div>

                        {/* Mobile button */}
                        <div className="min-[520px]:hidden">
                            <Button
                                text="Claim trust batch"
                                className={`!px-6 w-full ${progress === 100
                                    ? "" : "!bg-[#F0F0F0] !text-[#656565] hover:!bg-[#BBBBBB] active:!bg-[#BBBBBB]"}`}/>
                        </div>
                    </div>
                </div>
            </FormCardLayout>
        </div>
    );
}