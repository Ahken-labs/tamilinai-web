"use client";

import Image from "next/image";
import {
  AboutMeIcon, CakeIcon, CheckmarkIcon, ChevronRightIcon, CasteCircleIcon, EducationCapIcon, EliteCrownIcon, HeightRulerIcon, LocationPinIcon,
  PaintBrushIcon, ProfileBoxIcon, ProfileVerifiedBadgeIcon, UnionDesignIcon, WineGlassIcon, WorkBriefcaseIcon, StepFamilyIcon,
} from "@/src/assets/Icons";
import { BiPhoneCall } from "react-icons/bi";
import MatchPreferencesCard from "@/src/components/profile/MatchPreferencesCard";
import MatchInterestCard from "@/src/components/profile/MatchInterestCard";
import Match_ContactSection_Card from "@/src/components/profile/Match_ContactSection_Card";

type MatchStatus = "sent" | "received" | "declined";
const trustBadge = true;
const isElite = true;
const isPhoneVerified = true;
const isEmailVerified = true;
const profileName = "Username2";
const myName = "Username1";
const status = "sent" as MatchStatus; //(received / declined)
const isAccepted = false;
const sendCount = 2;
const receivedCount = 1;

function PartyIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`${className} inline-flex select-none items-center justify-center text-[32px] leading-none`}
      aria-label="party"
      role="img"
    >
      🎉
    </span>
  );
}

type FieldRow = {
  label: string;
  value: string;
};

type SectionData = {
  icon: React.ReactNode;
  title: string;
  left: FieldRow[];
  right?: FieldRow[];
  extra?: React.ReactNode;
  titleRightIcon?: React.ReactNode;
};

const basicInfoLeft: FieldRow[] = [
  { label: "Gender", value: "Female" },
  { label: "Marital status", value: "Unmarried" },
  { label: "Languages spoken", value: "English, Spanish" },
];

const basicInfoRight: FieldRow[] = [
  { label: "Height", value: "5 ft 1 in / 154 cm" },
  { label: "Weight", value: "50 Kg" },
  { label: "Any physical challenge", value: "No" },
  { label: "Body type", value: "N/A" },
];

const careerLeft: FieldRow[] = [
  { label: "Education", value: "Bachelors" },
  { label: "Education detail", value: "Not specified" },
];

const careerRight: FieldRow[] = [
  { label: "Sector", value: "Private" },
  { label: "Occupation", value: "Bio medical" },
  { label: "Monthly income", value: "150,000 - 200,000 LKR" },
];

const familyLeft: FieldRow[] = [
  { label: "Father’s occupation", value: "Teacher" },
  { label: "Mom’s occupation", value: "House wife and HNDA" },
  { label: "Family origin / Ancestral", value: "Trincomalee" },
];

const familyRight: FieldRow[] = [
  { label: "Number of brother(s)", value: "2" },
  { label: "Brother(s) married", value: "0" },
  { label: "Number of sister(s)", value: "2" },
  { label: "Sister(s) married", value: "2" },
];

const religionLeft: FieldRow[] = [{ label: "Religion", value: "Hindu" }];
const religionRight: FieldRow[] = [{ label: "Caste", value: "N/A" }];

const locationLeft: FieldRow[] = [
  { label: "City", value: "Trincomalee" },
  { label: "Country", value: "Sri Lanka" },
];
const locationRight: FieldRow[] = [{ label: "Citizenship", value: "Sri Lanka" }];

const lifestyleLeft: FieldRow[] = [{ label: "Diet habit", value: "Non Vegetarian" }];
const lifestyleRight: FieldRow[] = [
  { label: "Smoking habit", value: "No" },
  { label: "Drinking habit", value: "Light / Social Drinker" },
];

const hobbies = [
  "Collectibles",
  "Travel",
  "Music",
  "Photography",
  "Cooking",
  "Reading",
  "Gaming",
];

const sections: SectionData[] = [
  {
    icon: <AboutMeIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    title: "About Me",
    left: [],
    right: [],
    extra: (
      <p className="md:mt-4 mt-3 font-16 leading-[150%] text-dark">
        My name is username and I am working as a Bio medical in the Private
        sector. I have completed my bachelors
      </p>
    ),
  },
  {
    icon: <ProfileBoxIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    title: "Basic Info",
    left: basicInfoLeft,
    right: basicInfoRight,
  },
  {
    icon: <WorkBriefcaseIcon strokeWidth={2} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    title: "Career & Education",
    left: careerLeft,
    right: careerRight,
  },
  ...(status === "declined"
    ? []
    : [
      {
        icon: <BiPhoneCall strokeWidth={0.5} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
        title: "Contact",
        titleRightIcon: isElite ? (
          isAccepted ? (
            <PartyIcon className="h-3 sm:h-4 md:h-4.5 lg:h-5 w-3 sm:w-4 md:w-4.5 lg:w-5" />
          ) : (
            <EliteCrownIcon className="w-4 sm:w-5 md:w-5.5 lg:w-6 h-4 sm:h-5 md:h-5.5 lg:h-6 shrink-0" />
          )
        ) : null,
        left: [],
        right: [],
        extra: (
          <Match_ContactSection_Card
            profileName={profileName}
            myName={myName}
            status={status}
            isElite={isElite}
            isAccepted={isAccepted}
            sendCount={sendCount}
            receivedCount={receivedCount}
          />
        ),
      },
    ]),
  {
    icon: <StepFamilyIcon strokeWidth="4" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    title: "Family Background",
    left: familyLeft,
    right: familyRight,
  },
  {
    icon: <CasteCircleIcon strokeWidth="2" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    title: "Religion and Caste",
    left: religionLeft,
    right: religionRight,
  },
  {
    icon: <LocationPinIcon strokeWidth="2" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    title: "Location",
    left: locationLeft,
    right: locationRight,
  },
  {
    icon: <WineGlassIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    title: "Lifestyle",
    left: lifestyleLeft,
    right: lifestyleRight,
  },
  {
    icon: <PaintBrushIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    title: "Interests & Hobbies",
    left: [],
    right: [],
    extra: (
      <div className="pt-4 flex flex-wrap gap-3 md:gap-4">
        {hobbies.map((hobby) => (
          <div
            key={hobby}
            className=" flex items-center justify-center rounded-[48px] bg-[#F0F0F0] px-2 md:px-3 py-1 ">
            <span className="font-16 font-normal leading-[150%] text-dark">
              {hobby}
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function UserProfilePage() {
  return (
    <main className="min-h-screen bg-[#F8F5F2] font-poppins select-none pb-10">
      {/* Header */}
      <div className="sticky top-[74px] z-30 w-full border-t border-[#EEEEEE] bg-white">
        <div className="flex px-4 lg:px-10 py-3">
          <div className="flex items-center justify-center rounded-[40px] bg-light py-2 pl-2 pr-4 shadow-[0_0_11.1px_0_rgba(0,0,0,0.25)]">
            <ChevronRightIcon className="mr-1 md:mr-2 w-4 md:w-5 h-4 md:h-5 rotate-180" />
            <span className="font-16 text-dark">Back</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mt-6 md:mt-8 flex justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[1160px] flex-col items-center min-[520px]:items-start min-[520px]:flex-row gap-5 sm:gap-7 lg:gap-10">
          {/* Sticky Image */}
          <div className="shrink-0 min-[520px]:sticky min-[520px]:top-[172px] mb-0 min-[520px]:mb-16 sm:mb-18 md:mb-26">
            <div className="relative h-[133px] sm:h-[160px] md:h-[213px] lg:h-[266px] w-[100px] sm:w-[120px] md:w-[160px] lg:w-[200px]">
              {/* Image */}
              <div className="relative z-10 h-[133px] sm:h-[160px] md:h-[213px] lg:h-[266px] overflow-hidden rounded-[16px] bg-[#D9D9D9]">
                <Image
                  src="/images/no_photo.png"
                  alt="profile"
                  width={200}
                  height={266}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Union below image */}
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
                  username
                </h1>
                {trustBadge && (
                  <ProfileVerifiedBadgeIcon className="h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 shrink-0" />
                )}
              </div>

              {/* Status Tag */}
              {isElite ? (
                <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                  <EliteCrownIcon className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 shrink-0" />
                  <span className="text-[#A97216] font-16 font-normal leading-[150%]">
                    Elite
                  </span>
                </div>
              ) : (
                <div className="flex items-center rounded-[38px] bg-[#D5ECFF] px-3 py-[2px]">
                  <span className="font-16 font-normal leading-[150%] text-[#5D5D5D]">
                    New
                  </span>
                </div>
              )}
            </div>

            {/* ID */}
            <div className="md:mt-0.5 text-dark font-16 font-normal leading-[150%]">
              TI 247
            </div>

            {/* Top quick summary */}
            <div className="mt-4 flex flex-col gap-3 sm:mt-6 lg:mt-8">
              <QuickRow
                leftIcon={CakeIcon}
                leftText="25 years"
                rightText={isPhoneVerified ? "WhatsApp verified" : undefined}
              />

              <QuickRow
                leftIcon={EducationCapIcon}
                leftText="Bachelors"
                rightText={isEmailVerified ? "Email verified" : undefined}
              />
              <QuickRow leftIcon={WorkBriefcaseIcon} leftText="Not working" />
              <QuickRow leftIcon={HeightRulerIcon} leftText="5 ft 1 in / 154 cm" />
            </div>

            {/* Content */}
            <div className="mt-6 space-y-4 md:mt-8 md:space-y-6">
              <MatchInterestCard
                profileName={profileName}
                myName={myName}
                status={status}
                isElite={isElite}
                isAccepted={isAccepted}
                sendCount={sendCount}
                receivedCount={receivedCount}
              />
              {sections.map((section) => (
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
        <span className="font-16 font-normal leading-[150%] text-dark">
          {leftText}
        </span>
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
    <div className="rounded-[16px] bg-light p-4 md:p-5 font-poppins">
      {/* <div className="flex items-center gap-2 text-dark md:gap-3">
        {section.icon}
        <h2 className="font-20 font-semibold">{section.title}</h2>
      </div> */}
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
        // <div className="grid grid-cols-1 gap-4 min-[700px]:grid-cols-2 min-[767px]:max-[867px]:grid-cols-1">
        <div
          className="
    grid grid-cols-1 gap-0
    min-[700px]:grid-cols-2
    min-[700px]:gap-4
    min-[767px]:max-[867px]:grid-cols-1
    min-[767px]:max-[867px]:gap-0
  "
        >
          <InfoColumn items={section.left} />
          <InfoColumn items={section.right ?? []} borderLeft />
        </div>
      )}
    </div>
  );
}

function InfoColumn({
  items,
  borderLeft = false,
}: {
  items: FieldRow[];
  borderLeft?: boolean;
}) {
  return (
    <div
      className={`
        flex flex-col gap-3 pt-3 md:pt-4 font-poppins
        ${borderLeft
          ? "min-[700px]:border-l min-[700px]:border-[#EAEAEA] min-[700px]:pl-5 min-[767px]:max-[867px]:border-l-0 min-[767px]:max-[867px]:pl-0"
          : ""
        }
      `}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="
            grid grid-cols-1
            min-[420px]:grid-cols-2
            gap-x-4 gap-y-1
            items-start
          "
        >
          {/* Label */}
          <span className="font-16 font-normal leading-[150%] text-secondary3">
            {item.label}
          </span>

          {/* Value */}
          <span className="font-16 font-normal leading-[150%] text-dark break-words">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}