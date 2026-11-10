"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Anek_Tamil } from "next/font/google";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import Button from "../common-layout/Button";
import { CheckmarkIcon, EliteProIcon } from "@/src/assets/Icons";
import InstallAppPopup from "./InstallAppPopup";
import { useScrollLock } from "../../hooks/useScrollLock";
import { getMe } from "../../lib/api/user";
import { readMeCache, writeMeCache } from "../AppHeader";
import { isSriLanka } from "@/src/constants/elitePlans";
import { FREE_PLAN_POPUP_SEEN_KEY } from "@/src/constants/sessionKeys";

const anekTamil = Anek_Tamil({ subsets: ["tamil"], weight: "700", display: "swap" });

const COPY = {
  ta: {
    heading: "இலவசப் பயனராக நீங்கள்,",
    points: ["வரம்பற்ற வரன் சுயவிவரங்களைப் பார்க்கலாம்.", "தினமும் 20 விருப்பக் கோரிக்கைகள் அனுப்பலாம்."],
    nudge: "விருப்பத்தை ஏற்றுக்கொண்ட வரன்களின் நேரடித் தொடர்பு எண்களைப் பெற்று, நேரடியாகப் பேச உடனே Elite திட்டத்திற்கு மேம்படுத்துங்கள்.",
    upgrade: "Elite-க்கு மேம்படுத்துக",
    stay: "இலவசமாகத் தொடர்க",
  },
  en: {
    heading: "On the Free plan, you can:",
    points: ["View unlimited profiles", "Send up to 20 interest requests per day"],
    nudge: "Ready to talk? Upgrade to the Elite plan to unlock contact numbers and speak directly with your accepted matches.",
    upgrade: "Upgrade to Elite",
    stay: "Continue with Free",
  },
};

const POPUP_IMAGE = "/images/elite-reminder-poup.webp";
const IMAGE_WAIT_MS = 3000;

// Resolves when the image is in the browser cache, or after IMAGE_WAIT_MS on a slow connection
function preloadPopupImage(): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = POPUP_IMAGE;
    setTimeout(resolve, IMAGE_WAIT_MS);
  });
}

// Once per visit (per tab), a new login or sign-up shows it again. Free users: this card, then the install popup. Elite: install popup only
export default function FreePlanPopup() {
  const [lang, setLang] = useState<"ta" | "en" | null>(null);
  const [view, setView] = useState<"free" | "install" | null>(null);

  useEffect(() => {
    try { if (sessionStorage.getItem(FREE_PLAN_POPUP_SEEN_KEY)) return; } catch { return; }
    let cancelled = false;
    // Image and account load together, but a cached Elite user never downloads the image
    const imageReady = readMeCache()?.isElite ? null : preloadPopupImage();
    // Fresh data, so a user who just upgraded never sees it and the language is right
    getMe()
      .then(async (me) => {
        writeMeCache(me);
        if (!me.isElite) await (imageReady ?? preloadPopupImage());
        if (cancelled) return;
        try { sessionStorage.setItem(FREE_PLAN_POPUP_SEEN_KEY, "1"); } catch { /* unavailable */ }
        setLang(isSriLanka(me.countryCode) ? "ta" : "en");
        setView(me.isElite ? "install" : "free");
      })
      .catch(() => { /* no popup if the account can't be loaded */ });
    return () => { cancelled = true; };
  }, []);

  if (!lang) return null;
  return (
    <>
      {view === "free" && <FreePlanPopupCard lang={lang} onClose={() => setView(null)} onContinueFree={() => setView("install")} />}
      <InstallAppPopup lang={lang} open={view === "install"} onClose={() => setView(null)} />
    </>
  );
}

function FreePlanPopupCard({ lang, onClose, onContinueFree }: { lang: "ta" | "en"; onClose: () => void; onContinueFree: () => void }) {
  const router = useRouter();
  const copy = COPY[lang];
  const textFont = lang === "ta" ? "font-tamil" : "font-poppins";
  useScrollLock(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onContinueFree(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinueFree]);

  function handleUpgrade() {
    onClose();
    router.push("/elite-upgrade");
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:px-4 bg-black/50">
      {/* Bottom sheet at ≤500px, image on top below 900px, image on the left from 900px */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex w-full max-h-[92dvh] flex-col overflow-y-auto rounded-t-[32px] bg-white shadow-2xl min-[500px]:max-w-[500px] min-[500px]:rounded-[32px] min-[900px]:max-w-[846px] min-[900px]:flex-row min-[900px]:overflow-hidden"
      >
        {/* Soft pink shows if the image is still loading or failed, never white */}
        <div className="relative h-[150px] w-full shrink-0 overflow-hidden bg-[#F9E4EA] min-[900px]:h-auto min-[900px]:w-[50%]">
          {/* Already sized and compressed; optimising it again only adds artefacts */}
          <Image
            src={POPUP_IMAGE}
            alt=""
            fill
            priority
            unoptimized
            className="object-cover object-[25%_22%] min-[900px]:object-[18%_center] max-[470px]:scale-120 max-[600px]:origin-[20%_40%] max-[600px]:scale-115 max-[470px]:origin-[20%_40%] max-[390px]:scale-150 max-[390px]:origin-[10%_30%] min-[900px]:scale-127 min-[900px]:origin-[5%_50%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent min-[900px]:hidden" />
          <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-white to-transparent min-[900px]:block" />
        </div>

        <button
          type="button"
          onClick={onContinueFree}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-white shadow active:scale-95 transition-transform min-[900px]:right-auto min-[900px]:left-8"
        >
          <FiX className="h-4 w-4 text-dark" strokeWidth={2} />
        </button>

        <div className="flex flex-1 flex-col justify-center px-4 pb-6 pt-1 min-[900px]:px-6 min-[900px]:py-8">
          <h2 className={`${lang === "ta" ? anekTamil.className : "font-poppins font-semibold"} text-[20px] min-[500px]:text-[22px] min-[900px]:text-[24px] leading-[140%] text-[#222222]`}>
            {copy.heading}
          </h2>

          <ul className="mt-4 md:mt-5 flex flex-col md:gap-3 gap-2.5">
            {copy.points.map((point) => (
              <li key={point} className="flex items-center gap-1">
                <CheckmarkIcon className="h-5 w-5 shrink-0" />
                <span className={`${textFont} font-16 leading-[150%] text-[#222222]`}>{point}</span>
              </li>
            ))}
          </ul>

          <p className={`${textFont} mt-4 md:mt-6 ${lang === "ta" ? "text-[14px]" : "text-[14px] sm:text-[15px] md:text-[16px]"} font-semibold leading-[150%] text-[#B31B38]`}>
            {copy.nudge}
          </p>

          <Button
            text={copy.upgrade}
            onPress={handleUpgrade}
            iconLeft={<EliteProIcon className="h-4.5 sm:h-5 w-4.5 sm:w-5 shrink-0" fill="#FFFFFF" />}
            className={`${textFont} mt-6 w-full !px-4`}
          />
          <Button
            text={copy.stay}
            onPress={onContinueFree}
            className={`${textFont} mt-3 w-full !px-4 !bg-white !text-[#B31B38] border border-[#B31B38] hover:!bg-[#FFF0F3] active:!bg-[#FFE4E9]`}
          />
        </div>
      </div>
    </div>
  );
}
