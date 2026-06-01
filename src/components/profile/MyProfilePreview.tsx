"use client";

import ProtectedImage from "@/src/components/common-layout/ProtectedImage";
import {
  AboutMeIcon, CakeIcon, CheckmarkIcon, CasteCircleIcon,
  EducationCapIcon, EliteCrownIcon, HeightRulerIcon, LocationPinIcon,
  PaintBrushIcon, ProfileBoxIcon, ProfileVerifiedBadgeIcon, UnionDesignIcon,
  WineGlassIcon, WorkBriefcaseIcon, StepFamilyIcon,
} from "@/src/assets/Icons";
import { BiPhoneCall } from "react-icons/bi";
import { calculateAge } from "@/src/utils/calculateAge";
import { formatHeight } from "@/src/utils/heightUtils";
import { DIET_FROM_BE, SMOKE_FROM_BE, DRINK_FROM_BE } from "@/src/utils/profileMappers";
import type { Me } from "@/src/types/user";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatWeight(kg?: number | null) {
  return kg ? `${kg} kg` : "Not specified";
}
function formatIncome(amount?: number | null, currency?: string | null) {
  if (!amount) return "Not specified";
  return `${amount.toLocaleString()} ${currency ?? "LKR"}`;
}

// ─── sub-components (mirrors user-profile) ───────────────────────────────────

type FieldRow = { label: string; value: string };
type SectionData = {
  icon: React.ReactNode;
  title: string;
  left: FieldRow[];
  right?: FieldRow[];
  extra?: React.ReactNode;
  hidden?: boolean;
};

function InfoColumn({ items, borderLeft = false }: { items: FieldRow[]; borderLeft?: boolean }) {
  return (
    <div className={`flex flex-col max-[500px]:gap-[11px] gap-3 max-[500px]:mt-2 mt-3 md:mt-4 font-poppins ${borderLeft ? "min-[700px]:border-l min-[700px]:border-[#EAEAEA] min-[700px]:pl-5 min-[767px]:max-[867px]:border-l-0 min-[767px]:max-[867px]:pl-0" : ""}`}>
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-1 min-[310px]:grid-cols-2 gap-x-4 gap-y-1 items-start">
          <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">{item.label}</span>
          <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-dark break-words">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ section }: { section: SectionData }) {
  return (
    <div className="rounded-[16px] bg-light max-[370px]:px-3 max-[370px]:py-2 px-4 py-4 md:py-5 font-poppins">
      <div className="flex items-center gap-2 md:gap-3 text-dark">
        {section.icon}
        <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold">{section.title}</h2>
      </div>
      <div className="max-[500px]:mt-2 mt-3 md:mt-4 border-t border-[#EAEAEA]" />
      {section.extra ? section.extra : (
        <div className="grid grid-cols-1 gap-0 min-[700px]:grid-cols-2 min-[700px]:gap-4 min-[767px]:max-[867px]:grid-cols-1 min-[767px]:max-[867px]:gap-0">
          <InfoColumn items={section.left} />
          <InfoColumn items={section.right ?? []} borderLeft />
        </div>
      )}
    </div>
  );
}

function QuickRow({ leftIcon: LeftIcon, leftText, rightText }: {
  leftIcon: React.ElementType; leftText: string; rightText?: string;
}) {
  return (
    <div className="flex items-center font-poppins justify-between flex-wrap">
      <div className="flex items-center gap-3 sm:gap-4">
        <LeftIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
        <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">{leftText}</span>
      </div>
      {rightText && (
        <div className="flex items-center gap-1 text-secondary sm:gap-2">
          <span className="text-[14px] md:text-[16px] font-normal leading-[150%]">{rightText}</span>
          <CheckmarkIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
        </div>
      )}
    </div>
  );
}

// ─── section builder ─────────────────────────────────────────────────────────

function buildSections(me: Me): SectionData[] {
  const pr = me.profile;
  const age = calculateAge(pr.dateOfBirth);

  return [
    {
      icon: <AboutMeIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "About Me",
      left: [], right: [],
      hidden: !pr.aboutMe,
      extra: <p className="md:mt-4 mt-3 text-[14px] md:text-[16px] leading-[150%] text-dark">{pr.aboutMe}</p>,
    },
    {
      icon: <ProfileBoxIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Basic Info",
      left: [
        { label: "Gender", value: me.gender ?? "Not specified" },
        { label: "Age", value: age != null && age > 0 ? `${age} years` : "Not specified" },
        { label: "Marital status", value: pr.maritalStatus ?? "Not specified" },
        { label: "Languages spoken", value: pr.languagesSpoken?.join(", ") || "Not specified" },
      ],
      right: [
        { label: "Height", value: pr.heightCm ? formatHeight(pr.heightCm) : "Not specified" },
        { label: "Weight", value: formatWeight(pr.weightKg) },
        { label: "Any physical challenge", value: pr.hasPhysicalChallenge ? (pr.disabilityType ?? "Yes") : "No" },
        { label: "Body type", value: pr.physicalBuild ?? "Not specified" },
      ],
    },
    {
      icon: <WorkBriefcaseIcon strokeWidth={2} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Career & Education",
      left: [
        { label: "Education", value: pr.education ?? "Not specified" },
        { label: "Education detail", value: pr.educationDetail ?? "Not specified" },
      ],
      right: [
        { label: "Sector", value: pr.sector ?? "Not specified" },
        { label: "Occupation", value: pr.occupation ?? "Not specified" },
        { label: "Monthly income", value: formatIncome(pr.monthlyIncome, pr.incomeCurrency) },
      ],
    },
    {
      icon: <StepFamilyIcon strokeWidth="4" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Family Background",
      left: [
        { label: "Father's occupation", value: pr.fatherOccupation ?? "Not specified" },
        { label: "Mom's occupation", value: pr.motherOccupation ?? "Not specified" },
      ],
      right: [
        { label: "Number of brother(s)", value: pr.brotherCount !== undefined ? String(pr.brotherCount) : "Not specified" },
        { label: "Brother(s) married", value: pr.brothersMarried !== undefined ? String(pr.brothersMarried) : "Not specified" },
        { label: "Number of sister(s)", value: pr.sisterCount !== undefined ? String(pr.sisterCount) : "Not specified" },
        { label: "Sister(s) married", value: pr.sistersMarried !== undefined ? String(pr.sistersMarried) : "Not specified" },
      ],
    },
    {
      icon: <CasteCircleIcon strokeWidth="2" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Religion and Caste",
      left: [{ label: "Religion", value: pr.religion ?? "Not specified" }],
      right: [{ label: "Caste", value: pr.caste ?? "Not specified" }],
    },
    {
      icon: <LocationPinIcon strokeWidth="2" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Location",
      left: [
        { label: "City", value: pr.city ?? "Not specified" },
        { label: "Country", value: pr.country ?? "Not specified" },
      ],
      right: [
        { label: "Citizenship", value: pr.citizenship ?? "Not specified" },
        { label: "Resident status", value: pr.residentStatus ?? "Not specified" },
      ],
    },
    {
      icon: <WineGlassIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Lifestyle",
      left: [{ label: "Diet habit", value: (pr.dietHabit && DIET_FROM_BE[pr.dietHabit]) ?? "Not specified" }],
      right: [
        { label: "Smoking habit", value: (pr.smokingHabit && SMOKE_FROM_BE[pr.smokingHabit]) ?? "Not specified" },
        { label: "Drinking habit", value: (pr.drinkingHabit && DRINK_FROM_BE[pr.drinkingHabit]) ?? "Not specified" },
      ],
    },
    ...(pr.hobbies && pr.hobbies.length > 0 ? [{
      icon: <PaintBrushIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Interests & Hobbies",
      left: [], right: [],
      extra: (
        <div className="pt-4 flex flex-wrap gap-3 md:gap-4">
          {pr.hobbies.map((hobby) => (
            <div key={hobby} className="flex items-center justify-center rounded-[48px] bg-[#F0F0F0] px-2 md:px-3 py-1">
              <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">{hobby}</span>
            </div>
          ))}
        </div>
      ),
    }] : []),
    {
      icon: <BiPhoneCall strokeWidth={0.5} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Contact",
      left: [],
      right: [],
      extra: (
        <div className="mt-3 md:mt-4 flex flex-col gap-2">
          <div className="grid grid-cols-1 min-[310px]:grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">WhatsApp</span>
            <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-dark select-none">{me.phone ?? "—"}</span>
          </div>
          <div className="grid grid-cols-1 min-[310px]:grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">Email</span>
            <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-dark select-none">{me.email ?? "—"}</span>
          </div>
        </div>
      ),
    },
  ];
}

// ─── main export ─────────────────────────────────────────────────────────────

export default function MyProfilePreview({ me, photoSrc }: { me: Me; photoSrc: string }) {
  const pr = me.profile;
  const age = calculateAge(pr.dateOfBirth);
  const placeholder = me.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png";
  const displaySrc = photoSrc || placeholder;
  const sections = buildSections(me).filter((s) => !s.hidden);

  return (
    <>
      {/* ── Mobile layout (<768px) ── */}
      <div className="md:hidden">
        <div className="flex max-[370px]:gap-3 max-[500px]:gap-4 gap-6 sm:px-6 px-4 max-[370px]:px-2 max-[500px]:pt-4 pt-6">
          {/* Photo */}
          <div className="relative shrink-0 w-[165px] h-[218.664px] rounded-[20px] overflow-hidden bg-[#D9D9D9]">
            <ProtectedImage
              src={displaySrc}
              alt={me.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Right column */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-0">
            <p className="font-poppins text-[14px] text-dark font-normal">{me.displayId}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {me.isElite ? (
                <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[4.5px]">
                  <EliteCrownIcon className="w-4 h-4 shrink-0" />
                  <span className="text-[#A97216] text-[14px] font-normal leading-[150%]">Elite</span>
                </div>
              ) : (
                <div className="flex items-center rounded-[38px] bg-[#D5ECFF] px-2 py-[4.5px]">
                  <span className="text-[14px] font-normal leading-[150%] text-[#5D5D5D]">New</span>
                </div>
              )}
            </div>
            <div className="border-t border-[#EBEBEB] my-2" />
            {(me.isPhoneVerified || me.isEmailVerified) && (
              <>
                {me.isPhoneVerified && <div className="flex items-center gap-0.5 text-[#6B6B6B] mb-[3px]"><span className="text-[14px] font-normal leading-[150%]">WhatsApp verified</span><CheckmarkIcon className="h-4 w-4 shrink-0" /></div>}
                {me.isEmailVerified && <div className="flex items-center gap-0.5 text-[#6B6B6B]"><span className="text-[14px] font-normal leading-[150%]">Email verified</span><CheckmarkIcon className="h-4 w-4 shrink-0" /></div>}
                <div className="border-t border-[#EBEBEB] my-2" />
              </>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><CakeIcon className="w-4 h-4 shrink-0 text-dark" /><span className="text-[14px] text-dark truncate">{age != null && age > 0 ? `${age} years` : "Not specified"}</span></div>
              <div className="flex items-center gap-2"><EducationCapIcon className="w-4 h-4 shrink-0 text-dark" /><span className="text-[14px] text-dark truncate">{pr.education ?? "Not specified"}</span></div>
              <div className="flex items-center gap-2"><WorkBriefcaseIcon className="w-4 h-4 shrink-0 text-dark" /><span className="text-[14px] text-dark truncate">{pr.occupation ?? "Not specified"}</span></div>
              <div className="flex items-center gap-2"><HeightRulerIcon className="w-4 h-4 shrink-0 text-dark" /><span className="text-[14px] text-dark truncate">{pr.heightCm ? formatHeight(pr.heightCm) : "Not specified"}</span></div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-5 sm:px-6 px-4 max-[370px]:px-2 space-y-4">
          {sections.map((s) => <SectionCard key={s.title} section={s} />)}
        </div>
      </div>

      {/* ── Desktop layout (≥768px) ── */}
      <div className="hidden md:flex mt-6 md:mt-8 justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[1160px] flex-col min-[700px]:items-start min-[700px]:flex-row gap-5 sm:gap-7 lg:gap-10">
          {/* Sticky photo */}
          <div className="shrink-0 min-[700px]:sticky min-[700px]:top-[172px]">
            <div className="relative h-[213px] w-[160px] lg:h-[266px] lg:w-[200px]">
              <div className="relative z-10 h-[213px] w-[160px] lg:h-[266px] lg:w-[200px] overflow-hidden rounded-[16px] bg-[#D9D9D9]">
                <ProtectedImage
                  src={displaySrc}
                  alt={me.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="mt-[-2px] w-[92px] lg:w-[105px] mx-auto">
                <UnionDesignIcon className="rotate-270 -translate-y-32 lg:-translate-y-36.5" />
                <UnionDesignIcon className="rotate-90 -translate-y-52 lg:-translate-y-59.5" />
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1 md:gap-2">
                <h1 className="text-dark text-[16px] md:text-[18px] font-medium leading-[150%]">{me.name}</h1>
                {me.trustBadge && <ProfileVerifiedBadgeIcon className="h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 shrink-0" />}
              </div>
              {me.isElite ? (
                <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                  <EliteCrownIcon className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 shrink-0" />
                  <span className="text-[#A97216] text-[14px] md:text-[16px] font-normal leading-[150%]">Elite</span>
                </div>
              ) : (
                <div className="flex items-center rounded-[38px] bg-[#D5ECFF] px-3 py-[2px]">
                  <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-[#5D5D5D]">New</span>
                </div>
              )}
            </div>

            <div className="md:mt-0.5 text-dark text-[14px] md:text-[16px] font-normal leading-[150%]">{me.displayId}</div>

            <div className="mt-4 flex flex-col gap-3 sm:mt-6 lg:mt-8">
              <QuickRow leftIcon={CakeIcon} leftText={age != null && age > 0 ? `${age} years` : "Not specified"} rightText={me.isPhoneVerified ? "WhatsApp verified" : undefined} />
              <QuickRow leftIcon={EducationCapIcon} leftText={pr.education ?? "Not specified"} rightText={me.isEmailVerified ? "Email verified" : undefined} />
              <QuickRow leftIcon={WorkBriefcaseIcon} leftText={pr.occupation ?? "Not specified"} />
              <QuickRow leftIcon={HeightRulerIcon} leftText={pr.heightCm ? formatHeight(pr.heightCm) : "Not specified"} />
            </div>

            <div className="mt-6 space-y-4 md:mt-8 md:space-y-6">
              {sections.map((s) => <SectionCard key={s.title} section={s} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
