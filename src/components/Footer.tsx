"use client";

import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GlobeIcon, PrivacyChoicesIcon } from "../assets/Icons";
import { useLang } from "../context/LangContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "./auth/RegisterForm";
import TermsPopup from "./footer/TermsPopup";
import PrivacyPopup from "./footer/PrivacyPopup";
import RefundPolicyPopup from "./footer/RefundPolicyPopup";

import translations from "../assets/translation.json";
import { CONTACT } from "../lib/contact";
import { GoogleReviewTag, TrustpilotReviewTag, InaiReviewTag } from "./review/ReviewTag";

type FooterVariant = "landing" | "app";

interface FooterProps {
  variant?: FooterVariant;
}

// Nav link data
const NAV_LEFT = [
  { label: "Home", href: "#hero", appHref: "/matches" },
  { label: "About_Us", href: "#about", appHref: "/about" },
  // { label: "Join_Now", href: "#", appHref: "/register" },
  { label: "Terms_Conditions", href: "/terms", appHref: "/terms" },
  { label: "Privacy_Policy", href: "/privacy", appHref: "/privacy" },
  { label: "Refund_Return_Policy", href: "/refund-policy", appHref: "/refund-policy" },
  { label: "Ratings_and_reviews", href: "", appHref: "" },
  // { label: "Pricing", href: "", appHref: "" },
] as const;

// Social links
const SOCIALS = [
  {
    label: "Facebook",
    href: CONTACT.socials.facebook,
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
    href: CONTACT.whatsappUrl,
    icon: <FaWhatsapp size={17} />,
  },
  {
    label: "Twitter / X",
    href: CONTACT.socials.twitter,
    icon: <FaXTwitter size={15} />,
  },
  {
    label: "Instagram",
    href: CONTACT.socials.instagram,
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
  const [openPopup, setOpenPopup] = useState<"terms" | "privacy" | "refund" | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(CONTACT.email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 400);
    });
  }
  const router = useRouter();

  const isApp = variant === "app";

  const textClass = isApp ? "text-[#464646] hover:text-[#222]" : "text-white hover:opacity-70";
  const navLinkClass = `font-poppins font-normal lg:text-[18x] md:md:-[16px] text-[15px] leading-[200%] ${textClass} transition-opacity duration-150 block`;

  const scrollTo = (href: string) => {
    if (!href.startsWith("#") || href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLeftNav = (label: string, href: string, appHref: string) => {
    if (isApp) {
      if (label === "Terms_Conditions") { setOpenPopup("terms"); return; }
      if (label === "Privacy_Policy") { setOpenPopup("privacy"); return; }
      if (label === "Refund_Return_Policy") { setOpenPopup("refund"); return; }
      router.push(appHref);
      return;
    }
    if (label === "Join_Now") {
      setOpenForm(true);
    } else if (label === "Terms_Conditions" || label === "Privacy_Policy" || label === "Refund_Return_Policy") {
      router.push(href);
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
      <div className="mx-auto max-w-[1200px] px-6 min-[890px]:pt-10 pt-8 pb-0">

        {/* ── Top 3-column row ── */}
        <div className="grid grid-cols-1 min-[890px]:grid-cols-2 gap-6 sm:gap-8 min-[890px]:gap-10 lg:gap-0">

          {/* LEFT SIDE (Col1 + Col2 combined) */}
          <div className="flex flex-col min-[460px]:flex-row min-[460px]:justify-between max-w-[490px] w-full gap-6 min-[460px]:gap-0">

            {/* Col 1 */}
            <div className="flex flex-col gap-2 md:mr-4 mr:0 select-none">
              {NAV_LEFT.map(({ label, href, appHref }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleLeftNav(label, href, appHref)}
                  className={`cursor-pointer text-left ${navLinkClass} ${label === "Home" ? "font-semibold" : ""}`}
                >
                  {t(label)}
                </button>
              ))}
            </div>

            {/* Col 2 — Contact */}
            <div className="flex flex-col gap-2 md:mr-4 mr-0 select-none">
              <span className={`font-poppins font-semibold text-[15px] leading-[200%] ${isApp ? "text-[#464646]" : "text-white"}`}>
                Contact
              </span>
              <a href={CONTACT.company.website} target="_blank" rel="noopener noreferrer" className={`${navLinkClass} no-underline`}>
                {CONTACT.company.name}
              </a>
              <span className={`font-poppins font-normal text-[15px] leading-[200%] ${isApp ? "text-[#464646]" : "text-white"} block`}>{CONTACT.address.line1}</span>
              <span className={`font-poppins font-normal text-[15px] leading-[200%] ${isApp ? "text-[#464646]" : "text-white"} block`}>{CONTACT.address.line2}</span>
              {/* primary placeholder number */}
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${navLinkClass} no-underline`}>
                +94 77 075 0760
              </a>
              {/* secondary placeholder number */}
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${navLinkClass} no-underline`}>
                +94 75 020 7507
              </a>
              <button type="button" onClick={copyEmail} className={`cursor-pointer text-left ${navLinkClass}`}>
                {emailCopied ? "Copied!" : CONTACT.email}
              </button>
            </div>

          </div>

          {/* Col 3 — Description + Review tags (pushed right on desktop) */}
          <div className="min-[890px]:ml-auto select-none">
            <p className={`font-poppins font-normal md:text-[16px] text-[14px] leading-[150%] ${isApp ? "text-[#464646] " : "text-white"}`}>
              {t("Footer_parah")}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 overflow-visible">
              <GoogleReviewTag />
              <TrustpilotReviewTag />
              <InaiReviewTag />
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className={`mt-5 border-t pt-[30px] pb-[40px] ${isApp ? "border-[#35050C]/30" : "border-white"}`}>
          <div className={`flex flex-col ${isApp ? "min-[750px]:flex-row min-[750px]:justify-between min-[750px]:items-left" : "min-[600px]:flex-row min-[600px]:justify-between min-[600px]:items-left"} items-left gap-4`}>

            {/* Left — copyright */}
            <div className="flex flex-wrap items-center gap-1.5 select-none">
              {isApp ? (
                <>
                  <span className={`font-poppins font-normal text-[14px] ${textClass}`}>
                    © 2026{" "}
                    <a
                      href={CONTACT.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:opacity-70 transition-opacity"
                    >
                      {CONTACT.company.name}
                    </a>
                  </span>

                  <Dot isApp={isApp} />

                  <span className={`font-poppins font-normal text-[14px] ${textClass}`}>
                    Your Privacy Choices
                  </span>

                  <PrivacyChoicesIcon className="ml-1 w-5 md:w-6 h-3 shrink-0" />
                </>
              ) : (
                <span className={`font-poppins font-normal text-[14px] ${textClass}`}>
                  © 2026{" "}
                  <a
                    href={CONTACT.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline hover:opacity-70 transition-opacity"
                  >
                    {CONTACT.company.name}
                  </a>
                </span>
              )}
            </div>

            {/* Right — locale + socials */}
            <div className={`flex flex-wrap items-center gap-2 ${isApp ? "min-[750px]:justify-end" : "min-[600px]:justify-end"} select-none`}>

              {/* Globe + locale */}
              <div className="flex items-center gap-1.5">
                <GlobeIcon className={`w-4 h-4 shrink-0 ${isApp ? "text-[#464646]" : "text-white"}`} />
                <span className={`font-poppins font-normal text-[14px] leading-[18px] ${textClass}`}>
                  {t("English")}
                </span>
              </div>

              <Dot isApp={isApp} />
              <span className={`font-poppins font-normal text-[14px] leading-[18px] ${textClass} mx-0 md:mx-2 lg:mx-3`}>
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
                    className={`transition transform hover:scale-150 duration-200 ${isApp ? "text-[#464646]" : "text-white"}`}
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
      {isApp && (
        <>
          <TermsPopup isOpen={openPopup === "terms"} onClose={() => setOpenPopup(null)} />
          <PrivacyPopup isOpen={openPopup === "privacy"} onClose={() => setOpenPopup(null)} />
          <RefundPolicyPopup isOpen={openPopup === "refund"} onClose={() => setOpenPopup(null)} />
        </>
      )}
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
