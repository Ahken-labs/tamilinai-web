"use client";

import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "../../../components/app/ProfileCard";
import ProfileCardSkeleton from "../../../components/app/skeleton-layout/ProfileCardSkeleton";
import Pagination from "../../../components/more/Pagination";
import { getShortlisted } from "../../../lib/api/profiles";
import type { BrowseProfile } from "../../../types/user";
import type { Profile } from "../../../types/profile";

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
    isShortlisted: true,
  };
}

function ShortlistedContent() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["shortlisted", currentPage],
    queryFn: () => getShortlisted(currentPage),
    staleTime: 5 * 60 * 1000,
  });

  const profiles = data?.profiles.map(toCardProfile) ?? [];
  const hasMore = data?.hasMore ?? false;

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
        ) : profiles.length > 0 ? (
          profiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-poppins text-[16px] font-medium text-[#888888]">
              No shortlisted profiles yet.
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
  );
}

export default function ShortlistedPage() {
  return (
    <Suspense>
      <ShortlistedContent />
    </Suspense>
  );
}
