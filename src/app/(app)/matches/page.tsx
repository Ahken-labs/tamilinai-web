"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ToggleTabs from "../../../components/common/ToggleTabs";
import ProfileCard from "../../../components/app/ProfileCard";
import ProfileCardSkeleton from "../../../components/app/ProfileCardSkeleton";
import Pagination from "../../../components/more/Pagination";
import PartnerPreferenceModal from "../../../components/app/PartnerPreferenceModal";
import { dummyProfiles } from "../../../data/dummyProfiles";

const TABS = [
  { label: "Best match", value: "best" },
  { label: "Elite match", value: "elite" },
  { label: "Viewed not connected", value: "viewed" },
];

const CARDS_PER_PAGE = 10;

function matchesQuery(profile: (typeof dummyProfiles)[0], q: string): boolean {
  const s = q.toLowerCase();
  return (
    profile.name.toLowerCase().includes(s) ||
    profile.location.toLowerCase().includes(s) ||
    profile.education.toLowerCase().includes(s) ||
    profile.work.toLowerCase().includes(s) ||
    profile.country.toLowerCase().includes(s) ||
    profile.religion.toLowerCase().includes(s) ||
    profile.caste.toLowerCase().includes(s) ||
    profile.height.toLowerCase().includes(s) ||
    String(profile.age).includes(s) ||
    profile.id.toLowerCase().includes(s)
  );
}

function MatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [showWelcome, setShowWelcome] = useState(() => searchParams.get("welcome") === "1");
  const [activeTab, setActiveTab] = useState("best");
  const [currentPage, setCurrentPage] = useState(1);
  const isLoading = false; // set true when fetching from backend

  const byTab =
    activeTab === "elite"
      ? dummyProfiles.filter((p) => p.isElite)
      : activeTab === "viewed"
        ? dummyProfiles.filter((p) => p.isViewed)
        : dummyProfiles;

  const filtered = query ? byTab.filter((p) => matchesQuery(p, query)) : byTab;

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  function handleTabChange(value: string) {
    setActiveTab(value);
    setCurrentPage(1);
  }

  function handleCloseWelcome() {
    setShowWelcome(false);
    router.replace("/matches");
  }

  return (
    <>
      <PartnerPreferenceModal isOpen={showWelcome} onClose={handleCloseWelcome} />
      <main className="min-h-screen bg-[#F8F5F2]">
        {/* Toggle bar */}
        <div className="w-full bg-white border-t border-[#EEEEEE]">
          <div className="flex justify-center items-center py-3 px-4">
            <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>

        {/* Cards section */}
        <div className="px-4 lg:px-8 pt-[27px] pb-4 flex flex-col gap-6 max-w-[1024px] mx-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ProfileCardSkeleton key={i} />)
          ) : paginated.length > 0 ? (
            paginated.map((profile) => <ProfileCard key={profile.id} profile={profile} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-poppins text-[16px] font-medium text-[#888888]">
                {query ? `No results for "${query}"` : "No profiles found in this category."}
              </p>
            </div>
          )}

          {!isLoading && filtered.length > CARDS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default function MatchesPage() {
  return (
    <Suspense>
      <MatchesContent />
    </Suspense>
  );
}
