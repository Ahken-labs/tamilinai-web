"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import Button from "../common-layout/Button";
import ProtectedImage from "../common-layout/ProtectedImage";
import { readMeCache } from "../AppHeader";
import { getProgressWidth } from "../../utils/getProgressWidth";
import { useScrollLock } from "../../hooks/useScrollLock";

// Score a user reaches by filling only the required setup fields + one OTP verification
export const MIN_SCORE_TO_SEND_INTEREST = 49;

// False when the cache is missing, so a cold cache never blocks sending
export function needsProfileToSendInterest(): boolean {
  const me = readMeCache();
  return !!me && me.profileCompletionScore < MIN_SCORE_TO_SEND_INTEREST;
}

// Popup on desktop, bottom sheet at ≤500px
export default function CompleteProfilePopup({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  useScrollLock(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const me = readMeCache();
  const score = me?.profileCompletionScore ?? 0;
  const photo = me?.profile?.photoUrl
    ?? (me?.gender === "male" ? "/images/no_photo_male.webp" : "/images/no_photo.webp");

  function handleComplete() {
    onClose();
    router.push("/my-profile");
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:px-4 bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        className="font-poppins relative w-full min-[500px]:max-w-[510px] max-h-[90dvh] overflow-y-auto rounded-t-[32px] min-[500px]:rounded-[32px] bg-white px-4 min-[500px]:px-5 pt-4 pb-8 min-[500px]:pb-8 shadow-2xl"
      >
        <div className="flex justify-end">
          <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer p-1">
            <FiX className="h-6 w-6 text-dark" strokeWidth={2} />
          </button>
        </div>

        <h2 className="font-tamil mt-2 min-[500px]:mt-6 text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-extrabold leading-[135%] text-dark">
          விருப்பம் அனுப்ப, உங்கள் சுயவிவரத்தை குறைந்தது {MIN_SCORE_TO_SEND_INTEREST}% பூர்த்தி செய்யவும்!
        </h2>

        <div className="mt-4 flex items-center gap-4 rounded-[16px] bg-[#F0F0F0] md:p-5 sm:p-4 p-3">
          <div className="relative h-[40px] w-[40px] md:h-10 md:w-10 shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]">
            <ProtectedImage src={photo} fill className="object-cover" alt="my profile" sizes="40px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-16 font-poppins font-normal leading-[150%] text-dark">Profile points</span>
              <span className="font-16 font-poppins font-normal leading-[150%] text-dark">{score}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-[27px] bg-[#D9D9D9]">
              <div className="h-full rounded-[27px] bg-[#FFADBD]" style={{ width: `${getProgressWidth(score)}%` }} />
            </div>
          </div>
        </div>

        <p className="font-tamil mt-4 font-16 font-normal leading-[150%] text-dark">
          உங்கள் கல்வி, தொழில், சமூக, மற்றும் வசிப்பிட விவரங்களைச் சேர்க்க 2 நிமிடங்கள் மட்டுமே ஆகும். இதனால் உங்கள் விருப்பம் ஏற்கப்படும் வாய்ப்பு அதிகரிக்கும்!
        </p>

        <div className="mt-5 md:mt-4 flex justify-center">
          <Button
            text="சுயவிவரத்தை நிறைவு செய்க"
            onPress={handleComplete}
            className="font-tamil max-[500px]:w-full max-[350px]:!px-5"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
