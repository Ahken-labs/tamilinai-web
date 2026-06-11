"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useScrollHide } from "../../../hooks/useScrollHide";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoCloseOutline } from "react-icons/io5";
import ToggleTabs from "../../../components/common-layout/ToggleTabs";
import ProfileCard from "../../../components/app/ProfileCard";
import ProfileCardSkeleton from "../../../components/app/skeleton-layout/ProfileCardSkeleton";
import Pagination from "../../../components/more/Pagination";
import PartnerPreferenceModal from "../../../components/app/PartnerPreferenceModal";
import { getProfiles } from "../../../lib/api/profiles";
import type { ProfileFilters } from "../../../lib/api/profiles";
import type { SearchFilters } from "../../../types/search";
import type { BrowseProfile } from "../../../types/user";
import type { Profile } from "../../../types/profile";
import { formatHeight } from "../../../utils/heightUtils";
import { calculateAge } from "../../../utils/calculateAge";

const CARDS_PER_PAGE = 10;

const TABS = [
  { label: "Best match", value: "best" },
  { label: "Elite match", value: "elite" },
  { label: "Viewed", value: "viewed" },
];

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function isNewProfile(createdAt?: string): boolean {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < THIRTY_DAYS_MS;
}

function toCardProfile(p: BrowseProfile): Profile {
  return {
    id: p.id,
    displayId: p.displayId,
    name: p.name,
    age: calculateAge(p.dateOfBirth) ?? 0,
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

  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === "undefined") return false;
    if (localStorage.getItem("inai_welcome_seen")) return false;
    return searchParams.get("welcome") === "1";
  });
  const [activeTab, setActiveTab] = useState("best");
  const [currentPage, setCurrentPage] = useState(1);

  const tabBarVisible = useScrollHide();

  const searchFilters = useMemo<SearchFilters | null>(() => {
    const displayId = searchParams.get("displayId");
    const country = searchParams.get("country");
    const minAge = searchParams.get("minAge");
    const maxAge = searchParams.get("maxAge");
    const religion = searchParams.get("religion");
    const maritalStatus = searchParams.get("maritalStatus");
    if (!displayId && !country && !minAge && !maxAge && !religion && !maritalStatus) return null;
    return {
      displayId: displayId ?? undefined,
      country: country ?? undefined,
      minAge: minAge ? parseInt(minAge) : undefined,
      maxAge: maxAge ? parseInt(maxAge) : undefined,
      religion: religion ?? undefined,
      maritalStatus: maritalStatus ?? undefined,
    };
  }, [searchParams]);

  // Reset to page 1 whenever search changes
  const searchKey = searchParams.toString();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchKey]);

  const queryKey = ["profiles", activeTab, currentPage, searchFilters];

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey,
    queryFn: () => {
      const filters: ProfileFilters = {
        page: currentPage,
        limit: CARDS_PER_PAGE,
        sort: "newest",
      };
      if (activeTab === "elite") filters.isElite = "true";
      if (activeTab === "viewed") filters.isViewed = "true";
      if (searchFilters?.displayId) filters.displayId = searchFilters.displayId;
      if (searchFilters?.country) filters.country = searchFilters.country;
      if (searchFilters?.minAge) filters.minAge = searchFilters.minAge;
      if (searchFilters?.maxAge) filters.maxAge = searchFilters.maxAge;
      if (searchFilters?.religion) filters.religion = searchFilters.religion;
      if (searchFilters?.maritalStatus) filters.maritalStatus = searchFilters.maritalStatus;
      return getProfiles(filters);
    },
    staleTime: searchFilters ? 2 * 60 * 1000 : 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const profiles = data?.profiles.map(toCardProfile) ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Prefetch next page in background as soon as current page loads
  useEffect(() => {
    if (!data || currentPage >= totalPages || searchFilters) return;
    const nextFilters: ProfileFilters = {
      page: currentPage + 1,
      limit: CARDS_PER_PAGE,
      sort: "newest",
    };
    if (activeTab === "elite") nextFilters.isElite = "true";
    if (activeTab === "viewed") nextFilters.isViewed = "true";
    queryClient.prefetchQuery({
      queryKey: ["profiles", activeTab, currentPage + 1, null],
      queryFn: () => getProfiles(nextFilters),
      staleTime: 5 * 60 * 1000,
    });
  }, [data, currentPage, totalPages, activeTab, searchFilters, queryClient]);

  function handleTabChange(value: string) {
    setActiveTab(value);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCloseWelcome() {
    localStorage.setItem("inai_welcome_seen", "1");
    setShowWelcome(false);
    router.replace("/matches");
  }

  function handleClearSearch() {
    router.push("/matches");
  }

  const showSkeletons = isLoading;
  const showFetchingOverlay = isFetching && !isLoading;

  return (
    <>
      <PartnerPreferenceModal isOpen={showWelcome} onClose={handleCloseWelcome} variant="onboarding" />
      <main className="min-h-screen bg-[#F8F5F2]">
        <div className="sticky lg:px-10 max-[320px]:top-[56px] max-[768px]:top-[65px] top-[74px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE] transition-transform duration-300" style={!tabBarVisible ? { transform: "translateY(-110%)" } : undefined}>
          {searchFilters ? (
            <div className="flex items-center justify-center px-auto py-2 md:py-3">
              <button
                type="button"
                onClick={handleClearSearch}
                className="flex items-center gap-1 "
              >
                <span className="font-poppins fonts-24 font-semibold text-dark">Search results</span>
                <IoCloseOutline className="cursor-pointer w-4 md:w-6 h-4 md:h-6 hover:bg-[#F2F2F2] rounded-full transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center py-3 px-4">
              <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
          )}
        </div>

        <div className="px-4 lg:px-8 pt-[12px] sm:pt-[27px] pb-4 flex flex-col gap-4 max-w-[1024px] mx-auto">

          {showSkeletons ? (
            Array.from({ length: 10 }).map((_, i) => <ProfileCardSkeleton key={i} />)
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              {searchFilters ? (
                <p className="font-poppins text-[14px] md:text-[16px] font-medium text-[#888888]">
                  No profiles match your search.<br />- Team Inai -
                </p>
              ) : (
                <p className="font-poppins text-[14px] md:text-[16px] font-medium text-[#B31B38]">
                  Failed to load profiles. Please try again.
                </p>
              )}
            </div>
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-poppins text-[14px] md:text-[16px] font-medium text-[#888888]">
                {searchFilters ? "No profiles match your search." : "No profiles found for this filter."}
                <br />- Team Inai -
              </p>
            </div>
          ) : (
            <div className={showFetchingOverlay ? "opacity-60 pointer-events-none transition-opacity" : ""}>
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onInterestSent={undefined}
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
