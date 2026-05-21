"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ToggleTabs from "../../../components/common-layout/ToggleTabs";
import InterestCard from "../../../components/app/InterestCard";
import InterestCardSkeleton from "../../../components/app/skeleton-layout/InterestCardSkeleton";
import { getSentInterests, getReceivedInterests } from "../../../lib/api/interests";
import { sentInterestToCard, receivedInterestToCard } from "../../../types/interest";
import { RedDotIcon } from "../../../assets/Icons";
import { readMeCache } from "../../../components/AppHeader";

const SKELETON_COUNT = 4;

const EMPTY_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  received: {
    title: "No interests received yet",
    subtitle: "When someone likes your profile and sends an interest, it will appear here.",
  },
  sent: {
    title: "You haven't sent any interests yet",
    subtitle: "Browse matches and send an interest to someone you like — they could be the one!",
  },
  accepted: {
    title: "No accepted connections yet",
    subtitle: "Accept a received interest or wait for yours to be accepted. Good things take time.",
  },
  declined: {
    title: "Nothing declined",
    subtitle: "All clear here — no declined interests on either side.",
  },
};

function EmptyState({ tab }: { tab: string }) {
  const msg = EMPTY_MESSAGES[tab] ?? EMPTY_MESSAGES.received;
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <p className="font-poppins text-[16px] font-semibold text-[#444444]">{msg.title}</p>
      <p className="mt-2 font-poppins text-[14px] font-normal text-[#888888] max-w-[360px]">{msg.subtitle}</p>
    </div>
  );
}

export default function InterestedPage() {
  const [activeTab, setActiveTab] = useState("received");
  const queryClient = useQueryClient();
  const myPhoto = readMeCache()?.profile?.photoUrl ?? undefined;

  const { data: sentRaw, isLoading: sentLoading } = useQuery({
    queryKey: ["interests", "sent"],
    queryFn: getSentInterests,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const { data: receivedRaw, isLoading: receivedLoading } = useQuery({
    queryKey: ["interests", "received"],
    queryFn: getReceivedInterests,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const sentItems = (sentRaw ?? []).map((s) => sentInterestToCard(s, myPhoto));
  const receivedItems = (receivedRaw ?? []).map((r) => receivedInterestToCard(r, myPhoto));

  const hasNewReceived = receivedItems.some((i) => i.isNew);
  const hasNewSent = sentItems.some((i) => i.isNew || i.isReminderDue);

  const acceptedItems = [...sentItems, ...receivedItems].filter(
    (i) => i.status === "accepted_by_me" || i.status === "accepted_by_them"
  );
  const declinedItems = [...sentItems, ...receivedItems].filter(
    (i) => i.status === "declined_by_me" || i.status === "skipped_by_them"
  );
  const hasNewAccepted = acceptedItems.some((i) => i.isNew);
  const hasNewDeclined = declinedItems.some((i) => i.isNew);

  const TABS = [
    { label: "Received", value: "received", icon: hasNewReceived && activeTab !== "received" ? <RedDotIcon /> : undefined },
    { label: "Sent", value: "sent", icon: hasNewSent && activeTab !== "sent" ? <RedDotIcon /> : undefined },
    { label: "Accepted", value: "accepted", icon: hasNewAccepted && activeTab !== "accepted" ? <RedDotIcon /> : undefined },
    { label: "Declined", value: "declined", icon: hasNewDeclined && activeTab !== "declined" ? <RedDotIcon /> : undefined },
  ];

  const items =
    activeTab === "received" ? receivedItems
    : activeTab === "sent" ? sentItems
    : activeTab === "accepted" ? acceptedItems
    : declinedItems;

  const isLoading = activeTab === "received" ? receivedLoading
    : activeTab === "sent" ? sentLoading
    : sentLoading || receivedLoading;

  function handleAction() {
    queryClient.invalidateQueries({ queryKey: ["interests"] });
  }

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <div className="sticky top-[74px] z-10 w-full bg-white border-t border-[#EEEEEE]">
        <div className="flex justify-center items-center py-3 px-4">
          <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <div className="px-4 lg:px-8 pt-[27px] pb-10 max-w-[1024px] mx-auto">
        {isLoading ? (
          <div className="max-w-[926px] mx-auto rounded-[20px] overflow-hidden">
            {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <InterestCardSkeleton key={idx} isLast={idx === SKELETON_COUNT - 1} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="max-w-[926px] mx-auto rounded-[20px] overflow-hidden">
            {items.map((item, idx) => (
              <InterestCard
                key={item.id}
                interest={item}
                isLast={idx === items.length - 1}
                onAction={handleAction}
              />
            ))}
          </div>
        ) : (
          <EmptyState tab={activeTab} />
        )}
      </div>
    </main>
  );
}
