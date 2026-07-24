"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { PublicBusiness } from "./page";
import API_BASE_URL from "@/src/lib/api/config";
import { useLang } from "@/src/context/LangContext";
import { useDragScroll } from "@/src/hooks/useDragScroll";
import { useScrollLock } from "@/src/hooks/useScrollLock";
import {
  BackChevronIcon,
  ExpandIcon,
  XIcon,
  WhatsAppLineIcon,
  ChevronIcon,
  ClockIcon,
  QualificationIcon,
} from "@/src/assets/Icons";
import ServiceModal from "./ServiceModal";
import BusinessReviewSection from "./BusinessReviewSection";
import Button from "@/src/components/common-layout/Button";

function CareerIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M8.97724 3.03754L9.79972 4.68253C9.91055 4.91003 10.2081 5.12587 10.4589 5.17253L11.9464 5.41753C12.8972 5.57503 13.1189 6.26337 12.4364 6.9517L11.2756 8.11254C11.0831 8.30504 10.9722 8.6842 11.0364 8.95837L11.3689 10.3934C11.6314 11.525 11.0247 11.9684 10.0272 11.3734L8.63305 10.545C8.38222 10.3934 7.96223 10.3934 7.71139 10.545L6.31722 11.3734C5.31972 11.9625 4.71306 11.525 4.97556 10.3934L5.30806 8.95837C5.37223 8.69004 5.2614 8.31087 5.0689 8.11254L3.90807 6.9517C3.22557 6.2692 3.44723 5.58086 4.39807 5.41753L5.88556 5.17253C6.13639 5.1317 6.43389 4.91003 6.54473 4.68253L7.36723 3.03754C7.80473 2.14504 8.52807 2.14504 8.97724 3.03754Z" stroke="#222222" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.66602 2.9165H1.16602" stroke="#222222" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.91602 11.0835H1.16602" stroke="#222222" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.74935 7H1.16602" stroke="#222222" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Horizontal scroll strip ───────────────────────────────────────────────────

const SCROLL_STEP = 216;

function MobileScroll({
  services,
  onExpand,
  onViewDetails,
  viewDetailsLabel,
}: {
  services: PublicBusiness["services"];
  onExpand: (url: string, title: string) => void;
  onViewDetails: (s: PublicBusiness["services"][0]) => void;
  viewDetailsLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useDragScroll(scrollRef);

  const allPhotos = services.flatMap((s) =>
    s.photos.map((p) => ({ url: p.url, service: s }))
  );

  function scrollByCard(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * SCROLL_STEP, behavior: "smooth" });
  }

  return (
    <div className="max-[500px]:py-6 py-7 sm:py-8 md:py-9 lg:py-10 relative mx-auto">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll left"
        className="hidden min-[500px]:flex absolute -left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 items-center justify-center rounded-full bg-black/30 backdrop-blur-[25px] cursor-pointer"
      >
        <BackChevronIcon className="w-6 h-6" stroke="#fff" strokeWidth={3} />
      </button>
      <div ref={scrollRef} className="overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
        <div className="max-[500px]:px-4 flex flex-row min-[500px]:px-4 w-max max-[500px]:gap-2 gap-4">
          {allPhotos.map((photo, i) => (
            <div
              key={i}
              className="relative w-[clamp(200px,26vw,248px)] aspect-square overflow-hidden rounded-[20.645px] bg-[#D9D9D9]"
            >
              <Image src={photo.url} alt={photo.service.title} fill className="object-cover" loading="lazy" />
              <button
                type="button"
                onClick={() => onExpand(photo.url, photo.service.title)}
                aria-label="View full image"
                className="absolute left-2 top-2 flex max-[500px]:h-[34px] h-[43px] max-[500px]:w-[34px] w-[43px] items-center justify-center rounded-full bg-white/80 backdrop-blur-[8px] cursor-pointer shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_0_rgba(0,0,0,0.04),0_4px_8px_0_rgba(0,0,0,0.10)]"
              >
                <ExpandIcon className="max-[500px]:w-4 w-5 max-[500px]:h-4 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onViewDetails(photo.service)}
                className="absolute bottom-0 right-0 p-2 flex items-center"
              >
                <div className="rounded-[16px] bg-white/80 backdrop-blur-[8px] max-[500px]:px-[9px] px-[11px] max-[500px]:py-[5px] py-[6px] cursor-pointer whitespace-nowrap shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_0_rgba(0,0,0,0.04),0_4px_8px_0_rgba(0,0,0,0.10)]">
                  <span className="font-poppins max-[500px]:text-[12px] text-[14px] leading-[130%] font-medium text-[#222222]">{viewDetailsLabel}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll right"
        className="hidden min-[500px]:flex absolute -right-0 rotate-180 top-1/2 -translate-y-1/2 z-20 p-1.5 items-center justify-center rounded-full bg-black/30 backdrop-blur-[25px] cursor-pointer"
      >
        <BackChevronIcon className="w-6 h-6" stroke="#fff" strokeWidth={3} />
      </button>
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10"
        style={{ background: "linear-gradient(270deg, #FFFFFF 0%, #FFFFFF 35%, rgba(243,244,246,0.00) 70%)" }}
      />
    </div>
  );
}

// ── Service list item ─────────────────────────────────────────────────────────

function ServiceListItem({
  service,
  onViewDetails,
}: {
  service: PublicBusiness["services"][0];
  onViewDetails: (s: PublicBusiness["services"][0]) => void;
}) {
  const { t } = useLang();
  const cover = service.photos[0]?.url ?? null;

  return (
    <button
      type="button"
      onClick={() => onViewDetails(service)}
      className="flex max-w-[640px] mx-auto w-full items-center max-[500px]:gap-3 gap-5 max-[500px]:rounded-[16px] rounded-[32px] max-[500px]:p-2 p-4 shadow-[0_0_8px_0_rgba(0,0,0,0.12)] cursor-pointer text-left"
    >
      <div className="relative h-[clamp(80px,20vw,156px)] w-[clamp(80px,20vw,156px)] shrink-0 overflow-hidden max-[500px]:rounded-[12px] rounded-[20px] bg-[#D9D9D9]">
        {cover && <Image src={cover} alt={service.title} fill className="object-cover" loading="lazy" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="leading-[150%] truncate font-poppins max-[500px]:text-[14px] text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#222222]">{service.title}</p>
        <p className="leading-[135%] max-[500px]:mt-0.5 mt-1 max-[500px]:line-clamp-2 line-clamp-3 font-poppins max-[500px]:text-[12px] text-[14px] sm:text-[16px] text-[#767676]">{service.description}</p>
        <div className="max-[500px]:mt-1 mt-4 inline-flex items-center py-[2px] pl-2 pr-1.5 bg-[#F2F2F2] rounded-full gap-1">
          <span className="font-poppins max-[500px]:text-[12px] text-[14px] sm:text-[16px] leading-[150%] text-[#B31B38]">{t("View_details")}</span>
          <BackChevronIcon className="max-[500px]:w-3 w-4 max-[500px]:h-3 h-4 shrink-0 rotate-180" stroke="#B31B38" strokeWidth={2.5} />
        </div>
      </div>
    </button>
  );
}

// ── Image lightbox ────────────────────────────────────────────────────────────

function ImageLightbox({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  useScrollLock(true);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
      <button type="button" onClick={onClose} className="absolute right-4 top-4 cursor-pointer p-2" aria-label="Close">
        <XIcon className="h-7 w-7" stroke="#FFFFFF" />
      </button>
      <div className="relative h-[80vh] w-full max-w-[640px]">
        <Image src={url} alt={title} fill className="object-contain" />
      </div>
    </div>,
    document.body
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PublicPortfolioClient({ business: b }: { business: PublicBusiness }) {
  const { t } = useLang();
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioTruncated, setBioTruncated] = useState(false);
  const [detailsService, setDetailsService] = useState<PublicBusiness["services"][0] | null>(null);
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null);
  const [waClicked, setWaClicked] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  const whatsappHref = b.phone
    ? `https://wa.me/${b.countryCode.replace("+", "")}${b.phone}`
    : null;

  const locationText = [b.village, b.district].filter(Boolean).join(", ");
  const hasQualificationInfo = b.experience || b.qualifications || b.careerHighlight;

  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    const measure = () => setBioTruncated(el.scrollHeight > el.clientHeight);
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [b.bio]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/business/${b.username}/view`, { method: "POST" }).catch(() => { });
  }, [b.username]);

  function handleWhatsApp() {
    if (!waClicked) {
      setWaClicked(true);
      fetch(`${API_BASE_URL}/api/public/business/${b.username}/whatsapp-click`, { method: "POST" }).catch(() => { });
    }
    if (whatsappHref) window.open(whatsappHref, "_blank", "noopener");
  }

  return (
    <div className="min-h-screen bg-white font-poppins pb-20">
      <div className="flex flex-col">

        {/* ── Cover photo section ───────────────────────────────────────────── */}
        <div className="w-full max-[500px]:px-2 px-4 sm:px-6 md:px-10 lg:px-22">
          <div className="rounded-[24px] relative">

            {b.coverPhotoUrl && (
              <div
                className="hidden sm:block absolute inset-0 rounded-[24px] opacity-80"
                style={{
                  backgroundImage: `linear-gradient(89deg, rgba(255,255,255,0.00) 50%, rgba(255,255,255,0.30) 85%, #FFF 100%), linear-gradient(270deg, rgba(255,255,255,0.00) 50%, rgba(255,255,255,0.30) 85%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.20) 45%, #FFF 90%), url(${b.coverPhotoUrl})`,
                  backgroundColor: "#D9D9D9",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  filter: "blur(7px)",
                }}
              />
            )}

            <div className="relative">
              <div className="relative max-w-[1040px] mx-auto aspect-video w-full overflow-hidden rounded-[32px] min-[500px]:rounded-[64px] bg-[#D9D9D9]">
                {b.coverPhotoUrl && (
                  <Image src={b.coverPhotoUrl} alt={b.businessName} fill className="object-cover" />
                )}
              </div>

              <div className="absolute min-[500px]:-bottom-11.5 -bottom-6.5 max-[500px]:left-2 min-[500px]:right-0 min-[500px]:left-0 min-[500px]:mx-auto flex h-[50.4px] min-[500px]:h-23 w-[50.4px] min-[500px]:w-23 items-center justify-center overflow-hidden rounded-full max-[500px]:border-[2.4px] border-[4px] border-white bg-[#E8E8E8]">
                {b.logoUrl ? (
                  <Image src={b.logoUrl} alt="" fill className="object-cover" />
                ) : (
                  <span className="text-[19.2px] min-[500px]:text-[33.84px] font-medium text-[#E5BAC2]">
                    {b.businessName.trim().charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* height gap between logo*/}
            <div className="max-[500px]:h-6 h-11 " />

            <div className="relative flex flex-col px-4 max-[500px]:mt-6 mt-7 sm:mt-8 md:mt-9 lg:mt-10">
              <h1 className="text-center font-poppins max-[500px]:text-[24px] text-[26px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-semibold leading-[120%] text-[#222]">
                {b.businessName}
              </h1>

              {b.bio && (
                <div className="mx-auto mt-2 max-[500px]:mt-[15.67px] max-w-[640px] text-center">
                  <p
                    ref={bioRef}
                    className={`font-poppins max-[500px]:text-[12px] text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-[150%] text-[#656565] ${bioExpanded ? "" : "line-clamp-3 max-[500px]:line-clamp-4"}`}
                  >
                    {b.bio}
                  </p>
                  {bioTruncated && (
                    <button
                      type="button"
                      onClick={() => setBioExpanded((v) => !v)}
                      className="min-[500px]:font-semibold inline-flex items-center gap-1 font-poppins max-[500px]:text-[12px] text-[14px] md:text-[18px] text-[#767676] cursor-pointer"
                    >
                      {bioExpanded ? t("See_less") : t("See_more")}
                      <ChevronIcon open={bioExpanded} className="max-[500px]:w-3 w-4 max-[500px]:h-3 h-4 shrink-0 transition-transform duration-300" stroke="#767676" />
                    </button>
                  )}
                </div>
              )}

              {whatsappHref && (
                <Button
                  text={t("WhatsApp")}
                  onPress={handleWhatsApp}
                  className="max-[500px]:mt-4 mt-6 mx-auto max-[500px]:px-4 items-center "
                  iconLeft={<WhatsAppLineIcon className="h-5 w-5" />}
                />

              )}
            </div>
          </div>
        </div>

        {/* ── Experience / qualifications card ─────────────────────────────── */}
        {hasQualificationInfo && (
          <div className="px-4 sm:px-6">
            <div className="max-[500px]:mt-6 mt-10 max-w-[640px] mx-auto flex flex-col max-[500px]:gap-2 gap-3 rounded-[20px] bg-white max-[500px]:px-4 px-5 max-[500px]:py-6 py-5 shadow-[0_0_8px_0_rgba(0,0,0,0.16)]">
              {b.experience && (
                <div className="flex items-center max-[500px]:gap-2.5 gap-3 sm:gap-4 md:gap-5">
                  <ClockIcon className="max-[500px]:w-3.5 w-5 max-[500px]:h-3.5 h-5 shrink-0" />
                  <span className="font-poppins max-[500px]:text-[14px] text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] text-[#222222]">{b.experience}</span>
                </div>
              )}
              {b.qualifications && (
                <div className="flex items-center max-[500px]:gap-2.5 gap-3 sm:gap-4 md:gap-5">
                  <QualificationIcon className="max-[500px]:w-3.5 w-5 max-[500px]:h-3.5 h-5 shrink-0" />
                  <span className="font-poppins max-[500px]:text-[14px] text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] text-[#222222]">{b.qualifications}</span>
                </div>
              )}
              {b.careerHighlight && (
                <div className="flex items-start max-[500px]:gap-2.5 gap-3 sm:gap-4 md:gap-5">
                  <div className="mt-[2.5px] shrink-0">
                    <CareerIcon className="max-[500px]:w-3.5 w-5 max-[500px]:h-3.5 h-5" />
                  </div>
                  <span className="font-poppins max-[500px]:text-[14px] text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] text-[#222222]">{b.careerHighlight}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Services ─────────────────────────────────────────────────────── */}
        {b.services.length > 0 && (
          <section className="w-full bg-white font-poppins max-[500px]:mt-6 mt-7 sm:mt-8 md:mt-9 lg:mt-10 md:max-w-[1040px] min-[500px]:px-2 sm:px-4 md:mx-auto">
            <MobileScroll
              services={b.services}
              onExpand={(url, title) => setLightbox({ url, title })}
              onViewDetails={setDetailsService}
              viewDetailsLabel={t("View_details")}
            />

            <div className="max-[500px]:mt-6 mt-10 flex flex-col max-[500px]:gap-4 gap-5 px-2 sm:px-4">
              {b.services.map((s) => (
                <ServiceListItem key={s.id} service={s} onViewDetails={setDetailsService} />
              ))}
            </div>
          </section>
        )}

        {/* ── Location + service areas ──────────────────────────────────────── */}
        <div className="flex flex-col items-center px-4 max-[500px]:mt-5 mt-6">
          {whatsappHref && (
              <Button text={t("WhatsApp")} 
              className="max-[500px]:px-6"
              onPress={handleWhatsApp}/>
            )}

          {locationText && (
            <div className="max-[500px]:mt-6 mt-7 sm:mt-8 md:mt-9 lg:mt-10">
              <h3 className="text-center font-poppins text-[16px] sm:text-[18px] md:text-[19px] text-[20px] font-semibold leading-[150%] text-[#222]">
                {t("Location")}
              </h3>
              <p className="max-[500px]:mt-1 mt-2 text-center font-poppins text-[14px] sm:text-[15px] md:text-[16px] leading-[135%] text-[#767676]">{locationText}</p>
            </div>
          )}

          {b.serviceDistricts.length > 0 && (
            <div className="max-[500px]:mt-4 mt-6">
              <h3 className="text-center font-poppins text-[16px] sm:text-[18px] md:text-[19px] text-[20px] font-semibold leading-[150%] text-[#222]">
                {t("Service_areas")}
              </h3>
              <p className="max-[500px]:mt-1 mt-2 max-w-[320px] text-center font-poppins text-[14px] sm:text-[15px] md:text-[16px] leading-[135%] text-[#767676]">
                {b.islandWide ? t("Island_wide") : b.serviceDistricts.join(", ")}
              </p>
            </div>
          )}

        </div>

        {/* ── Reviews ──────────────────────────────────────────────────────── */}
        <BusinessReviewSection showActions={true} businessName={b.businessName} username={b.username} />

      </div>

      {lightbox && (
        <ImageLightbox url={lightbox.url} title={lightbox.title} onClose={() => setLightbox(null)} />
      )}
      {detailsService && (
        <ServiceModal service={detailsService} whatsappHref={whatsappHref} onClose={() => setDetailsService(null)} />
      )}
    </div>
  );
}
