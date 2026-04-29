"use client";

import { useEffect, useMemo, useState } from "react";
import { getPaginationRange } from "../../utils/pagination";
import { ArrowRight, ChevronIcon } from "@/src/assets/Icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [windowSize, setWindowSize] = useState(5);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize(window.innerWidth < 640 ? 3 : 5);
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  const pages = useMemo(() => {
    return getPaginationRange(currentPage, totalPages, windowSize);
  }, [currentPage, totalPages, windowSize]);

  return (
    <div className="select-none flex items-center justify-end font-poppins sm:justify-between gap-3 mt-8 mb-20">
      {/* Left: page label */}
      <button
        onClick={() => onPageChange(currentPage)}
        className="hidden sm:flex items-center gap-1 md:gap-2 py-2 pl-2 md:pl-3 pr-1 rounded-full bg-light font-16 font-medium text-[#767676]"
      >
        Page number
        <div className="bg-[#DFDFDF] rounded-full p-1">
          <ArrowRight />
        </div>
      </button>

      {/* Right: navigation */}
      <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="cursor-pointer gap-2 mr-[15px] flex text-16 text-dark items-center justify-center hover:bg-[#F8F5F2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Previous page"
        >
          <ChevronIcon open={false} className="w-4 h-4 rotate-90" />
          <div className="hidden sm:flex">Previous</div>
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`cursor-pointer flex items-center justify-center py-2 px-5 rounded-[20px] font-poppins font-16 font-medium transition-colors duration-150 ${
              page === currentPage
                ? "bg-[#222222] text-white"
                : "text-dark bg-[F8F5F2] hover:bg-[#E0E0E0]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="cursor-pointer flex gap-2 ml-[13px] text-16 text-dark items-center justify-center hover:bg-[#F8F5F2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Next page"
        >
          <div className="hidden sm:flex">Next</div>
          <ChevronIcon open={false} className="w-4 h-4 rotate-270" />
        </button>
      </div>
    </div>
  );
}