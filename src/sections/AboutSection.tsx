"use client";

import Image from "next/image";
import { useState } from "react";

// ─── Data ───────
const TRUST_CARDS = [
  {
    title: "Diaspora Connected",
    desc: "Bridging the gap between Tamils living in Jaffna, Vanni, Batticaloa and the United Kingdom, Canada, and Europe.",
  },
  {
    title: "Parents' First Choice",
    desc: "Built with family values in mind, making it safe for parents to search for their children.",
  },
  {
    title: "100% Verified Profiles",
    desc: "Every single profile is manually verified using government IDs before going live.",
  },
];

// ─── Main export ────
export default function AboutSection() {
  const [imageLoaded, setImageLoaded] = useState(false);

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
            Absolute Privacy Control
          </h2>

          {/* Body */}
          <p
            className="font-normal leading-[150%] text-[#222222]
              text-center max-w-[730px] text-[13px] md:text-[16px]"
            style={{ marginTop: 24 }}
          >
            At Tamilinai, you have 100% control over who views your profile and photos.
            Our &ldquo;Safe-View&rdquo; technology ensures your identity is protected
            until you choose to share it.
          </p>

          {/* CTA */}
          <button
            type="button"
            className="font-semibold text-[16px] leading-[150%] tracking-wide
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
            Start Your Journey
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
          Why Our Community Trusts Us
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10">
          {TRUST_CARDS.map((card, i) => (
            <TrustCard
              key={i}
              title={card.title}
              desc={card.desc}
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
          text-[18px] lg:text-[24px] md:text-[20px]"
      >
        {title}
      </span>
      <span
        className="font-normal leading-[150%] text-[#222222]
          text-[13px] lg:text-[20px] md:text-[15px] mt-4"
      >
        {desc}
      </span>
    </div>
  );
}