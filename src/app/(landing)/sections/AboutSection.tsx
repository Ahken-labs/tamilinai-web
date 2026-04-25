"use client";

import Button from "@/src/components/common/Button";
import RegisterForm from "@/src/components/form/RegisterForm";
import { useLang } from "@/src/context/LangContext";
import Image from "next/image";
import { useState } from "react";

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
] as const;

// ─── Main export ────
export default function AboutSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useLang();
  const [openForm, setOpenForm] = useState(false);


  return (
    <>
      <section
        className="relative w-full font-poppins overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFF7F0 0%, #FFEBEB 100%)",
        }}
      >
        <div className="flex flex-col items-center px-5 pb-14 md:pb-18 lg:pb-20 ">

          {/* Phone image — simple CSS skeleton via bg + opacity trick */}
          <div
            className="relative mt-15 md:mt-20 mx-auto w-full"
            style={{ maxWidth: 565}}
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
                objectFit: "contain",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            />
          </div>

          {/* Headline */}
          <h2
            className="font-bold text-center leading-[150%] text-dark1
              font-40 sm:mt-10 md:mt-10 mt-8"
          >
            {t("Absolute_Privacy_Control")}
          </h2>

          {/* Body */}
          <p
            className="font-normal leading-[150%] text-dark
              text-center max-w-[730px] font-16 mt-6"
          >
            {t("At_Tamilinai_you_have_100_control_over_who_views_your_profile_and_photos_Our_SafeView_technology_ensures_your_identity_is_protected_until_you_choose_to_share_it")}
          </p>

          {/* CTA */}
          <Button
            text={t("Start_your_journey")}
            className="mt-6 uppercase"
            onPress={() => setOpenForm(true)}

          />
        </div>
      </section>


      <section className="w-full bg-light font-poppins px-5 md:px-10 xl:px-[120px]">

        {/* Section title */}
        <h2
          className="font-bold text-[#222222] text-center
            text-[20px] sm:text-[28px] md:text-[32px] lg:text-[40px] mt-12 md:mt-20 lg:mt-30 mb-6 md:mb-10"
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
        <RegisterForm
          variant="modal"
          open={openForm}
          onClose={() => setOpenForm(false)}
        />
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
      className={`flex flex-col rounded-[16px] md:rounded-[32px] py-5 md:py-8 lg:py-10 px-3 md:px-5 lg:px-6 bg-cartbox1 ${className}`}
    >
      <span
        className="font-semibold leading-[150%] text-dark
         font-24"
      >
        {title}
      </span>
      <span
        className="font-normal leading-[150%] text-dark
          font-20 mt-4"
      >
        {desc}
      </span>
    </div>
  );
}