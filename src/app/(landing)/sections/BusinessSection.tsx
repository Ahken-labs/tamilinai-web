"use client";

import { useLang } from "@/src/context/LangContext";
import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { useState } from "react";
import Image from "next/image";

export default function BusinessSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);

    return (
        <section className="w-full bg-[#530024] font-poppins mt-0 md:mt-0 lg:mt-0" >
            <div className="py-10 sm:py-15 md:py-20 lg:py-25 max-[500px]:px-0 sm:px-6 md:px-10 flex flex-col items-center">
                {/* Eyebrow */}
                <p className="text-white text-center text-[16px] sm:text-[18px] md:text-[20px] font-normal leading-[150%]">
                    {t("Business_eyebrow")}
                </p>

                {/* Heading */}
                <h2 className="px-4 sm:px-0 mt-2 sm:mt-3 md-4 lg:mt-5 text-white text-center text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-bold leading-[125%]">
                    {t("Business_heading_line1")}
                    <br />
                    {t("Business_heading_line2")}
                </h2>

                {/* Subtext -desktop */}
                <p className="px-4 sm:px-0 max-[500px]:hidden flex mt-5 text-white text-center text-[16px] md:text-[18px] lg:text-[20px] font-normal leading-[150%] md:max-w-[746px]">
                    {t("Business_subtext")}
                </p>

                {/* CTA - desktop */}
                <div className="max-[500px]:hidden flex mt-5 sm:mt-6 md:mt-7 lg:mt-8">
                    <Button
                        text={t("Business_cta")}
                        className=""
                        onPress={() => setOpenForm(true)}
                    />
                </div>

                {/* Image */}
                <div className="mt-5 md:mt-6 w-full flex justify-center">
                    <Image
                        src="/images/bussiness.webp"
                        alt="Wedding business showcase"
                        width={1038}
                        height={471}
                        className="w-full max-w-[1038px] h-auto object-contain"
                        priority={false}
                    />
                </div>

                {/* Subtext -mobile */}
                <p className="px-4 max-[500px]:flex hidden mt-5 text-white text-center text-[16px] font-normal leading-[150%]">
                    {t("Business_subtext")}
                </p>

                {/* CTA -mobile */}
                <div className="max-[500px]:flex hidden mt-5">
                    <Button
                        text={t("Business_cta")}
                        className=""
                        onPress={() => setOpenForm(true)}
                    />
                </div>
            </div>

            <RegisterForm
                variant="modal"
                open={openForm}
                onClose={() => setOpenForm(false)}
            />
        </section>
    );
}
