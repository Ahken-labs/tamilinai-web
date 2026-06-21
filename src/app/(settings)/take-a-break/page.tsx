"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScrollHide } from "@/src/hooks/useScrollHide";
import { useQueryClient } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { FiAlertTriangle } from "react-icons/fi";

import {
  CloseCircleIcon,
  EliteIcon,
  PartnerPreferencesIcon,
  RadioCircleIcon,
  SearchMinusIcon,
  VerifiedShieldIcon,
} from "@/src/assets/Icons";
import Button from "@/src/components/common-layout/Button";
import { http } from "@/src/lib/api/client";
import { clearBlobCache } from "@/src/components/common-layout/ProtectedPhoto";
import { readMeCache } from "@/src/components/AppHeader";

const BREAK_OPTIONS = [
  { title: "1 week",   subtitle: "Back in 7 days automatically",  duration: "1_week"   },
  { title: "2 weeks",  subtitle: "Back in 14 days automatically", duration: "2_weeks"  },
  { title: "1 month",  subtitle: "Back in 30 days automatically", duration: "1_month"  },
  { title: "3 months", subtitle: "Back in 90 days automatically", duration: "3_months" },
];

const BREAK_ITEMS = [
  { icon: SearchMinusIcon,       title: "Profile hidden from search",   subtitle: "No one can discover or view your profile while on break." },
  { icon: VerifiedShieldIcon,    title: "Messages & data preserved",    subtitle: "All your conversations and matches are safely saved." },
  { icon: EliteIcon,             title: "Subscription continues",       subtitle: "Your plan time is not paused during your break." },
  { icon: PartnerPreferencesIcon,title: "Return anytime",               subtitle: "Reactivates automatically, or log in to return early." },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default function BreakPage() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [openBreakPopup, setOpenBreakPopup] = useState(false);
  const headerVisible = useScrollHide();

  const [photoSrc, setPhotoSrc] = useState("/images/no_photo.png");
  useEffect(() => {
    const gender = readMeCache()?.gender?.toLowerCase();
    if (gender === "male") setPhotoSrc("/images/no_photo_male.png");
  }, []);

  const selected = BREAK_OPTIONS[selectedOption];
  const durationDays = [7, 14, 30, 90][selectedOption];
  const startedDate = formatDate(new Date());
  const returnsDate = formatDate(addDays(new Date(), durationDays));

  return (
    <main className="min-h-screen bg-[#F8F5F2] font-poppins select-none pb-10">
      <div className="sticky top-[66px] md:top-[74px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE] transition-transform duration-300" style={!headerVisible ? { transform: "translateY(-128%)" } : undefined}>
        <div className="flex items-center justify-center px-4 py-3">
          <span className="fonts-24 font-semibold text-dark">Take a break from searching</span>
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[945px] flex-col items-center">

          <div className="relative h-15 w-15">
            <div className="h-full w-full overflow-hidden rounded-full">
              <Image src={photoSrc} alt="profile" width={60} height={60} priority />
            </div>
            <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full border-[1.5px] border-[#F8F5F2] bg-[#17EA21]" />
          </div>

          <span className="mt-2 text-center text-[14px] sm:text-[15px] md:text-[16px] leading-[150%] text-dark">
            Profile is active & visible
          </span>

          <p className="mt-4 md:mt-6 max-w-[483px] text-center text-[14px] sm:text-[15px] md:text-[16px] leading-[150%] text-dark">
            Need some time away? Pause your profile to keep your data safe and
            pick up right where you left off when you&apos;re ready.
          </p>

          <SectionBox title="How long do you need?">
            <div className="pt-2 grid grid-cols-1 min-[520px]:grid-cols-2 gap-3">
              {BREAK_OPTIONS.map(({ title, subtitle }, index) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => setSelectedOption(index)}
                  className="flex flex-col items-start self-stretch rounded-[20px] bg-cartbox2 p-4 text-left cursor-pointer"
                >
                  <RadioCircleIcon checked={selectedOption === index} />
                  <div className="mt-3 text-[16px] sm:text-[17px] md:text-[18px] font-medium leading-[150%] text-dark">{title}</div>
                  <div className="text-[14px] sm:text-[15px] md:text-[16px] mt-0.5 font-normal leading-[150%] text-secondary4">{subtitle}</div>
                </button>
              ))}
            </div>
          </SectionBox>

          <SectionBox title="What happens during your break">
            {BREAK_ITEMS.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-center gap-3 md:gap-4 py-3">
                <Icon className="h-5 w-5 shrink-0 text-dark sm:h-5.5 sm:w-5.5 md:h-6 md:w-6" />
                <div>
                  <div className="text-[16px] sm:text-[17px] md:text-[18px] font-medium leading-[150%] text-dark">{title}</div>
                  <div className="text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] text-secondary4">{subtitle}</div>
                </div>
              </div>
            ))}
          </SectionBox>

          <div className="mt-10 w-full gap-4 flex">
            <div className="flex-1" />
            <Button text="Confirm break" onPress={() => setOpenBreakPopup(true)} className="flex-1" />
          </div>

        </div>
      </div>

      <BreakConfirmPopup
        isOpen={openBreakPopup}
        onClose={() => setOpenBreakPopup(false)}
        durationLabel={selected.title}
        duration={selected.duration}
        startedDate={startedDate}
        returnsDate={returnsDate}
      />
    </main>
  );
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 sm:mt-8 md:mt-10 w-full rounded-[20px] bg-light px-4 py-3 md:px-6 md:py-4">
      <div className="mb-2 text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[150%] text-dark">{title}</div>
      {children}
    </div>
  );
}

function BreakConfirmPopup({
  isOpen, onClose, durationLabel, duration, startedDate, returnsDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  durationLabel: string;
  duration: string;
  startedDate: string;
  returnsDate: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await http("/api/user/take-a-break", {
        method: "POST",
        body: JSON.stringify({ duration }),
      });
    } catch { /* break set — proceed to logout regardless */ }

    try { await http("/api/auth/logout", { method: "POST" }); } catch { /* ignore */ }

    clearBlobCache();
    localStorage.clear();
    sessionStorage.clear();
    queryClient.clear();
    router.push("/");
  }

  return createPortal(
    <div className="fixed font-poppins inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-[784px] flex-col overflow-hidden rounded-[20px] bg-light shadow-2xl">
        <div className="flex items-center justify-between self-stretch border-b border-[#EAEAEA] px-4 md:px-6 pb-2 pt-4 md:pb-4 md:pt-6">
          <div className="flex items-center">
            <FiAlertTriangle className="w-4 md:w-6 h-4 md:h-6 mr-1 md:mr-2" />
            <span className="fonts-24 font-semibold leading-[150%] text-dark">Take a break from Inai?</span>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 cursor-pointer" aria-label="Close">
            <CloseCircleIcon className="h-8 w-8 transition-transform duration-200 hover:scale-110 active:scale-95" />
          </button>
        </div>

        <div className="px-4 md:px-6 pt-4 pb-4 md:pb-6">
          <p className="text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] text-dark">
            Your profile will be hidden from matches and search results. Relax —
            everything will be right here when you return, or log back in anytime to cancel your break early.
          </p>

          <div className="mt-4 md:mt-6 flex items-center justify-between max-[374px]:gap-0 gap-4">
            <div className="shrink-0">
              <div className="text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[150%] text-dark">Started</div>
              <div className="mt-1 text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] text-dark">{startedDate}</div>
            </div>

            <div className="relative flex-1 px-4">
              <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#D8D8D8]" />
              <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#D8D8D8]" />
              <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#D8D8D8]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D8D8D8] px-2 py-[2px] text-[14px] font-normal leading-[150%] text-dark">
                {durationLabel}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[150%] text-dark">Returns</div>
              <div className="mt-1 text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] text-dark">{returnsDate}</div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              text="Cancel"
              onPress={onClose}
              className="max-[408px]:!px-6 mr-3 sm:mr-4 md:mr-5 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
            />
            <Button
              text={submitting ? "Setting break…" : "Got it, log me out"}
              onPress={handleConfirm}
              disabled={submitting}
              className="max-[408px]:!px-6"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
