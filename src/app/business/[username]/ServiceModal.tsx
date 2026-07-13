"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLang } from "@/src/context/LangContext";
import { useScrollLock } from "@/src/hooks/useScrollLock";
import { XIcon } from "@/src/assets/Icons";
import type { PublicBusiness } from "./page";
import Button from "@/src/components/common-layout/Button";

type Service = PublicBusiness["services"][0];

export default function ServiceModal({
  service,
  whatsappHref,
  onClose,
}: {
  service: Service;
  whatsappHref: string | null;
  onClose: () => void;
}) {
  const { t } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  useScrollLock(true);

  const images = service.photos.map((p) => p.url);

  function handleScroll() {
    const el = carouselRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / el.offsetWidth));
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/60">
      <div className="flex h-[96dvh] max-h-[96dvh] min-[500px]:h-[85vh] min-[500px]:max-h-[85vh] w-full min-[500px]:max-w-[640px] flex-col overflow-hidden rounded-t-[32px] min-[500px]:rounded-[32px] bg-white shadow-2xl">

        {/* Image carousel — full width, 1:1, close bar floats over it */}
        {images.length > 0 && (
          <div className="relative w-full aspect-square flex-none">
            {/* Close bar */}
            <div
              className="absolute top-0 left-0 right-0 z-20 flex items-center justify-end px-1 pb-0 pt-2"
              style={{ background: "rgba(255,255,255,0.60)", backdropFilter: "blur(11px)" }}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex items-center justify-center p-2 cursor-pointer"
              >
                <XIcon className="w-6 h-6" stroke="#222" />
              </button>
            </div>

            {/* Swipe carousel */}
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex h-full overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((url, i) => (
                <div key={i} className="flex-none w-full h-full snap-center relative">
                  <Image src={url} alt={service.title} fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Dots */}
            {images.length > 1 && (
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center"
                style={{
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 100,
                  border: "1px solid rgba(255,255,255,0.50)",
                  background: "rgba(255,255,255,0.80)",
                  backdropFilter: "blur(25px)",
                }}
              >
                {images.map((_, i) => (
                  <div
                    key={i}
                    style={
                      i === activeIndex
                        ? { width: 10, height: 10, borderRadius: "50%", background: "#222", flexShrink: 0 }
                        : { width: 8, height: 8, borderRadius: "50%", background: "#B8B8B8", flexShrink: 0 }
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto p-4">
          <h2 className="font-poppins text-[20px] font-semibold leading-[150%] text-[#222]">
            {service.title}
          </h2>
          <p className="font-poppins text-[14px] leading-[150%] text-[#222]">
            {t("Starting_price")}{" "}
            <span className="text-[16px] font-semibold">Rs. {service.price.toLocaleString()}</span>
          </p>
          {whatsappHref && (
            <Button text={t("WhatsApp")}
              className="mt-4 inline-flex "
              onPress={() => window.open(whatsappHref, "_blank", "noopener")}
            />
          )}
          <p className="mt-4 font-poppins text-[14px] leading-[150%] text-[#525252]">
            {service.description}
          </p>
        </div>

      </div>
    </div>,
    document.body
  );
}
