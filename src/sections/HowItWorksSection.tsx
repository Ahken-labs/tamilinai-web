"use client";

import Image from "next/image";

// ─── Step data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    icon: "/icons/profile.png",
    title: "Create Your Profile",
    desc: "Add details and photos. Our 100% verification secures the process.",
  },
  {
    icon: "/icons/preferences.png",
    title: "Set Preferences",
    desc: "Tell us what matters most to you in a life partner, from background to values.",
  },
  {
    icon: "/icons/match.png",
    title: "Find Your Match",
    desc: "Browse verified profiles with total photo and data privacy.",
  },
  {
    icon: "/icons/family.png",
    title: "Involve Your Family",
    desc: "Get the families involved. Meet and solidify the bond with your elders' blessings.",
  },
];

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HowItWorksSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-0 md:py-12 font-poppins">

      {/* ── Left union design ── */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/union_design.png"
          alt=""
          width={797}
          height={780}
          className="h-[460px] object-contain md:h-[540px] lg:h-[780px]"
          style={{ width: "auto" }}
        />
      </div>

      {/* ── Right union design — mirrored ── */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none"
        aria-hidden="true"
      >
        <Image
          src="/images/union_design.png"
          alt=""
          width={797}
          height={780}
          className="h-[460px] object-contain md:h-[540px] lg:h-[780px] scale-x-[-1]"
          style={{ width: "auto" }}
        />
      </div>

      {/* ── Center glass card ── */}
      <div className="relative z-10 mx-auto w-full max-w-[800px] px-5 md:px-12 lg:px-0">
        <div
          className="w-full px-6 py-10 md:px-14 md:py-14"
          style={{
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 4px 40px rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Title */}
          <h2 className="mb-12 text-center font-semibold text-[26px] leading-[150%] text-[#222222] md:text-[32px]">
            How Tamilinai Works
          </h2>

          {/* Step rows */}
          <div className="flex flex-col gap-10">
            {STEPS.map((step, i) => (
              <StepRow key={i} icon={step.icon} title={step.title} desc={step.desc} />
            ))}
          </div>

          {/* Register CTA */}
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              className="flex h-12 cursor-pointer items-center justify-center gap-2
                rounded-full bg-[#B31B38] font-semibold text-[16px] leading-[150%]
                text-white transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]"
              style={{ paddingLeft: 64, paddingRight: 64 }}
            >
              Register for Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Step row ─────────────────────────────────────────────────────────────────
function StepRow({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-5">
      <Image
        src={icon}
        alt=""
        width={40}
        height={40}
        className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"

      />
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