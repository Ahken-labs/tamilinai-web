"use client";

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

type StatusType = "sent" | "received" | "recived" | "declined";

type Props = {
  profileName: string;
  myName?: string;
  status: StatusType;
  isElite: boolean;
  isAccepted: boolean;
  sendCount?: number;
  receivedCount?: number;
};

export default function Match_ContactSection_Card({
  status,
  isElite,
  isAccepted,
  sendCount = 0,
  receivedCount = 1,
}: Props) {
  const normalizedStatus: "sent" | "received" | "declined" =
    status === "recived" ? "received" : status;


  if (normalizedStatus === "declined") return null;

  if (normalizedStatus === "sent" && !isAccepted) {
    return <SentPendingBody sendCount={sendCount} />;
  }

  if (normalizedStatus === "sent" && isAccepted) {
    return isElite ? (
      <VisibleContactBody />
    ) : (
      <UpgradeContactBody
        title="She accepted! Upgrade to Elite to see her contact."
        buttonText="Upgrade & connect now"
      />
    );
  }

  if (normalizedStatus === "received" && !isAccepted) {
    return <ReceivedRequestBody receivedCount={receivedCount} />;
  }

  if (normalizedStatus === "received" && isAccepted) {
    return isElite ? (
      <VisibleContactBody />
    ) : (
      <UpgradeContactBody
        title="You accepted! Upgrade to Elite to see her contact."
        buttonText="Upgrade & connect now"
      />
    );
  }

  return null;
}

function SentPendingBody({ sendCount }: { sendCount: number }) {
  return (
    <div className="pt-3 md:pt-4">
      <div className="flex gap-6 md:gap-10 lg:gap-16">
        <div className="text-secondary3 font-16">
          WhatsApp
          <div className="mt-3 md:mt-4">Email</div>
        </div>

        <div className="flex w-full items-center justify-center rounded-[8px] bg-cartbox2 px-2 py-4 md:py-6">
          <InterestLockIcon className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
          <p className="font-16 text-primary">
            Contact unlocks after she accepts your interest.
          </p>
        </div>
      </div>

      {sendCount === 0 ? (
        <div className="mt-4 md:mt-5 flex justify-center">
          <Button
            className="!font-medium"
            text="Send Interest"
            iconLeft={<SendInterestMsgIcon className="h-4 w-4 md:h-5 md:w-5" />}
          />
        </div>
      ) : null}

      {sendCount === 1 ? (
        <div className="mt-4 md:mt-5 text-center font-16 font-medium leading-[150%] text-secondary4">
          Interest sent · Awaiting response.
        </div>
      ) : null}

      {sendCount === 2 ? (
        <>
          <div className="mt-4 md:mt-5 text-center font-16 font-medium leading-[150%] text-secondary4">
            Interest sent · Awaiting response.
          </div>

          <div className="mt-2 flex justify-center">
            <Button
              text="Send reminder"
              iconLeft={<NotificationIcon className="h-4 w-4 md:h-5 md:w-5" />}
              className="!font-medium"
            />
          </div>
        </>
      ) : null}

      {sendCount >= 3 ? (
        <div className="mt-4 md:mt-5 text-center font-16 font-medium leading-[150%] text-secondary4">
          Reminder sent · Awaiting response.
        </div>
      ) : null}
    </div>
  );
}

function ReceivedRequestBody({ receivedCount }: { receivedCount: number }) {
  return (
    <div className="pt-3 md:pt-4">
      <div className="flex gap-6 md:gap-10 lg:gap-16">
        <div className="text-secondary3 font-16">
          WhatsApp
          <div className="mt-3 md:mt-4">Email</div>
        </div>

        <div className="flex w-full items-center justify-center rounded-[8px] bg-cartbox2 px-2 py-4 md:py-6">
          <InterestLockIcon className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
          <p className="font-16 text-primary">
            Contact unlocks after she accepts your interest.
          </p>
        </div>
      </div>

      {receivedCount >= 1 ? (
        <div className="mt-4 md:mt-5 flex justify-center">
          <Button
            text="Accept interest"
            iconLeft={<CheckmarkIcon className="h-4 w-4 md:h-5 md:w-5" />}
          />
        </div>
      ) : null}
    </div>
  );
}

function UpgradeContactBody({
  title,
  buttonText,
}: {
  title: string;
  buttonText: string;
}) {
  return (
    <div className="pt-3 md:pt-4">
      <div className="flex flex-col items-center rounded-[8px] bg-[linear-gradient(0deg,#FFE9E2_0%,#FFE9E2_100%),linear-gradient(270deg,#FFE0C2_0%,#FFF2D9_49.72%,#FFE0C2_99.44%)] px-4 py-6">
        <Image src="/icons/elite_batch.png" alt="Elite" width={42} height={40} />
        <p className="mt-3 md:mt-4 text-center font-16 font-medium leading-[150%] text-[#B31B38]">
          {title}
        </p>
        <div className="mt-4">
          <Button
            text={buttonText}
            className="!font-medium"
            iconLeft={<FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />}
          />
        </div>
      </div>

      <div className="mt-4 md:mt-5 flex w-full justify-between gap-6 md:gap-10 lg:gap-16">
        <div className="text-secondary3 font-16">
          WhatsApp
        </div>

        <div className="flex items-center">
          <span className="font-16 text-[#767676] blur-[5.3px]">
            +94 75 020 7507
          </span>
        </div>
      </div>
 <div className="mt-4 border-b border-[#EAEAEA]" />

      <div className="mt-4 md:mt-5 flex w-full justify-between gap-6 md:gap-10 lg:gap-16">
        <div className="text-secondary3 font-16">
          Email
        </div>

        <div className="flex items-center">
          <span className="font-16 text-[#767676] blur-[5.3px]">
            contact@inai.lk
          </span>
        </div>
      </div>
    </div>
  );
}

function VisibleContactBody() {
  return (
    <div className="pt-3 md:pt-4">
      <div className="flex w-full justify-between">
        <div className="text-secondary3 font-16">
          WhatsApp
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="font-16 text-[#767676]">+94 75 020 7507</span>
            <ChevronRightIcon className="ml-1 h-4 w-4 md:ml-2 md:h-5 md:w-5" />
          </div>
        </div>
      </div>
      <div className="mt-3 md:mt-4 border-b border-[#EAEAEA]" />

            <div className="mt-3 md:mt-4 flex w-full justify-between">
        <div className="text-secondary3 font-16">
          Email
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="font-16 text-[#767676]">contact@inai.lk</span>
            <ChevronRightIcon className="ml-1 h-4 w-4 md:ml-2 md:h-5 md:w-5" />
          </div>
        </div>
      </div>
      

      <div className="mt-4 md:mt-5 flex justify-center">
        <Button
          text="Chat on WhatsApp"
          iconLeft={<FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />}
          className="!font-medium"
        />
      </div>
    </div>
  );
}