"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa6";

import Button from "@/src/components/common-layout/Button";
import {
  CheckmarkIcon,
  ChevronRightIcon,
  InterestLockIcon,
  NotificationIcon,
  SendInterestMsgIcon,
} from "@/src/assets/Icons";
import { sendInterest, respondToInterest } from "@/src/lib/api/interests";
import { ApiError } from "@/src/lib/api/client";
import EliteUpgradePopup from "@/src/components/common-layout/EliteUpgradePopup";

type StatusType = "sent" | "received" | "recived" | "declined";

type Props = {
  profileId: string;
  profileName: string;
  myName?: string;
  gender?: string;
  status: StatusType;
  isElite: boolean;
  isAccepted: boolean;
  sendCount?: number;
  receivedCount?: number;
  lastSentAt?: string | null;
  isReminderDue?: boolean;
  // Only populated by backend when isElite && isAccepted
  phone?: string;
  countryCode?: string;
  email?: string;
  onAction?: () => void;
};

export default function Match_ContactSection_Card({
  profileId,
  gender,
  status,
  isElite,
  isAccepted,
  sendCount = 0,
  receivedCount = 1,
  lastSentAt,
  isReminderDue = false,
  phone,
  countryCode,
  email,
  onAction,
}: Props) {
  const [pending, setPending] = useState(false);
  const isMale = gender === "male";
  const she = isMale ? "He" : "She";
  const she_l = isMale ? "he" : "she";
  const her = isMale ? "his" : "her";

  async function act(fn: () => Promise<unknown>) {
    if (pending) return;
    setPending(true);
    try {
      await fn();
      onAction?.();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) onAction?.();
    } finally {
      setPending(false);
    }
  }

  const normalizedStatus: "sent" | "received" | "declined" =
    status === "recived" ? "received" : status;

  if (normalizedStatus === "declined") return null;

  if (normalizedStatus === "sent" && !isAccepted) {
    return (
      <SentPendingBody
        sendCount={sendCount}
        lastSentAt={lastSentAt}
        isReminderDue={isReminderDue}
        pending={pending}
        she_l={she_l}
        onSendInterest={() => act(() => sendInterest(profileId))}
        onSendReminder={() => act(() => sendInterest(profileId))}
      />
    );
  }

  if (normalizedStatus === "sent" && isAccepted) {
    return isElite ? (
      <VisibleContactBody phone={phone} countryCode={countryCode} email={email} />
    ) : (
      <UpgradeContactBody
        title={`${she} accepted! Upgrade to Elite to see ${her} contact.`}
        buttonText="Upgrade & connect now"
      />
    );
  }

  if (normalizedStatus === "received" && !isAccepted) {
    return (
      <ReceivedRequestBody
        receivedCount={receivedCount}
        pending={pending}
        onAccept={() => act(() => respondToInterest(profileId, "accept"))}
      />
    );
  }

  if (normalizedStatus === "received" && isAccepted) {
    return isElite ? (
      <VisibleContactBody phone={phone} countryCode={countryCode} email={email} />
    ) : (
      <UpgradeContactBody
        title={`You accepted! Upgrade to Elite to see ${her} contact.`}
        buttonText="Upgrade & connect now"
      />
    );
  }

  return null;
}

function formatCountdown(until: Date): string {
  const msLeft = until.getTime() - Date.now();
  if (msLeft <= 0) return "0 hours";
  const totalHours = Math.floor(msLeft / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0) return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}`;
  return `${hours} hour${hours !== 1 ? "s" : ""}`;
}

function SentPendingBody({
  sendCount,
  lastSentAt,
  isReminderDue,
  pending,
  she_l,
  onSendInterest,
  onSendReminder,
}: {
  sendCount: number;
  lastSentAt?: string | null;
  isReminderDue: boolean;
  pending: boolean;
  she_l: string;
  onSendInterest: () => void;
  onSendReminder: () => void;
}) {
  const reminderAt = lastSentAt
    ? new Date(new Date(lastSentAt).getTime() + 3 * 24 * 60 * 60 * 1000)
    : null;
  const countdownText = reminderAt ? formatCountdown(reminderAt) : null;

  return (
    <div className="max-[370px]:pt-2 pt-3 md:pt-4">
      <div className="flex gap-6 md:gap-10 lg:gap-16">
        <div className="text-secondary3 text-[14px] md:text-[16px]">
          WhatsApp
          <div className="mt-3 md:mt-4">Email</div>
        </div>
        <div className="flex w-full items-start  justify-center rounded-[8px] bg-cartbox2 px-2 py-4 md:py-6">
          <InterestLockIcon className="mt-1 mr-1 max-[370px]:h-3 max-[370px]:w-3 h-4 w-4 md:mr-2" />
          <p className="text-[14px] md:text-[16px] text-primary">
            Contact unlocks after {she_l} accepts your interest.
          </p>
        </div>
      </div>

      {/* No interest sent yet */}
      {sendCount === 0 && (
        <div className="mt-4 md:mt-5 flex justify-center">
          <Button
            className="!font-medium"
            text={pending ? "Sending..." : "Send Interest"}
            onPress={onSendInterest}
            iconLeft={<SendInterestMsgIcon className="h-4 w-4 md:h-5 md:w-5" />}
          />
        </div>
      )}

      {/* First interest sent, 3-day wait not over */}
      {sendCount === 1 && !isReminderDue && (
        <>
          <div className="mt-4 md:mt-5 text-center text-[14px] md:text-[16px] font-medium leading-[150%] text-secondary4">
            Interest sent · Awaiting response.
          </div>
          {countdownText && (
            <div className="mt-1 text-center text-[14px] md:text-[16px] font-normal leading-[150%] text-primary">
              You can send a reminder in {countdownText}.
            </div>
          )}
        </>
      )}

      {/* 3 days passed — show Send reminder button */}
      {sendCount === 1 && isReminderDue && (
        <>
          <div className="mt-4 md:mt-5 text-center text-[14px] md:text-[16px] font-medium leading-[150%] text-secondary4">
            Interest sent · Awaiting response.
          </div>
          <div className="mt-2 flex justify-center">
            <Button
              text={pending ? "Sending..." : "Send reminder"}
              onPress={onSendReminder}
              iconLeft={<NotificationIcon className="h-4 w-4 md:h-5 md:w-5" />}
              className="!font-medium"
            />
          </div>
        </>
      )}

      {/* Reminder already sent — no more actions */}
      {sendCount >= 2 && (
        <div className="mt-4 md:mt-5 text-center text-[14px] md:text-[16px] font-medium leading-[150%] text-secondary4">
          Reminder sent · Awaiting response.
        </div>
      )}
    </div>
  );
}

function ReceivedRequestBody({
  receivedCount,
  pending,
  onAccept,
}: {
  receivedCount: number;
  pending: boolean;
  onAccept: () => void;
}) {
  return (
    <div className="pt-3 md:pt-4">
      <div className="flex gap-6 md:gap-10 lg:gap-16">
        <div className="text-secondary3 text-[14px] md:text-[16px]">
          WhatsApp
          <div className="mt-3 md:mt-4">Email</div>
        </div>
        <div className="flex w-full items-center justify-center rounded-[8px] bg-cartbox2 px-2 py-4 md:py-6">
          <InterestLockIcon className="mr-1 max-[370px]:h-3 max-[370px]:w-3 h-4 w-4 md:mr-2" />
          <p className="text-[14px] md:text-[16px] text-primary">
            Contact unlocks after you accept their interest.
          </p>
        </div>
      </div>

      {receivedCount >= 1 && (
        <div className="mt-4 md:mt-5 flex justify-center">
          <Button
            text={pending ? "Accepting..." : "Accept interest"}
            onPress={onAccept}
            iconLeft={<CheckmarkIcon className="h-4 w-4 md:h-5 md:w-5" />}
          />
        </div>
      )}
    </div>
  );
}

function UpgradeContactBody({ title, buttonText }: { title: string; buttonText: string }) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <div className="pt-3 md:pt-4">
        <div className="flex flex-col items-center rounded-[8px] bg-[linear-gradient(0deg,#FFE9E2_0%,#FFE9E2_100%),linear-gradient(270deg,#FFE0C2_0%,#FFF2D9_49.72%,#FFE0C2_99.44%)] px-4 py-6">
          <Image src="/icons/elite_batch.png" alt="Elite" width={42} height={40} />
          <p className="mt-3 md:mt-4 text-center text-[14px] md:text-[16px] font-medium leading-[150%] text-[#B31B38]">
            {title}
          </p>
          <div className="mt-4">
            <Button
              text={buttonText}
              className="!font-medium"
              onPress={() => router.push("/elite-upgrade")}
              iconLeft={<FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />}
            />
          </div>
        </div>

        {/* Blurred placeholder — clicking opens Elite popup */}
        <button
          type="button"
          onClick={() => setShowPopup(true)}
          className="mt-4 md:mt-5 w-full text-left cursor-pointer"
        >
          <div className="flex w-full justify-between gap-6 md:gap-10 lg:gap-16">
            <div className="text-secondary3 text-[14px] md:text-[16px]">WhatsApp</div>
            <span className="text-[14px] md:text-[16px] text-[#767676] blur-[5.3px] select-none">+94 75 020 7507</span>
          </div>
          <div className="mt-4 border-b border-[#EAEAEA]" />
          <div className="mt-4 md:mt-5 flex w-full justify-between gap-6 md:gap-10 lg:gap-16">
            <div className="text-secondary3 text-[14px] md:text-[16px]">Email</div>
            <span className="text-[14px] md:text-[16px] text-[#767676] blur-[5.3px] select-none">contact@inai.lk</span>
          </div>
        </button>
      </div>

      {showPopup && (
        <EliteUpgradePopup trigger="contact_locked" onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}

function VisibleContactBody({
  phone,
  email,
}: {
  phone?: string;
  countryCode?: string;
  email?: string;
}) {
  // phone already contains the full number (may or may not include country code prefix).
  // Strip everything except digits and leading + for display; use digits-only for wa.me link.
  const rawPhone = phone?.trim() ?? null;
  const displayPhone = rawPhone ?? null;
  const displayEmail = email ?? null;

  return (
    <div className="pt-3 md:pt-4">
      {displayPhone && (
        <>
          <div className="flex w-full justify-between">
            <div className="text-secondary3 text-[14px] md:text-[16px]">WhatsApp</div>
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-[14px] md:text-[16px] text-[#767676]">{displayPhone}</span>
              <ChevronRightIcon className="ml-1 h-4 w-4 md:ml-2 md:h-5 md:w-5" />
            </div>
          </div>
          <div className="mt-3 md:mt-4 border-b border-[#EAEAEA]" />
        </>
      )}

      {displayEmail && (
        <div className="mt-3 md:mt-4 flex w-full justify-between">
          <div className="text-secondary3 text-[14px] md:text-[16px]">Email</div>
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-[14px] md:text-[16px] text-[#767676]">{displayEmail}</span>
            <ChevronRightIcon className="ml-1 h-4 w-4 md:ml-2 md:h-5 md:w-5" />
          </div>
        </div>
      )}

      {displayPhone && (
        <div className="mt-4 md:mt-5 flex justify-center">
          <Button
            text="Chat on WhatsApp"
            iconLeft={<FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />}
            className="!font-medium"
            onPress={() => {
              const num = displayPhone.replace(/\D/g, "");
              window.open(`https://wa.me/${num}`, "_blank");
            }}
          />
        </div>
      )}
    </div>
  );
}
