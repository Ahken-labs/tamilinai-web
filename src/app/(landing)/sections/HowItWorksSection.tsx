"use client";

import { useLang } from "@/src/context/LangContext";

import {
  StepProfileIcon,
  StepPreferencesIcon,
  StepMatchIcon,
  StepFamilyIcon,
  UnionDesignIcon,
} from "@/src/assets/Icons";
import Button from "@/src/components/common/Button";
import { useState } from "react";
import ProfileForm from "@/src/components/form/ProfileForm";

// ─── Step data ────────────────────────────────────────────────────────────────
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

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HowItWorksSection() {
  const { t } = useLang();
  const [openForm, setOpenForm] = useState(false);
  return (
    <section className="relative w-full overflow-hidden bg-white md:pt-10 pt-8 lg:py-12 font-poppins">

      {/* ── Left union design ── */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none"
        aria-hidden="true"
      >
        <UnionDesignIcon
          className="h-[460px] w-auto md:h-[640px] lg:h-[744px]"
          aria-hidden="true"
        />
      </div>

      {/* ── Right union design — mirrored ── */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none"
        aria-hidden="true"
      >
        <UnionDesignIcon
          className="h-[460px] w-auto md:h-[640px] lg:h-[744px] scale-x-[-1]"
          aria-hidden="true"
        />
      </div>

      {/* ── Center glass card ── */}
      <div className="relative z-10 mx-auto w-full max-w-[800px] px-5 md:px-12 lg:px-0">
        <div
          className="w-full px-6 py-10 md:px-10 md:py-14"
          style={{
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 4px 40px rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Title */}
          <h2 className="text-[18px] sm:text-[20px] md:text-[26px] lg:text-[32px] mb-12 text-center font-semibold leading-[150%] text-[#222222]">
            {t("Find_your_match_in_4_simple_steps")}
          </h2>

          {/* Step rows */}
          <div className="flex flex-col gap-10">
            {STEPS.map((step, i) => (
              <StepRow
                key={i}
                Icon={step.Icon}
                title={t(step.title)}
                desc={t(step.desc)}
              />
            ))}
          </div>

          {/* Register CTA */}
          <div className="mt-12 flex justify-center">
            <Button
              text={t("Register_for_free")}
              className="px-16"
              onPress={() => setOpenForm(true)}
            />
          </div>

        </div>
      </div>
      <ProfileForm
        variant="modal"
        open={openForm}
        onClose={() => setOpenForm(false)}
      />
    </section>
  );
}

// ─── Step row ─────────────────────────────────────────────────────────────────
function StepRow({
  Icon,
  title,
  desc,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <Icon />
      <div className="flex flex-col">
        <span className="text-[16px] font-medium leading-[1.4] text-[#222222] md:text-[20px]">
          {title}
        </span>
        <span className="mt-2 text-[13px] leading-[1.5] text-[#6B6B6B] md:text-[16px]">
          {desc}
        </span>
      </div>
    </div>
  );
}
