"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Anek_Tamil } from "next/font/google";
import { FiDownload, FiX } from "react-icons/fi";
import Button from "../common-layout/Button";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useCanInstall, runInstall } from "../../hooks/useInstallApp";

const anekTamil = Anek_Tamil({ subsets: ["tamil"], weight: "700", display: "swap" });

const COPY = {
  ta: {
    heading: "ஒவ்வொரு முறையும் கூகுளில் தேட வேண்டாம்!",
    body: ["உடனுக்குடன் அறிவிப்புகள் (Notifications), சுலபமான பயன்பாடு மற்றும் முழுத்திரை அனுபவத்தைப் பெற ", "இணை செயலி (ஆப்)", " பயன்படுத்துங்கள்."],
    install: "இணை செயலியை நிறுவுக",
    later: "பிறகு",
  },
  en: {
    heading: "Get matches faster. Zero browser tabs.",
    body: ["Add inai.lk app to your home screen for instant notifications and a seamless, full-screen experience.", "", ""],
    install: "Install now",
    later: "Maybe Later",
  },
};

// New name for every new version: /images/ is cached for a year, so browsers would keep showing an old file with the same name
const POPUP_IMAGE = "/images/Install-App-Banner-v2.webp";
const IMAGE_WAIT_MS = 3000;

// Mounted early with open=false so the image is already downloaded when the popup opens
export default function InstallAppPopup({ lang, open, onClose }: { lang: "ta" | "en"; open: boolean; onClose: () => void }) {
  const canInstall = useCanInstall();
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    if (!canInstall || imageReady) return;
    let done = false;
    const finish = () => { if (!done) { done = true; setImageReady(true); } };
    const img = new window.Image();
    img.onload = finish;
    img.onerror = finish;
    img.src = POPUP_IMAGE;
    if (img.complete) finish();
    const timer = setTimeout(finish, IMAGE_WAIT_MS);
    return () => { done = true; clearTimeout(timer); };
  }, [canInstall, imageReady]);

  if (!open || !canInstall || !imageReady) return null;
  return <InstallAppCard lang={lang} onClose={onClose} />;
}

function InstallAppCard({ lang, onClose }: { lang: "ta" | "en"; onClose: () => void }) {
  const copy = COPY[lang];
  const textFont = lang === "ta" ? "font-tamil" : "font-poppins";
  useScrollLock(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleInstall() {
    onClose();
    runInstall();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:px-4 bg-black/50">
      {/* Bottom sheet at ≤500px, image on top below 900px, image on the left from 900px */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex w-full max-h-[92dvh] flex-col overflow-y-auto rounded-t-[32px] bg-white shadow-2xl min-[500px]:max-w-[500px] min-[500px]:rounded-[32px] min-[900px]:max-w-[750px] min-[900px]:flex-row min-[900px]:overflow-hidden"
      >
        <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-[#F9E4EA] min-[900px]:h-[360px] min-[900px]:w-[360px]">
          {/* Already sized and compressed; optimising it again only adds artefacts */}
          <Image
            src={POPUP_IMAGE}
            alt=""
            fill
            unoptimized
            className="object-cover max-[400px]:scale-115 max-[400px]:origin-[100%_77%] object-[0%_47%] min-[900px]:object-[100%_100%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent min-[900px]:hidden" />
          <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-white to-transparent min-[900px]:block" />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute left-8 top-8 z-10 hidden h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-white shadow active:scale-95 transition-transform min-[900px]:flex"
        >
          <FiX className="h-4 w-4 text-dark" strokeWidth={2} />
        </button>

        <div className="flex flex-1 flex-col justify-center px-4 pb-6 pt-1 min-[900px]:pl-4 min-[900px]:pr-6 min-[900px]:py-6">
          <h2 className={`${lang === "ta" ? anekTamil.className : "font-poppins font-semibold"} text-[20px] min-[500px]:text-[22px] min-[900px]:text-[24px] leading-[140%] text-[#222222]`}>
            {copy.heading}
          </h2>

          <p className={`${textFont} mt-4 sm:mt-5 md:mt-6 text-[14px] leading-[150%] text-[#222222]`}>
            {copy.body[0]}<span className="font-bold">{copy.body[1]}</span>{copy.body[2]}
          </p>

          <Button
            text={copy.install}
            onPress={handleInstall}
            iconLeft={<FiDownload className="h-4.5 sm:h-5 w-4.5 sm:w-5 shrink-0" />}
            className={`${textFont} mt-6 w-full !px-4`}
          />
          <Button
            text={copy.later}
            onPress={onClose}
            className={`${textFont} mt-3 w-full !px-4 !bg-white !text-[#B31B38] border border-[#B31B38] hover:!bg-[#FFF0F3] active:!bg-[#FFE4E9]`}
          />
        </div>
      </div>
    </div>
  );
}
