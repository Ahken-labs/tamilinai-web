"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScrollHide } from "../../../hooks/useScrollHide";
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

function InterestedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const t = searchParams.get("tab");
    return t === "sent" || t === "accepted" || t === "declined" ? t : "received";
  });
  const queryClient = useQueryClient();
  const me = readMeCache();
  const myPhoto = me?.profile?.photoUrl ?? (me?.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png");


  const { data: sentRaw, isLoading: sentLoading, isFetching: sentFetching } = useQuery({
    queryKey: ["interests", "sent"],
    queryFn: getSentInterests,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: receivedRaw, isLoading: receivedLoading, isFetching: receivedFetching } = useQuery({
    queryKey: ["interests", "received"],
    queryFn: getReceivedInterests,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const allSentItems = (sentRaw ?? []).map((s) => sentInterestToCard(s, myPhoto));
  const allReceivedItems = (receivedRaw ?? []).map((r) => receivedInterestToCard(r, myPhoto));

  // Sent tab: only pending (not yet responded) — accepted/declined move to their own tabs
  const sentItems = allSentItems.filter(
    (i) => i.status === "sent_interest" || i.status === "sent_reminder"
  );

  // Received tab: only pending (not yet responded)
  const receivedItems = allReceivedItems.filter(
    (i) => i.status === "received_interest" || i.status === "received_reminder"
  );

  // Accepted: accepted_by_them (from sent) + accepted_by_me (from received), deduplicated by profile ID
  const acceptedRaw = [
    ...allSentItems.filter((i) => i.status === "accepted_by_them"),
    ...allReceivedItems.filter((i) => i.status === "accepted_by_me"),
  ];
  const seenIds = new Set<string>();
  const acceptedItems = acceptedRaw.filter((i) => {
    if (seenIds.has(i.id)) return false;
    seenIds.add(i.id);
    return true;
  });

  // Declined: declined_by_me first (change mind CTA), then skipped_by_them — deduplicated
  const declinedRaw = [
    ...allReceivedItems.filter((i) => i.status === "declined_by_me"),
    ...allSentItems.filter((i) => i.status === "skipped_by_them"),
  ];
  const seenDeclinedIds = new Set<string>();
  const declinedItems = declinedRaw.filter((i) => {
    if (seenDeclinedIds.has(i.id)) return false;
    seenDeclinedIds.add(i.id);
    return true;
  });

  const hasNewReceived = receivedItems.some((i) => i.isNew);
  const hasNewSent = sentItems.some((i) => i.isReminderDue);
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

  const isBackgroundFetching = (sentFetching || receivedFetching) && !isLoading;


  const tabBarVisible = useScrollHide();

  function handleTabChange(value: string) {
    setActiveTab(value);
    router.replace(`/interested?tab=${value}`, { scroll: false });
  }

  function handleAction() {
    queryClient.invalidateQueries({ queryKey: ["interests"] });
  }

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <div className="sticky max-[320px]:top-[56px] max-[768px]:top-[65px] top-[74px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE] transition-transform duration-300" style={!tabBarVisible ? { transform: "translateY(-110%)" } : undefined}>
        <div className="flex justify-center items-center py-3 px-4">
          <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>

      <div className="px-4 lg:px-8 pt-[12px] sm:pt-[27px] pb-10 max-w-[1024px] mx-auto">
        {isLoading ? (
          <div className="max-w-[926px] mx-auto rounded-[20px] overflow-hidden">
            {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <InterestCardSkeleton key={idx} isLast={idx === SKELETON_COUNT - 1} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className={`max-w-[926px] mx-auto rounded-[20px] overflow-hidden${isBackgroundFetching ? " opacity-60 pointer-events-none transition-opacity" : ""}`}>
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

export default function InterestedPage() {
  return (
    <Suspense>
      <InterestedContent />
    </Suspense>
  );
}
