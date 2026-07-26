"use client";

import { SleepIcon } from "@/src/assets/Icons";
import Header from "@/src/components/Header";
import { useLang } from "@/src/context/LangContext";

export default function OnBreakPage() {
  const { t } = useLang();
  return (
    <main className="min-h-screen bg-white flex flex-col font-poppins">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF0F3] flex items-center justify-center mb-6">
          <SleepIcon className="text-[#B31B38] w-8 h-8"/>
        </div>
        <h1 className="text-[22px] font-semibold text-[#222]">{t("Business_on_break")}</h1>
        <p className="mt-3 max-w-[320px] text-[15px] leading-[155%] text-[#767676]">
          {t("Business_on_break_desc")}
        </p>
      </div>
    </main>
  );
}
