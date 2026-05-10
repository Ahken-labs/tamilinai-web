"use client";

import Image from "next/image";
import { CheckboxIcon, } from "@/src/assets/Icons";

type MatchItem = {
    label: string;
    value: string;
    matched: boolean;
};

const matchItems: MatchItem[] = [
    { label: "Marital status", value: "Unmarried", matched: true },
    { label: "Age", value: "21 - 27 yrs", matched: true },
    { label: "Mother tongue", value: "Tamil", matched: true },
    { label: "Physical status", value: "Normal", matched: true },
    { label: "Eating habit", value: "Does not matter", matched: false },
    { label: "Drinking habit", value: "Does not matter", matched: false },
    { label: "Smoking habit", value: "Does not matter", matched: false },
    { label: "Education", value: "Bachelors, Diploma, Higher secondary", matched: true },
    { label: "Occupation", value: "Any", matched: true },
    { label: "Country living in", value: "Any", matched: true },
    { label: "Citizenship", value: "Any", matched: false },
    { label: "Resident status", value: "Any", matched: true },
    { label: "Religion", value: "Hindu", matched: true },
];

export default function MatchPreferencesCard() {
    return (
        <div className="font-poppins w-full max-w-[1160px] px-6 md:px-10 mx-auto">
            {/* Top match box */}
            <div className="rounded-[60px] bg-white p-2">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <Image
                            src="/images/no_photo.png"
                            alt="left profile"
                            width={64}
                            height={64}
                            className="h-8 sm:h-10 md:h-14 lg:h-16 w-8 sm:w-10 md:w-14 lg:w-16 rounded-full object-cover"
                            priority
                        />
                    </div>

                    <div className="flex flex-1 items-center">
                        <div className="h-px flex-1 bg-[#D7D7D7]" />
                        <span className="mx-3 sm:mx-4 shrink-0 font-16 font-semibold leading-[150%] text-primary">
                            90% match
                        </span>
                        <div className="h-px flex-1 bg-[#D7D7D7]" />
                    </div>

                    <div className="shrink-0">
                        <Image
                            src="/images/no_photo_male.png"
                            alt="right profile"
                            width={64}
                            height={64}
                            className="h-8 sm:h-10 md:h-14 lg:h-16 w-8 sm:w-10 md:w-14 lg:w-16 rounded-full object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Titles */}
            <div className="mt-4 md:mt-6 flex items-center justify-between gap-4">
                <h2 className="font-20 font-semibold leading-[150%] text-dark">
                    Her partner preferences
                </h2>
                <span className="font-20 font-semibold leading-[150%] text-dark">
                    You
                </span>
            </div>

            {/* Preference rows */}
            <div className="mt-4 md:mt-6">
                {matchItems.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-0 sm:gap-2 md:gap-8 border-b border-[#D7D7D7] py-3 pr-0 pl-0"
                    >
                        <div className="min-w-[160px] font-16 font-normal italic leading-[150%] text-dark">
                            {item.label}
                        </div>

                        <div className="flex-1 font-16 font-medium not-italic leading-[150%] text-dark">
                            {item.value}
                        </div>
                        <div className="shrink-0">
                            <CheckboxIcon
                                checked={item.matched}
                                className="h-4 sm:h-5 md:h-5.5 lg:h-6 w-4 sm:w-5 md:w-5.5 lg:w-6"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}