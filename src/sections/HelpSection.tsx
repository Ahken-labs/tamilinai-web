"use client";

import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useLang } from "../context/LangContext";

const WHATSAPP_NUMBER = "+94762360948";

export function HelpSection() {
  const { t } = useLang();
  return (
    <section
      className="
        relative w-full overflow-hidden
        mt-8 md:mt-15 lg:mt-25"
      style={{
        background: "linear-gradient(180deg, #FFF7F0 0%, #FFEBEB 100%)",
      }}
    >
      <div className="mx-auto max-w-[1100px] px-6 flex flex-col md:flex-row items-center gap-10">

        {/* ── LEFT IMAGE ── */}
        <div className="w-full md:w-auto flex justify-center">
          <Image
            src="/images/help_girl.png"
            alt="Support"
            width={528}
            height={480}
            className="
              w-[260px] sm:w-[360px] md:w-[420px] lg:w-[528px]
              h-auto object-contain
            "
            priority
          />
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="flex flex-col text-center md:text-left max-w-[620px]">

          {/* Title */}
          <h2
            className="
              font-bold text-[#222222]
              text-[20px] sm:text-[28px] md:text-[30px] lg:text-[40px]
              leading-[120%]
            "
          >
            {t("Need_Help_Finding_a_Match")}
          </h2>

          {/* Description */}
          <p
            className="
              mt-4 md:mt-6 text-[#222222]
              text-[12px] md:text-[14px] lg:text-[16px]
              leading-[150%]
            "
          >
            {t("Chat_with_Tamilinais_friendly_support_team_for_profile_creation_photo_uploads_or_personalized_matchmaking_assistance")}
          </p>

          {/* WhatsApp Button */}
          <div className="mt-8 lg:mb-0 md:mb-0 mb-6 md:mt-10">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center
                h-[48px] px-10
                border border-[#222222]
                rounded-[31px]
                text-[#222222]
               text-[14px] md:text-[16px] font-medium
                transition hover:bg-[#075E54] hover:text-white
              "
            >
              <FaWhatsapp className="mr-2 text-[18px]" />
              {t("WhatsApp")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}