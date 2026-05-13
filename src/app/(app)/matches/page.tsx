"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ToggleTabs from "../../../components/common-layout/ToggleTabs";
import ProfileCard from "../../../components/app/ProfileCard";
import ProfileCardSkeleton from "../../../components/app/skeleton-layout/ProfileCardSkeleton";
import Pagination from "../../../components/more/Pagination";
import PartnerPreferenceModal from "../../../components/app/PartnerPreferenceModal";
import { getProfiles } from "../../../lib/api/profiles";
import type { BrowseProfile } from "../../../types/user";
import type { Profile } from "../../../types/profile";

const TABS = [
  { label: "Best match", value: "best" },
  { label: "Elite match", value: "elite" },
  { label: "Viewed not connected", value: "viewed" },
];

const CARDS_PER_PAGE = 10;

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
    name: p.name,
    age: calculateAge(p.dateOfBirth),
    location: p.city ?? "",
    education: p.education ?? "",
    country: p.country ?? "",
    work: p.occupation ?? "",
    religion: p.religion ?? "",
    height: p.heightCm ? `${p.heightCm} cm` : "",
    caste: p.caste ?? "",
    isVerified: p.trustBadge ?? false,
    isElite: p.isElite,
    isNew: false,
    isViewed: p.isViewed ?? false,
    photo: p.photoUrl,
    isPrivate: p.photoAccess === "locked",
    isShortlisted: p.isShortlisted,
  };
}

function MatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showWelcome, setShowWelcome] = useState(() => searchParams.get("welcome") === "1");
  const [activeTab, setActiveTab] = useState("best");
  const [currentPage, setCurrentPage] = useState(1);

  const filters: Record<string, string | number> = { page: currentPage, limit: CARDS_PER_PAGE };
  if (activeTab === "elite") filters.isElite = "true";
  if (activeTab === "viewed") filters.isViewed = "true";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profiles", activeTab, currentPage],
    queryFn: () => getProfiles(filters),
    staleTime: 5 * 60 * 1000, // keep in cache 5 min — no re-fetch on tab switch
  });

  const profiles = data?.profiles.map(toCardProfile) ?? [];
  const hasMore = data?.hasMore ?? false;

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
      <PartnerPreferenceModal isOpen={showWelcome} onClose={handleCloseWelcome} variant="onboarding" />
      <main className="min-h-screen bg-[#F8F5F2]">
        <div className="sticky top-[74px] z-10 w-full bg-white border-t border-[#EEEEEE]">
          <div className="flex justify-center items-center py-3 px-4">
            <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>

        <div className="px-4 lg:px-8 pt-[27px] pb-4 flex flex-col gap-6 max-w-[1024px] mx-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ProfileCardSkeleton key={i} />)
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-poppins text-[16px] font-medium text-[#B31B38]">
                Failed to load profiles. Please try again.
              </p>
            </div>
          ) : profiles.length > 0 ? (
            profiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-poppins text-[16px] font-medium text-[#888888]">
                No profiles found in this category.
              </p>
            </div>
          )}

          {!isLoading && hasMore && (
            <Pagination
              currentPage={currentPage}
              totalPages={currentPage + 1}
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
