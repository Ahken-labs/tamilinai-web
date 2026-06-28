"use client";

import { useLang } from "@/src/context/LangContext";
import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { useState } from "react";

const COUNTRIES = [
    "Sri Lanka",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Switzerland",
    "Norway",
    "Denmark",
    "Netherlands",
    "Italy",
    "UAE",
    "Qatar",
    "Saudi Arabia",
    "Kuwait",
    "Singapore",
    "Malaysia",
    "United States",
    "New Zealand",
    "+ More",
] as const;

export default function DiasporaSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);

    return (
        <section className="w-full bg-light overflow-hidden font-poppins mt-14 md:mt-16 lg:mt-20">
            <div className="mx-4 sm:mx-6 md:mx-10">
                <h1 className="font-32 font-bold text-dark1 text-center mx-auto max-w-[260px] sm:max-w-[300px] md:max-w-[390px] lg:max-w-[420px]">{t("The_SriLankan_Tamil_diaspora_is_our_home_too")}</h1>
                <p className="mt-3 md:mt-4 lg:mt-6 md:text-[16px] text-[15px] text-dark text-center md:max-w-[640px] lg:max-w-[800px] mx-auto">{t("Wherever_life_has_taken_your_family_Inai_connects_you_with_Eelam_Tamil_partners_who_share_your_heritage_across_every_country_every_city_every_timezone")}</p>

                <div className="mt-5 md:mt-6 lg:mt-8 flex flex-wrap justify-center gap-2 mx-auto md:max-w-[640px] lg:max-w-[800px] ">
                    {COUNTRIES.map((country, i) => (
                        <div
                            key={i}
                            className={`rounded-[48px] bg-[#F0F0F0] px-3 py-1
                                lg:text-[16px] sm:text-[14px] text-[13px] text-dark whitespace-nowrap
                                ${i > 9 && country !== "+ More" ? "hidden lg:block" : ""}`}>
                            {country}
                        </div>
                    ))}
                </div>
                <div className="justify-center flex mt-5 lg:mt-8">
                    <Button
                        text={t("Begin_your_journey")}
                        className="!md:text-[16px] !text-[15px]"
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
