"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { EliteCrownIcon, HeadphoneSupportIcon, InfinityIcon, StarBadgeIcon, TrophyIcon, UserSearchIcon, WhatsAppIcon } from "@/src/assets/Icons";
import { FiX } from "react-icons/fi";
import Button from "./Button";
// ── Weekly nudge helpers ──────────────────────────────────────────────────────
const WEEKLY_KEY = "inai_elite_nudge_at";

export function shouldShowWeeklyNudge(): boolean {
  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    if (!raw) return true;
    return Date.now() - parseInt(raw) > 7 * 24 * 60 * 60 * 1000;
  } catch { return false; }
}

export function markWeeklyNudgeSeen(): void {
  try { localStorage.setItem(WEEKLY_KEY, String(Date.now())); } catch { }
}

// ── Trigger reasons ───────────────────────────────────────────────────────────
export type EliteUpgradeTrigger =
  | "daily_limit"      // free user hit 20 interest/day cap
  | "contact_locked"   // connected but contact hidden (non-elite)
  | "weekly_nudge";    // once-a-week gentle reminder

// const TRIGGER_COPY: Record<EliteUpgradeTrigger, { sub: string }> = {
//   daily_limit: { sub: "You've sent 20 interests today — that's the free plan limit. Elite members send unlimited interests every day." },
//   contact_locked: { sub: "You're connected! Upgrade to Elite to unlock their WhatsApp number and email so you can reach out directly." },
//   weekly_nudge: { sub: "Elite members find their match faster. Unlock unlimited interests, direct contact details, and more." },
// };

// ── Features list ─────────────────────────────────────────────────────────────
const FEATURES = [
  { Icon: WhatsAppIcon, label: "Direct WhatsApp connections" },
  { Icon: InfinityIcon, label: "Send unlimited interest requests" },
  { Icon: StarBadgeIcon, label: "Boosted profile visibility" },
  { Icon: UserSearchIcon, label: "See who viewed your profile" },
  { Icon: HeadphoneSupportIcon, label: "Priority customer service" },
  { Icon: TrophyIcon, label: "Dedicated support from Inai team" },
];

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  trigger: EliteUpgradeTrigger;
  onClose: () => void;
}

export default function EliteUpgradePopup({ onClose }: Props) {
  const router = useRouter();

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleUpgrade() {
    onClose();
    router.push("/elite-upgrade");
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Card */}
      <div
        className="font-poppins relative z-10 w-full max-w-[752px] rounded-[16px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/elite_popup.png')" }}
        />
        {/* Left overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-transparent" />

        {/* Content */}
        <div className="relative pr-4 pl-6 py-6">

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white shadow cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform"
            aria-label="Close"
          >
            <FiX className="w-4 h-4 text-dark" strokeWidth={2} />
          </button>

          {/* Heading */}
          <div className="max-w-[224px]">
            <p
              className="font-24 font-bold leading-[130%]"
              style={{
                background: "linear-gradient(90deg, #B31B38 0%, #222 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Find your match,{" "}

            </p>
            <div className="flex gap-3 mt-1 items-center">
              <p
                className="font-24 font-bold leading-[130%]"
                style={{
                  background: "linear-gradient(90deg, #B31B38 0%, #222 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                faster with
              </p>
              {/* Elite badge */}
              <div className="inline-flex items-center gap-1 rounded-[40px] bg-[#FFDED3] px-2 py-0.5">
                <EliteCrownIcon className="w-4 md:w-5 h-4 md:h-5 shrink-0" />
                <span className="font-poppins font-20 text-[#A97216]">Elite</span>
              </div>
            </div>


          </div>

          {/* Sub-copy */}
          {/* <p className="mt-3 font-poppins text-[13px] leading-[160%] text-[#444444] max-w-[340px]">
            {sub}
          </p> */}

          {/* Features */}
          <ul className="mt-6 md:mt-8 flex flex-col gap-2 md:gap-3 max-w-[305px]">
            {FEATURES.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="w-4 md:w-5 h-4 md:h-5 shrink-0 text-[#444444]" />
                <span className="font-poppins font-16 leading-[150%] text-dark">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button text="View Elite plans"
            className="mt-6"
            iconLeft={<EliteCrownIcon className="w-4 md:w-5 h-4 md:h-5 shrink-0 " fill="#FFFFFF" />}
            onPress={handleUpgrade} />
        </div>
      </div>
    </div>
  );
}
