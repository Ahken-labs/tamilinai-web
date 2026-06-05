"use client";

import { Suspense, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProfileCard from "../../../components/app/ProfileCard";
import ProfileCardSkeleton from "../../../components/app/skeleton-layout/ProfileCardSkeleton";
import Pagination from "../../../components/more/Pagination";
import { getShortlisted } from "../../../lib/api/profiles";
import type { BrowseProfile } from "../../../types/user";
import type { Profile } from "../../../types/profile";
import { formatHeight } from "../../../utils/heightUtils";
import { calculateAge } from "../../../utils/calculateAge";
import EmptyState from "@/src/components/common-layout/EmptyState";
import { EmptyShortlistedIcon } from "@/src/assets/Icons";

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
    isShortlisted: true,
    gender: p.gender,
    interestStatus: p.interestStatus,
  };
}

function ShortlistedContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["shortlisted", currentPage],
    queryFn: () => getShortlisted(currentPage),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const profiles = data?.profiles.map(toCardProfile) ?? [];
  const totalPages = data?.totalPages ?? 1;
  const showFetchingOverlay = isFetching && !isLoading;

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Called by ProfileCard when user unshortlists — invalidate so list refreshes
  function handleUnshortlist() {
    queryClient.invalidateQueries({ queryKey: ["shortlisted"] });
  }

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <div className="px-4 lg:px-8 pt-[27px] pb-4 flex flex-col gap-6 max-w-[1024px] mx-auto">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <ProfileCardSkeleton key={i} />)
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-poppins text-[16px] font-medium text-[#B31B38]">
              Failed to load shortlisted profiles. Please try again.
            </p>
          </div>
        ) : profiles.length === 0 ? (
          <EmptyState
            icon={<EmptyShortlistedIcon />}
            title="Your shortlist is empty"
            subtitle="Tap the bookmark icon on profiles you like to safely save them here for later."
            btText="Browse profiles"
            className="mx-0"
            onAction={() => window.location.href = "/matches"}
          />
        ) : (
          <div className={showFetchingOverlay ? "opacity-60 pointer-events-none transition-opacity" : ""}>
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} onUnshortlist={handleUnshortlist} />
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
  );
}

export default function ShortlistedPage() {
  return (
    <Suspense>
      <ShortlistedContent />
    </Suspense>
  );
}
