"use client";

import { useEffect, useRef, useState } from "react";

const REVIEW_DATA = {
  google: {
    rating: 5.0,
    href: "https://share.google/P4PazoF1xtCs8PFcQ",
  },
  trustpilot: {
    rating: 3.7,
    href: "https://www.trustpilot.com/review/inai.lk",
  },
  inai: {
    rating: 4.5,
    href: "https://inai.lk",
  },
};
import Link from "next/link";
import {
  GoogleIcon,
  GoogleStarIcon,
  GoogleHalfStarIcon,
  TrustpilotIcon,
  TrustpilotStarIcon,
  TrustpilotHalfStarIcon,
  TrustpilotEmptyStarIcon,
  InaiReviewIcon,
} from "../../assets/Icons";

interface ReviewTagProps {
  rating?: number;
  href?: string;
  gray?: boolean;
}

// Count-up + star-fill animation hook 
function useReviewAnimation(target: number, duration = 900) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(parseFloat((eased * target).toFixed(1)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return displayed;
}

// Google star row 
function GoogleStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <GoogleStarIcon key={i} className="w-5 h-5" />;
        if (i === full && hasHalf) return <GoogleHalfStarIcon key={i} className="w-5 h-5" />;
        return <GoogleStarIcon key={i} className="w-5 h-5 opacity-20" />;
      })}
    </div>
  );
}

//  Trustpilot star row 
function TrustpilotStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <TrustpilotStarIcon key={i} className="w-5 h-5" />;
        if (i === full && hasHalf) return <TrustpilotHalfStarIcon key={i} className="w-5 h-5" />;
        return <TrustpilotEmptyStarIcon key={i} className="w-5 h-5" />;
      })}
    </div>
  );
}

// Shared inner layout 
function TagShell({
  icon,
  stars,
  rating,
  platform,
  href,
  gray,
}: {
  icon: React.ReactNode;
  stars: React.ReactNode;
  rating: number;
  platform: string;
  href?: string;
  gray?: boolean;
}) {
  const animated = useReviewAnimation(rating);

  const inner = (
    <div className={`flex items-center py-2 pl-2 pr-4 rounded-full gap-2 cursor-pointer select-none transition-transform duration-300 ease-out hover:scale-[1.06] ${gray ? "bg-[#F2F2F2]" : "bg-white"}`}>
      <div className="w-11 h-11 shrink-0 flex items-center justify-center">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[#242424] text-[18px] font-poppins font-semibold inline-block w-[2.4ch] text-right tabular-nums">
            {animated.toFixed(1)}
          </span>
          {stars}
        </div>
        <span className="text-[#000] font-poppins text-[14px]"        >
          {platform}
        </span>
      </div>
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="no-underline inline-block">
      {inner}
    </Link>
  );
}

// Exported tag components 
export function GoogleReviewTag({ rating = REVIEW_DATA.google.rating, href = REVIEW_DATA.google.href, gray }: ReviewTagProps) {
  return (
    <TagShell
      icon={<GoogleIcon />}
      stars={<GoogleStars rating={rating} />}
      rating={rating}
      platform="Google"
      href={href}
      gray={gray}
    />
  );
}

export function TrustpilotReviewTag({ rating = REVIEW_DATA.trustpilot.rating, href = REVIEW_DATA.trustpilot.href, gray }: ReviewTagProps) {
  return (
    <TagShell
      icon={<TrustpilotIcon />}
      stars={<TrustpilotStars rating={rating} />}
      rating={rating}
      platform="Trustpilot"
      href={href}
      gray={gray}
    />
  );
}

export function InaiReviewTag({ rating = REVIEW_DATA.inai.rating, href = REVIEW_DATA.inai.href, gray }: ReviewTagProps) {
  return (
    <TagShell
      icon={<InaiReviewIcon />}
      stars={<GoogleStars rating={rating} />}
      rating={rating}
      platform="Inai.lk reviews"
      href={href}
      gray={gray}
    />
  );
}
