"use client";

import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GlobeIcon } from "../assets/Icons";
import { useLang } from "../context/LangContext";
import { useState } from "react";
import RegisterForm from "./form/RegisterForm";

// Nav link data
const NAV_LEFT = [
  { label: "Home", href: "#hero" },
  { label: "About_Us", href: "#about" },
  { label: "Join_Now", href: "#" },
] as const;

const NAV_RIGHT = [
  { label: "Terms_Conditions", href: "#" },
  { label: "Privacy_Policy", href: "#" },
  { label: "Blog", href: "#" },
] as const;

// Social links
const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <div className="w-4 h-4 rounded-full bg-white flex items-end justify-center">
        <FaFacebookF size={13} className="text-[#740234]" />
      </div>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/94762360948",
    icon: <FaWhatsapp size={17} />,
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    icon: <FaXTwitter size={15} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <FaInstagram size={15} />,
  },
];

// Shared link style
const navLinkClass =
  "font-poppins font-normal text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] leading-[200%] text-white hover:opacity-70 transition-opacity duration-150 block";

export default function Footer() {
  const { t } = useLang();
  const [openForm, setOpenForm] = useState(false);

  const scrollTo = (href: string) => {
    if (!href.startsWith("#") || href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="w-full font-poppins"
      style={{ background: "linear-gradient(270deg, #35050C 0%, #740234 100%)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:pt-10 pt-8 pb-0">

        {/* ── Top 3-column row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 lg:gap-0">

          {/* LEFT SIDE (Col1 + Col2 combined) */}
          <div className="flex justify-between max-w-[490px] w-full">

            {/* Col 1 */}
            <div className="flex flex-col gap-2 md:mr-4 mr:0 select-none">
              {NAV_LEFT.map(({ label, href }) => {
                const isJoinNow = label === "Join_Now";

                return isJoinNow ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setOpenForm(true)}
                    className={`cursor-pointer ${navLinkClass}`}
                  >
                    {t(label)}
                  </button>
                ) : (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => {
                      if (href.startsWith("#")) {
                        e.preventDefault();
                        scrollTo(href);
                      }
                    }}
                    className={navLinkClass}
                  >
                    {t(label)}
                  </a>
                );
              })}
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-2 md:mr-4 mr-0 select-none">
              {NAV_RIGHT.map(({ label, href }) => (
                <a key={label} href={href} className={navLinkClass}>
                  {t(label)}
                </a>
              ))}
            </div>

          </div>

          {/* Col 3 — Description (pushed right on desktop) */}
          <div className="md:ml-auto ">
            <p className="font-poppins font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] leading-[150%] text-white">
              {t("Footer_parah")}
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-5 border-t border-white pt-[30px] pb-[40px]">
          <div className="flex flex-col min-[440px]:flex-row min-[440px]:justify-between min-[440px]:items-left items-left gap-4">

            {/* Left — copyright */}
            <div className="flex flex-wrap items-center gap-1.5 select-none">
              <span className="font-poppins font-normal text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] text-white">
                © 2026 Ahken nexus
              </span>
            </div>

            {/* Right — locale + socials */}
            <div className="flex flex-wrap items-center gap-2 min-[440px]:justify-end select-none">

              {/* Globe + locale */}
              <div className="flex items-center gap-1.5">
                <GlobeIcon className="w-4 h-4 text-white shrink-0" />
                <span className="font-poppins font-normal text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] text-white">
                  {t("English")}
                </span>
              </div>

              <Dot />
              <span className="font-poppins font-normal text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] text-white mx-0 md:mx-2 lg:mx-3">
                {t("LKR")}
              </span>
              <Dot />

              {/* Social icons */}
              <div className="flex items-center gap-4 md:gap-6 lg:gap-8 ml-1 md:ml-3 lg:ml-4">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-white transition transform hover:scale-110 duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <RegisterForm
        variant="modal"
        open={openForm}
        onClose={() => setOpenForm(false)}
      />
    </footer>
  );
}

// Helpers
function Dot() {
  return <span className="text-white text-[14px] leading-none">·</span>;
}
