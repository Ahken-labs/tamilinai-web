"use client";

import ProtectedImage from "../common-layout/ProtectedImage";
import { useRouter } from "next/navigation";
import { getProfilePhotoSrc } from "../../utils/profilePhoto";
import type { Interest, InterestCardStatus, SentInterest, ReceivedInterest } from "../../types/interest";
import { markInterestSeen } from "../../lib/api/interests";
import { useQueryClient } from "@tanstack/react-query";
import {
  InterestArrowIcon,
  InterestXIcon,
  InterestLockIcon,
  InterestCheckIcon,
  RedDotIcon,
  ChevronRightIcon,
} from "../../assets/Icons";

// ── Badge components ──────────────────────────────────────────────────────────

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

// ── Photo section ─────────────────────────────────────────────────────────────

function PhotoSection({ interest }: { interest: Interest }) {
  const isPrivate = interest.isPhotoPrivate;
  const rawPhoto = (!isPrivate && interest.profilePhoto) ? interest.profilePhoto : null;

  const photo = getProfilePhotoSrc(rawPhoto, "approved", interest.gender);
  const myPhoto = interest.myPhoto ?? "/images/no_photo.png";
  const { status } = interest;

  if (status === "accepted_by_me" || status === "accepted_by_them") {
    const leftPhoto = status === "accepted_by_me" ? myPhoto : photo;
    const rightPhoto = status === "accepted_by_me" ? photo : myPhoto;
    return (
      <div className="relative flex-shrink-0 w-[94px] h-14">
        <div className="absolute left-0 top-0 w-14 h-14 rounded-full overflow-hidden border-2 border-white z-20 bg-[#D9D9D9]">
          <ProtectedImage src={leftPhoto} fill className="object-cover" alt="my profile" sizes="56px" />
        </div>
        <div className="absolute left-[38px] top-0 w-14 h-14 rounded-full overflow-hidden border-2 border-white z-10 bg-[#D9D9D9]">
          <ProtectedImage src={rightPhoto} fill className="object-cover" alt="their profile" sizes="56px" />
        </div>
        <div className="absolute bottom-0 left-[52px] -translate-x-1/2 z-30">
          <AcceptedCheckBadge />
        </div>
      </div>
    );
  }

  const isSent = status === "sent_interest" || status === "sent_reminder";
  const isSkipped = status === "skipped_by_them";
  const badge = isSent ? <SentBadge />
    : status === "declined_by_me" ? <DeclinedBadge />
    : status === "skipped_by_them" ? <SkippedBadge />
    : <ReceivedBadge />;
  const cornerClass = isSent ? "left-0" : "right-0";

  return (
    <div className="relative flex-shrink-0 w-14 h-14">
      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#D9D9D9]">
        <ProtectedImage
          src={photo}
          fill
          className={`object-cover${isSkipped ? " grayscale" : ""}`}
          alt={interest.profileName}
          sizes="56px"
        />
      </div>
      <div className={`absolute bottom-0 ${cornerClass}`}>{badge}</div>
    </div>
  );
}

// ── Content helpers ───────────────────────────────────────────────────────────

function getTitle(status: InterestCardStatus, name: string): string {
  switch (status) {
    case "sent_interest":    return `You sent an interest to ${name}.`;
    case "sent_reminder":    return `You sent a reminder to ${name}.`;
    case "received_interest": return `${name} sent you an interest.`;
    case "received_reminder": return `${name} sent you a reminder.`;
    case "accepted_by_me":   return `You accepted ${name}'s interest. 🎉`;
    case "accepted_by_them": return `🎉 Great news! ${name} accepted your interest.`;
    case "declined_by_me":   return `You declined ${name}'s interest.`;
    case "skipped_by_them":  return `${name} skipped your profile.`;
  }
}

function getDatePrefix(status: InterestCardStatus): string {
  switch (status) {
    case "sent_interest":
    case "sent_reminder":    return "Sent";
    case "received_interest":
    case "received_reminder": return "Received";
    case "accepted_by_me":   return "Connected";
    case "accepted_by_them": return "Connected";
    case "declined_by_me":   return "Declined";
    case "skipped_by_them":  return "Skipped";
  }
}

// ── Main component ────────────────────────────────────────────────────────────

interface InterestCardProps {
  interest: Interest;
  isLast?: boolean;
  onAction?: () => void; // parent refreshes list after action
}

const ACTION_CLASS =
  "flex items-center gap-1.5 font-poppins font-16 font-normal text-[#B31B38] leading-[150%] whitespace-nowrap cursor-pointer disabled:opacity-50";

export default function InterestCard({ interest, isLast = false }: InterestCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status, id: profileId, profileName } = interest;

  const isSent = status === "sent_interest" || status === "sent_reminder";
  const isReceived = status === "received_interest" || status === "received_reminder";
  const isNew = interest.isNew;

  function markSeen() {
    if (!isNew) return;
    // Optimistically clear isNew in both caches so dot disappears immediately
    queryClient.setQueryData<SentInterest[]>(["interests", "sent"], (old) =>
      old?.map((item) => item.receiverId === profileId ? { ...item, isNew: false } : item)
    );
    queryClient.setQueryData<ReceivedInterest[]>(["interests", "received"], (old) =>
      old?.map((item) => item.senderId === profileId ? { ...item, isNew: false } : item)
    );
    markInterestSeen(profileId).catch(() => {});
  }

  function goToProfile() {
    markSeen();
    router.push(`/user-profile?id=${profileId}`);
  }

  // Build action element per status
  let actionEl: React.ReactNode = null;

  if (status === "sent_interest") {
    actionEl = (
      <button className={ACTION_CLASS} onClick={goToProfile}>
        {isNew && <RedDotIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />}
        See status
        <ChevronRightIcon className="w-4 sm:w-5 h-4 sm:h-5 shrink-0 text-[#B31B38]" />
      </button>
    );
  } else if (status === "sent_reminder") {
    actionEl = (
      <button className={ACTION_CLASS} onClick={goToProfile}>
        {(isNew || interest.isReminderDue) && <RedDotIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />}
        See reminder
        <ChevronRightIcon className="w-4 sm:w-5 h-4 sm:h-5 shrink-0 text-[#B31B38]" />
      </button>
    );
  } else if (isReceived) {
    actionEl = (
      <button className={ACTION_CLASS} onClick={goToProfile}>
        {isNew && <RedDotIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />}
        See full profile
        <ChevronRightIcon className="w-4 sm:w-5 h-4 sm:h-5 shrink-0 text-[#B31B38]" />
      </button>
    );
  } else if (status === "accepted_by_them" || status === "accepted_by_me") {
    actionEl = (
      <button className={ACTION_CLASS} onClick={() => { markSeen(); router.push(`/user-profile?id=${profileId}#contact-section`); }}>
        {isNew && <RedDotIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />}
        Start chat
        <ChevronRightIcon className="w-4 sm:w-5 h-4 sm:h-5 shrink-0 text-[#B31B38]" />
      </button>
    );
  } else if (status === "skipped_by_them") {
    actionEl = (
      <button className={ACTION_CLASS} onClick={() => { markSeen(); router.push("/matches"); }}>
        {isNew && <RedDotIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />}
        View similar matches
        <ChevronRightIcon className="w-4 sm:w-5 h-4 sm:h-5 shrink-0 text-[#B31B38]" />
      </button>
    );
  } else if (status === "declined_by_me") {
    actionEl = (
      <button className={ACTION_CLASS} onClick={goToProfile}>
        {isNew && <RedDotIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />}
        View profile
        <ChevronRightIcon className="w-4 sm:w-5 h-4 sm:h-5 shrink-0 text-[#B31B38]" />
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-4 md:py-6 bg-white ${!isLast ? "border-b border-[#EAEAEA]" : ""}`}>
      {/* Photo — non-navigating, CTA handles navigation */}
      <div className="shrink-0">
        <PhotoSection interest={interest} />
      </div>

      {/* Text + mobile action */}
      <div className="flex-1 min-w-0">
        <div className="text-left w-full">
          <p className="font-poppins font-18 font-medium text-[#222222] leading-[150%]">
            {getTitle(status, profileName)}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1 md:mt-1.5">
            <span className="font-poppins font-16 font-normal text-[#767676] leading-[150%]">
              {getDatePrefix(status)} · {interest.date}
            </span>
            {isSent && status === "sent_interest" && (
              <span className="font-poppins font-16 font-normal text-[#B31B38] leading-[150%] px-2 py-[2px] rounded-[40px] bg-[#FFF0F3]">
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Action shown below text on mobile only */}
        <div className="mt-2 sm:hidden">{actionEl}</div>
      </div>

      {/* Action on right on sm+ */}
      <div className="hidden sm:flex shrink-0">{actionEl}</div>
    </div>
  );
}
