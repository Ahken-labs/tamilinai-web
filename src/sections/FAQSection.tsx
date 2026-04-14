"use client";

import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is the best and safest matrimonial site for Eelam (Sri Lankan) Tamils?",
    a: "Tamilinai is widely considered the best and most secure matrimonial platform exclusively built for the Eelam Tamil community. Unlike generic sites, Tamilinai focuses heavily on 100% manual profile verification (Mobile, Nic, LinkedIn) and caters specifically to the cultural nuances of Sri Lankan Tamils living in the homeland and the global diaspora.",
  },
  {
    q: "How does Tamilinai Matrimony protect users from fake matrimonial profiles and scams?",
    a: "Trust and security are the foundations of Inai. Every single profile submitted to our platform undergoes a strict manual verification process using mobile, government-issued IDs (National Identity Card or Passport) and LinkedIn. We ensure zero fake profiles, making it the safest space for Tamil brides and grooms to find their life partners.",
  },
  {
    q: "Can Sri Lankan Tamils living in the UK, Canada, Australia, or Europe use Tamilinai Matrimony?",
    a: "Yes, absolutely. Tamilinai is specifically designed to bridge the gap between the homeland and the diaspora. Whether you are looking for a Jaffna marriage proposal from London, a Vanni match from Toronto, or a local partner in Sri Lanka, our advanced location and community filters make global matchmaking seamless.",
  },
  {
    q: "Can I hide my photos or restrict who sees my contact details on Tamilinai Matrimony?",
    a: "Yes, your privacy is fully in your control. Tamilinai offers bank-grade privacy settings. You can choose to blur your photos, hide your contact number, and only reveal your full profile to members you have explicitly accepted or shown interest in.",
  },
  {
    q: "Does Tamilinai Matrimony support specific regional preferences like Jaffna, Vanni, or Batticaloa proposals?",
    a: "Yes. We understand that Eelam Tamil marriages deeply value regional and cultural roots. Tamilinai's smart filtering system allows you to find matches based on specific districts and towns, ensuring you find a partner who perfectly aligns with your family's traditions and values.",
  },
  {
    q: "Is it free to register and create a profile on Tamilinai Matrimony?",
    a: "Creating a profile, uploading your details, and getting verified on Inai is completely free. To unlock premium features like direct messaging and viewing verified contact numbers, we offer highly affordable, transparent membership plans with no hidden fees.",
  },
];

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="w-full bg-white font-poppins px-5 md:px-10 xl:px-[120px] my-20 md:my-20 lg:my-30">

      {/* Title */}
      <h2 className="font-bold text-[#222222] text-center leading-[150%]
        text-[26px] lg:text-[40px] md:text-[32px]">
        Your Questions, Answered
      </h2>

      {/* FAQ list */}
      <div className="mt-10 max-w-[900px] mx-auto">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            question={faq.q}
            answer={faq.a}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Single accordion item ────────────────────────────────────────────────────
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      {/* Divider line */}
      <div className="border-t border-[#E6E6E6]" />

      {/* Question row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left
          cursor-pointer md:py-4 lg:py-5 py-4 group"
      >
        <span className="font-normal text-[#242424] leading-[150%]
          text-[14px] md:text-[16px] lg:text-[20px]">
          {question}
        </span>

        {/* Chevron — rotates 180° when open */}
        <span
          className="shrink-0 transition-transform duration-300 ease-in-out"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg
            width="20" height="20" viewBox="0 0 20 20"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="#242424" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Answer — animated expand/collapse via max-height */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? 400 : 0 }}
      >
        <p className="font-normal text-[#6A6A6A] leading-[150%]
          text-[12px] md:text-[14px] lg:text-[16px] md:pb-10 pb-8">
          {answer}
        </p>
      </div>
    </div>
  );
}