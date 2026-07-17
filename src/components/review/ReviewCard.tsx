"use client";

import { useRef, useState, useEffect } from "react";
import { GoogleStarIcon, GoogleHalfStarIcon, GoogleEmptyStarIcon } from "@/src/assets/Icons";

const RATING_STARS = 5;

export interface Review {
  name: string;
  subtitle: string;
  rating: number;
  text: string;
  picture?: string;
}

export function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: RATING_STARS }, (_, i) => {
        const remainder = rating - i;
        if (remainder >= 1) return <GoogleStarIcon className="w-6 h-6" key={i} />;
        if (remainder >= 0.5) return <GoogleHalfStarIcon className="w-6 h-6" key={i} />;
        return <GoogleEmptyStarIcon className="w-6 h-6" key={i} />;
      })}
    </div>
  );
}

export function ReviewCard({ review, onShowMore }: { review: Review; onShowMore?: () => void }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setIsClamped(el.clientHeight >= lineHeight * 5 - 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [review.text]);

  return (
    <div className="w-full min-[710px]:w-[341px] bg-white rounded-[12px] py-5 px-4 font-poppins">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-[110px] bg-[#F2F2F2] shrink-0 flex items-center justify-center overflow-hidden">
          {review.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.picture} alt={review.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#656565] text-[15.4px] font-semibold leading-[150%]">
              {review.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex flex-col min-[500px]:gap-[2px]">
          <span className="text-[#242424] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[150%] overflow-hidden text-ellipsis whitespace-nowrap">
            {review.name}
          </span>
          <span className="text-[#58585B] text-[12px] sm:text-[13px] md:text-[14px] font-normal leading-[125%]">
            {review.subtitle}
          </span>
        </div>
      </div>
      <div className="mt-6">
        <RatingStars rating={review.rating} />
      </div>
      <div className="min-[500px]:mt-2 mt-4">
        <p
          ref={textRef}
          className="m-0 text-[#343434] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[150%] line-clamp-5"
        >
          {review.text}
        </p>
        {isClamped && (
          <button
            type="button"
            onClick={onShowMore}
            className="mt-[2px] bg-transparent border-0 p-0 cursor-pointer text-[#343434] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[150%] underline decoration-solid underline-offset-auto"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
}

export function MobileCarousel({ reviews, onShowMore }: { reviews: Review[]; onShowMore?: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dotCount = Math.min(reviews.length, 6);
  const CARD_WIDTH = 266;
  const GAP = 8;

  function handleScroll() {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / (CARD_WIDTH + GAP));
    setCurrentIdx(Math.min(idx, reviews.length - 1));
  }

  function goTo(idx: number) {
    scrollRef.current?.scrollTo({ left: idx * (CARD_WIDTH + GAP), behavior: "smooth" });
    setCurrentIdx(idx);
  }

  return (
    <div className="mt-8">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory"
        style={{ gap: GAP, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex-shrink-0 w-4" />
        {reviews.map((review, i) => (
          <div key={i} className="snap-start flex-shrink-0" style={{ width: CARD_WIDTH }}>
            <ReviewCard review={review} onShowMore={onShowMore} />
          </div>
        ))}
        <div className="flex-shrink-0 w-4" />
      </div>

      <div className="mt-8 h-3 flex justify-center items-center" style={{ gap: "8px" }}>
        {dotCount > 1 && Array.from({ length: dotCount }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to review ${i + 1}`}
            style={{
              width: i === currentIdx ? 10 : 8,
              height: i === currentIdx ? 10 : 8,
              borderRadius: "50%",
              background: i === currentIdx ? "#222" : "#B8B8B8",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
