"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScrollLock } from "../../hooks/useScrollLock";
import { EliteProIcon, HeadphoneSupportIcon, InfinityIcon, StarBadgeIcon, TrophyIcon, UserSearchIcon, WhatsAppIcon } from "@/src/assets/Icons";
import { FiX } from "react-icons/fi";
import Button from "../common-layout/Button";
import { EliteProTag } from "./Tags";
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
  useScrollLock(true);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleUpgrade() {
    onClose();
    router.push("/elite-upgrade");
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex max-[500px]:items-end items-center justify-center max-[500px]:px-0 px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* ── MOBILE card (≤500px) ── */}
      <div
        className="min-[500px]:hidden font-poppins relative z-10 w-full max-w-[752px] max-[500px]:rounded-t-[20px] max-[500px]:rounded-b-none rounded-[16px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop background image */}
        <div
          className="absolute inset-0 max-[500px]:hidden"
          style={{ backgroundImage: "url('/images/elite_popup.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        />

        {/* Mobile background: image + gradient fade to white */}
        <style>{`
          .elite-mobile-bg {
            background: url('/images/elite_popup.webp') 90% top / auto 60% no-repeat;
          }
          @media (min-width: 380px) and (max-width: 500px) {
            .elite-mobile-bg { background: url('/images/elite_popup.webp') 94% top / auto 66% no-repeat; }
            .elite-heading-pt { padding-top: 133px; }
          }
          @media (min-width: 430px) and (max-width: 500px) {
            .elite-mobile-bg { background: url('/images/elite_popup.webp') 97% top / auto 71% no-repeat; }
            .elite-heading-pt { padding-top: 144px; }
          }
          @media (min-width: 470px) and (max-width: 500px) {
            .elite-mobile-bg { background: url('/images/elite_popup.webp') 100% top / auto 75% no-repeat; }
            .elite-heading-pt { padding-top: 155px; }
          }
        `}</style>
        <div className="absolute inset-0 hidden max-[500px]:block elite-mobile-bg" />

        {/* Content */}
        <div className="relative py-6 max-[500px]:py-0">

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white shadow cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform z-10"
            aria-label="Close"
          >
            <FiX className="w-4 h-4 text-dark" strokeWidth={2} />
          </button>

          {/* Content area */}
          <div className="pl-3 pr-3 max-[500px]:pb-3 py-0 relative">

            {/* Mobile: gradient fade transparent→white behind heading */}
            <div
              className="hidden max-[500px]:block absolute left-0 right-0 top-0 pointer-events-none z-0"
              style={{ height: "230px", background: "linear-gradient(180deg, rgba(255,255,255,0.00) 45%, rgba(255,255,255,0.64) 60%, #FFF 90%)" }}
            />
            {/* Mobile: solid white from features downward */}
            <div
              className="hidden max-[500px]:block absolute left-0 right-0 bottom-0 pointer-events-none z-0"
              style={{ top: "220px", background: "#FFF" }}
            />

            {/* Heading */}
            <div className="max-w-[224px] max-[500px]:pt-[125px] min-[380px]:pt-[133px] min-[430px]:pt-[144px] min-[470px]:pt-[155px] relative z-10">
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
                {/* <div className="inline-flex items-center gap-1 rounded-[40px] bg-[#FFDED3] px-2 max-[500px]:py-0 py-0.5">
                  <EliteCrownIcon className="w-5 h-5 shrink-0" />
                  <span className="font-poppins max-[500px]:text-[14px] text-[16px] sm:text-[18px] md:text-[20px] text-[#A97216]">Elite pro</span>
                </div> */}
                <EliteProTag />
              </div>
            </div>
            <ul className="mt-6  md:mt-8 flex flex-col gap-2 md:gap-3 max-w-[305px] relative z-10">
              {FEATURES.map(({ Icon, label }) => (
                <li key={label} className="flex items-center max-[500px]:gap-2 gap-2.5">
                  <Icon className="w-5 h-5 shrink-0 text-[#444444]" />
                  <span className="font-poppins text-[14px] md:text-[16px] leading-[150%] text-dark">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button text="View Elite plans"
              className="mt-6 !px-4 sm:!px-6 md:!px-8 max-[500px]:w-full relative z-10"
              iconLeft={<EliteProIcon className="w-5 h-5 shrink-0" fill="#FFFFFF" />}
              onPress={handleUpgrade} />
          </div>
        </div>
      </div>

      {/* ── DESKTOP card (>500px) — original unchanged ── */}
      <div
        className="max-[500px]:hidden font-poppins relative z-10 w-full max-w-[752px] rounded-[16px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/elite_popup.webp')" }}
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
              {/* <div className="inline-flex items-center gap-1 rounded-[40px] bg-[#FFDED3] px-2 py-0.5">
                <EliteCrownIcon className="w-4 md:w-5 h-4 md:h-5 shrink-0" />
                <span className="font-poppins text-[16px] sm:text-[18px] md:text-[20px] text-[#A97216]">Elite</span>
              </div> */}
              <EliteProTag/>
            </div>
          </div>

          {/* Features */}
          <ul className="mt-6 md:mt-8 flex flex-col gap-2 md:gap-3 max-w-[305px]">
            {FEATURES.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="w-4 md:w-5 h-4 md:h-5 shrink-0 text-[#444444]" />
                <span className="font-poppins text-[14px] md:text-[16px] leading-[150%] text-dark">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button text="View Elite plans"
            className="mt-6 !px-4 sm:!px-6 md:!px-8 "
            iconLeft={<EliteProIcon className="w-4 md:w-5 h-4 md:h-5 shrink-0 " fill="#FFFFFF" />}
            onPress={handleUpgrade} />
        </div>
      </div>
    </div>
  );
}
