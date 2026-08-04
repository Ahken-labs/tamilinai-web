"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "@/src/assets/Icons";

export default function BizCardsPromo() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-[944px] mx-auto px-4">
      <style>{`
        @keyframes bizCardSlideIn {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0px);  }
        }
        .biz-card-1, .biz-card-2, .biz-card-3 { opacity: 0; }
        .biz-cards-visible .biz-card-1 { animation: bizCardSlideIn 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.9s both; }
        .biz-cards-visible .biz-card-2 { animation: bizCardSlideIn 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
        .biz-cards-visible .biz-card-3 { animation: bizCardSlideIn 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
      `}</style>

      <div
        ref={ref}
        className="[clamp(126px,2.5vw,217px)] rounded-[16px] pt-2 px-2 sm:px-3 md:px-4 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #FFAEBF 0%, #F9EAD0 100%)",
        }}
      >
        {/* Left — fanned cards */}
        <div
          className={`relative shrink-0 flex items-center justify-center${visible ? " biz-cards-visible" : ""}`}
          style={{
            width: "clamp(136px, 22vw, 284px)",
            height: "clamp(99.96px, 16.2vw, 209px)",
            overflow: "visible",
          }}
        >
          <div
            className="biz-card-1 absolute inset-0 flex items-center justify-center"
            style={{ transform: "rotate(22deg)", transformOrigin: "center bottom", zIndex: 1 }}
          >
            <Image src="/images/cards/card3.webp" alt="" width={1200} height={882} className="w-full h-auto drop-shadow-md" />
          </div>
          <div
            className="biz-card-2 absolute inset-0 flex items-center justify-center"
            style={{ transform: "rotate(-5deg)", transformOrigin: "center bottom", zIndex: 2 }}
          >
            <Image src="/images/cards/card2.webp" alt="" width={1200} height={882} className="w-full h-auto drop-shadow-lg" />
          </div>
          <div
            className="biz-card-3 absolute inset-0 flex items-center justify-center"
            style={{ transform: "rotate(-22deg)", transformOrigin: "center bottom", zIndex: 3 }}
          >
            <Image src="/images/cards/card1.webp" alt="" width={1200} height={882} className="w-full h-auto drop-shadow-lg" />
          </div>
        </div>

        {/* Right — text + button */}
        <div className="flex flex-col pb-2 gap-2 sm:gap-3 md:gap-4 pl-4">
          <p className="font-poppins text-[clamp(16px,2.5vw,20px)] leading-[125%] text-[#222]">
            <span className="font-bold">Trending</span> customized<br />invitation cards
          </p>
          <button
            type="button"
            onClick={() => window.open("https://cards.inai.lk/", "_blank", "noopener,noreferrer")}
            aria-label="Go to invitation cards"
            className="cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.1] cursor-pointer flex items-center justify-center w-[32.727px] h-6 rounded-full bg-white shadow-sm cursor-pointer"
          >
            <ChevronRight stroke="#222" className="w-[14px] h-[14px] shrink-0"  />
          </button>
        </div>
      </div>
    </div>
  );
}
