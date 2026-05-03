"use client";

interface InterestCardSkeletonProps {
  isLast?: boolean;
}

export default function InterestCardSkeleton({ isLast = false }: InterestCardSkeletonProps) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-6 bg-white ${!isLast ? "border-b border-[#EAEAEA]" : ""}`}
    >
      {/* Photo circle */}
      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#E8E8E8] animate-pulse" />

      {/* Text block */}
      <div className="flex-1 min-w-0">
        <div className="h-[17px] bg-[#E8E8E8] animate-pulse rounded-full w-4/5 mb-2" />
        <div className="h-[14px] bg-[#E8E8E8] animate-pulse rounded-full w-2/5" />
        {/* Mobile action placeholder */}
        <div className="mt-3 sm:hidden h-[14px] bg-[#E8E8E8] animate-pulse rounded-full w-1/3" />
      </div>

      {/* Desktop action placeholder */}
      <div className="hidden sm:block shrink-0 w-24 h-[14px] bg-[#E8E8E8] animate-pulse rounded-full" />
    </div>
  );
}
