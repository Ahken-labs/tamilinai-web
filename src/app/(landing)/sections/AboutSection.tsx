"use client";

import Image from "next/image";
import { useLang } from "@/src/context/LangContext";
import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { useState } from "react";

export default function AboutSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);

    return (
        <section className="w-full bg-light overflow-hidden font-poppins">
            <div className="mt-14 lg:mt-18 relative px-5 py-5 bg-[linear-gradient(180deg,_#FFEBEB_0%,_#FFF7F0_100%)]">
                {/* ── LEFT PILLAR ── */}
                <div className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 select-none lg:block">
                    <Image
                        src="/images/piller.webp"
                        alt=""
                        width={156}
                        height={412}
                        className="w-[156px] h-[412px]"
                        priority
                    />
                </div>

                {/* ── RIGHT PILLAR (MIRRORED) ── */}
                <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 select-none lg:block">
                    <Image
                        src="/images/piller.webp"
                        alt=""
                        width={156}
                        height={412}
                        className="w-[156px] h-[412px] scale-x-[-1]"
                        priority
                    />
                </div>

                {/* ── CENTER CONTENT ── */}
                <div className="relative z-10 mx-auto max-w-[640px] text-center">
                    <div className="lg:hidden flex justify-center mb-5">
                        <Image
                            src="/images/piller_mobile.webp"
                            alt=""
                            width={320}
                            height={110}
                            className="w-[320px] h-[110px]"
                        />
                    </div>
                    <p className="md:text-[16px] text-[15px] font-medium text-dark">
                        {t("Our_story")}
                    </p>
                    <h2
                        className="mt-2 font-medium text-dark1 italic text-center leading-[150%]
                    font-28
                    max-w-[328px] md:max-w-[640px] mx-auto" >
                        <span className="block">&ldquo;{t("More_than_just_matchmaking")}</span>
                        <span className="block">{t("We_are_your_bridge_to_home")}&rdquo;</span>

                    </h2>
                    <p className="mt-5 md:text-[16px] text-[15px] leading-[150%] text-dark font-normal text-center">
                        {t("vision_parah1")} <br /><br />
                        {t("vision_parah2")}
                    </p>
                    <Button
                        text={t("Begin_your_journey")}
                        className="mt-5 !md:text-[16px] !text-[15px]"
                        onPress={() => setOpenForm(true)}
                    />
                    <div className="scale-y-[-1] lg:hidden flex justify-center mt-5">
                        <Image
                            src="/images/piller_mobile.webp"
                            alt=""
                            width={320}
                            height={110}
                            className="w-[320px] h-[110px]"
                        />
                    </div>
                </div>
                <RegisterForm
                    variant="modal"
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                />
            </div>
            <div className="mt-10 lg:mt-18 font-tamil text-dark lg:text-[20px] md:text-[18px] text-[16px] mx-auto text-center">
                தமிழால் இணைவதால்,<br />
                தமிழ் மணங்களை இணைப்பதால்,<br />
                இணைகளை இணைப்பதால்,<br />
                நாம் - இணை.lk
            </div>

        </section>
    );
}
