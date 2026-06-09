"use client";

import Button from "@/src/components/common-layout/Button";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { useLang } from "@/src/context/LangContext";
import Image from "next/image";
import { useState } from "react";
import { CommunityIcon, Logo, StepFamilyIcon, TamilLetterIcon } from "@/src/assets/Icons";

const TRUST_CARDS = [
  {
    title: "Exclusively_SriLankan_Tamil",
    desc: "Not_an_Tamil_platform_not_a_panTamil_platform",
    Icon: TamilLetterIcon,
  },
  {
    title: "One_united_community",
    desc: "We_welcome_SriLankan_Tamil_families_from_every_region_of_Sri_Lanka_Jaffna_Kilinochchi_Mullaitivu_Vavuniya_Trincomalee_Batticaloa_Kandy_Colombo_and_beyond",
    Icon: CommunityIcon,
  },
  {
    title: "Familyfirst_design",
    desc: "Share_profiles_with_parents_Involve_your_family_in_the_process_Because_Tamil_marriage_is_a_family_decision_and_our_platform_respects_that",
    Icon: StepFamilyIcon,
  },
] as const;

// ─── Main export ────
export default function ContactSection() {
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
        <div className="flex flex-col items-center px-5 pb-10 sm:pb-12 md:pb-14 lg:pb-18">

          <h2
            className="font-bold text-center leading-[150%] text-dark1
              font-32 lg:mt-15 md:mt-14 mt-12"
          >
            {t("Your_profile_stays_under_your_control")}
          </h2>
          <div className="mt-4">
            <p className="text-[15px] md:text-[16px] font-normal leading-[150%] text-dark text-center max-w-[730px]" >
              {t("We_built_privacy_into_every_part_of_Inai_lk_not_as_a_feature_you_activate")}
            </p>
            <p className="text-[15px] md:text-[16px] font-normal leading-[150%] text-dark text-center max-w-[730px]" >
              {t("but_as_the_foundation_of_how_the_platform_works")}
            </p>
          </div>
          {/* Phone image — simple CSS skeleton via bg + opacity trick */}
          <div
            className="relative mx-auto border-b-2 border-[#FFDED3]/50 w-full mt-6 md:mt-8 lg:mt-10"
            style={{ maxWidth: 565 }}
          >
            {/* Skeleton: just a rounded bg that disappears once image loads */}
            {!imageLoaded && (
              <div className="absolute inset-0 rounded-[32px] bg-[#e8d5d5] animate-pulse" />
            )}
            <Image
              src="/images/sample_profile_phone.webp"
              alt="Privacy control demo on phone"
              width={565}
              height={320}
              sizes="(max-width: 768px) 100vw, 565px"
              onLoad={() => setImageLoaded(true)}
              style={{
                width: "100%",
                objectFit: "contain",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            />
          </div>
          <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col items-center gap-5">
            <PrivacyCard
              title={t("Your_contact_details_are_private")}
              desc={t("No_one_can_see_your_phone_number_or_email_until_a_mutual_match")}
              badge={t("Always_on")}
            />
            <PrivacyCard
              title={t("Your_photo_only_who_you_allow")}
              desc={t("Choose_who_sees_your_photo_everyone_only_people_whose_interest")}
              badge={t("You_decide")}
            />
          </div>
          {/* CTA */}
          <Button
            text={t("Create_my_profile")}
            className="lg:mt-10 md:mt-8 mt-6 !md:text-[16px] !text-[15px]"
            onPress={() => setOpenForm(true)}
          />
        </div>
      </section>


      <section className="pt-14 md:pt-16 lg:pt-20 w-full bg-light font-poppins  lg:px-10">
        <h3 className="md:text-[16px] text-[15px] text-dark font-medium text-center">{t("Why_Inai")}</h3>
        <h2
          className="font-bold text-dark1 text-center font-32 mt-1 md:mt-2 max-w-[320px] md:max-w-[480px] lg:max-w-[600px] mx-auto" >
          {t("The_only_platform_built_exclusively_for_SriLankan_Tamils")}
        </h2>

        <div className="mt-4 mx-auto max-w-[1400px] md:mt-6 flex flex-col lg:grid lg:grid-cols-2 lg:gap-5">
          {/* Left */}
          <div className="h-full rounded-[16px] mx-auto md:max-w-[640px] lg:max-w-[690px] lg:bg-[#FFF6F0] lg:p-17 flex flex-col items-center lg:items-start px-4 sm:px-6 md:px-10">
            <Logo className="w-10 h-10" />

            <p className="mt-4 lg:mt-6 text-[15px] md:text-[16px] text-dark">
              {t("About_Parah1")}
              <br /><br />
              {t("About_Parah2")}
            </p>

            <div className="hidden lg:block">
              <Button
                text={t("Join_today")}
                onPress={() => setOpenForm(true)}
                className="mt-6 !md:text-[16px] !text-[15px]"
              />
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:flex flex-col gap-5 h-full">
            {TRUST_CARDS.map((card, i) => (
              <TrustCard
                key={i}
                title={t(card.title)}
                desc={t(card.desc)}
                Icon={card.Icon}
              />
            ))}
          </div>

          <div className="lg:hidden flex lg:hidden mt-8 md:px-6 sm:px-5 px-4 gap-4 overflow-x-auto no-scrollbar">
            {TRUST_CARDS.map((card, i) => (
              <div
                key={i}
                className="w-[312px] shrink-0 flex"
              >
                <TrustCard
                  title={t(card.title)}
                  desc={t(card.desc)}
                  Icon={card.Icon}
                />
              </div>
            ))}
          </div>
          <div className="lg:hidden mt-5 mx-auto">
            <Button
              text={t("Join_today")}
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
    </>
  );
}

function TrustCard({
  title,
  desc,
  className = "",
  Icon,
}: {
  title: string;
  desc: string;
  className?: string;
  Icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className={`flex flex-col  rounded-[16px] p-4 bg-cartbox2 ${className}`} >
      {Icon && (
        <div className="mb-2">
          <Icon className="w-6 h-6" />
        </div>
      )}

      <span className="font-semibold leading-[150%] text-dark md:text-[16px] text-[15px]">
        {title}
      </span>

      <span className="font-normal leading-[150%] text-dark lg:text-[16px] text-[14px] mt-2 lg:pr-4">
        {desc}
      </span>
    </div>
  );
}

function PrivacyCard({
  title,
  desc,
  badge,
}: {
  title: string;
  desc: string;
  badge: string;
}) {
  return (
    <div className="w-full max-w-[460px] rounded-[16px] bg-light p-4">

      <h2 className="md:text-[18px] text-[16px] font-semibold text-dark text-center">
        {title}
      </h2>

      <p className="mt-2 md:text-[16px] text-[15px] text-dark text-center leading-[150%]">
        {desc}
      </p>

      <div className="mt-3 flex justify-center">
        <div className="md:text-[16px] text-[15px] rounded-[48px] bg-[#FFDED3] px-3 py-1">
          {badge}
        </div>
      </div>

    </div>
  );
}