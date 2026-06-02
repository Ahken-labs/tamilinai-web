"use client";

import { GlobeIcon, TrustPrivacyIcon, TrustVerifiedIcon } from "@/src/assets/Icons";
import { useLang } from "@/src/context/LangContext";

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex shrink-0 items-center text-[#767676] lg:text-[#222222] gap-2 lg:gap-3 min-w-max">
            <div className="shrink-0">{icon}</div>
            <span className="leading-none text-[16px] lg:text-[20px] whitespace-nowrap">{text}</span>
        </div>
    );
}

export default function HeroTrustBar() {
    const { t } = useLang();

    return (
        <div className="lg:pt-15 lg:pb-15 pt-10 py-8 border-b border-[#D8D8D8]">
            <div className="max-w-[1260px] mx-auto">
                {/* Desktop */}
                <div className="hidden lg:grid grid-cols-3 gap-x-10 gap-y-6">
                    <div className="flex items-center justify-center">
                        <TrustItem icon={<TrustVerifiedIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("Verified_Profiles")} />
                    </div>
                    <div className="flex items-center justify-center">
                        <TrustItem icon={<GlobeIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("12_countries")} />
                    </div>
                    <div className="flex items-center justify-center">
                        <TrustItem icon={<TrustPrivacyIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("Free_to_join")} />
                    </div>
                </div>

                {/* Mobile / tablet marquee */}
                <div className="lg:hidden overflow-hidden">
                    <div className="flex w-max animate-trust-marquee">
                        <div className="flex items-center gap-[48px] pr-[48px] shrink-0">
                            <TrustItem icon={<TrustVerifiedIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("Verified_Profiles")} />
                            <TrustItem icon={<GlobeIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("12_countries")} />
                            <TrustItem icon={<TrustPrivacyIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("Free_to_join")} />
                        </div>
                        <div className="flex items-center gap-[48px] pr-[48px] shrink-0">
                            <TrustItem icon={<TrustVerifiedIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("Verified_Profiles")} />
                            <TrustItem icon={<GlobeIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("12_countries")} />
                            <TrustItem icon={<TrustPrivacyIcon className="w-4 lg:w-6 h-4 lg:h-6" />} text={t("Free_to_join")} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
