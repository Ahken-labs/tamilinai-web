"use client";

import Image from "next/image";
import {
  AboutMeIcon, EliteCrownIcon, ProfileVerifiedBadgeIcon, UnionDesignIcon,
  GlobeIcon, InterestLockIcon, ChevronIcon, CameraIcon,
  ProfileBoxIcon,
  WorkBriefcaseIcon,
  StepFamilyIcon,
  CasteCircleIcon,
  LocationPinIcon,
  WineGlassIcon,
  PaintBrushIcon,
  HeartIcon,
} from "@/src/assets/Icons";
import { useEffect, useState } from "react";
import Button from "@/src/components/common-layout/Button";
import { getMe } from "@/src/lib/api/user";
import type { Me } from "@/src/types/user";
import { BiPhoneCall } from "react-icons/bi";
import ToggleTabs from "@/src/components/common-layout/ToggleTabs";
import ContactInfoSection from "@/src/components/profile/sections/ContactInfoSection";
import BasicInfoSection from "@/src/components/profile/sections/BasicInfoSection";
import CareerEducationSection from "@/src/components/profile/sections/CareerEducationSection";
import FamilyBackgroundSection from "@/src/components/profile/sections/FamilyBackgroundSection";
import ReligionCasteSection from "@/src/components/profile/sections/ReligionCasteSection";
import LocationSection from "@/src/components/profile/sections/LocationSection";
import LifestyleSection from "@/src/components/profile/sections/LifestyleSection";
import InterestsHobbiesSection from "@/src/components/profile/sections/InterestsHobbiesSection";
import PartnerPreferenceSection from "@/src/components/profile/sections/PartnerPreferenceSection";

const TABS = [
  { label: "Edit profile", value: "edit_profile" },
  { label: "Preview my profile", value: "preview_my_profile" },
];

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState("edit_profile");
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    getMe().then(setMe).catch(() => {});
  }, []);

  const trustBadge = me?.trustBadge ?? false;
  const isElite = me?.isElite ?? false;
  const displayName = me?.name ?? "username";
  const displayId = me?.displayId ?? "";
  const photoUrl = me?.profile?.photoUrl ?? null;

  function handleTabChange(value: string) {
    setActiveTab(value);
  }
  return (
    <main className="min-h-screen bg-[#F8F5F2] font-poppins select-none pb-0">
      {/* Header */}
      <div className="sticky top-[74px] z-30 w-full border-t border-[#EEEEEE] bg-white">
        <div className="flex justify-center px-4 lg:px-10 py-3">
          <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>

      {/* Body */}
      <div className="mt-5 md:mt-7 flex justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[1160px] flex-col items-center min-[520px]:items-start min-[520px]:flex-row gap-5 sm:gap-7 lg:gap-10">
          {/* Sticky Image */}
          <div className="shrink-0 min-[520px]:sticky min-[520px]:top-[168px]">
            <div className="relative h-[133px] sm:h-[160px] md:h-[213px] lg:h-[266px] w-[100px] sm:w-[120px] md:w-[160px] lg:w-[200px]">
              {/* Image */}
              <div className="relative z-10 h-[133px] sm:h-[160px] md:h-[213px] lg:h-[266px] overflow-hidden rounded-[16px] bg-[#D9D9D9]">
                <Image
                  src={photoUrl ?? "/images/no_photo.png"}
                  alt="profile"
                  width={200}
                  height={266}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 z-10 bottom-[-18px] min-[520px]:bottom-0">
                <Button
                  text="Edit"
                  className="max-[520px]:py-2 min-[520px]:py-2 min-[767px]:px-10 min-[520px]:px-6 md:py-3"
                  iconLeft={
                    <CameraIcon className="w-3 sm:w-4 md:w-4.5 h-3 sm:h-4 md:h-4.5" />
                  }
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
            <h1 className="font-24 font-semibold text-dark">
              My profile
            </h1>
            {/* Top Row */}
            <div className="mt-4 md:mt-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1 md:gap-2">
                <h1 className="text-dark text-[14px] md:text-[18px] font-medium leading-[150%]">
                  {displayName}
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
              {displayId}
            </div>
            {/* Photo visible toggle*/}
            <PhotoVisibilityDropdown />
            <div className="mt-6 md:mt-8 bg-[#FFE9E2] rounded-[16px] p-4 md:p-5">
              <div className="flex items-center">
                <Image
                  src="/icons/trust_Badge.png"
                  alt=""
                  width={36}
                  height={40}
                  className="h-10 w-9 shrink-0"
                />
                <p className="ml-2 md:ml-3 text-dark font-16">Get a Trust Badge by completing 3 quick tasks to show members you are real and trustworthy.</p>
              </div>

              <div className="ml-10.5 flex flex-col font-16 text-dark gap-1.5 md:gap-2 mt-1.5">
                <span>1. Verify your mobile number</span>
                <span>2. Verify your email address</span>
                <span>3. Reach 90% profile completion points</span>
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 md:mt-8 space-y-6 md:mt-8 md:space-y-8">
              <div className="rounded-[16px] bg-light p-4 md:p-5">
                <div className="flex items-center gap-2 text-dark md:gap-3">
                  <AboutMeIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />
                  <h2 className="font-20 font-semibold">About Me</h2>
                </div>
                <div className="my-3 border-t border-[#EAEAEA] md:my-4" />
                <div>
                  <div className="rounded-[12px] border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3]">
                    <textarea placeholder="A few words about yourself, your values, what you're looking for."
                      className="h-20 w-full resize-none bg-transparent p-3 font-16 text-dark outline-none placeholder:text-[#B31B38] " />
                  </div>
                  <span className="mt-[5px] md:mt-[7px] block text-secondary4 font-14">
                    Keep it genuine — families read this
                  </span>
                </div>
              </div>
              {/* boxes */}
              <ExpandableSections />

            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 md:mt-20 justify-center border-t border-[#EAEAEA] bg-[rgba(255,255,255,0.60)]  shadow-[0_0_20px_rgba(0,0,0,0.04)]">
        <div className="mx-auto justify-center px-4 md:px-10 py-2 md:py-3">
          <div className="flex max-w-[1160px] mx-auto">
            <div className="flex-1" />

            <Button
              text="Done"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

const PHOTO_VISIBILITY_OPTIONS = [
  { value: "all", label: "All Inai members", type: "globe" },
  { value: "accepted", label: "Accepted interest only", type: "lock" },
] as const;

type PhotoVisibilityValue = (typeof PHOTO_VISIBILITY_OPTIONS)[number]["value"];

function PhotoVisibilityDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PhotoVisibilityValue>("all");

  const selectedOption = PHOTO_VISIBILITY_OPTIONS.find((item) => item.value === selected) ?? PHOTO_VISIBILITY_OPTIONS[0];

  return (
    <div className="relative inline-flex items-center gap-2 mt-2 md:mt-3">
      <div className="font-16 text-dark">Photo visibility</div>

      <button type="button" onClick={() => setOpen((v) => !v)}
        className="cursor-pointer px-2 py-1 flex items-center gap-1 md:gap-2 rounded-full bg-light"
      >
        {selectedOption.type === "globe" ? (
          <GlobeIcon className="w-3 md:w-4 h-3 md:h-4 text-dark" />
        ) : (
          <InterestLockIcon className="w-3 md:w-4 h-3 md:h-4" stroke="#222" />
        )}
        <span className="font-16 text-dark">{selectedOption.label}</span>
        <ChevronIcon open={open} strokeWidth={1.5} className="w-3 md:w-4 h-3 md:h-4 transition-transform duration-150" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 inline-flex flex-col gap-2 rounded-[16px] bg-white px-1 md:px-2 py-3 md:py-4 shadow-[0_0_16px_0_rgba(0,0,0,0.08)] origin-top-right">
          {PHOTO_VISIBILITY_OPTIONS.map((item) => {
            const active = selected === item.value;
            return (
              <button key={item.value} type="button" onClick={() => { setSelected(item.value); setOpen(false); }}
                className={`cursor-pointer flex items-center gap-2 rounded-[8px] px-2 py-1 transition-colors duration-150 ${active ? "bg-[#FFF0F3]" : "hover:bg-[#EAEAEA]"}`}
              >
                {item.type === "globe" ? (
                  <GlobeIcon className={`h-3 w-3 md:h-4 md:w-4 ${active ? "text-primary" : "text-dark"}`} />
                ) : (
                  <InterestLockIcon stroke={active ? "#B31B38" : "#222"} className="h-3 w-3 md:h-4 md:w-4" />
                )}

                <span className={`font-16 font-normal leading-[150%] ${active ? "text-primary" : "text-dark"}`} >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}



type SectionItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed: number;
  total: number;
  body: React.ReactNode;
  defaultOpen?: boolean;
};

const sections: SectionItem[] = [
  {
    id: "contact",
    title: "Contact information",
    icon: <BiPhoneCall strokeWidth={0.5} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 1,
    total: 2,
    body: <ContactInfoSection />,
  },
  {
    id: "basic",
    title: "Basic Info",
    icon: <ProfileBoxIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 6,
    total: 7,
    body: <BasicInfoSection />,
  },
  {
    id: "career",
    title: "Career & Education",
    icon: <WorkBriefcaseIcon strokeWidth={2} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 2,
    total: 5,
    body: <CareerEducationSection />,
  },
  {
    id: "family",
    title: "Family Background",
    icon: <StepFamilyIcon strokeWidth="4" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 0,
    total: 7,
    body: <FamilyBackgroundSection />,
  },
  {
    id: "religion",
    title: "Religion and Caste",
    icon: <CasteCircleIcon strokeWidth="2" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 2,
    total: 2,
    body: <ReligionCasteSection />,
  },
  {
    id: "location",
    title: "Location",
    icon: <LocationPinIcon strokeWidth="2" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 2,
    total: 2,
    body: <LocationSection />,
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    icon: <WineGlassIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 0,
    total: 3,
    body: <LifestyleSection />,
  },
  {
    id: "hobbies",
    title: "Interests & Hobbies",
    icon: <PaintBrushIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 0,
    total: 10,
    body: <InterestsHobbiesSection />,
  },
  {
    id: "partner",
    title: "Partner preference",
    icon: <HeartIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
    completed: 11,
    total: 12,
    body: <PartnerPreferenceSection />,
  },
];

function ExpandableSections() {
  const [openId, setOpenId] = useState<string>("contact");

  return (
    <div className="space-y-4 md:space-y-6">
      {sections.map((section) => (
        <ExpandableSection
          key={section.id}
          section={section}
          open={openId === section.id}
          onToggle={() => setOpenId((prev) => (prev === section.id ? "" : section.id))}
        />
      ))}
    </div>
  );
}

function ExpandableSection({
  section,
  open,
  onToggle,
}: {
  section: SectionItem;
  open: boolean;
  onToggle: () => void;
}) {
  const statusText = section.completed >= section.total ? "completed" : `${section.completed}/${section.total} completed`;

  return (
    <div className="font-poppins rounded-[16px] bg-light">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between px-4 md:px-5 pt-4 md:pt-5 pb-3 md:pb-4"
      >
        <div className="flex items-center gap-2 md:gap-3">
          {section.icon}
          <span className="text-left font-20 font-semibold leading-[150%] text-dark">
            {section.title}
          </span>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <span className="font-16 font-medium leading-[150%] text-secondary4">
            {statusText}
          </span>
          {section.completed < section.total && (
            <div className="h-2 md:h-3 w-2 md:w-3 rounded-full bg-[#B31B38]" />
          )}
          <ChevronIcon
            open={open}
            stroke="#B31B38"
            strokeWidth={1.5}
            className="h-3 md:h-4 w-3 md:w-4"
          />
        </div>
      </button>

      {open && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-1 md:pt-2">
          {section.body}
        </div>
      )}
    </div>
  );
}