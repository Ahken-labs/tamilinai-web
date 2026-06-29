"use client";

import { useLang } from "@/src/context/LangContext";
import Image from "next/image";
import Link from "next/link";
import { EliteBasicTag, EliteProTag, EliteMaxTag } from "@/src/components/ui/Tags";
import {
    CakeIcon,
    HeightRulerIcon,
    WorkBriefcaseIcon,
    ReligionSparkleIcon,
    ArrowRight,
} from "@/src/assets/Icons";
import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { useState, useRef } from "react";
import { useDragScroll } from "@/src/hooks/useDragScroll";
import { ChevronIcon } from "@/src/assets/Icons";

interface MockProfile {
    id: string;
    displayId: string;
    gender: "male" | "female";
    location: string;
    age: number;
    height: string;
    work: string;
    religion: string;
    elite: "pro" | "basic" | "max" | null;
}

const MOCK_PROFILES: MockProfile[] = [
    { id: "1", displayId: "INI 945", gender: "male", location: "Ontario, Canada.", age: 34, height: "163 cm", work: "HR Consultant", religion: "Hindu", elite: "pro" },
    { id: "2", displayId: "INI 943", gender: "male", location: "Jaffna, Sri Lanka.", age: 37, height: "148 cm", work: "Engineer", religion: "Hindu", elite: "pro" },
    { id: "3", displayId: "INI 944", gender: "female", location: "Toronto, Canada.", age: 25, height: "154 cm", work: "Not working", religion: "Hindu", elite: "pro" },
    { id: "4", displayId: "INI 942", gender: "male", location: "Trincomalee, Sri Lanka.", age: 25, height: "154 cm", work: "Not working", religion: "Hindu", elite: "pro" },
    { id: "5", displayId: "INI 946", gender: "female", location: "Kilinochchi, Sri Lanka.", age: 29, height: "157 cm", work: "Not working", religion: "Hindu", elite: "pro" },
    { id: "6", displayId: "INI 947", gender: "male", location: "Oslo, Norway.", age: 25, height: "154 cm", work: "Not working", religion: "Hindu", elite: "pro" },
];

function EliteTag({ plan }: { plan: "pro" | "basic" | "max" | null }) {
    if (plan === "pro") return <EliteProTag />;
    if (plan === "max") return <EliteMaxTag />;
    if (plan === "basic") return <EliteBasicTag />;
    return null;
}

function AdCard({ profile }: { profile: MockProfile }) {
    const photo = profile.gender === "female" ? "/images/no_photo.webp" : "/images/no_photo_male.webp";

    return (
        <div className="shrink-0 w-[85vw] max-[500px]:max-w-[264px] min-w-[264px] max-w-[325px] rounded-[24px] border border-[#F0F0F0] bg-white px-4 sm:px-5 md:px-6 py-10 flex flex-col justify-center items-center">
            {/* Photo + ID + tag row */}
            <div className="flex items-center w-full gap-3 sm:gap-3.5 md:gap-4">
                <Image
                    src={photo}
                    alt={profile.displayId}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full border border-[#D8D8D8] object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[#222] font-poppins text-[16px] sm:text-[17px] md:text-[18px] font-medium leading-[150%] truncate">
                            {profile.displayId}
                        </span>
                        <EliteTag plan={profile.elite} />
                    </div>
                    {/* Location */}
                    <p className="text-[#222] mt-1.5 font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] truncate overflow-hidden text-ellipsis">
                        {profile.location}
                    </p>
                </div>
            </div>

            {/* Detail rows */}
            <div className="mt-6 w-full grid grid-cols-2 gap-x-2 gap-y-[2px]">
                <div className="flex items-center gap-2 min-w-0">
                    <CakeIcon className="w-[14px] h-[14px] shrink-0 text-[#222]" />
                    <span className="text-[#222] font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] truncate">{profile.age} years</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <HeightRulerIcon className="w-[14px] h-[14px] shrink-0 text-[#222]" />
                    <span className="text-[#222] font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] truncate">{profile.height}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <WorkBriefcaseIcon className="w-[14px] h-[14px] shrink-0 text-[#222]" />
                    <span className="text-[#222] font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] truncate">{profile.work}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <ReligionSparkleIcon className="w-[14px] h-[14px] shrink-0 text-[#222]" />
                    <span className="text-[#222] font-poppins text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] truncate">{profile.religion}</span>
                </div>
            </div>
        </div>
    );
}

function ViewAllCard({ label }: { label: string }) {
    return (
        <Link href="/login" className="shrink-0 w-[85vw] max-[500px]:max-w-[264px] min-w-[264px] max-w-[325px] rounded-[24px] border border-[#F0F0F0] bg-white px-4 sm:px-5 md:px-6 py-10 flex flex-col items-center justify-center no-underline">
            <div className="flex items-center gap-1">
                <span className="text-[#222] font-poppins text-[16px] font-medium leading-[150%]">{label}</span>
                <ArrowRight className="w-4 h-4 text-[#222]" />
            </div>
        </Link>
    );
}

export default function BoostedProfileSection() {
    const { t } = useLang();
    const [openForm, setOpenForm] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    useDragScroll(scrollRef);

    const CARD_STEP = 345; // card max-width + gap

    function scrollPrev() {
        scrollRef.current?.scrollBy({ left: -CARD_STEP, behavior: "smooth" });
    }
    function scrollNext() {
        scrollRef.current?.scrollBy({ left: CARD_STEP, behavior: "smooth" });
    }

    return (
        <section className="w-full bg-[#F0F0F0] font-poppins py-10 sm:py-14 md:py-18 lg:py-20">
            {/* Heading row */}
            <div className="px-4 relative flex items-center justify-center">
                <h2 className="text-[#222] text-center text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-bold leading-[135%]">
                    {t("Boosted_heading")}
                </h2>
                <div className="hidden lg:flex absolute right-10 shrink-0 md:gap-2 lg:gap-4">
                    <button
                        onClick={scrollPrev}
                        className="cursor-pointer w-9 h-9 rounded-full bg-[#D8D8D8] flex items-center justify-center hover:bg-[#CCC] transition-colors"
                        aria-label="Previous"
                    >
                        <ChevronIcon open={false} className="w-4 h-4 rotate-90" strokeWidth="2" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="cursor-pointer w-9 h-9 rounded-full bg-[#D8D8D8] flex items-center justify-center hover:bg-[#CCC] transition-colors"
                        aria-label="Next"
                    >
                        <ChevronIcon open={false} className="w-4 h-4 -rotate-90" strokeWidth="2" />
                    </button>
                </div>
            </div>

            {/* Scrollable cards row */}
            <div className="relative mt-6 sm:mt-7 md:mt-8 lg:mt-10">
                {/* Left fog */}
                <div
                    className="min-[500px]:flex hidden pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10"
                    style={{ background: "linear-gradient(90deg, #F3F4F6 0%, #F3F4F6 25%, rgba(243,244,246,0.00) 100%)" }}
                />
                {/* Right fog */}
                <div
                    className="min-[500px]:flex hidden pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10"
                    style={{ background: "linear-gradient(270deg, #F3F4F6 0%, #F3F4F6 25%, rgba(243,244,246,0.00) 100%)" }}
                />

                <div ref={scrollRef} className="overflow-x-auto no-scrollbar">
                    <div className="flex flex-row gap-3 sm:gap-4 md:gap-5 px-4 w-max">
                        {MOCK_PROFILES.map((profile) => (
                            <AdCard key={profile.id} profile={profile} />
                        ))}
                        <ViewAllCard label={t("Boosted_viewAll")} />
                    </div>
                </div>

            </div>

            {/* CTA */}
            <div className="flex justify-center mt-6 sm:mt-7 md:mt-7.5 lg:mt-8">
                <Button
                    text={t("Join_now_to_see_all")}
                    onPress={() => setOpenForm(true)}
                />
            </div>

            <RegisterForm
                variant="modal"
                open={openForm}
                onClose={() => setOpenForm(false)}
            />

        </section>
    );
}
