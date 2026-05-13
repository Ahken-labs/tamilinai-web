"use client";

import { useEffect, useState } from "react";
import ToggleTabs from "../../../components/common-layout/ToggleTabs";
// import InterestCard from "../../../components/app/InterestCard";
import InterestCardSkeleton from "../../../components/app/skeleton-layout/InterestCardSkeleton";
import { getSentInterests, getReceivedInterests } from "../../../lib/api/interests";
import type { Interest } from "../../../types/interest";
import { sentInterestToCard, receivedInterestToCard } from "../../../types/interest";
import { RedDotIcon } from "../../../assets/Icons";

const SKELETON_COUNT = 4;

export default function InterestedPage() {
  const [activeTab, setActiveTab] = useState("received");
  const [sentItems, setSentItems] = useState<Interest[]>([]);
  const [receivedItems, setReceivedItems] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [sent, received] = await Promise.all([
          getSentInterests(),
          getReceivedInterests(),
        ]);
        setSentItems(sent.map(sentInterestToCard));
        setReceivedItems(received.map(receivedInterestToCard));
      } catch {
        setError("Failed to load interests. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const hasNewReceived = receivedItems.some((i) => i.isNew);
  const hasNewSent = sentItems.some((i) => i.isNew || i.isReminderDue);
  const acceptedItems = [...sentItems, ...receivedItems].filter(
    (i) => i.status === "accepted_by_me" || i.status === "accepted_by_them"
  );
  const declinedItems = [...sentItems, ...receivedItems].filter(
    (i) => i.status === "declined_by_me" || i.status === "skipped_by_them"
  );

  const TABS = [
    { label: "Received", value: "received", icon: hasNewReceived ? <RedDotIcon /> : undefined },
    { label: "Sent", value: "sent", icon: hasNewSent ? <RedDotIcon /> : undefined },
    { label: "Accepted", value: "accepted" },
    { label: "Declined", value: "declined" },
  ];

  const items =
    activeTab === "received" ? receivedItems
    : activeTab === "sent" ? sentItems
    : activeTab === "accepted" ? acceptedItems
    : declinedItems;

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
        ) : error ? (
          <div className="flex justify-center py-24">
            <p className="font-poppins text-[16px] font-medium text-[#B31B38]">{error}</p>
          </div>
        ) : items.length > 0 ? (
          <div className="max-w-[926px] mx-auto rounded-[20px] overflow-hidden">
            {/* {items.map((item, idx) => (
              <InterestCard
                key={item.id}
                interest={item}
                isLast={idx === items.length - 1}
              />
            ))} */}
            {items.map((_, idx) => (
  <div key={idx} />
  
  // <InterestCard
  //   key={item.id}
  //   interest={item}
  //   isLast={idx === items.length - 1}
  // />
))}
          </div>
        ) : (
          <div className="flex justify-center py-24">
            <p className="font-poppins text-[16px] font-medium text-[#888888]">
              Nothing here yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
