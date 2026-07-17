"use client";

import Header from "@/src/components/Header";
import { useLang } from "@/src/context/LangContext";

export default function UnderReviewPage() {
  const { t } = useLang();
  return (
    <main className="min-h-screen bg-white flex flex-col font-poppins">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF0F3] flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B31B38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className="text-[22px] font-semibold text-[#222]">{t("Profile_under_review")}</h1>
        <p className="mt-3 max-w-[320px] text-[15px] leading-[155%] text-[#767676]">
          {t("Profile_under_review_desc")}
        </p>
      </div>
    </main>
  );
}
