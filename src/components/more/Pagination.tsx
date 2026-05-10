"use client";

import { useEffect, useMemo, useState } from "react";
import { getPaginationRange } from "../../utils/pagination";
import { ArrowRight, ChevronIcon } from "@/src/assets/Icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function goToPage(page: number, onPageChange: (p: number) => void) {
  onPageChange(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
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
      <PageJump
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {/* Right: navigation */}
      <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2.5">
        <button
          onClick={() => goToPage(Math.max(1, currentPage - 1), onPageChange)}
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
            onClick={() => goToPage(page, onPageChange)}
            className={`cursor-pointer flex items-center justify-center py-2 px-5 rounded-[20px] font-poppins font-16 font-medium transition-colors duration-150 ${page === currentPage
                ? "bg-[#222222] text-white"
                : "text-dark bg-[F8F5F2] hover:bg-[#E0E0E0]"
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(Math.min(totalPages, currentPage + 1), onPageChange)}
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

type PageJumpProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function PageJump({
  totalPages,
  onPageChange,
}: PageJumpProps) {
  const [inputValue, setInputValue] = useState("");

  function handleSubmit() {
    const page = Number(inputValue);

    if (!page || page < 1 || page > totalPages) return;

    goToPage(page, onPageChange);
    setInputValue("");
  }

  return (
    <div className="hidden sm:flex items-center gap-1 md:gap-2 py-2 pl-2 md:pl-3 pr-1 rounded-full bg-light font-16 font-medium text-[#767676]">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        min={1}
        max={totalPages}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder="Page number"
        className="w-[110px] bg-transparent outline-none placeholder:text-[#767676]"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-[#DFDFDF] rounded-full p-1 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        <ArrowRight />
      </button>
    </div>
  );
}