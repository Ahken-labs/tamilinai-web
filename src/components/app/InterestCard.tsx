"use client";

import Image from "next/image";
import Link from "next/link";
import { Interest, InterestStatus } from "../../types/interest";
import {
  InterestArrowIcon,
  InterestXIcon,
  InterestLockIcon,
  InterestCheckIcon,
  RedDotIcon,
  ChevronRightIcon,
} from "../../assets/Icons";

// ── Badge components ──────────────────────────────────────────────────────

function SentBadge() {
  return (
    <div className="flex px-1 items-center rounded-[28.5px] bg-[#B31B38]">
      <InterestArrowIcon className="w-6 h-6" />
    </div>
  );
}

function ReceivedBadge() {
  return (
    <div className="flex px-1 items-center rounded-[28.5px] bg-[#B31B38]">
      <InterestArrowIcon className="w-6 h-6 rotate-180" />
    </div>
  );
}

function DeclinedBadge() {
  return (
    <div className="flex px-1 items-center rounded-[28.5px] bg-[#FFF0F3]">
      <InterestXIcon className="w-6 h-6" />
    </div>
  );
}

function SkippedBadge() {
  return (
    <div className="flex px-1 items-center rounded-[28.5px] bg-[#FFF0F3]">
      <InterestLockIcon className="w-6 h-6" />
    </div>
  );
}

function AcceptedCheckBadge() {
  return (
    <div className="flex px-1 items-center rounded-[28.5px] border-2 border-white bg-[#B31B38]">
      <InterestCheckIcon className="w-6 h-6" />
    </div>
  );
}

// ── Profile photo section ─────────────────────────────────────────────────

function PhotoSection({ interest }: { interest: Interest }) {
  const photo = interest.profilePhoto || "/images/no_photo.png";
  const myPhoto = interest.myPhoto || "/images/no_photo.png";
  const { status } = interest;

  if (status === "accepted_by_me" || status === "accepted_by_them") {
    const leftPhoto = status === "accepted_by_me" ? myPhoto : photo;
    const rightPhoto = status === "accepted_by_me" ? photo : myPhoto;
    return (
      <div className="relative flex-shrink-0 w-[86px] h-14">
        <div className="absolute left-0 top-0 w-14 h-14 rounded-full overflow-hidden border-2 border-white z-20 bg-[#D9D9D9]">
          <Image src={leftPhoto} fill className="object-cover" alt="my profile" sizes="56px" />
        </div>
        <div className="absolute left-[30px] top-0 w-14 h-14 rounded-full overflow-hidden border-2 border-white z-10 bg-[#D9D9D9]">
          <Image src={rightPhoto} fill className="object-cover" alt="their profile" sizes="56px" />
        </div>
        <div className="absolute -bottom-[5px] left-[44px] -translate-x-1/2 z-30">
          <AcceptedCheckBadge />
        </div>
      </div>
    );
  }

  const isSent = status === "sent_interest" || status === "sent_reminder";
  const badge = isSent ? <SentBadge /> :
    (status === "declined_by_me" ? <DeclinedBadge /> :
      status === "skipped_by_them" ? <SkippedBadge /> :
        <ReceivedBadge />);
  const cornerClass = isSent ? "left-0" : "right-0";

  return (
    <div className="relative flex-shrink-0 w-14 h-14">
      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#D9D9D9]">
        <Image src={photo} fill className="object-cover" alt={interest.profileName} sizes="56px" />
      </div>
      <div className={`absolute bottom-0 ${cornerClass}`}>{badge}</div>
    </div>
  );
}

// ── Content helpers ───────────────────────────────────────────────────────

function getTitle(status: InterestStatus, name: string): string {
  switch (status) {
    case "sent_interest":   return `You sent an interest to ${name}.`;
    case "sent_reminder":   return `You sent a reminder to ${name}.`;
    case "received_interest": return `${name} sent you an Interest`;
    case "received_reminder": return `${name} sent you a reminder`;
    case "accepted_by_me":  return `You accepted ${name}'s interest. 🎉`;
    case "accepted_by_them": return `🎉 Great News! ${name} accepted your interest.`;
    case "declined_by_me":  return `You declined ${name}'s interest.`;
    case "skipped_by_them": return `${name} skipped on your profile.`;
  }
}

function getDatePrefix(status: InterestStatus): string {
  switch (status) {
    case "sent_interest":
    case "sent_reminder":   return "Sent";
    case "received_interest":
    case "received_reminder": return "Received";
    case "accepted_by_me":  return "Connected";
    case "accepted_by_them": return "Received";
    case "declined_by_me":  return "Declined";
    case "skipped_by_them": return "Skipped on";
  }
}

interface ActionConfig {
  label: string;
  showDot: boolean;
  href?: string;
}

function getAction(interest: Interest): ActionConfig {
  const { status, isNew, isReminderDue } = interest;
  switch (status) {
    case "sent_interest":   return { label: "See status", showDot: false };
    case "sent_reminder":   return { label: "Send reminder", showDot: isReminderDue ?? false };
    case "received_interest": return { label: "See full profile", showDot: isNew ?? false };
    case "received_reminder": return { label: "See reminder", showDot: isNew ?? false };
    case "accepted_by_me":  return { label: "Chat now", showDot: false };
    case "accepted_by_them": return { label: "Start Chat", showDot: false };
    case "declined_by_me":  return { label: "See full profile", showDot: isNew ?? false };
    case "skipped_by_them": return { label: "View similar matches", showDot: isNew ?? false, href: "/matches" };
  }
}

// ── Main component ────────────────────────────────────────────────────────

interface InterestCardProps {
  interest: Interest;
  isLast?: boolean;
}

const ACTION_CLASS =
  "flex items-center gap-1.5 font-poppins font-16 font-normal text-[#B31B38] leading-[150%] whitespace-nowrap cursor-pointer";

function ActionButton({ action }: { action: ActionConfig }) {
  const inner = (
    <>
      {action.showDot && <RedDotIcon />}
      {action.label}
      <ChevronRightIcon className="w-5 h-5 shrink-0 text-[#B31B38]" />
    </>
  );
  return action.href ? (
    <Link href={action.href} className={ACTION_CLASS}>{inner}</Link>
  ) : (
    <button className={ACTION_CLASS}>{inner}</button>
  );
}

export default function InterestCard({ interest, isLast = false }: InterestCardProps) {
  const isSent = interest.status === "sent_interest" || interest.status === "sent_reminder";
  const action = getAction(interest);

  return (
    <div
      className={`flex items-center gap-4 px-4 py-6 bg-white ${!isLast ? "border-b border-[#EAEAEA]" : ""}`}
    >
      {/* Photo */}
      <PhotoSection interest={interest} />

      {/* Text + mobile action */}
      <div className="flex-1 min-w-0">
        <p className="font-poppins font-18 font-medium text-[#222222] leading-[150%]">
          {getTitle(interest.status, interest.profileName)}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="font-poppins font-16 font-normal text-[#767676] leading-[150%]">
            {getDatePrefix(interest.status)} • {interest.date}
          </span>
          {isSent && (
            <span className="font-poppins font-16 font-normal text-[#B31B38] leading-[150%] px-2 py-[2px] rounded-[40px] bg-[#FFF0F3]">
              Pending
            </span>
          )}
        </div>
        {/* Action shown below text on mobile only */}
        <div className="mt-2 sm:hidden">
          <ActionButton action={action} />
        </div>
      </div>

      {/* Action shown on the right on sm+ only */}
      <div className="hidden sm:flex shrink-0">
        <ActionButton action={action} />
      </div>
    </div>
  );
}
