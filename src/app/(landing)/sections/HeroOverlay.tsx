"use client";

import { FlowerIcon } from "@/src/assets/Icons";
import RegisterForm from "@/src/components/auth/RegisterForm";
import Button from "@/src/components/common-layout/Button";
import { useLang } from "@/src/context/LangContext";
import { useState } from "react";

export default function HeroOverlay() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);

    return (
        <>
            <div className="absolute inset-0 flex flex-col justify-between pt-4 sm:pt-6 lg:pt-10 pb-4 sm:pb-6 lg:pb-10 px-4 sm:px-6 md:px-10">
                <div className="flex justify-between items-center h-full">
                    <div className="flex flex-col justify-between items-center lg:items-start h-full w-full">
                        {/* Trust badge */}
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

                        <div className="relative mx-auto lg:mx-0 text-center lg:text-left">
                            <div className="absolute inset-x-[-24px] md:top-[-32px] top-[-62px] left-[-200px] right-[-200px] bottom-[-24px]
                                            rounded-[32px] lg:hidden
                                            bg-[linear-gradient(180deg,rgba(38,2,3,0)_0%,rgba(38,2,3,0.95)_50%,#260203_100%)]
                                            blur-[14px] z-0" />
                            <div className="max-w-[640px]">
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
                                        <Button
                                            className="mt-2 w-full !md:text-[16px] !text-[15px]"
                                            text={t("Find_your_matches")}
                                            onPress={() => setOpenForm(true)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop form — right side */}
                    <div className="hidden lg:block w-[400px] shrink-0">
                        <RegisterForm variant="hero" />
                    </div>
                </div>
            </div>

            {/* Mobile modal */}
            <RegisterForm
                variant="modal"
                open={openForm}
                onClose={() => setOpenForm(false)}
            />
        </>
    );
}
