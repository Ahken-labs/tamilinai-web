"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ToggleTabs from "../../../components/common-layout/ToggleTabs";
import ProfileCard from "../../../components/app/ProfileCard";
import ProfileCardSkeleton from "../../../components/app/skeleton-layout/ProfileCardSkeleton";
import Pagination from "../../../components/more/Pagination";
import PartnerPreferenceModal from "../../../components/app/PartnerPreferenceModal";
import { getProfiles } from "../../../lib/api/profiles";
import type { BrowseProfile } from "../../../types/user";
import type { Profile } from "../../../types/profile";
import { formatHeight } from "../../../utils/heightUtils";

const CARDS_PER_PAGE = 10;

const TABS = [
  { label: "Best match", value: "best" },
  { label: "Elite match", value: "elite" },
  { label: "Viewed not connected", value: "viewed" },
];

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function isNewProfile(createdAt?: string): boolean {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < THIRTY_DAYS_MS;
}

function calculateAge(dateOfBirth?: string): number {
  if (!dateOfBirth) return 0;
  const born = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  if (
    today.getMonth() < born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() < born.getDate())
  ) age--;
  return age;
}

function toCardProfile(p: BrowseProfile): Profile {
  return {
    id: p.id,
    displayId: p.displayId,
    name: p.name,
    age: calculateAge(p.dateOfBirth),
    location: p.city ?? "",
    education: p.education ?? "",
    country: p.country ?? "",
    work: p.occupation ?? "",
    religion: p.religion ?? "",
    height: formatHeight(p.heightCm),
    caste: p.caste ?? "",
    isVerified: p.trustBadge ?? false,
    isElite: p.isElite,
    isNew: isNewProfile(p.createdAt),
    isViewed: p.isViewed ?? false,
    photo: p.photoUrl ?? undefined,
    isPrivate: p.photoAccess === "locked",
    isShortlisted: p.isShortlisted,
    gender: p.gender,
    interestStatus: p.interestStatus,
  };
}

function MatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [showWelcome, setShowWelcome] = useState(() => searchParams.get("welcome") === "1");
  const [activeTab, setActiveTab] = useState("best");
  const [currentPage, setCurrentPage] = useState(1);

  const queryKey = ["profiles", activeTab, currentPage];

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey,
    queryFn: () => {
      const filters: Record<string, string | number> = {
        page: currentPage,
        limit: CARDS_PER_PAGE,
        sort: "newest",
      };
      if (activeTab === "elite") filters.isElite = "true";
      if (activeTab === "viewed") filters.isViewed = "true";
      return getProfiles(filters);
    },
    // staleTime: Infinity — once a page is loaded this session, keep it as-is.
    // User won't see already-viewed page 1 get replaced with newer profiles
    // when navigating back from page 2. Fresh data comes on page refresh.
    staleTime: Infinity,
    // Keep cached pages in memory even when not active
    gcTime: Infinity,
  });

  const profiles = data?.profiles.map(toCardProfile) ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Prefetch next page in background as soon as current page loads
  if (data && currentPage < totalPages) {
    const nextFilters: Record<string, string | number> = {
      page: currentPage + 1,
      limit: CARDS_PER_PAGE,
      sort: "newest",
    };
    if (activeTab === "elite") nextFilters.isElite = "true";
    if (activeTab === "viewed") nextFilters.isViewed = "true";
    queryClient.prefetchQuery({
      queryKey: ["profiles", activeTab, currentPage + 1],
      queryFn: () => getProfiles(nextFilters),
      staleTime: Infinity,
    });
  }

  function handleTabChange(value: string) {
    setActiveTab(value);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCloseWelcome() {
    setShowWelcome(false);
    router.replace("/matches");
  }

  // Show skeletons on first load; on page change show previous data while fetching (isFetching)
  const showSkeletons = isLoading;
  const showFetchingOverlay = isFetching && !isLoading;

  return (
    <>
      <PartnerPreferenceModal isOpen={showWelcome} onClose={handleCloseWelcome} variant="onboarding" />
      <main className="min-h-screen bg-[#F8F5F2]">
        <div className="sticky top-[74px] z-10 w-full bg-white border-t border-[#EEEEEE]">
          <div className="flex justify-center items-center py-3 px-4">
            <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>

        <div className="px-4 lg:px-8 pt-[27px] pb-4 flex flex-col gap-6 max-w-[1024px] mx-auto">
          {showSkeletons ? (
            Array.from({ length: 3 }).map((_, i) => <ProfileCardSkeleton key={i} />)
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-poppins text-[16px] font-medium text-[#B31B38]">
                Failed to load profiles. Please try again.
              </p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-poppins font-16 font-medium text-[#888888]">
                No profiles found for this filter.
                <br />- Team Inai -
              </p>
            </div>
          ) : (
            // opacity-60 while fetching next page — subtle, not a full spinner
            <div className={showFetchingOverlay ? "opacity-60 pointer-events-none transition-opacity" : ""}>
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onInterestSent={() => queryClient.invalidateQueries({ queryKey: ["profiles"] })}
                />
              ))}
            </div>
          )}

          {!isLoading && !isError && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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
