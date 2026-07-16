"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/src/hooks/useScrollLock";
import { XIcon, GoogleStarIcon, EmptyReviewIcon } from "@/src/assets/Icons";
import { RatingStars, type Review } from "@/src/components/review/ReviewCard";
import Button from "@/src/components/common-layout/Button";
import { useLang } from "@/src/context/LangContext";

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function ReviewSkeleton() {
  return (
    <div className="py-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-[#F2F2F2] shrink-0" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-28 bg-[#F2F2F2] rounded-full" />
          <div className="h-3 w-20 bg-[#F2F2F2] rounded-full" />
        </div>
      </div>
      <div className="flex gap-1 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-5 h-5 bg-[#F2F2F2] rounded" />
        ))}
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-[#F2F2F2] rounded-full w-full" />
        <div className="h-4 bg-[#F2F2F2] rounded-full w-4/5" />
        <div className="h-4 bg-[#F2F2F2] rounded-full w-2/3" />
      </div>
    </div>
  );
}

// ── Review list item ──────────────────────────────────────────────────────────

function ReviewListItem({ review, isLast }: { review: Review; isLast: boolean }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => {
      if (window.innerWidth >= 500) { setShowMoreBtn(false); return; }
      setShowMoreBtn(el.scrollHeight > el.clientHeight);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [review.text]);

  return (
    <>
      <div className="max-[500px]:py-5 py-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#F2F2F2] shrink-0 flex items-center justify-center overflow-hidden">
            {review.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.picture} alt={review.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#656565] text-[15.4px] font-semibold leading-[150%]">
                {review.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col min-[500px]:gap-[2px] min-w-0">
            <span className="text-[#242424] max-[500px]:text-[14px] text-[16px] font-medium leading-[150%] truncate">
              {review.name}
            </span>
            <span className="text-[#58585B] max-[500px]:text-[12px] text-[14px] font-normal leading-[125%]">
              {review.subtitle}
            </span>
          </div>
        </div>
        <div className="max-[500px]:mt-4 mt-6">
          <RatingStars rating={review.rating} />
        </div>
        <div className="max-[500px]:mt-3 mt-4">
          <p
            ref={textRef}
            className={`m-0 text-[#343434] max-[500px]:text-[14px] text-[16px] font-normal leading-[150%] ${!expanded ? "max-[500px]:line-clamp-4" : ""}`}
          >
            {review.text}
          </p>
          {(showMoreBtn || expanded) && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-[2px] bg-transparent border-0 p-0 cursor-pointer text-[#343434] text-[14px] font-medium leading-[150%] underline decoration-solid underline-offset-auto"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
      {!isLast && <div className="h-px bg-[#F0F0F0]" />}
    </>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

interface ReviewsModalProps {
  allReviews: Review[];
  averageRating: number | null;
  totalCount: number;
  showActions: boolean;
  onClose: () => void;
}

export default function ReviewsModal({
  allReviews,
  averageRating,
  totalCount,
  showActions,
  onClose,
}: ReviewsModalProps) {
  const { t } = useLang();
  useScrollLock(true);

  const isEmpty = totalCount === 0;
  const ratingDisplay = averageRating != null ? averageRating.toFixed(1).replace(/\.0$/, "") : null;

  return createPortal(
    <div className="font-poppins fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/60">
      <div className="flex h-[96dvh] max-h-[96dvh] min-[500px]:h-[85vh] min-[500px]:max-h-[85vh] w-full min-[500px]:max-w-[640px] flex-col overflow-hidden rounded-t-[32px] min-[500px]:rounded-[32px] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between pl-4 max-[500px]:pr-1 pr-2 pt-2 min-[500px]:pb-2 shrink-0 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-1">
            <span className="font-poppins text-[20px] font-semibold leading-[150%] text-[#222]">
              {totalCount} {t("Reviews")}
            </span>
            {ratingDisplay && (
              <div className="flex gap-1 items-center">
                <span className="text-[#222222] font-semibold text-[20px]">·</span>
                <span className="font-poppins text-[20px] font-semibold text-[#222]">{ratingDisplay}</span>
                <GoogleStarIcon />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center p-2 cursor-pointer"
          >
            <XIcon className="w-8 max-[500px]:w-6 h-8 max-[500px]:h-6" stroke="#222" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto max-[500px]:px-4 px-5">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center max-[500px]:py-8 py-4">
              <EmptyReviewIcon />
              <p className="font-poppins text-[16px] text-[#767676] text-center">
                Be the first to review this business!
              </p>
            </div>
          ) : (
            allReviews.map((review, i) => (
              <ReviewListItem
                key={`${review.name}-${i}`}
                review={review}
                isLast={i === allReviews.length - 1}
              />
            ))
          )}
        </div>


        {/* Footer */}
        {showActions && (
          <div className="shrink-0 border-t border-[#F0F0F0] max-[500px]:px-4 px-6 py-3">
            <div className="flex justify-center">
              <div className={`flex max-[500px]:hidden ${isEmpty ?"":"flex-1"} `} />
              <Button
                text={t("Add_a_review")}
                className={`${isEmpty ? "max-[500px]:w-full mx-auto" : "max-[500px]:w-full"}`}
                onPress={() => { }}
              />
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
