"use client";

import Image from "next/image";
import { useLang } from "@/src/context/LangContext";
import Button from "@/src/components/common/Button";
import ProfileForm from "@/src/components/form/ProfileForm";
import { useState } from "react";

export default function ContactSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);

    return (
        <section className="relative w-full bg-white overflow-hidden font-poppins py-15 md:py-20 lg:py-25 mt-8 md:mt-15 lg:mt-30">

            {/* ── LEFT PILLAR ── */}
            <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none">
                <Image
                    src="/images/piller.png"
                    alt=""
                    width={200}
                    height={528}
                    className="h-[380px] md:h-[420px] lg:h-[528px] w-[100px] md:w-[160px] lg:w-[200px] ml-4 md:ml-6 lg:ml-10"
                    priority
                />
            </div>

            {/* ── RIGHT PILLAR (MIRRORED) ── */}
            <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none">
                <Image
                    src="/images/piller.png"
                    alt=""
                    width={200}
                    height={528}
                    className="h-[380px] md:h-[420px] lg:h-[528px] w-[100px] md:w-[160px] lg:w-[200px] mr-4 md:mr-6 lg:mr-10 scale-x-[-1]"
                    priority
                />
            </div>

            {/* ── CENTER CONTENT ── */}
            <div className="relative z-10 mx-auto max-w-[700px] px-6 text-center">

                {/* Small heading */}
                <p className="text-[12px] md:text-[14px] lg:text-[16px] font-medium text-[#222222]">
                    {t("Our_vision_and_purpose")}
                </p>

                {/* Main heading */}
                <h2
                    className="
    mt-2
    font-bold text-[#191C1D] capitalize text-center
    leading-[150%]

    text-[20px] sm:text-[25px] md:text-[30px] lg:text-[40px]

    max-w-[200px] sm:max-w-[300px] md:max-w-[640px]
    mx-auto
  "
                >
                    <span className="block">{t("More_than_just_matchmaking")}</span>
                    <span className="block">{t("We_are_your_bridge_to_home")}</span>
                    {/* More than just matchmaking.<br />We are your bridge to home. */}
                </h2>
                {/* Tamil text */}
                <p className="mt-6 text-[12px] md:text-[16px] lg:text-[20px] leading-[150%] text-[#222222] font-normal">
                    தமிழால் இணைவதால்,<br />தமிழ் மணங்களை இணைப்பதால்,<br />இணைகளை இணைப்பதால், <br />நாம் -{" "}
                    <span className="font-semibold">தமிழிணை!</span>
                </p>

                {/* CTA Button */}
                <Button
                    text={t("Start_your_roots")}
                    className="uppercase mt-8"
                    onPress={() => setOpenForm(true)}

                />
            </div>
            <ProfileForm
                variant="modal"
                open={openForm}
                onClose={() => setOpenForm(false)}
            />
        </section>

    );
}