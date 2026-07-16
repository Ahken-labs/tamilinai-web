"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLang } from "@/src/context/LangContext";
import { useScrollLock } from "@/src/hooks/useScrollLock";
import { BackChevronIcon, XIcon } from "@/src/assets/Icons";
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
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  useScrollLock(true);

  const images = service.photos.map((p) => p.url);

  const onMobileScroll = useCallback(() => {
    const el = mobileRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / el.offsetWidth));
  }, []);

  const onDesktopScroll = useCallback(() => {
    const el = desktopRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / el.offsetWidth));
  }, []);

  function goTo(idx: number) {
    [mobileRef, desktopRef].forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      el.scrollTo({ left: idx * el.offsetWidth, behavior: "smooth" });
    });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/60"
      onClick={onClose}
    >
      {/* ── MOBILE: bottom sheet  ── */}
      <div
        className="min-[500px]:hidden flex h-[96dvh] max-h-[96dvh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 0 && (
          <div className="relative w-full aspect-square flex-none">
            <div
              className="absolute top-0 left-0 right-0 z-20 flex items-center justify-end px-1 pt-2"
              style={{ background: "rgba(255,255,255,0.60)", backdropFilter: "blur(11px)" }}
            >
              <button type="button" onClick={onClose} aria-label="Close" className="flex items-center justify-center p-2 cursor-pointer">
                <XIcon className="w-6 h-6" stroke="#222" />
              </button>
            </div>
            <div ref={mobileRef} onScroll={onMobileScroll} className="flex h-full overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {images.map((url, i) => (
                <div key={i} className="flex-none w-full h-full snap-center relative">
                  <Image src={url} alt={service.title} fill className="object-cover" />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="absolute h-[26px] bottom-2 left-1/2 -translate-x-1/2 flex items-center" style={{ gap: 8, padding: "8px 12px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.50)", background: "rgba(255,255,255,0.80)", backdropFilter: "blur(25px)" }}>
                {images.map((_, i) => (
                  <div key={i} style={i === activeIndex ? { width: 10, height: 10, borderRadius: "50%", background: "#222", flexShrink: 0 } : { width: 8, height: 8, borderRadius: "50%", background: "#B8B8B8", flexShrink: 0 }} />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="no-scrollbar flex-1 overflow-y-auto p-4">
          <h2 className="font-poppins text-[20px] font-semibold leading-[150%] text-[#222]">{service.title}</h2>
          <p className="font-poppins text-[14px] leading-[150%] text-[#222]">{t("Starting_price")} <span className="text-[16px] font-semibold">Rs. {service.price.toLocaleString()}</span></p>
          {whatsappHref && <Button text={t("WhatsApp")} className="mt-4 inline-flex" onPress={() => window.open(whatsappHref, "_blank", "noopener")} />}
          <p className="mt-4 font-poppins text-[14px] leading-[150%] text-[#525252]">{service.description}</p>
        </div>
      </div>

      {/* ── DESKTOP: header + body ── */}
      <div
        className="hidden min-[500px]:flex flex-col w-full max-w-[1008px] overflow-hidden rounded-[32px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-2 py-2 shrink-0">
          <button type="button" onClick={onClose} aria-label="Close" className="flex items-center justify-center p-2 cursor-pointer">
            <XIcon className="w-8 h-8" stroke="#222" />
          </button>
        </div>

        {/* Body: image left + content right */}
        <div className="flex items-start px-2 sm:px-5 pb-6 gap-3 sm:gap-5 pb-6">
          {/* Image — padded, rounded */}
          <div className="shrink-0">
            <div className="items-center relative w-[40vw] max-w-[400px] aspect-square rounded-[24px] overflow-hidden bg-[#F2F2F2]">
              {images.length > 0 && (
                <>
                  <div ref={desktopRef} onScroll={onDesktopScroll} className="flex h-full overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                    {images.map((url, i) => (
                      <div key={i} className="flex-none w-full h-full snap-center relative">
                        <Image src={url} alt={service.title} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  {images.length > 1 && (
                    <>
                      <button type="button" onClick={() => goTo((activeIndex - 1 + images.length) % images.length)} aria-label="Previous" className="absolute left-[5px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center cursor-pointer" style={{ borderRadius: 100, background: "rgba(0,0,0,0.30)", backdropFilter: "blur(25px)" }}>
                        <BackChevronIcon className="w-5 h-5" stroke="#fff" />
                      </button>
                      <button type="button" onClick={() => goTo((activeIndex + 1) % images.length)} aria-label="Next" className="absolute right-[5px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center cursor-pointer rotate-180" style={{ borderRadius: 100, background: "rgba(0,0,0,0.30)", backdropFilter: "blur(25px)" }}>
                        <BackChevronIcon className="w-5 h-5" stroke="#fff" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex h-8 items-center px-[14.77px]" style={{ gap: 9.85, borderRadius: 100, border: "1px solid rgba(255,255,255,0.50)", background: "rgba(255,255,255,0.80)", backdropFilter: "blur(25px)" }}>
                        {images.map((_, i) => (
                          <div key={i} style={i === activeIndex ? { width: 12.308, height: 12.308, borderRadius: "50%", background: "#222", flexShrink: 0 } : { width: 9.846, height: 9.846, borderRadius: "50%", background: "#B8B8B8", flexShrink: 0 }} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="no-scrollbar flex-1 overflow-y-auto pr-6">
            <h2 className="font-poppins text-[18px] sm:text-[20px] md:text-[24px] font-semibold leading-[150%] text-[#222]">{service.title}</h2>
            <p className="font-poppins text-[14px] sm:text-[16px] leading-[150%] text-[#222]">{t("Starting_price")} <span className="text-[16px] sm:text-[18px] font-semibold">Rs. {service.price.toLocaleString()}</span></p>
            {whatsappHref && <Button text={t("WhatsApp")} className="mt-4 sm:mt-5 inline-flex" onPress={() => window.open(whatsappHref, "_blank", "noopener")} />}
            <p className="mt-4 sm:mt-5 font-poppins text-[14px] sm:text-[16px] leading-[150%] text-[#525252]">{service.description}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
