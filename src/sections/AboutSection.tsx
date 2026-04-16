"use client";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "../context/LangContext";

// ─── Data ───────
const TRUST_CARDS = [
  {
    title: "Diaspora_Connected",
    desc: "Bridging_the_gap_between_Tamils_​​living_in_Jaffna_Vanni_Batticaloa_and_the_United_Kingdom_Canada_and_Europe",
  },
  {
    title: "Parents_First_Choice",
    desc: "Built_with_family_values_in_mind_making_it_safe_for_parents_to_search_for_their_children",
  },
  {
    title: "100_Verified_Profiles",
    desc: "Every_single_profile_is_manually_verified_using_government_IDs_before_going_live",
  },
]as const;

// ─── Main export ────
export default function AboutSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useLang();

  return (
    <>
      <section
        className="relative w-full font-poppins overflow-hidden"
        style={{
          minHeight: 724,
          background: "linear-gradient(180deg, #FFF7F0 0%, #FFEBEB 100%)",
        }}
      >
        <div className="flex flex-col items-center px-5 pb-16">

          {/* Phone image — simple CSS skeleton via bg + opacity trick */}
          <div
            className="relative mx-auto w-full"
            style={{ maxWidth: 565, marginTop: 80, height: 320 }}
          >
            {/* Skeleton: just a rounded bg that disappears once image loads */}
            {!imageLoaded && (
              <div className="absolute inset-0 rounded-[32px] bg-[#e8d5d5] animate-pulse" />
            )}
            <Image
              src="/images/sample_profile_phone.png"
              alt="Privacy control demo on phone"
              width={565}
              height={320}
              priority
              onLoad={() => setImageLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            />
          </div>

          {/* Headline */}
          <h2
            className="font-bold text-center leading-[150%] text-[#191C1D]
              text-[26px] sm:text-[32px] md:text-[40px]"
            style={{ marginTop: 40 }}
          >
            {t("Absolute_Privacy_Control")}
          </h2>

          {/* Body */}
          <p
            className="font-normal leading-[150%] text-[#222222]
              text-center max-w-[730px] text-[13px] md:text-[16px]"
            style={{ marginTop: 24 }}
          >
            {t("At_Tamilinai_you_have_100_control_over_who_views_your_profile_and_photos_Our_SafeView_technology_ensures_your_identity_is_protected_until_you_choose_to_share_it")}
          </p>

          {/* CTA */}
          <button
            type="button"
            className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-wide
              uppercase text-white bg-[#B31B38] cursor-pointer
              transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]"
            style={{
              marginTop: 24,
              paddingTop: 12,
              paddingBottom: 12,
              paddingLeft: 40,
              paddingRight: 40,
              borderRadius: 31,
            }}
          >
            {t("Start_your_journey")}
          </button>
        </div>
      </section>


      <section className="w-full bg-white font-poppins px-5 md:px-10 xl:px-[120px]">

        {/* Section title */}
        <h2
          className="font-bold text-[#222222] 
            text-[26px] lg:text-[40px] md:text-[32px] mt-15 md:mt-30 mb-6 md:mb-10"
          style={{
            lineHeight: "44.48px",
            letterSpacing: "0.64px",
          }}
        >
          {t("Why_Our_Community_Trusts_Us")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10">
          {TRUST_CARDS.map((card, i) => (
            <TrustCard
              key={i}
              title={t(card.title)}
              desc={t(card.desc)}
              // 3rd card spans full width on mobile only
              className={i === 2 ? "col-span-2 md:col-span-1" : ""}
            />
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Trust card ────────────
function TrustCard({
  title,
  desc,
  className = "",
}: {
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-[32px] bg-[#EFEFEF] ${className}`}
      style={{
        minHeight: 252,
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      <span
        className="font-semibold leading-[150%] text-[#222222]
         text-[16px] lg:text-[24px] md:text-[20px]"
      >
        {title}
      </span>
      <span
        className="font-normal leading-[150%] text-[#222222]
          text-[12px] lg:text-[20px] md:text-[16px] mt-4"
      >
        {desc}
      </span>
    </div>
  );
}