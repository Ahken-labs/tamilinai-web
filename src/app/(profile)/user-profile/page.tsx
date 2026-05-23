"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProtectedPhoto from "@/src/components/common-layout/ProtectedPhoto";
import ProtectedImage from "@/src/components/common-layout/ProtectedImage";
import { formatHeight } from "@/src/utils/heightUtils";
import {
  AboutMeIcon, CakeIcon, CheckmarkIcon, ChevronRightIcon, CasteCircleIcon,
  EducationCapIcon, EliteCrownIcon, HeightRulerIcon, LocationPinIcon,
  NotifPhotoUploadIcon, PaintBrushIcon, ProfileBoxIcon, ProfileVerifiedBadgeIcon, UnionDesignIcon,
  WineGlassIcon, WorkBriefcaseIcon, StepFamilyIcon,
  ShieldLockRedIcon,
} from "@/src/assets/Icons";
import { BiPhoneCall } from "react-icons/bi";
import Button from "@/src/components/common-layout/Button";
import MatchPreferencesCard from "@/src/components/profile/MatchPreferencesCard";
import MatchInterestCard from "@/src/components/profile/MatchInterestCard";
import IncomingPhotoRequestCard from "@/src/components/profile/IncomingPhotoRequestCard";
import Match_ContactSection_Card from "@/src/components/profile/Match_ContactSection_Card";
import { getProfile, requestPhotoAccess, requestPhotoUpload } from "@/src/lib/api/profiles";
import { getMe } from "@/src/lib/api/user";
import type { ProfileDetail } from "@/src/types/user";
import { UserProfileSkeletonBody } from "@/src/components/app/skeleton-layout/UserProfileSkeleton";
import { calculateAge } from "@/src/utils/calculateAge";
import EliteUpgradePopup, { shouldShowWeeklyNudge, markWeeklyNudgeSeen, type EliteUpgradeTrigger } from "@/src/components/common-layout/EliteUpgradePopup";

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

function buildSections(p: ProfileDetail, interestStatus: "sent" | "received" | "declined", onAction?: () => void, contactBlurred?: boolean, viewerIsElite = false): SectionData[] {
  const pr = p.profile;
  const isAccepted = p.interestIsAccepted ?? false;
  const sendCount = p.interestSendCount ?? 0;
  const receivedCount = p.interestReceiveCount ?? 1;
  const lastSentAt = p.interestLastSentAt ?? null;
  const isReminderDue = p.isReminderDue ?? false;

  const isElite = viewerIsElite;

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
          extra: contactBlurred ? (
            <div className="mt-4 rounded-[12px] bg-[#FFF8F8] border border-[#FFD6DE] px-4 py-5 flex flex-col items-center text-center gap-2">
              <div className="text-[28px] leading-none select-none">🔒</div>
              <p className="font-poppins font-semibold text-[14px] text-[#B31B38] leading-[150%]">
                You&apos;ve reached your 30 profile view limit this month
              </p>
              <p className="font-poppins font-normal text-[13px] text-[#6B6B6B] leading-[160%]">
                This limit resets after 30 days. For any concerns, contact us at{" "}
                <a href="mailto:contact@inai.lk" className="text-[#B31B38] underline">contact@inai.lk</a>
              </p>
            </div>
          ) : (
            <Match_ContactSection_Card
              profileId={p.id}
              profileName={p.name}
              gender={p.gender}
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
  }

  const { data: profile, isLoading, isFetching, isError } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfile(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Hits React Query cache if AppHeader already loaded it — zero network cost
  const { data: me, isLoading: isMeLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isBackgroundFetching = isFetching && !isLoading;

  const [upgradePopupTrigger, setUpgradePopupTrigger] = useState<EliteUpgradeTrigger | null>(null);

  // Show upgrade popup once per week for free users:
  // - "contact_locked" if they're connected but not elite (most relevant)
  // - "weekly_nudge" otherwise as a gentle reminder
  useEffect(() => {
    if (!profile || profile.viewerIsElite) return;
    if (!shouldShowWeeklyNudge()) return;
    const trigger: EliteUpgradeTrigger = isConnected ? "contact_locked" : "weekly_nudge";
    const t = setTimeout(() => {
      setUpgradePopupTrigger(trigger);
      markWeeklyNudgeSeen();
    }, 3500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  useEffect(() => {
    if (!isLoading && (isError || !profile)) {
      router.replace("/matches");
    }
  }, [isLoading, isError, profile, router]);

  const [photoActionLoading, setPhotoActionLoading] = useState(false);
  const [optimisticPhotoAccess, setOptimisticPhotoAccess] = useState<'locked' | 'pending' | 'accepted' | 'declined' | null | undefined>(undefined);
  const [optimisticUploadRequested, setOptimisticUploadRequested] = useState<boolean | undefined>(undefined);
  const [incomingDismissed, setIncomingDismissed] = useState(false);

  if (isError && !isLoading && !profile) return null;

  if (isLoading || !profile) return (
    <main className="min-h-screen bg-[#F8F5F2] font-poppins select-none pb-10">
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
      <UserProfileSkeletonBody />
    </main>
  );

  const pr = profile.profile;
  const age = calculateAge(pr.dateOfBirth);
  const resolvedPhotoAccess = optimisticPhotoAccess !== undefined ? optimisticPhotoAccess : (pr.photoAccess ?? null);
  const resolvedUploadRequested = optimisticUploadRequested !== undefined ? optimisticUploadRequested : (profile.myPhotoUploadRequestPending ?? false);
  const isPrivate = resolvedPhotoAccess === 'locked' || resolvedPhotoAccess === 'pending' || resolvedPhotoAccess === 'declined';
  const accessRetryAfter = profile.photoAccessRetryAfter ? new Date(profile.photoAccessRetryAfter) : null;
  const accessInCooldown = accessRetryAfter ? accessRetryAfter > new Date() : false;
  const accessMaxed = profile.photoAccessMaxed ?? false;
  const accessCooldownDaysLeft = accessRetryAfter
    // eslint-disable-next-line react-hooks/purity
    ? Math.max(1, Math.ceil((accessRetryAfter.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;
  const hasPhoto = !isPrivate && !!pr.photoUrl;
  const noPhotoCase = !pr.photoUrl && !isPrivate;
  const placeholder = profile.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png";

  const photoSrc = hasPhoto ? pr.photoUrl! : placeholder;
  const profileId = profile.id;

  async function handleRequestPhotoUpload() {
    if (photoActionLoading) return;
    setPhotoActionLoading(true);
    try {
      await requestPhotoUpload(profileId);
      setOptimisticUploadRequested(true);
    } catch (err) {
      console.error('requestPhotoUpload failed:', err);
    }
    setPhotoActionLoading(false);
  }

  async function handleRequestPhotoAccess() {
    if (photoActionLoading) return;
    setPhotoActionLoading(true);
    try {
      await requestPhotoAccess(profileId);
      setOptimisticPhotoAccess('pending');
    } catch (err) {
      console.error('requestPhotoAccess failed:', err);
    }
    setPhotoActionLoading(false);
  }

  const viewerIsElite = profile.viewerIsElite ?? false;
  const rawStatus = profile.interestStatus ?? "none";
  // Map 'none' → show as 'sent' with sendCount=0 (initial state)
  const interestStatus: "sent" | "received" | "declined" =
    rawStatus === "received" ? "received" : rawStatus === "declined" ? "declined" : "sent";
  const sendCount = rawStatus === "none" ? 0 : (profile.interestSendCount ?? 1);
  // declinedByMe=true: I declined their incoming interest → "Change mind" is possible
  // declinedByMe=false: they declined MY interest (and I never received from them) → dead end
  const declinedByMe = rawStatus === "declined" && (profile.interestReceiveCount ?? 0) > 0;

  const sections = buildSections(profile, interestStatus, handleInterestAction, profile.contactBlurred, viewerIsElite);

  const profileInterestStatus = profile.interestStatus as string | undefined;
  const isConnected = profileInterestStatus === "accepted";

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
                    className={`object-cover${interestStatus === "declined" ? " grayscale" : ""}`}
                    sizes="(max-width: 520px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 160px, 200px"
                  />
                ) : (
                  <ProtectedImage
                    src={placeholder}
                    alt={profile.name}
                    width={200}
                    height={266}
                    priority
                    className={`h-full w-full object-cover${interestStatus === "declined" ? " grayscale" : ""}`}
                  />
                )}
              </div>
              {(noPhotoCase || isPrivate) && (
                <div className="absolute left-1/2 -translate-x-1/2 z-20 bottom-1">
                  {noPhotoCase && !resolvedUploadRequested && (
                    <Button
                      text={photoActionLoading ? "loading..." : "Request photo"}
                      onPress={handleRequestPhotoUpload}
                      disabled={photoActionLoading}
                      iconLeft={<NotifPhotoUploadIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-white" />}
                      className="!py-1.5 !px-3 sm:!py-2 sm:!px-4 !text-[11px] sm:!text-[12px] md:!text-[13px] whitespace-nowrap"
                    />
                  )}
                  {noPhotoCase && resolvedUploadRequested && (
                    <button disabled className="inline-flex items-center justify-center rounded-full bg-[#E8E8E8] py-1.5 px-3 sm:py-2 sm:px-4 text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#AAAAAA] whitespace-nowrap">
                      Requested
                    </button>
                  )}
                  {resolvedPhotoAccess === 'locked' && (
                    <Button
                      text={photoActionLoading ? "loading..." : "Request access"}
                      onPress={handleRequestPhotoAccess}
                      disabled={photoActionLoading}
                      iconLeft={<ShieldLockRedIcon className="w-4 h-4 sm:w-5 sm:h-5 md:h-8 md:w-8 shrink-0"/>}
                      className="!py-1.5 !px-2 sm:!py-2 sm:!px-2 md:!px-4 !text-[11px] sm:!text-[12px] md:!text-[13px] whitespace-nowrap"
                    />
                  )}
                  {resolvedPhotoAccess === 'declined' && !accessInCooldown && !accessMaxed && (
                    <Button
                      text={photoActionLoading ? "loading..." : "Request access"}
                      onPress={handleRequestPhotoAccess}
                      disabled={photoActionLoading}
                      iconLeft={<ShieldLockRedIcon className="w-4 h-4 sm:w-5 sm:h-5 md:h-8 md:w-8 shrink-0"/>}
                      className="!py-1.5 !px-2 sm:!py-2 sm:!px-2 md:!px-4 !text-[11px] sm:!text-[12px] md:!text-[13px] whitespace-nowrap"
                    />
                  )}
                  {resolvedPhotoAccess === 'declined' && accessInCooldown && (
                    <button disabled className="inline-flex items-center justify-center rounded-full bg-[#E8E8E8] py-1.5 px-3 sm:py-2 sm:px-4 text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#AAAAAA] whitespace-nowrap">
                      Try again in {accessCooldownDaysLeft}d
                    </button>
                  )}
                  {resolvedPhotoAccess === 'declined' && accessMaxed && (
                    <button disabled className="inline-flex items-center justify-center rounded-full bg-[#E8E8E8] py-1.5 px-3 sm:py-2 sm:px-4 text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#AAAAAA] whitespace-nowrap">
                      Request limit reached
                    </button>
                  )}
                  {resolvedPhotoAccess === 'pending' && (
                    <button disabled className="inline-flex items-center justify-center rounded-full bg-[#E8E8E8] py-1.5 px-3 sm:py-2 sm:px-4 text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#AAAAAA] whitespace-nowrap">
                      Requested
                    </button>
                  )}
                </div>
              )}
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
                leftText={age != null && age > 0 ? `${age} years` : "Age not specified"}
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
              {isBackgroundFetching ? (
                <>
                  <div className="rounded-[16px] bg-light p-4 md:p-5 animate-pulse">
                    <div className="h-4 w-1/3 bg-[#EAEAEA] rounded mb-3" />
                    <div className="h-px bg-[#EAEAEA] mb-4" />
                    <div className="h-10 bg-[#EAEAEA] rounded mb-3" />
                    <div className="h-9 w-40 bg-[#EAEAEA] rounded mx-auto" />
                  </div>
                  <div className="rounded-[16px] bg-light p-4 md:p-5 animate-pulse h-24" />
                </>
              ) : (
                <>
                  <MatchInterestCard
                    profileId={profile.id}
                    profileName={profile.name}
                    gender={profile.gender}
                    status={interestStatus}
                    isElite={viewerIsElite}
                    isAccepted={profile.interestIsAccepted ?? false}
                    sendCount={sendCount}
                    receivedCount={profile.interestReceiveCount ?? 1}
                    isShortlisted={profile.isShortlisted}
                    lastSentAt={profile.interestLastSentAt}
                    isReminderDue={profile.isReminderDue ?? false}
                    declinedByMe={declinedByMe}
                    phone={viewerIsElite ? profile.phone : undefined}
                    onAction={handleInterestAction}
                  />
                  {profile.incomingPhotoRequest && !incomingDismissed && (
                    <IncomingPhotoRequestCard
                      profileId={profileId}
                      profileName={profile.name}
                      type={profile.incomingPhotoRequest.type}
                      onDismiss={() => {
                        setIncomingDismissed(true);
                        handleInterestAction();
                      }}
                    />
                  )}
                </>
              )}
              {sections.filter((s) => !s.hidden).map((section) => (
                <SectionCard key={section.title} section={section} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 md:my-13 lg:mt-15">
        <MatchPreferencesCard
          theirPrefs={profile.partnerPreferences}
          theirPhotoUrl={profile.profile?.photoUrl}
          theirGender={profile.gender}
          myPhotoUrl={me?.profile?.photoUrl}
          myGender={me?.gender}
          myProfile={me?.profile ?? {}}
          isLoading={isMeLoading}
        />
      </div>

      {/* Elite upgrade popup — daily limit, contact locked, or weekly nudge */}
      {upgradePopupTrigger && (
        <EliteUpgradePopup
          trigger={upgradePopupTrigger}
          onClose={() => setUpgradePopupTrigger(null)}
        />
      )}
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
