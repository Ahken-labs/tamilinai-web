"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import ProtectedPhoto from "@/src/components/common-layout/ProtectedPhoto";
import { getCachedPhoto, setCachedPhoto } from "@/src/utils/othersPhotoCache";
import { formatHeight } from "@/src/utils/heightUtils";
import {
  AboutMeIcon, CakeIcon, CheckmarkIcon, ChevronRightIcon, CasteCircleIcon,
  EducationCapIcon, EliteCrownIcon, HeightRulerIcon, LocationPinIcon,
  PaintBrushIcon, ProfileBoxIcon, ProfileVerifiedBadgeIcon, UnionDesignIcon,
  WineGlassIcon, WorkBriefcaseIcon, StepFamilyIcon,
} from "@/src/assets/Icons";
import { BiPhoneCall } from "react-icons/bi";
import MatchPreferencesCard from "@/src/components/profile/MatchPreferencesCard";
import MatchInterestCard from "@/src/components/profile/MatchInterestCard";
import Match_ContactSection_Card from "@/src/components/profile/Match_ContactSection_Card";
import { getProfile } from "@/src/lib/api/profiles";
import type { ProfileDetail } from "@/src/types/user";
import UserProfileSkeleton from "@/src/components/app/skeleton-layout/UserProfileSkeleton";

function calculateAge(dob?: string): number {
  if (!dob) return 0;
  const born = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  if (
    today.getMonth() < born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() < born.getDate())
  ) age--;
  return age;
}

function formatWeight(kg?: number): string {
  if (!kg) return "Not specified";
  return `${kg} kg`;
}

function formatIncome(amount?: number, currency?: string): string {
  if (!amount) return "Not specified";
  const c = currency ?? "LKR";
  return `${amount.toLocaleString()} ${c}`;
}

type FieldRow = { label: string; value: string };
type SectionData = {
  icon: React.ReactNode;
  title: string;
  left: FieldRow[];
  right?: FieldRow[];
  extra?: React.ReactNode;
  titleRightIcon?: React.ReactNode;
  hidden?: boolean;
};

function buildSections(p: ProfileDetail, interestStatus: "sent" | "received" | "declined", onAction?: () => void): SectionData[] {
  const pr = p.profile;
  const age = calculateAge(pr.dateOfBirth);
  const isAccepted = p.interestIsAccepted ?? false;
  const sendCount = p.interestSendCount ?? 0;
  const receivedCount = p.interestReceiveCount ?? 1;
  const lastSentAt = p.interestLastSentAt ?? null;
  const isReminderDue = p.isReminderDue ?? false;

  const isElite = p.isElite;

  return [
    {
      icon: <AboutMeIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "About Me",
      left: [],
      right: [],
      hidden: !pr.aboutMe,
      extra: (
        <p className="md:mt-4 mt-3 font-16 leading-[150%] text-dark">
          {pr.aboutMe}
        </p>
      ),
    },
    {
      icon: <ProfileBoxIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Basic Info",
      left: [
        { label: "Gender", value: p.gender ?? "Not specified" },
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
    ...(interestStatus === "declined"
      ? []
      : [
        {
          icon: <BiPhoneCall strokeWidth={0.5} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
          title: "Contact",
          titleRightIcon: isElite ? (
            isAccepted ? (
              <span className="inline-flex select-none items-center justify-center text-[20px] leading-none" aria-label="party" role="img">🎉</span>
            ) : (
              <EliteCrownIcon className="w-4 sm:w-5 md:w-5.5 lg:w-6 h-4 sm:h-5 md:h-5.5 lg:h-6 shrink-0" />
            )
          ) : null,
          left: [],
          right: [],
          extra: (
            <Match_ContactSection_Card
              profileId={p.id}
              profileName={p.name}
              status={interestStatus}
              isElite={isElite}
              isAccepted={isAccepted}
              sendCount={sendCount}
              receivedCount={receivedCount}
              lastSentAt={lastSentAt}
              isReminderDue={isReminderDue}
              phone={isAccepted && isElite ? p.phone : undefined}
              countryCode={isAccepted && isElite ? p.countryCode : undefined}
              email={isAccepted && isElite ? p.email : undefined}
              onAction={onAction}
            />
          ),
        },
      ]),
    {
      icon: <StepFamilyIcon strokeWidth="4" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Family Background",
      left: [
        { label: "Father's occupation", value: pr.fatherOccupation ?? "Not specified" },
        { label: "Mom's occupation", value: pr.motherOccupation ?? "Not specified" },
        { label: "Family origin / Ancestral", value: pr.familyOrigin ?? "Not specified" },
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
      right: [{ label: "Citizenship", value: pr.citizenship ?? "Not specified" }],
    },
    {
      icon: <WineGlassIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      title: "Lifestyle",
      left: [{ label: "Diet habit", value: pr.dietHabit ?? "Not specified" }],
      right: [
        { label: "Smoking habit", value: pr.smokingHabit ?? "Not specified" },
        { label: "Drinking habit", value: pr.drinkingHabit ?? "Not specified" },
      ],
    },
    ...(pr.hobbies && pr.hobbies.length > 0
      ? [
        {
          icon: <PaintBrushIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
          title: "Interests & Hobbies",
          left: [],
          right: [],
          extra: (
            <div className="pt-4 flex flex-wrap gap-3 md:gap-4">
              {pr.hobbies.map((hobby) => (
                <div key={hobby} className="flex items-center justify-center rounded-[48px] bg-[#F0F0F0] px-2 md:px-3 py-1">
                  <span className="font-16 font-normal leading-[150%] text-dark">{hobby}</span>
                </div>
              ))}
            </div>
          ),
        },
      ]
      : []),
  ];
}

function UserProfileContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  function handleInterestAction() {
    queryClient.invalidateQueries({ queryKey: ["profile", id] });
    queryClient.invalidateQueries({ queryKey: ["profiles"] });
  }

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfile(id),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (isLoading) return <UserProfileSkeleton />;

  if (isError || !profile) {
    return (
      <main className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
        <p className="font-poppins text-[16px] font-medium text-[#B31B38]">
          Failed to load profile. Please try again.
        </p>
      </main>
    );
  }

  const pr = profile.profile;
  const age = calculateAge(pr.dateOfBirth);
  const isPrivate = pr.photoAccess === "locked";
  const hasPhoto = !isPrivate && !!pr.photoUrl;
  const placeholder = profile.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png";

  // Cache this profile's photo in sessionStorage
  if (hasPhoto && pr.photoUrl) {
    const cached = getCachedPhoto(profile.id);
    if (!cached) setCachedPhoto(profile.id, pr.photoUrl);
  }
  const photoSrc = hasPhoto ? (getCachedPhoto(profile.id) ?? pr.photoUrl!) : placeholder;

  const rawStatus = profile.interestStatus ?? "none";
  // Map 'none' → show as 'sent' with sendCount=0 (initial state)
  const interestStatus: "sent" | "received" | "declined" =
    rawStatus === "received" ? "received" : rawStatus === "declined" ? "declined" : "sent";
  const sendCount = rawStatus === "none" ? 0 : (profile.interestSendCount ?? 1);

  const sections = buildSections(profile, interestStatus, handleInterestAction);

  return (
    <main className="min-h-screen bg-[#F8F5F2] font-poppins select-none pb-10">
      {/* Header */}
      <div className="sticky top-[74px] z-30 w-full border-t border-[#EEEEEE] bg-white">
        <div className="flex px-4 lg:px-10 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-[40px] bg-light py-2 pl-2 pr-4 shadow-[0_0_11.1px_0_rgba(0,0,0,0.25)]"
          >
            <ChevronRightIcon className="mr-1 md:mr-2 w-4 md:w-5 h-4 md:h-5 rotate-180" />
            <span className="font-16 text-dark">Back</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mt-6 md:mt-8 flex justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[1160px] flex-col items-center min-[520px]:items-start min-[520px]:flex-row gap-5 sm:gap-7 lg:gap-10">
          {/* Sticky Image */}
          <div className="shrink-0 min-[520px]:sticky min-[520px]:top-[172px] mb-0 min-[520px]:mb-16 sm:mb-18 md:mb-26">
            <div className="relative h-[133px] sm:h-[160px] md:h-[213px] lg:h-[266px] w-[100px] sm:w-[120px] md:w-[160px] lg:w-[200px]">
              <div className="relative z-10 h-[133px] sm:h-[160px] md:h-[213px] lg:h-[266px] overflow-hidden rounded-[16px] bg-[#D9D9D9]">
                {hasPhoto ? (
                  <ProtectedPhoto
                    src={photoSrc}
                    alt={profile.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 520px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 160px, 200px"
                  />
                ) : (
                  <Image
                    src={placeholder}
                    alt={profile.name}
                    width={200}
                    height={266}
                    priority
                    className="h-full w-full object-cover"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                )}
              </div>
              <div className="mt-[-2px] w-[60px] md:w-[92px] lg:w-[105px] mx-auto">
                <UnionDesignIcon className="rotate-270 -translate-y-16 md:-translate-y-32 lg:-translate-y-36.5" />
                <UnionDesignIcon className="rotate-90 -translate-y-29 md:-translate-y-52 lg:-translate-y-59.5" />
              </div>
            </div>
          </div>

          {/* Detail Body */}
          <div className="flex-1 min-w-0 w-full">
            {/* Top Row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1 md:gap-2">
                <h1 className="text-dark text-[14px] md:text-[18px] font-medium leading-[150%]">
                  {profile.name}
                </h1>
                {profile.trustBadge && (
                  <ProfileVerifiedBadgeIcon className="h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 shrink-0" />
                )}
              </div>
              {profile.isElite ? (
                <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                  <EliteCrownIcon className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 shrink-0" />
                  <span className="text-[#A97216] font-16 font-normal leading-[150%]">Elite</span>
                </div>
              ) : (
                <div className="flex items-center rounded-[38px] bg-[#D5ECFF] px-3 py-[2px]">
                  <span className="font-16 font-normal leading-[150%] text-[#5D5D5D]">New</span>
                </div>
              )}
            </div>

            {/* ID */}
            <div className="md:mt-0.5 text-dark font-16 font-normal leading-[150%]">
              {profile.displayId}
            </div>

            {/* Quick summary */}
            <div className="mt-4 flex flex-col gap-3 sm:mt-6 lg:mt-8">
              <QuickRow
                leftIcon={CakeIcon}
                leftText={age ? `${age} years` : "Age not specified"}
                rightText={profile.isPhoneVerified ? "WhatsApp verified" : undefined}
              />
              <QuickRow
                leftIcon={EducationCapIcon}
                leftText={pr.education ?? "Not specified"}
                rightText={profile.isEmailVerified ? "Email verified" : undefined}
              />
              <QuickRow leftIcon={WorkBriefcaseIcon} leftText={pr.occupation ?? "Not specified"} />
              <QuickRow leftIcon={HeightRulerIcon} leftText={pr.heightCm ? formatHeight(pr.heightCm) : "Not specified"} />
            </div>

            {/* Content */}
            <div className="mt-6 space-y-4 md:mt-8 md:space-y-6">
              <MatchInterestCard
                profileId={profile.id}
                profileName={profile.name}
                status={interestStatus}
                isElite={profile.isElite}
                isAccepted={profile.interestIsAccepted ?? false}
                sendCount={sendCount}
                receivedCount={profile.interestReceiveCount ?? 1}
                isShortlisted={profile.isShortlisted}
                lastSentAt={profile.interestLastSentAt}
                isReminderDue={profile.isReminderDue ?? false}
                onAction={handleInterestAction}
              />
              {sections.filter((s) => !s.hidden).map((section) => (
                <SectionCard key={section.title} section={section} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 md:my-13 lg:mt-15">
        <MatchPreferencesCard />
      </div>
    </main>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense>
      <UserProfileContent />
    </Suspense>
  );
}

function QuickRow({
  leftIcon: LeftIcon,
  leftText,
  rightText,
}: {
  leftIcon: React.ElementType;
  leftText: string;
  rightText?: string;
}) {
  return (
    <div className="flex items-center font-poppins justify-between flex-wrap">
      <div className="flex items-center gap-3 sm:gap-4">
        <LeftIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
        <span className="font-16 font-normal leading-[150%] text-dark">{leftText}</span>
      </div>
      {rightText ? (
        <div className="flex items-center gap-1 text-secondary sm:gap-2">
          <span className="font-16 font-normal leading-[150%]">{rightText}</span>
          <CheckmarkIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
        </div>
      ) : null}
    </div>
  );
}

function SectionCard({ section }: { section: SectionData }) {
  return (
    <div id={section.title === "Contact" ? "contact-section" : undefined} className="rounded-[16px] bg-light p-4 md:p-5 font-poppins">
      <div className="flex items-center justify-between gap-2 text-dark md:gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          {section.icon}
          <h2 className="font-20 font-semibold">{section.title}</h2>
        </div>
        {section.titleRightIcon ? <div className="shrink-0">{section.titleRightIcon}</div> : null}
      </div>
      <div className="mt-3 md:mt-4 border-t border-[#EAEAEA]" />
      {section.extra ? (
        section.extra
      ) : (
        <div className="grid grid-cols-1 gap-0 min-[700px]:grid-cols-2 min-[700px]:gap-4 min-[767px]:max-[867px]:grid-cols-1 min-[767px]:max-[867px]:gap-0">
          <InfoColumn items={section.left} />
          <InfoColumn items={section.right ?? []} borderLeft />
        </div>
      )}
    </div>
  );
}

function InfoColumn({ items, borderLeft = false }: { items: FieldRow[]; borderLeft?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-3 pt-3 md:pt-4 font-poppins ${
        borderLeft
          ? "min-[700px]:border-l min-[700px]:border-[#EAEAEA] min-[700px]:pl-5 min-[767px]:max-[867px]:border-l-0 min-[767px]:max-[867px]:pl-0"
          : ""
      }`}
    >
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-4 gap-y-1 items-start">
          <span className="font-16 font-normal leading-[150%] text-secondary3">{item.label}</span>
          <span className="font-16 font-normal leading-[150%] text-dark break-words">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
