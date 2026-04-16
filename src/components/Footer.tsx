"use client";

import Image from "next/image";
import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLang } from "../context/LangContext";

// ─── Nav link data ────────────────────────────────────────────────────────────
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

const BOTTOM_LINKS = [
  { label: "Privacy_Policy", href: "#" },
  { label: "Terms_Conditions", href: "#" },
] as const;

// ─── Social links ─────────────────────────────────────────────────────────────
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

// ─── Shared link style ────────────────────────────────────────────────────────
const navLinkClass =
  "font-poppins font-normal text-[14px] md:text-[16px] lg:text-[18px] leading-[200%] text-white hover:opacity-70 transition-opacity duration-150 block";

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Footer() {
  const { t } = useLang();
  /** Smooth scroll helper */
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
          <div className="flex justify-between max-w-[400px] w-full">

            {/* Col 1 */}
            <div className="flex flex-col gap-2">
              {NAV_LEFT.map(({ label, href }) => (
                <a
                  key={t(label)}
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
              ))}
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-2">
              {NAV_RIGHT.map(({ label, href }) => (
                <a key={label} href={href} className={navLinkClass}>
                  {t(label)}
                </a>
              ))}
            </div>

          </div>

          {/* Col 3 — Description (pushed right on desktop) */}
          <div className="md:ml-auto ">
            <p className="font-poppins font-normal text-[13px] md:text-[14px] lg:text-[16px] leading-[150%] text-white">
              {t("Footer_parah")}
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-5 border-t border-white pt-[30px] pb-[40px]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

            {/* Left — copyright + legal links */}
            <div className="w-full md:w-[500px] flex flex-wrap items-center gap-1.5">
              <span className="font-poppins font-normal text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] text-white">
                © 2026 Ahken nexus
              </span>

              {BOTTOM_LINKS.map(({ label, href }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Dot />
                  <a
                    href={href}
                    className="font-poppins font-normal text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] text-white hover:text-white transition-colors"
                  >
                    {t(label)}
                  </a>
                </div>
              ))}

              <Dot />
              <a
                href="#"
                className="font-poppins font-normal text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] text-white hover:text-white transition-colors"
              >
                Your Privacy Choices
              </a>

              {/* Privacy icon */}
              <Image
                src="/icons/privacy_icon.png"
                alt="Privacy choices icon"
                width={26}
                height={12}
                className="w-[22px] md:w-[24px] lg:w-[26px]"
                style={{ marginLeft: 8, verticalAlign: "middle" }}
              />
            </div>

            {/* Right — locale + socials */}
            <div className="w-full flex flex-wrap items-center gap-2 md:justify-end">

              {/* Globe + locale */}
              <div className="flex items-center gap-1.5">
                <GlobeIcon />
                <span className="font-poppins font-normal text-[12px] md:text-[13px] lg:text-[14px] leading-[18px] text-white">
                  English (UK)
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
    </footer>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Dot() {
  return <span className="text-white text-[14px] leading-none">·</span>;
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" />
      <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" />
    </svg>
  );
}