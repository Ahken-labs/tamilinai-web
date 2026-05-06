"use client";

import { useState } from "react";
import ToggleTabs from "../../../components/common-layout/ToggleTabs";
import InterestCard from "../../../components/app/InterestCard";
import InterestCardSkeleton from "../../../components/app/skeleton-layout/InterestCardSkeleton";
import { dummyInterests } from "../../../data/dummyInterests";
import { InterestStatus } from "../../../types/interest";
import { RedDotIcon } from "../../../assets/Icons";

const TAB_STATUSES: Record<string, InterestStatus[]> = {
  sent:     ["sent_interest", "sent_reminder"],
  received: ["received_interest", "received_reminder"],
  accepted: ["accepted_by_me", "accepted_by_them"],
  declined: ["declined_by_me", "skipped_by_them"],
};

function hasUnread(tab: string): boolean {
  return dummyInterests.some(
    (i) => TAB_STATUSES[tab].includes(i.status) && (i.isNew || i.isReminderDue)
  );
}

const TABS = [
  { label: "Sent",     value: "sent",     icon: hasUnread("sent")     ? <RedDotIcon /> : undefined },
  { label: "Received", value: "received", icon: hasUnread("received") ? <RedDotIcon /> : undefined },
  { label: "Accepted", value: "accepted", icon: hasUnread("accepted") ? <RedDotIcon /> : undefined },
  { label: "Declined", value: "declined", icon: hasUnread("declined") ? <RedDotIcon /> : undefined },
];

const SKELETON_COUNT = 4;

export default function InterestedPage() {
  const [activeTab, setActiveTab] = useState("sent");
  const [isLoading] = useState(false);

  const items = dummyInterests.filter((i) =>
    TAB_STATUSES[activeTab].includes(i.status)
  );

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      {/* Toggle bar */}
      <div className="sticky top-[74px] z-10 w-full bg-white border-t border-[#EEEEEE]">
        <div className="flex justify-center items-center py-3 px-4">
          <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Content */}
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
              />
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