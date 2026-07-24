"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/src/hooks/useScrollLock";
import { XIcon } from "@/src/assets/Icons";
import Button from "@/src/components/common-layout/Button";
import { useLang } from "@/src/context/LangContext";

const MAX_CHARS = 800;

function StarPicker({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover || rating;

  return (
    <div className="flex items-center gap-[6.67px]">
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        const filled = value <= active;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${value} star`}
            className="cursor-pointer bg-transparent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M14.4123 8.71931L12.3818 2.22173C12.2648 1.84748 11.7352 1.84748 11.6182 2.22173L9.58772 8.71931C9.53553 8.8863 9.38088 9 9.20592 9H2.17605C1.79411 9 1.62943 9.48418 1.93216 9.71705L7.27888 13.8299C7.41174 13.9321 7.46678 14.1063 7.41679 14.2663L5.35546 20.8625C5.24106 21.2286 5.65763 21.5303 5.96975 21.3073L11.7675 17.1661C11.9066 17.0667 12.0934 17.0667 12.2325 17.1661L18.0302 21.3073C18.3424 21.5303 18.7589 21.2286 18.6445 20.8625L16.5832 14.2663C16.5332 14.1063 16.5883 13.9321 16.7211 13.8299L22.0678 9.71705C22.3706 9.48418 22.2059 9 21.824 9H14.7941C14.6191 9 14.4645 8.8863 14.4123 8.71931Z"
                fill={filled ? "#FFBF43" : "#E0E0E0"}
                stroke={filled ? "#FFBF43" : "#E0E0E0"}
                strokeWidth="1.2"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

interface AddReviewModalProps {
  businessName: string;
  reviewerName?: string;
  reviewerPicture?: string;
  initialRating?: number;
  initialText?: string;
  onClose: () => void;
  onPost: (rating: number, text: string) => void | Promise<void>;
}

export default function AddReviewModal({ businessName, reviewerName, reviewerPicture, initialRating, initialText, onClose, onPost }: AddReviewModalProps) {
  const { t } = useLang();
  const [rating, setRating] = useState(initialRating ?? 5);
  const [text, setText] = useState(initialText ?? "");
  useScrollLock(true);

  function handlePost() {
    if (!rating) return;
    onPost(rating, text);
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center bg-black/60 min-[500px]:px-4 ">
      <div className="flex h-[96dvh] max-h-[96dvh] min-[500px]:h-auto min-[500px]:max-h-[85vh] w-full min-[500px]:max-w-[640px] flex-col overflow-hidden rounded-t-[32px] min-[500px]:rounded-[32px] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-end pl-4 max-[500px]:pr-1 pr-2 pt-2 min-[500px]:pb-2 shrink-0">
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
          <h2 className="max-[500px]:mt-2 font-poppins text-[20px] font-semibold leading-[135%] text-[#222] text-center">
            {businessName}
          </h2>
{/* 
          {(reviewerName || reviewerPicture) && (
            <div className="flex items-center gap-3 mt-4">
              {reviewerPicture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={reviewerPicture} alt={reviewerName ?? ""} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
              )}
              {reviewerName && (
                <span className="font-poppins text-[14px] text-[#343434] font-medium">{reviewerName}</span>
              )}
            </div>
          )} */}

          <div className="flex justify-center my-6 min-[500px]:my-5">
            <StarPicker rating={rating} onChange={setRating} />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder={t("Review_placeholder")}
            rows={5}
            className="w-full resize-none rounded-[16px] bg-[#F2F2F2] px-2 max-[500px]:py-3 py-[14px] font-poppins text-[14px] min-[500px]:text-[16px] leading-[150%] text-[#222222] placeholder:text-[#656565] border-0 outline-none"
          />
          <p className="mt-1 text-right font-poppins text-[14px] text-[#767676]">
            ({text.length} / {MAX_CHARS})
          </p>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#F0F0F0] max-[500px]:px-4 px-6 py-3">
          <Button
            text={t("Post")}
            className="w-full"
            onPress={handlePost}
          />
        </div>

      </div>
    </div>,
    document.body
  );
}
