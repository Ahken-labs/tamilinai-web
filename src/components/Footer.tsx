"use client";

import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GlobeIcon, PrivacyChoicesIcon } from "../assets/Icons";
import { useLang } from "../context/LangContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "./auth/RegisterForm";

import translations from "../assets/translation.json";
import PrivacyPopup from "./footer/PrivacyPopup";

type FooterVariant = "landing" | "app";

interface FooterProps {
  variant?: FooterVariant;
}

// Nav link data
const NAV_LEFT = [
  { label: "Home", href: "#hero", appHref: "/matches" },
  { label: "About_Us", href: "#about", appHref: "/about" },
  { label: "Join_Now", href: "#", appHref: "/register" },
] as const;

const NAV_RIGHT = [
  { label: "Terms_Conditions", key: "terms" },
  { label: "Privacy_Policy", key: "privacy" },
  { label: "Blog", key: "blog" },
] as const;

// Social links
const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (isApp: boolean) => (
      <div
        className={`w-4 h-4 rounded-full flex items-end justify-center ${isApp ? "bg-[#464646]" : "bg-white"
          }`}
      >
        <FaFacebookF
          size={13}
          className={isApp ? "text-[#E4D8C4]" : "text-[#740234]"}
        />
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

export default function Footer({ variant = "landing" }: FooterProps) {
  // const { t } = useLang();
  //in futre remove this and use ----const { t } = useLang();----
  const { t: _t } = useLang();
  const t = (key: keyof typeof translations.en) =>
    variant === "app" ? translations.en[key] || key : _t(key);

  const [openForm, setOpenForm] = useState(false);
  const router = useRouter();

  const isApp = variant === "app";
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const textClass = isApp ? "text-[#464646] hover:text-[#222]" : "text-white hover:opacity-70";
  const navLinkClass = `font-poppins font-normal font-18 leading-[200%] ${textClass} transition-opacity duration-150 block`;

  const scrollTo = (href: string) => {
    if (!href.startsWith("#") || href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLeftNav = (label: string, href: string, appHref: string) => {
    if (isApp) {
      router.push(appHref);
      return;
    }
    if (label === "Join_Now") {
      setOpenForm(true);
    } else {
      scrollTo(href);
    }
  };

  return (
    <footer
      className="w-full font-poppins"
      style={
        isApp
          ? { background: "#E4D8C4" }
          : { background: "linear-gradient(270deg, #35050C 0%, #740234 100%)" }
      }
    >
      <div className="mx-auto max-w-[1200px] px-6 md:pt-10 pt-8 pb-0">

        {/* ── Top 3-column row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 lg:gap-0">

          {/* LEFT SIDE (Col1 + Col2 combined) */}
          <div className="flex justify-between max-w-[490px] w-full">

            {/* Col 1 */}
            <div className="flex flex-col gap-2 md:mr-4 mr:0 select-none">
              {NAV_LEFT.map(({ label, href, appHref }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleLeftNav(label, href, appHref)}
                  className={`cursor-pointer text-left ${navLinkClass}`}
                >
                  {t(label)}
                </button>
              ))}
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-2 md:mr-4 mr-0 select-none">
              {NAV_RIGHT.map(({ label, key }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (key === "privacy") setOpenPrivacy(true);
                    // later: terms, blog etc
                  }}
                  className={`cursor-pointer text-left ${navLinkClass}`}
                >
                  {t(label)}
                </button>
              ))}
            </div>

          </div>

          {/* Col 3 — Description (pushed right on desktop) */}
          <div className="md:ml-auto">
            <p className={`font-poppins font-normal font-16 leading-[150%] ${isApp ? "text-[#464646] " : "text-white"}`}>
              {t("Footer_parah")}
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className={`mt-5 border-t pt-[30px] pb-[40px] ${isApp ? "border-[#35050C]/30" : "border-white"}`}>
          <div className={`flex flex-col ${isApp ? "min-[650px]:flex-row min-[650px]:justify-between min-[650px]:items-left" : "min-[460px]:flex-row min-[460px]:justify-between min-[460px]:items-left"} items-left gap-4`}>

            {/* Left — copyright */}
            <div className="flex flex-wrap items-center gap-1.5 select-none">
              {isApp ? (
                <>
                  <span className={`font-poppins font-normal font-14 leading-[18px] ${textClass}`}>
                    © 2026 Ahken nexus
                  </span>

                  <Dot isApp={isApp} />

                  <span className={`font-poppins font-normal font-14 leading-[18px] ${textClass}`}>
                    Your Privacy Choices
                  </span>

                  <PrivacyChoicesIcon className="ml-1 w-5 md:w-6 h-3 shrink-0" />
                </>
              ) : (
                <span className={`font-poppins font-normal font-14 leading-[18px] ${textClass}`}>
                  © 2026 Ahken nexus
                </span>
              )}
            </div>

            {/* Right — locale + socials */}
            <div className={`flex flex-wrap items-center gap-2 ${isApp ? "min-[650px]:justify-end" : "min-[460px]:justify-end"} select-none`}>

              {/* Globe + locale */}
              <div className="flex items-center gap-1.5">
                <GlobeIcon className={`w-4 h-4 shrink-0 ${isApp ? "text-[#464646]" : "text-white"}`} />
                <span className={`font-poppins font-normal font-14 leading-[18px] ${textClass}`}>
                  {t("English")}
                </span>
              </div>

              <Dot isApp={isApp} />
              <span className={`font-poppins font-normal font-14 leading-[18px] ${textClass} mx-0 md:mx-2 lg:mx-3`}>
                {t("LKR")}
              </span>
              <Dot isApp={isApp} />

              {/* Social icons */}
              <div className="flex items-center gap-4 md:gap-6 lg:gap-8 ml-1 md:ml-3 lg:ml-4">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`transition transform hover:scale-110 duration-200 ${isApp ? "text-[#464646]" : "text-white"}`}
                  >
                    {typeof icon === "function" ? icon(isApp) : icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      {!isApp && (
        <RegisterForm
          variant="modal"
          open={openForm}
          onClose={() => setOpenForm(false)}
        />
      )}
      <PrivacyPopup
        isOpen={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
      />
    </footer>
  );
}

// Helpers
function Dot({ isApp }: { isApp: boolean }) {
  return (
    <span className={`text-[14px] leading-none ${isApp ? "text-[#35050C]" : "text-white"}`}>
      ·
    </span>
  );
}
