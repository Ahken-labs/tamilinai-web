"use client";

import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useLang } from "@/src/context/LangContext";
import {  UnionFullIcon } from "@/src/assets/Icons";
import { CONTACT } from "@/src/lib/contact";

export function HelpSection() {
  const { t } = useLang();
  return (
    <section
      className="relative w-full overflow-hidden mt-10 lg:mt-18 font-poppins"
      style={{
        background: "linear-gradient(180deg, #FFF7F0 0%, #FFEBEB 100%)",
      }}
    >
      {/* Background Design */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Mobile + md: left side, half visible */}
        <div className="absolute left-[-75%] sm:left-[-35%] md:left-[-35%] lg:left-[0%] top-[85px] lg:top-[0px]">
          <div className="relative">
            <UnionFullIcon className="w-[620px] md:w-[720px] lg:w-[570px] h-auto opacity-100" />
            <div className="absolute inset-0 lg:bg-gradient-to-l bg-gradient-to-b from-[#FFF7F0] via-[#FFF7F0]/35 to-transparent blur-3xm lg:blur-3xl" />
          </div>
        </div>

      </div>
      <div className="relative z-10 mx-auto max-w-[884px] sm:px-6 px-4 flex flex-col-reverse lg:flex-row items-center gap-10 pt-10">

        {/* ── LEFT IMAGE ── */}
        <div className="relative w-full md:w-auto flex justify-center">

          {/* Girl image */}
          <Image
            src="/images/help_girl.webp"
            alt="Support"
            width={250}
            height={400}
            sizes="(max-width: 768px) 180px, (max-width: 1024px) 220px, 250px"
            className="relative z-10  w-[180px] h-[288px] md:w-[220px] md:h-[352px] lg:w-[250px] lg:h-[400px] object-contain "
          />
        </div>

        <div className="flex flex-col text-center lg:text-left max-w-[620px]">
          <h2
            className="font-bold text-dark font-32">
            {t("Need_Help_Finding_a_Match")}
          </h2>
          <p className="mt-2 text-dark text-[15px] lg:text-[16px] max-w-[330px] md:max-w-[510px] mx-auto lg-max-w-none" >
            {t("Help_parah")}
          </p>

          {/* CTA WhatsApp */}
          <div className="mt-10 lg:mt-6">
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center
                h-[48px] px-10
                border border-[#222222]
                rounded-[31px]
                text-[#222222]
                bg-[#fff]
               text-[15px] md:text-[16px] font-medium
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