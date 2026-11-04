"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BackChevronIcon,
  CakeIcon,
  EliteCrownIcon,
  EliteIcon,
  EliteProIcon,
  EliteVIPIcon,
  HeightRulerIcon,
  ReligionSparkleIcon,
  ShieldOutlineIcon,
  WorkBriefcaseIcon,
} from "../../assets/Icons";
import ProtectedImage from "../common-layout/ProtectedImage";
import ProtectedPhoto from "../common-layout/ProtectedPhoto";
import EliteMemberCardSkeleton from "./skeleton-layout/EliteMemberCardSkeleton";
import { getEliteMembers } from "../../lib/api/profiles";
import { useDragScroll } from "../../hooks/useDragScroll";
import { calculateAge } from "../../utils/calculateAge";
import type { BrowseProfile } from "../../types/user";

const SCROLL_STEP = 304;
// CSS paints the first layer on top, so the opaque gold base must be last
const CARD_BG = "radial-gradient(100% 158.06% at 35.43% 100%, #FFED99 0%, rgba(226, 185, 101, 0) 36.95%), linear-gradient(122.64deg, rgba(254, 241, 164, 0) 60.94%, rgba(177, 135, 58, 0.11) 61.06%), linear-gradient(112.5deg, #F5C55A 0.99%, #FFFEB3 37.1%, #FFE999 53.2%, #A2782B 100%)";
const CARD_SIZE = "shrink-0 w-[288px] h-[184px] max-[500px]:w-[264px] max-[500px]:h-[176px] rounded-[24px]";

const PLAN_TAGS = {
  max: { label: "Elite VIP", bg: "bg-[#141514]", text: "text-[#FFCE2D]", fill: "#FFCE2D", Icon: EliteVIPIcon },
  pro: { label: "Elite pro", bg: "bg-[#B31B38]", text: "text-white", fill: "#FFFFFF", Icon: EliteProIcon },
  basic: { label: "Elite basic", bg: "bg-[#725E4C]", text: "text-white", fill: "#FFFFFF", Icon: EliteCrownIcon },
};

function EliteMemberCard({ member, scrollRootRef, photosReady }: {
  member: BrowseProfile;
  scrollRootRef: RefObject<HTMLDivElement | null>;
  photosReady: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [nearView, setNearView] = useState(false);

  // Fetch the photo only when the card is on screen or one card away from it
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          observer.disconnect();
        }
      },
      { root: scrollRootRef.current, rootMargin: `0px ${SCROLL_STEP}px` },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [scrollRootRef]);

  const tag = PLAN_TAGS[member.elitePlanKey === "max" || member.elitePlanKey === "pro" ? member.elitePlanKey : "basic"];
  const placeholder = member.gender === "male" ? "/images/no_photo_male.webp" : "/images/no_photo.webp";
  const showPhoto = !!member.photoUrl && member.photoAccess !== "locked";
  const age = calculateAge(member.dateOfBirth);

  const details = [
    { Icon: CakeIcon, value: age ? `${age} years` : "-" },
    { Icon: HeightRulerIcon, value: member.heightCm ? `${member.heightCm} cm` : "-" },
    { Icon: WorkBriefcaseIcon, value: member.occupation || "-" },
    { Icon: ReligionSparkleIcon, value: member.religion || "-" },
  ];

  return (
    <Link
      ref={cardRef}
      href={`/user-profile?id=${member.id}`}
      draggable={false}
      className={`${CARD_SIZE} relative flex flex-col justify-center overflow-hidden px-5 max-[500px]:px-4 no-underline`}
      style={{ background: CARD_BG }}
    >
      <div className={`absolute right-0 top-0 flex items-center gap-1 rounded-bl-[24px] py-1 pl-4 pr-4 ${tag.bg}`}>
        <tag.Icon className="h-[16px] w-[16px] shrink-0" fill={tag.fill} />
        <span className={`font-poppins text-[12px] leading-[150%] ${tag.text}`}>{tag.label}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-1 border-[#D8D8D8] bg-[#D8D8D8]">
          <ProtectedImage src={placeholder} alt="" fill className="object-cover" sizes="56px" />
          {showPhoto && nearView && photosReady && (
            <ProtectedPhoto src={member.photoUrl!} alt={member.name} fill className="object-cover" sizes="56px" hideWhileLoading />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-poppins text-[18px] max-[500px]:text-[16px] font-medium leading-[150%] text-[#222222]">{member.name}</p>
          <p className="font-poppins text-[16px] max-[500px]:text-[14px] leading-[150%] text-[#222222]">{member.displayId}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1">
        {details.map(({ Icon, value }, i) => (
          <div key={i} className="flex min-w-0 items-center gap-2">
            <Icon className="h-5 w-5 max-[500px]:h-[14px] max-[500px]:w-[14px] shrink-0 text-[#222222]" />
            <span className="truncate font-poppins text-[16px] max-[500px]:text-[14px] leading-[150%] text-[#222222]">{value}</span>
          </div>
        ))}
      </div>
    </Link>
  );
}

export default function EliteMembersSection({ onViewAll, photosReady }: { onViewAll: () => void; photosReady: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  useDragScroll(scrollRef);

  const { data: members, isLoading, isError } = useQuery({
    queryKey: ["profiles", "elite-members"],
    queryFn: getEliteMembers,
    select: (data) => data.profiles,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isError || (!isLoading && !members?.length)) return null;

  function scrollByCard(dir: 1 | -1) {
    scrollRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
  }

  const arrowClass = "cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.06] absolute top-1/2 -translate-y-1/2 z-20 p-1.5 hidden min-[500px]:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-[25px]";
  const arrowIconClass = "w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]";

  return (
    <section className="mx-auto w-full max-w-[944px]">
      <div className="flex items-center gap-2">
        <EliteIcon className="h-4.5 sm:h-5 w-4.5 sm:w-5 shrink-0 text-[#222222]" />
        <h2 className="font-tamil text-[15px] sm:text-[16px] font-medium leading-[150%] text-[#222222]">எலைட் அங்கத்தவர்கள்</h2>
      </div>

      {/* -mx-4 cancels the page padding so cards scroll to the screen edge on mobile */}
      <div className="relative mt-3 -mx-4">
        <div
          className="pointer-events-none absolute -left-[1px] top-0 bottom-0 w-10 z-10 hidden min-[500px]:block"
          style={{ background: "linear-gradient(90deg, #F8F5F2 0%, #F8F5F2 35%, rgba(248,245,242,0.00) 100%)" }}
        />
        <button type="button" onClick={() => scrollByCard(-1)} aria-label="Scroll left" className={`${arrowClass} left-[2px] lg:-left-2`}>
          <BackChevronIcon className={arrowIconClass} stroke="#fff" strokeWidth={3} />
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: "none" }}
          onMouseDownCapture={(e) => { dragStartX.current = e.clientX; }}
          onClickCapture={(e) => { if (Math.abs(e.clientX - dragStartX.current) > 5) { e.preventDefault(); e.stopPropagation(); } }}
        >
          <div className="flex w-max gap-4 px-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <EliteMemberCardSkeleton key={i} />)
              : (
                <>
                  {members?.map((member) => <EliteMemberCard key={member.id} member={member} scrollRootRef={scrollRef} photosReady={photosReady} />)}
                  <button
                    type="button"
                    onClick={onViewAll}
                    className={`${CARD_SIZE} flex cursor-pointer items-center justify-center gap-1`}
                    style={{ background: CARD_BG }}
                  >
                    <span className="font-poppins text-[16px] font-medium leading-[150%] text-[#222222]">View all</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
          </div>
        </div>

        <button type="button" onClick={() => scrollByCard(1)} aria-label="Scroll right" className={`${arrowClass} right-[1px] lg:-right-2`}>
          <BackChevronIcon className={`${arrowIconClass} rotate-180`} stroke="#fff" strokeWidth={3} />
        </button>
        <div
          className="pointer-events-none absolute -right-[1px] top-0 bottom-0 w-10 z-10 hidden min-[500px]:block"
          style={{ background: "linear-gradient(270deg, #F8F5F2 0%, #F8F5F2 35%, rgba(248,245,242,0.00) 100%)" }}
        />
      </div>

      <div className="mt-6 sm:mt-7 md:mt-8 flex items-center gap-2">
        <ShieldOutlineIcon className="h-4.5 sm:h-5 w-4.5 sm:w-5 shrink-0 text-[#222222]" />
        <h2 className="font-tamil text-[15px] sm:text-[16px] font-medium leading-[150%] text-[#222222]">இணை வரன்கள்</h2>
      </div>
    </section>
  );
}
