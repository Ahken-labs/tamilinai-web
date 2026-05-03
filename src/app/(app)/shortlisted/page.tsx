"use client";

import { useState } from "react";
import ProfileCard from "../../../components/app/ProfileCard";
import ProfileCardSkeleton from "../../../components/app/skeleton-layout/ProfileCardSkeleton";
import Pagination from "../../../components/more/Pagination";
import { dummyProfiles } from "../../../data/dummyProfiles";
import { useShortlist } from "../../../context/ShortlistContext";

const CARDS_PER_PAGE = 10;

export default function ShortlistedPage() {
  const { shortlistedIds } = useShortlist();
  const [currentPage, setCurrentPage] = useState(1);
  const isLoading = false;

  const shortlisted = dummyProfiles.filter((p) => shortlistedIds.has(p.id));
  const totalPages = Math.max(1, Math.ceil(shortlisted.length / CARDS_PER_PAGE));
  const paginated = shortlisted.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <div className="px-4 lg:px-8 pt-[27px] pb-4 flex flex-col gap-6 max-w-[1024px] mx-auto">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <ProfileCardSkeleton key={i} />)
        ) : paginated.length > 0 ? (
          paginated.map((profile) => <ProfileCard key={profile.id} profile={profile} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-poppins text-[16px] font-medium text-[#888888]">
              No shortlisted profiles yet.
            </p>
          </div>
        )}

        {!isLoading && shortlisted.length > CARDS_PER_PAGE && (
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
