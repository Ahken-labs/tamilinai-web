"use client";

import { useState } from "react";
import { useLang } from "../context/LangContext";

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "FAQ1",
    a: "FAQ1_Answer",
  },
  {
    q: "FAQ2",
    a: "FAQ2_Answer",
  },
  {
    q: "FAQ3",
    a: "FAQ3_Answer",
  },
  {
    q: "FAQ4",
    a: "FAQ4_Answer",
  },
  {
    q: "FAQ5",
    a: "FAQ5_Answer",
  },
  {
    q: "FAQ6",
    a: "FAQ6_Answer",
  },
] as const;

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLang();

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="w-full bg-white font-poppins px-5 md:px-10 xl:px-[120px] my-20 md:my-20 lg:my-30">

      {/* Title */}
      <h2 className="font-bold text-[#222222] text-center leading-[150%]
        text-[26px] lg:text-[40px] md:text-[32px]">
        {t("Your_Questions_Answered")}
      </h2>

      {/* FAQ list */}
      <div className="mt-10 max-w-[900px] mx-auto">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            question={t(faq.q)}
            answer={t(faq.a)}
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