"use client";

import { useLang } from "@/src/context/LangContext";

import {
  StepProfileIcon,
  StepPreferencesIcon,
  StepMatchIcon,
  StepFamilyIcon,
  UnionDesignIcon,
} from "@/src/assets/Icons";
import Button from "@/src/components/common-layout/Button";
import { useState } from "react";
import RegisterForm from "@/src/components/auth/RegisterForm";

// Step data 
const STEPS = [
  {
    Icon: StepProfileIcon,
    title: "Create_Your_Profile",
    desc: "Add_details_and_photos_Our_verification_secures_the_process"
  },
  {
    Icon: StepPreferencesIcon,
    title: "Set_Preferences",
    desc: "Tell_us_what_matters_most_to_you_in_a_life_partner_from_background_to_values"
  },
  {
    Icon: StepMatchIcon,
    title: "Find_Your_Match",
    desc: "Browse_verified_profiles_with_total_photo_and_data_privacy"
  },
  {
    Icon: StepFamilyIcon,
    title: "Involve_Your_Family",
    desc: "Get_the_families_involved_Meet_and_solidify_the_bond_with_your_elders_blessings"
  },
] as const;


export default function HowItWorksSection() {
  const { t } = useLang();
  const [openForm, setOpenForm] = useState(false);
  return (
    <section className="relative w-full overflow-hidden bg-light font-poppins lg:pb-9 mb-10">
      {/* ── Left union design ── */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 
      select-none" aria-hidden="true" >
        <UnionDesignIcon className="h-[460px] w-auto md:h-[580px] lg:h-[728px] md:w-[290px] lg:w-[364px]"
          aria-hidden="true" />
      </div>

      {/* ── Right union design — mirrored ── */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none"
        aria-hidden="true"
      >
        <UnionDesignIcon
          className="h-[460px] w-auto md:h-[580px] lg:h-[728px] md:w-[290px] lg:w-[364px] scale-x-[-1]"
          aria-hidden="true"
        />
      </div>

      {/* ── Center glass card ── */}
      <div className="relative z-10 mx-auto w-full md:max-w-[480px] lg:max-w-[627px] md:px-0 sm:px-8">
        <div
          className="w-full sm:px-6 px-4 md:px-10 pt-10"
          style={{
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 4px 40px rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Title */}
          <div className="max-w-[328px] md:max-w-none mx-auto">
            <h2 className="font-28 text-center font-bold leading-[150%] text-dark">
              {t("Find_your_match_in_4_simple_steps")}
            </h2> </div>

          {/* Step rows */}
          <div className="lg:mt-10 md:mt-8 mt-6 flex flex-col gap-6 lg:gap-8">
            {STEPS.map((step, i) => (
              <StepRow
                key={i}
                Icon={step.Icon}
                title={t(step.title)}
                desc={t(step.desc)}
                isLast={i === STEPS.length - 1}
              />
            ))}
          </div>

          {/* Register CTA */}
          <div className="mt-6 md:mt-8 lg:mt-10 flex justify-center">
            <Button
              text={t("Register_for_free")}
              className="px-16"
              onPress={() => setOpenForm(true)}
            />
          </div>

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

// Step row 
function StepRow({
  Icon,
  title,
  desc,
  isLast,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">

      {/* Icon + connector */}
      <div className="relative flex flex-col items-center shrink-0">

        <div className="relative z-10 rounded-full bg-[#F0F0F0] p-3">
          <Icon className="w-6 h-6" />
        </div>

        {!isLast && (
          <div className="absolute top-[44px] h-[calc(100%+48px)] w-[2px] bg-[#F2F2F2]" />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="font-20 font-medium leading-[1.4] text-dark">
          {title}
        </span>

        <span className="mt-1 font-16 leading-[1.5] text-secondary4">
          {desc}
        </span>
      </div>
    </div>
  );
}