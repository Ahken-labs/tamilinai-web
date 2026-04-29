"use client";

import { useState } from "react";
import ToggleTabs from "../../../components/common/ToggleTabs";
import ProfileCard from "../../../components/app/ProfileCard";
import Pagination from "../../../components/more/Pagination";
import { dummyProfiles } from "../../../data/dummyProfiles";

const TABS = [
  { label: "Best match", value: "best" },
  { label: "Elite match", value: "elite" },
  { label: "Viewed not connected", value: "viewed" },
];

const CARDS_PER_PAGE = 5;

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState("best");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered =
    activeTab === "elite"
      ? dummyProfiles.filter((p) => p.isElite)
      : activeTab === "viewed"
      ? dummyProfiles.filter((p) => p.isViewed)
      : dummyProfiles;

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  function handleTabChange(value: string) {
    setActiveTab(value);
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      {/* Toggle bar */}
      <div className="w-full bg-white border-t border-[#EEEEEE]">
        <div className="flex justify-center items-center py-3 px-4">
          <ToggleTabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      {/* Cards section */}
      <div className="px-4 lg:px-8 pt-[27px] pb-4 flex flex-col gap-6 max-w-[1024px] mx-auto">
        {paginated.length > 0 ? (
          paginated.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-poppins text-[16px] font-medium text-[#888888]">
              No profiles found in this category.
            </p>
          </div>
        )}

        {filtered.length > CARDS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </main>
  );
}
