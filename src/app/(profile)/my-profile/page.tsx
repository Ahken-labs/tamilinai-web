"use client";

import Image from "next/image";
import ProtectedImage from "@/src/components/common-layout/ProtectedImage";
import Link from "next/link";
import {
  AboutMeIcon, EliteCrownIcon, ProfileVerifiedBadgeIcon, UnionDesignIcon,
  GlobeIcon, InterestLockIcon, ChevronIcon, CameraIcon,
  ProfileBoxIcon, WorkBriefcaseIcon, StepFamilyIcon, CasteCircleIcon,
  LocationPinIcon, WineGlassIcon, PaintBrushIcon, HeartIcon,
  CheckmarkIcon, ChevronRightIcon,
} from "@/src/assets/Icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/src/components/common-layout/Button";
import {
  getMe, uploadPhoto, savePersonalDetails, saveBasicDetails,
  saveCareerDetails, saveFamilyDetails, saveLifestyleDetails, savePartnerPreferences,
  getPartnerPreferences, updateMe, updatePhotoVisibility,
} from "@/src/lib/api/user";
import { readMeCache, writeMeCache, invalidateMeCache } from "@/src/components/AppHeader";
import { getProfilePhotoSrc } from "@/src/utils/profilePhoto";
import {
  nn, parseCm, parseKg, formatDOB,
  MARITAL_TO_BE, BUILD_TO_BE, DIET_TO_BE, SMOKE_TO_BE, DRINK_TO_BE, RESIDENT_TO_BE,
} from "@/src/utils/profileMappers";
import type { Me, PersonalDetailsPayload, LifestyleDetailsPayload } from "@/src/types/user";
import { BiPhoneCall } from "react-icons/bi";
import ToggleTabs from "@/src/components/common-layout/ToggleTabs";
import PhotoCropModal from "@/src/components/app/PhotoCropModal";
import MyProfilePreview from "@/src/components/profile/MyProfilePreview";
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

// ─── Session draft keys ────────────────────────────────────────────────────────
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";
import { validateAboutMe, splitHighlight } from "@/src/utils/aboutMeValidation";
import { useScrollHide } from "@/src/hooks/useScrollHide";
import { useLoadingText } from "@/src/hooks/useLoadingText";

export { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";

const ABOUT_ME_KEY = DRAFT_KEYS.about;

function readDraft<T>(key: string): T | null {
  try { const r = sessionStorage.getItem(key); return r ? JSON.parse(r) as T : null; } catch { return null; }
}

function hasSectionDrafts(): boolean {
  const keys = [DRAFT_KEYS.basic, DRAFT_KEYS.career, DRAFT_KEYS.family, DRAFT_KEYS.religion,
  DRAFT_KEYS.location, DRAFT_KEYS.lifestyle, DRAFT_KEYS.hobbies, DRAFT_KEYS.partner];
  return keys.some(k => sessionStorage.getItem(k) !== null);
}

function clearAllDrafts() {
  Object.values(DRAFT_KEYS).forEach(k => sessionStorage.removeItem(k));
}

function isAccountNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
}

function getFirstIncomplete(me: Me | null): string {
  if (!me) return "contact";
  const p = me.profile;
  if ([me.isPhoneVerified, me.isEmailVerified].filter(Boolean).length < 2) return "contact";
  // basic: 8 or 9 fields — same as buildSections
  const _hasPhys = p?.hasPhysicalChallenge === true;
  const _basicFields: unknown[] = [me?.name, p?.dateOfBirth, p?.maritalStatus, nn(p?.heightCm), nn(p?.weightKg), true /* hasPhysicalChallenge: No is valid */, p?.physicalBuild, (p?.languagesSpoken?.length ?? 0) > 0];
  if (_hasPhys) _basicFields.push(!!p?.disabilityType);
  if (_basicFields.filter(Boolean).length < _basicFields.length) return "basic";
  // career: 5 fields
  if ([p?.education, p?.educationDetail, p?.occupation, p?.sector, nn(p?.monthlyIncome),
  ].filter(Boolean).length < 5) return "career";
  // family: 6 fields
  if ([p?.fatherOccupation, p?.motherOccupation,
  nn(p?.brotherCount), nn(p?.brothersMarried), nn(p?.sisterCount), nn(p?.sistersMarried),
  ].filter(Boolean).length < 6) return "family";
  if ([p?.religion, p?.caste].filter(Boolean).length < 2) return "religion";
  if ([p?.country, p?.city, p?.citizenship, p?.residentStatus].filter(Boolean).length < 4) return "location";
  if ([p?.dietHabit, p?.smokingHabit, p?.drinkingHabit].filter(Boolean).length < 3) return "lifestyle";
  if (!(p?.hobbies?.length)) return "hobbies";
  return "partner";
}

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState("edit_profile");
  const [me, setMe] = useState<Me | null>(null);

  // Photo crop state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // About Me draft (sessionStorage-backed)
  const [aboutMe, setAboutMe] = useState("");
  const [aboutMeDirty, setAboutMeDirty] = useState(false);
  const [aboutMeError, setAboutMeError] = useState<{ message: string; offendingWord: string } | null>(null);

  // Saving
  const [saving, setSaving] = useState(false);
  const loadingText = useLoadingText(saving, "save");

  // True when any section has written a draft to sessionStorage
  const [draftsExist, setDraftsExist] = useState(false);
  // Incremented on every onDirty call so buildSections re-reads sessionStorage even when draftsExist is already true
  const [draftTick, setDraftTick] = useState(0);
  // Incremented after Done to force section remount with fresh me data
  const [sectionRevision, setSectionRevision] = useState(0);

  // Section refs for auto-scroll
  const sectionsRef = useRef<HTMLDivElement>(null);
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const [openSectionId, setOpenSectionId] = useState<string>("contact");

  const handleDirty = useCallback(() => { setDraftsExist(true); setDraftTick(t => t + 1); }, []);
  const tabBarVisible = useScrollHide();
  // Load me (cache first, then fresh)
  useEffect(() => {
    // Check session drafts immediately (handles page reload with pending drafts)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftsExist(hasSectionDrafts());

    const cached = readMeCache();
    if (cached) {
      setMe(cached);
      setOpenSectionId(getFirstIncomplete(cached));
      setAboutMe(sessionStorage.getItem(ABOUT_ME_KEY) ?? cached.profile?.aboutMe ?? "");
    }

    getMe().then((data) => {
      writeMeCache(data);
      setMe(data);
      setOpenSectionId(prev => prev === "contact" ? getFirstIncomplete(data) : prev);
      if (!sessionStorage.getItem(ABOUT_ME_KEY)) setAboutMe(data.profile?.aboutMe ?? "");
    }).catch(() => { });

    // Pre-cache partner prefs so computePartnerCompleted shows correct count immediately
    const existingPref = sessionStorage.getItem("inai_partner_pref");
    const prefExpired = existingPref ? (() => { try { const p = JSON.parse(existingPref); return p.expiresAt && Date.now() > p.expiresAt; } catch { return false; } })() : true;
    if (!existingPref || prefExpired) {
      getPartnerPreferences().then((prefs) => {
        try { sessionStorage.setItem("inai_partner_pref", JSON.stringify({ data: prefs, expiresAt: Date.now() + 30 * 60 * 1000 })); } catch { /* unavailable */ }
        setDraftTick(t => t + 1);
      }).catch(() => { });
    }
  }, []);

  const trustBadge = me?.trustBadge ?? false;
  const isElite = me?.isElite ?? false;
  const displayName = me?.name ?? "";
  const displayId = me?.displayId ?? "";
  const photoStatus = me?.profile?.photoStatus ?? null;
  const photoSrc = previewUrl ?? getProfilePhotoSrc(me?.profile?.photoUrl, photoStatus, me?.gender, true);
  const hasPhoto = !!(me?.profile?.photoUrl || pendingPhoto);
  const isNew = me?.createdAt ? isAccountNew(me.createdAt) : false;

  const hasPendingChanges = pendingPhoto !== null || aboutMeDirty || draftsExist;

  // File picker handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    e.target.value = "";
  };

  // After crop confirmed
  const handleCropConfirm = useCallback((file: File, url: string) => {
    setPendingPhoto(file);
    setPreviewUrl(url);
    setCropSrc(null);
  }, []);

  // About Me change
  const handleAboutMeChange = (value: string) => {
    setAboutMe(value);
    const err = validateAboutMe(value);
    setAboutMeError(err);
    // Only cache valid text — invalid drafts are never persisted
    if (!err) {
      sessionStorage.setItem(ABOUT_ME_KEY, value);
      setAboutMeDirty(value !== (me?.profile?.aboutMe ?? ""));
    }
  };

  // Scroll to first incomplete section + open it
  const scrollToAddDetails = () => {
    sectionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Open "basic" as the first profile-filling section
    setOpenSectionId("basic");
  };

  // Done: save everything from sessionStorage drafts + photo + about me
  const handleDone = async () => {
    if (aboutMeError) {
      aboutMeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!hasPendingChanges) return;
    setSaving(true);

    // Compare two values — arrays compared sorted, null/undefined treated the same
    const diff = (a: unknown, b: unknown): boolean => {
      const norm = (v: unknown) => (v === null || v === undefined ? null : v);
      const na = norm(a); const nb = norm(b);
      if (Array.isArray(na) && Array.isArray(nb))
        return JSON.stringify([...na].sort()) !== JSON.stringify([...nb].sort());
      return na !== nb;
    };

    try {
      const saves: Promise<unknown>[] = [];
      const bp = me?.profile;

      if (pendingPhoto) {
        saves.push(uploadPhoto(pendingPhoto));
      }

      // ── Personal: aboutMe + religion + caste + country + city + citizenship ──
      const personalPayload: PersonalDetailsPayload = {};
      if (aboutMeDirty && diff(aboutMe, bp?.aboutMe)) personalPayload.aboutMe = aboutMe;

      const rd = readDraft<{ religion: string; caste: string }>(DRAFT_KEYS.religion);
      if (rd) {
        if (rd.religion && diff(rd.religion, bp?.religion)) personalPayload.religion = rd.religion;
        if (rd.caste && diff(rd.caste, bp?.caste)) personalPayload.caste = rd.caste;
      }

      const ld = readDraft<{ countryLivingIn: string; city: string; citizenship: string; residentStatus: string }>(DRAFT_KEYS.location);
      if (ld) {
        if (ld.countryLivingIn && diff(ld.countryLivingIn, bp?.country)) personalPayload.country = ld.countryLivingIn;
        if (ld.city && diff(ld.city, bp?.city)) personalPayload.city = ld.city;
        if (ld.citizenship && diff(ld.citizenship, bp?.citizenship)) personalPayload.citizenship = ld.citizenship;
      }

      if (Object.keys(personalPayload).length) saves.push(savePersonalDetails(personalPayload));

      // ── Basic (dateOfBirth, marital, height, weight, physicalChallenge, disability) ──
      const bd = readDraft<{ name?: string; birthYear: string; birthMonth: string; birthDay: string; maritalStatus: string; height: string; weight: string; physicalChallenge: string; disability: string; physBuild: string; languages: string[] }>(DRAFT_KEYS.basic);
      if (bd) {
        // ── Name ──
        const draftName = bd.name?.trim();
        if (draftName && draftName.length >= 3 && !/^\d+$/.test(draftName) && diff(draftName, me?.name)) {
          saves.push(updateMe({ name: draftName }));
        }

        const dob = formatDOB(bd.birthYear, bd.birthMonth, bd.birthDay) ?? bp?.dateOfBirth;
        const marital = bd.maritalStatus ? (MARITAL_TO_BE[bd.maritalStatus] ?? bd.maritalStatus) : bp?.maritalStatus;
        const heightCm = bd.height ? parseCm(bd.height) : bp?.heightCm;
        const weightKg = bd.weight ? parseKg(bd.weight) : bp?.weightKg;
        const hasPhys = bd.physicalChallenge !== undefined ? bd.physicalChallenge === "yes" : (bp?.hasPhysicalChallenge ?? false);
        const disType = hasPhys ? (bd.disability || bp?.disabilityType || undefined) : undefined;

        const basicChanged =
          diff(dob, bp?.dateOfBirth) ||
          diff(marital, bp?.maritalStatus) ||
          diff(heightCm, bp?.heightCm) ||
          diff(weightKg, bp?.weightKg) ||
          diff(hasPhys, bp?.hasPhysicalChallenge ?? false) ||
          (hasPhys && diff(disType, bp?.disabilityType));

        if (basicChanged && dob && marital) saves.push(saveBasicDetails({
          dateOfBirth: dob,
          maritalStatus: marital as Parameters<typeof saveBasicDetails>[0]["maritalStatus"],
          heightCm,
          weightKg,
          hasPhysicalChallenge: hasPhys,
          disabilityType: disType,
        }));
      }

      // ── Lifestyle: physBuild + languages (from basic draft) + diet/smoke/drink + residentStatus + hobbies ──
      const lifestylePayload: LifestyleDetailsPayload = {};

      if (bd?.physBuild) {
        const physBuildBE = BUILD_TO_BE[bd.physBuild];
        if (physBuildBE && diff(physBuildBE, bp?.physicalBuild)) lifestylePayload.physicalBuild = physBuildBE;
      }
      if (bd?.languages?.length && diff(bd.languages, bp?.languagesSpoken ?? ["Tamil"])) {
        lifestylePayload.languagesSpoken = bd.languages;
      }

      const lsd = readDraft<{ dietHabit: string; smokingHabit: string; drinkingHabit: string }>(DRAFT_KEYS.lifestyle);
      if (lsd) {
        const dietBE = lsd.dietHabit ? (DIET_TO_BE[lsd.dietHabit] ?? undefined) : undefined;
        const smokeBE = lsd.smokingHabit ? (SMOKE_TO_BE[lsd.smokingHabit] ?? undefined) : undefined;
        const drinkBE = lsd.drinkingHabit ? (DRINK_TO_BE[lsd.drinkingHabit] ?? undefined) : undefined;
        if (dietBE && diff(dietBE, bp?.dietHabit)) lifestylePayload.dietHabit = dietBE;
        if (smokeBE && diff(smokeBE, bp?.smokingHabit)) lifestylePayload.smokingHabit = smokeBE;
        if (drinkBE && diff(drinkBE, bp?.drinkingHabit)) lifestylePayload.drinkingHabit = drinkBE;
      }
      if (ld?.residentStatus) {
        const resBE = RESIDENT_TO_BE[ld.residentStatus] ?? ld.residentStatus;
        if (diff(resBE, bp?.residentStatus)) lifestylePayload.residentStatus = resBE;
      }

      const hd = readDraft<{ hobbies: string[] }>(DRAFT_KEYS.hobbies);
      if (hd?.hobbies && diff(hd.hobbies, bp?.hobbies)) lifestylePayload.hobbies = hd.hobbies;

      if (Object.keys(lifestylePayload).length) saves.push(saveLifestyleDetails(lifestylePayload));

      // ── Career ────────────────────────────────────────────────────────────
      const cd = readDraft<{ education: string; educationDetail: string; occupation: string; sector: string; currency: string; monthlyIncome: string }>(DRAFT_KEYS.career);
      if (cd) {
        const careerPayload: Parameters<typeof saveCareerDetails>[0] = {};
        const income = cd.monthlyIncome ? Number(cd.monthlyIncome) : undefined;
        const currency = cd.currency ? cd.currency.substring(0, 3) : undefined;
        if (cd.education && diff(cd.education, bp?.education)) careerPayload.education = cd.education;
        if (cd.educationDetail && diff(cd.educationDetail, bp?.educationDetail)) careerPayload.educationDetail = cd.educationDetail;
        if (cd.occupation && diff(cd.occupation, bp?.occupation)) careerPayload.occupation = cd.occupation;
        if (cd.sector && diff(cd.sector, bp?.sector)) careerPayload.sector = cd.sector;
        if (income !== undefined && diff(income, bp?.monthlyIncome)) careerPayload.monthlyIncome = income;
        if (currency && diff(currency, bp?.incomeCurrency)) careerPayload.incomeCurrency = currency;
        if (Object.keys(careerPayload).length) saves.push(saveCareerDetails(careerPayload));
      }

      // ── Family ────────────────────────────────────────────────────────────
      const fd = readDraft<{ fatherOccupation: string; motherOccupation: string; brothers: string; brothersMarried: string; sisters: string; sistersMarried: string }>(DRAFT_KEYS.family);
      if (fd) {
        const familyPayload: Parameters<typeof saveFamilyDetails>[0] = {};
        const bc = fd.brothers !== "" ? Number(fd.brothers) : undefined;
        const bm = fd.brothersMarried !== "" ? Number(fd.brothersMarried) : undefined;
        const sc = fd.sisters !== "" ? Number(fd.sisters) : undefined;
        const sm = fd.sistersMarried !== "" ? Number(fd.sistersMarried) : undefined;
        if (fd.fatherOccupation && diff(fd.fatherOccupation, bp?.fatherOccupation)) familyPayload.fatherOccupation = fd.fatherOccupation;
        if (fd.motherOccupation && diff(fd.motherOccupation, bp?.motherOccupation)) familyPayload.motherOccupation = fd.motherOccupation;
        if (bc !== undefined && diff(bc, bp?.brotherCount)) familyPayload.brotherCount = bc;
        if (bm !== undefined && diff(bm, bp?.brothersMarried)) familyPayload.brothersMarried = bm;
        if (sc !== undefined && diff(sc, bp?.sisterCount)) familyPayload.sisterCount = sc;
        if (sm !== undefined && diff(sm, bp?.sistersMarried)) familyPayload.sistersMarried = sm;
        if (Object.keys(familyPayload).length) saves.push(saveFamilyDetails(familyPayload));
      }

      // ── Partner prefs ─────────────────────────────────────────────────────
      const ppd = readDraft<Record<string, unknown>>(DRAFT_KEYS.partner);
      if (ppd) saves.push(savePartnerPreferences(ppd as Parameters<typeof savePartnerPreferences>[0]));

      if (saves.length === 0) {
        // Nothing actually changed — just clear drafts and return
        clearAllDrafts();
        setDraftsExist(false);
        setAboutMeDirty(false);
        return;
      }

      await Promise.all(saves.map((p, i) => p.catch((e: unknown) => { console.error(`Save[${i}] failed:`, e); throw e; })));

      // Clear all drafts
      clearAllDrafts();
      setDraftsExist(false);
      setPendingPhoto(null);
      setAboutMeDirty(false);

      // Re-fetch and notify AppHeader to update score
      invalidateMeCache();
      const fresh = await getMe();
      writeMeCache(fresh);
      setMe(fresh);
      window.dispatchEvent(new CustomEvent("me-updated"));
      if (fresh.profile?.photoUrl) setPreviewUrl(null);
      if (!sessionStorage.getItem(ABOUT_ME_KEY)) setAboutMe(fresh.profile?.aboutMe ?? "");

      // Force section remount so they display fresh saved values
      setSectionRevision(r => r + 1);
      // If profile now complete, switch to preview
      if (fresh.isProfileComplete) setActiveTab("preview_my_profile");
    } catch (err) { console.error("Done save failed:", err); }
    finally { setSaving(false); }
  };

  return (
    <main className="min-h-screen bg-[#F8F5F2] font-poppins select-none max-[500px]:pb-10 pb-4">
      {/* Tab bar */}
      <div className="sticky max-[320px]:top-[56px] max-[768px]:top-[65px] top-[74px] z-30 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE] transition-transform duration-300" style={!tabBarVisible ? { transform: "translateY(-110%)" } : undefined}>

        <div className="flex justify-center px-4 lg:px-10 py-3">
          <ToggleTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Preview tab — mirrors user-profile layout */}
      {activeTab === "preview_my_profile" && me && (
        <MyProfilePreview me={me} photoSrc={photoSrc} />
      )}

      {/* Body — edit tab only */}
      <div className={`mt-5 md:mt-7 flex justify-center max-[370px]:px-2 px-4 md:px-10${activeTab === "preview_my_profile" ? " hidden" : ""}`}>
        <div className="w-full max-w-[1160px] flex flex-col">

          {/* Mobile TrustBadgeCard — ≤500px, above photo/detail row */}
          {me && !trustBadge && (
            <div className="min-[500px]:hidden mb-6">
              <TrustBadgeCard me={me} onAddDetails={scrollToAddDetails} />
            </div>
          )}

          <div className="flex flex-col items-center min-[700px]:items-start min-[700px]:flex-row gap-5 sm:gap-7 lg:gap-10">

            {/* Sticky photo column */}
            <div className="shrink-0 min-[700px]:sticky min-[700px]:top-[168px]">
              <div className="relative h-[219px] w-[165px] min-[700px]:h-[213px] min-[700px]:w-[160px] lg:h-[266px] lg:w-[200px]">
                <div className="relative z-10 h-[219px] w-[165px] min-[700px]:h-[213px] min-[700px]:w-[160px] lg:h-[266px] lg:w-[200px] overflow-hidden rounded-[16px] bg-[#D9D9D9]">
                  <ProtectedImage
                    src={photoSrc}
                    alt="profile"
                    width={200}
                    height={300}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {activeTab !== "preview_my_profile" && (
                  <div className="absolute left-1/2 -translate-x-1/2 z-10 bottom-0">
                    <Button
                      text={hasPhoto ? "Edit" : "Upload"}
                      onPress={() => fileInputRef.current?.click()}
                      className="max-[700px]:py-2 px-10 py-3 !font-medium text"
                      iconLeft={<CameraIcon className="w-4 md:w-4.5 h-4 md:h-4.5" />}
                    />
                  </div>
                )}

                <div className="max-[500px]:hidden mt-[-2px] w-[60px] md:w-[92px] lg:w-[105px] mx-auto">
                  <UnionDesignIcon className="rotate-270 -translate-y-16 md:-translate-y-32 lg:-translate-y-36.5" />
                  <UnionDesignIcon className="rotate-90 -translate-y-29 md:-translate-y-52 lg:-translate-y-59.5" />
                </div>
              </div>

              {/* Photo status labels below the image */}
              {photoStatus === "pending" && (
                <p className="text-center relative z-10 text-[14px] md:text-[16px] text-[#8D5900] font-medium">Photo under review</p>
              )}
              {photoStatus === "rejected" && (
                <p className="text-center relative z-10 text-[14px] md:text-[16px] text-[#B31B38] font-medium">Photo rejected</p>
              )}
            </div>

            {/* Detail column */}
            <div className="flex-1 min-w-0 w-full">

              {/* ── Mobile info box ≤500px ── */}
              <div className="min-[500px]:hidden rounded-[16px] bg-white max-[370px]:px-3 px-4 py-4">
                {/* Row 1: My profile + tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[#222] text-[16px] font-semibold leading-[150%]">My profile</span>
                  {isElite ? (
                    <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                      <EliteCrownIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[#A97216] text-[14px] font-normal leading-[150%]">Elite</span>
                    </div>
                  ) : isNew ? (
                    <div className="flex items-center rounded-[38px] bg-[#D5ECFF] px-3 py-[2px]">
                      <span className="text-[14px] font-normal leading-[150%] text-[#5D5D5D]">New</span>
                    </div>
                  ) : null}
                </div>
                {/* Name + trust badge */}
                <div className="mt-5 flex items-center gap-1">
                  <span className="text-[#222] text-[14px] font-medium leading-[150%]">{displayName}</span>
                  {trustBadge && <ProfileVerifiedBadgeIcon className="h-4 w-4 shrink-0" />}
                </div>
                {/* Inai ID */}
                <div className="text-[#222] text-[14px] font-normal leading-[150%]">{displayId}</div>
                {/* Photo visibility */}
                <div className="mt-2">
                  {me && <PhotoVisibilityRow photoStatus={photoStatus} initialVisibility={me.profile?.photoVisibility ?? "public"} pillBg="bg-[#F2F2F2]" />}
                </div>
              </div>

              {/* ── Desktop header >500px ── */}
              <h1 className="max-[500px]:hidden fonts-24 font-semibold text-dark">My profile</h1>

              {/* Name + badge + tag row */}
              <div className="max-[500px]:hidden mt-4 md:mt-6 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-1 md:gap-2">
                  <h2 className="text-dark text-[14px] md:text-[18px] font-medium leading-[150%]">
                    {displayName}
                  </h2>
                  {trustBadge && (
                    <ProfileVerifiedBadgeIcon className="h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 shrink-0" />
                  )}
                </div>

                {/* One tag: Elite has priority, then New (< 30 days), else nothing */}
                {isElite ? (
                  <div className="flex items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-[2px]">
                    <EliteCrownIcon className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 shrink-0" />
                    <span className="text-[#A97216] text-[14px] md:text-[16px] font-normal leading-[150%]">Elite</span>
                  </div>
                ) : isNew ? (
                  <div className="flex items-center rounded-[38px] bg-[#D5ECFF] px-3 py-[2px]">
                    <span className="text-[14px] md:text-[16px] font-normal leading-[150%] text-[#5D5D5D]">New</span>
                  </div>
                ) : null}
              </div>

              {/* Inai ID */}
              <div className="max-[500px]:hidden md:mt-0.5 text-dark text-[14px] md:text-[16px] font-normal leading-[150%]">{displayId}</div>

              {/* Photo visibility */}
              <div className="max-[500px]:hidden">
                {me && <PhotoVisibilityRow photoStatus={photoStatus} initialVisibility={me.profile?.photoVisibility ?? "public"} />}
              </div>

              {/* Trust badge section — desktop only (mobile shown above photo row) */}
              {me && !trustBadge && (
                <div className="max-[500px]:hidden mt-6 md:mt-8">
                  <TrustBadgeCard me={me} onAddDetails={scrollToAddDetails} />
                </div>
              )}

              {/* About Me */}
              <div ref={aboutMeRef} className="max-[500px]:mt-4 mt-6 md:mt-8 rounded-[16px] bg-light p-4 md:p-5">
                <div className="flex items-center gap-2 text-dark md:gap-3">
                  <AboutMeIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />
                  <h2 className="md:text-[20px] sm:text-[18px] text-[16px] font-semibold">About Me</h2>
                </div>
                <div className="my-3 border-t border-[#EAEAEA] md:my-4" />
                {activeTab === "preview_my_profile" ? (
                  <p className="text-[14px] md:text-[16px] text-dark leading-[150%] whitespace-pre-wrap">
                    {aboutMe || <span className="text-[#B31B38]">A few words about yourself, your values, what you&apos;re looking for.</span>}
                  </p>
                ) : (
                  <div>
                    <div className={`rounded-[12px] border bg-[#FFF0F3] ${aboutMeError ? "border-[#B31B38]" : "border-[rgba(179,27,56,0.25)]"}`}>
                      <textarea
                        value={aboutMe}
                        onChange={(e) => handleAboutMeChange(e.target.value)}
                        placeholder="A few words about yourself, your values, what you're looking for."
                        className="md:h-20 h-22 w-full resize-none bg-transparent p-3 text-[14px] md:text-[16px] text-dark outline-none placeholder:text-[#B31B38]"
                      />
                    </div>
                    <span className="mt-[5px] md:mt-[7px] block text-[12px] md:text-[14px]" style={{ minHeight: "1.2em" }}>
                      {aboutMeError
                        ? <span className="text-[#B31B38] font-medium">
                          {splitHighlight(aboutMeError.message, aboutMeError.offendingWord).map((seg, i) =>
                            seg.highlight
                              ? <span key={i} className="underline decoration-[0.5px] underline-offset-2">{seg.text}</span>
                              : <span key={i}>{seg.text}</span>
                          )}
                        </span>
                        : <span className="text-secondary4">Keep it genuine — families read this</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Expandable sections */}
              <div ref={sectionsRef} className="max-[500px]:mt-4 mt-6 md:mt-8 space-y-4 md:space-y-6">
                {activeTab === "preview_my_profile" ? (
                  <ExpandableSections
                    me={me}
                    openId={openSectionId}
                    onOpenChange={setOpenSectionId}
                    onDirty={handleDirty}
                    revision={sectionRevision}
                    draftTick={draftTick}
                    isPreview
                  />
                ) : (
                  <ExpandableSections
                    me={me}
                    openId={openSectionId}
                    onOpenChange={setOpenSectionId}
                    onDirty={handleDirty}
                    revision={sectionRevision}
                    draftTick={draftTick}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Done button — scrolls with page, sits at bottom of content */}
      {hasPendingChanges && activeTab === "edit_profile" && (
        <div className="mt-10 md:mt-20 border-t border-[#EAEAEA] bg-[rgba(255,255,255,0.60)] shadow-[0_0_20px_rgba(0,0,0,0.04)]">
          <div className="mx-auto px-4 md:px-10 py-2 md:py-3">
            <div className="flex max-w-[1160px] mx-auto">
              <div className="flex-1" />
              <Button
                text={saving ? loadingText : "Done"}
                onPress={handleDone}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Crop modal */}
      {cropSrc && (
        <PhotoCropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onClose={() => setCropSrc(null)}
        />
      )}
    </main>
  );
}

// ─── Photo visibility row ──────────────────────────────────────────────────────

const PHOTO_VISIBILITY_OPTIONS = [
  { value: "public", label: "All Inai members", type: "globe" },
  { value: "locked", label: "Accepted interest only", type: "lock" },
] as const;
type VisibilityValue = "public" | "locked";

function PhotoVisibilityRow({
  initialVisibility,
  pillBg = "bg-light",
}: {
  photoStatus?: string | null;
  initialVisibility: VisibilityValue;
  pillBg?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<VisibilityValue>(initialVisibility);
  const [saving, setSaving] = useState(false);

  async function handleSelect(value: VisibilityValue) {
    if (value === selected || saving) return;
    setSelected(value);
    setOpen(false);
    setSaving(true);
    try { await updatePhotoVisibility(value); } catch { setSelected(selected); }
    finally { setSaving(false); }
  }

  const selectedOption = PHOTO_VISIBILITY_OPTIONS.find((o) => o.value === selected) ?? PHOTO_VISIBILITY_OPTIONS[0];

  return (
    <div className="relative inline-flex max-[376px]:flex-col max-[376px]:items-start items-center gap-2 mt-2 md:mt-3">
      <div className="text-[14px] md:text-[16px] text-dark">Photo visibility</div>
      <button
        type="button"
        onClick={() => !saving && setOpen((v) => !v)}
        className={`px-2 py-1 flex items-center gap-1 md:gap-2 rounded-full ${pillBg} transition-opacity ${saving ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
      >
        {selectedOption.type === "globe" ? (
          <GlobeIcon className="w-3 md:w-4 h-3 md:h-4 text-dark" />
        ) : (
          <InterestLockIcon className="w-3 md:w-4 h-3 md:h-4" stroke="#222" />
        )}
        <span className="text-[14px] md:text-[16px] text-dark">{selectedOption.label}</span>
        <ChevronIcon open={open} strokeWidth={1.5} className="w-3 md:w-4 h-3 md:h-4 transition-transform duration-150" />
      </button>

      {open && (
        <div className="absolute left-[90px] top-full mt-2 z-40 inline-flex flex-col gap-2 rounded-[16px] bg-white px-1 md:px-2 py-3 md:py-4 shadow-[0_0_16px_0_rgba(0,0,0,0.08)] origin-top-left">
          {PHOTO_VISIBILITY_OPTIONS.map((item) => {
            const active = selected === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item.value)}
                className={`cursor-pointer flex items-center gap-2 rounded-[8px] px-2 py-1 transition-colors duration-150 whitespace-nowrap ${active ? "bg-[#FFF0F3]" : "hover:bg-[#EAEAEA]"}`}
              >
                {item.type === "globe" ? (
                  <GlobeIcon className={`h-3 w-3 md:h-4 md:w-4 ${active ? "text-primary" : "text-dark"}`} />
                ) : (
                  <InterestLockIcon stroke={active ? "#B31B38" : "#222"} className="h-3 w-3 md:h-4 md:w-4" />
                )}
                <span className={`text-[14px] md:text-[16px] font-normal leading-[150%] ${active ? "text-primary" : "text-dark"}`}>
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

// ─── Trust badge card ──────────────────────────────────────────────────────────

function TrustBadgeCard({ me, onAddDetails }: { me: Me; onAddDetails: () => void }) {
  const isPhoneVerified = me.isPhoneVerified;
  const isEmailVerified = me.isEmailVerified;
  const isProfileVerified = me.profileCompletionScore >= 90;
  const [expanded, setExpanded] = useState(false);

  const taskList = (
    <div className="flex flex-col gap-2 md:gap-2 mt-1.5">
      <div className="min-[500px]:ml-10.5 flex flex-col min-[500px]:flex-row min-[500px]:justify-between text-[14px] lg:text-[16px] gap-0.5">
        <span className="text-dark">1. Verify your mobile number</span>
        {isPhoneVerified ? (
          <div className="text-[14px] lg:text-[16px] max-[500px]:ml-2.5 text-[#656565] flex items-center">
            Verified <CheckmarkIcon className="md:w-6 md:h-6 w-5 h-5 ml-1" />
          </div>
        ) : (
          <Link href="/verify-identity?method=phone" className="text-[14px] lg:text-[16px] max-[500px]:ml-2.5 text-[#B31B38] flex items-center hover:underline">
            Verify now <ChevronRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="min-[500px]:ml-10.5 flex flex-col min-[500px]:flex-row min-[500px]:justify-between text-[14px] lg:text-[16px] gap-0.5">
        <span className="text-dark">2. Verify your email address</span>
        {isEmailVerified ? (
          <div className="text-[14px] lg:text-[16px] max-[500px]:ml-2.5 text-[#656565] flex items-center">
            Verified <CheckmarkIcon className="md:w-6 md:h-6 w-5 h-5 ml-1" />
          </div>
        ) : (
          <Link href="/verify-identity?method=email" className="text-[14px] lg:text-[16px] max-[500px]:ml-2.5 text-[#B31B38] flex items-center hover:underline">
            Verify now <ChevronRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="min-[500px]:ml-10.5 flex flex-col min-[500px]:flex-row min-[500px]:justify-between text-[14px] lg:text-[16px] gap-0.5">
        <span className="text-dark">3. Reach 90% profile completion points</span>
        {isProfileVerified ? (
          <div className="max-[500px]:ml-2.5 text-[#656565] flex items-center text-[14px] lg:text-[16px]">
            Verified <CheckmarkIcon className="md:w-6 md:h-6 w-5 h-5 ml-1" />
          </div>
        ) : (
          <button
            type="button"
            onClick={onAddDetails}
            className="text-[14px] lg:text-[16px] max-[500px]:ml-2.5 text-[#B31B38] flex items-center hover:underline cursor-pointer"
          >
            Add details <ChevronRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[#FFE9E2] rounded-[16px]">

      {/* ── Mobile collapsed/expanded card (≤500px) ── */}
      <div
        className="min-[500px]:hidden max-[370px]:px-2 px-4 sm:px-6 max-[370px]:py-4 py-6 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        {/* Badge centred, chevron pinned to right */}
        <div className="flex items-center">
          <div className="flex-1" />
          <Image src="/icons/trust_Badge.png" alt="" width={33} height={36} className="shrink-0 max-[370px]:w-[33px] w-9 max-[370px]:h-[36px] h-10" />
          <div className="flex-1 flex justify-end">
            <ChevronIcon open={expanded} stroke="#222" strokeWidth={1.5} className="w-4 h-4 shrink-0 transition-transform duration-300" />
          </div>
        </div>

        {/* Summary text */}
        <p className="mt-3 text-[#222] text-[14px] font-normal leading-[150%]">
          Get a Trust Badge by completing 3 quick tasks to show members you are real and trustworthy. {"  "}
          <Link
            href="/trust-badge"
            onClick={e => e.stopPropagation()}
            className="ml-1 text-[#B31B38] text-[14px] font-medium leading-[150%] underline"
          >
            Get Trust Badge &gt;
          </Link>
        </p>

        {/* Smooth expand via CSS grid trick */}
        <div
          className="overflow-hidden"
          style={{
            display: "grid",
            gridTemplateRows: expanded ? "1fr" : "0fr",
            transition: "grid-template-rows 300ms ease-in-out",
          }}
        >
          <div className="overflow-hidden">
            <div className="pt-3">{taskList}</div>
          </div>
        </div>
      </div>

      {/* ── Desktop layout (>500px, unchanged) ── */}
      <div className="max-[500px]:hidden p-4 md:p-5">
        <div className="flex items-center">
          <Image src="/icons/trust_Badge.png" alt="" width={36} height={40} className="h-10 w-9 shrink-0" />
          <p className="ml-2 md:ml-3 text-dark text-[14px] md:text-[16px]">
            Get a Trust Badge by completing 3 quick tasks to show members you are real and trustworthy.
          </p>
        </div>
        {taskList}
      </div>

    </div>
  );
}

// ─── Expandable sections ───────────────────────────────────────────────────────

type SectionItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed: number;
  total: number;
  body: React.ReactNode;
};

function computePartnerCompleted(): number {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEYS.partner);
    let ppd: Record<string, unknown> = {};
    if (raw) {
      ppd = JSON.parse(raw);
    } else {
      const modal = sessionStorage.getItem("inai_partner_pref");
      if (modal) {
        const p = JSON.parse(modal);
        ppd = {
          ageMin: p.ageMin ? String(p.ageMin) : "",
          ageMax: p.ageMax ? String(p.ageMax) : "",
          heightMin: p.heightMinCm ? `${p.heightMinCm} cm` : "",
          heightMax: p.heightMaxCm ? `${p.heightMaxCm} cm` : "",
          marital: p.maritalStatuses?.[0] ?? "Unmarried",
          physical: p.physicalStatuses?.[0] ?? "Open to all",
          edu: p.educationLevels?.length ? p.educationLevels : ["filled"],
          countries: p.countries ?? [],
          religion: p.religions?.[0] ?? "Open to all",
          castes: p.castes ?? [],
          food: p.foodHabits?.[0] ?? "Open to all",
          smoking: p.smokingHabits?.[0] ?? "Open to all",
          drinking: p.drinkingHabits?.[0] ?? "Open to all",
          aboutPartner: "",
        };
      }
    }
    return ([
      !!(ppd.ageMin && ppd.ageMax),
      !!(ppd.heightMin && ppd.heightMax),
      !!(ppd.marital ?? "Unmarried"),
      !!(ppd.physical ?? "Open to all"),
      true, // edu: empty = show all = filled
      true, // countries: empty = show all = filled
      !!(ppd.religion ?? "Open to all"),
      true, // castes: empty = show all = filled
      !!(ppd.food ?? "Open to all"),
      !!(ppd.smoking ?? "Open to all"),
      !!(ppd.drinking ?? "Open to all"),
      !!ppd.aboutPartner,
    ] as boolean[]).filter(Boolean).length;
  } catch { return 0; }
}

function buildSections(me: Me | null, onDirty: () => void, partnerCompleted: number, revision: number, _draftTick = 0): SectionItem[] {
  const p = me?.profile;
  const key = `${me?.id ?? "loading"}_${revision}`;

  const contactComplete = [me?.isPhoneVerified, me?.isEmailVerified].filter(Boolean).length;

  // Basic: name, dob, marital, height, weight, hasPhysicalChallenge, physBuild, languages (8 or 9)
  // _draftTick=0 means we're in SSR/pre-mount — skip sessionStorage to avoid hydration mismatch
  const bd = (_draftTick > 0 ? (() => { try { const r = sessionStorage.getItem(DRAFT_KEYS.basic); return r ? JSON.parse(r) : null; } catch { return null; } })() : null) as Record<string, unknown> | null;
  const liveHasPhys = bd?.physicalChallenge !== undefined ? bd.physicalChallenge === "yes" : (p?.hasPhysicalChallenge === true);
  const liveHeight = bd?.height ?? (p?.heightCm ? `${p.heightCm} cm` : "");
  const liveWeight = bd?.weight ?? (p?.weightKg ? `${p.weightKg} kg` : "");
  const liveMarital = bd?.maritalStatus ?? p?.maritalStatus;
  const liveDOB = bd?.birthYear ? `${bd.birthYear}-${bd.birthMonth}-${bd.birthDay}` : p?.dateOfBirth;
  const livePhysBuild = bd?.physBuild ?? p?.physicalBuild;
  // Section defaults to ["Tamil"] when API returns null, so treat null as filled
  const liveLangs = (bd?.languages as string[] | undefined) ?? p?.languagesSpoken ?? ["Tamil"];
  const liveDisability = bd?.disability ?? p?.disabilityType;
  const hasPhysChallenge = liveHasPhys;
  const liveName = (bd?.name as string | undefined) ?? me?.name;
  const basicFields: unknown[] = [
    !!liveName,
    liveDOB, liveMarital, !!liveHeight, !!liveWeight,
    true, // hasPhysicalChallenge itself: always filled (No is a valid answer)
    livePhysBuild, (liveLangs?.length ?? 0) > 0,
  ];
  if (hasPhysChallenge) basicFields.push(!!liveDisability);
  const basicComplete = basicFields.filter(Boolean).length;
  const basicTotal = hasPhysChallenge ? 9 : 8;

  // Career: education, educationDetail, occupation, sector, monthlyIncome (5)
  const careerComplete = [
    p?.education, p?.educationDetail, p?.occupation, p?.sector, nn(p?.monthlyIncome),
  ].filter(Boolean).length;

  // Family: fatherOcc, motherOcc, brotherCount, brothersMarried, sisterCount, sistersMarried (6)
  const familyComplete = [
    p?.fatherOccupation, p?.motherOccupation,
    nn(p?.brotherCount), nn(p?.brothersMarried), nn(p?.sisterCount), nn(p?.sistersMarried),
  ].filter(Boolean).length;

  // Location: country, city, citizenship, residentStatus (4)
  const locationComplete = [p?.country, p?.city, p?.citizenship, p?.residentStatus].filter(Boolean).length;

  // Lifestyle: diet, smoking, drinking (3)
  const lifestyleComplete = [p?.dietHabit, p?.smokingHabit, p?.drinkingHabit].filter(Boolean).length;

  return [
    {
      id: "contact",
      title: "Contact information",
      icon: <BiPhoneCall strokeWidth={0.5} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: contactComplete,
      total: 2,
      body: me ? <ContactInfoSection me={me} /> : null,
    },
    {
      id: "basic",
      title: "Basic Info",
      icon: <ProfileBoxIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: basicComplete,
      total: basicTotal,
      body: <BasicInfoSection key={key} me={me} onDirty={onDirty} />,
    },
    {
      id: "career",
      title: "Career & Education",
      icon: <WorkBriefcaseIcon strokeWidth={2} className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: careerComplete,
      total: 5,
      body: <CareerEducationSection key={key} me={me} onDirty={onDirty} />,
    },
    {
      id: "family",
      title: "Family Background",
      icon: <StepFamilyIcon strokeWidth="4" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: familyComplete,
      total: 6,
      body: <FamilyBackgroundSection key={key} me={me} onDirty={onDirty} />,
    },
    {
      id: "religion",
      title: "Religion and Caste",
      icon: <CasteCircleIcon strokeWidth="2" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: [p?.religion, p?.caste].filter(Boolean).length,
      total: 2,
      body: <ReligionCasteSection key={key} me={me} onDirty={onDirty} />,
    },
    {
      id: "location",
      title: "Location",
      icon: <LocationPinIcon strokeWidth="2" className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: locationComplete,
      total: 4,
      body: <LocationSection key={key} me={me} onDirty={onDirty} />,
    },
    {
      id: "lifestyle",
      title: "Lifestyle",
      icon: <WineGlassIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: lifestyleComplete,
      total: 3,
      body: <LifestyleSection key={key} me={me} onDirty={onDirty} />,
    },
    {
      id: "hobbies",
      title: "Interests & Hobbies",
      icon: <PaintBrushIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: (p?.hobbies?.length ?? 0) > 0 ? 1 : 0,
      total: 1,
      body: <InterestsHobbiesSection key={key} me={me} onDirty={onDirty} />,
    },
    {
      id: "partner",
      title: "Partner preference",
      icon: <HeartIcon className="h-4 w-4 md:h-4.5 lg:h-5 md:w-4.5 lg:w-5" />,
      completed: partnerCompleted,
      total: 12,
      body: <PartnerPreferenceSection key={key} onDirty={onDirty} />,
    },
  ];
}

function ExpandableSections({
  me,
  openId,
  onOpenChange,
  onDirty,
  isPreview = false,
  revision = 0,
  draftTick = 0,
}: {
  me: Me | null;
  openId: string;
  onOpenChange: (id: string) => void;
  onDirty: () => void;
  isPreview?: boolean;
  revision?: number;
  draftTick?: number;
}) {
  // mounted gates sessionStorage reads — prevents SSR/client hydration mismatch
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  const [partnerCompleted, setPartnerCompleted] = useState(0);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (mounted) setPartnerCompleted(computePartnerCompleted()); }, [revision, mounted, draftTick]);
  const sections = buildSections(me, onDirty, partnerCompleted, revision, mounted ? draftTick : 0);

  return (
    <>
      {sections.map((section) => (
        <ExpandableSection
          key={section.id}
          section={section}
          open={isPreview ? true : openId === section.id}
          onToggle={() => onOpenChange(openId === section.id ? "" : section.id)}
          isPreview={isPreview}
        />
      ))}
    </>
  );
}

function ExpandableSection({
  section,
  open,
  onToggle,
  isPreview = false,
}: {
  section: SectionItem;
  open: boolean;
  onToggle: () => void;
  isPreview?: boolean;
}) {
  const allDone = section.completed >= section.total;
  const statusText = allDone ? "Completed" : `${section.completed}/${section.total} completed`;

  return (
    <div className="font-poppins rounded-[16px] bg-light">
      {isPreview ? (
        <div className="flex w-full items-center justify-between px-4 md:px-5 pt-4 md:pt-5 pb-3 md:pb-4">
          <div className="flex items-center gap-2 md:gap-3">
            {section.icon}
            <span className="md:text-[20px] sm:text-[18px] text-[16px] font-semibold leading-[150%] text-dark">{section.title}</span>
          </div>
          <span className="text-[14px] md:text-[16px] font-medium leading-[150%] text-secondary4">{statusText}</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-between px-4 md:px-5 pt-4 md:pt-5 pb-3 md:pb-4 gap-2"
        >
          {/* Left: icon + (title / count stacked on mobile, title only on desktop) */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="shrink-0">{section.icon}</div>
            <div className="flex flex-col min-[410px]:flex-row min-[410px]:items-center min-[410px]:gap-0 gap-0.5 min-w-0 flex-1">
              <span className="text-left md:text-[20px] sm:text-[18px] text-[16px] font-semibold leading-[150%] text-dark min-[410px]:flex-1">
                {section.title}
              </span>
              {/* Count + dot — below title on ≤410px, hidden here on desktop (shown in right group) */}
              <div className="min-[410px]:hidden flex items-center gap-1">
                <span className="text-[14px] font-medium leading-[150%] text-secondary4">{statusText}</span>
                {!allDone && <div className="h-2 w-2 rounded-full bg-[#B31B38]" />}
              </div>
            </div>
          </div>

          {/* Right: count + dot + chevron (desktop only) */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <span className="max-[410px]:hidden text-[14px] md:text-[16px] font-medium leading-[150%] text-secondary4">{statusText}</span>
            {!allDone && <div className="max-[410px]:hidden h-2 md:h-3 w-2 md:w-3 rounded-full bg-[#B31B38]" />}
            <ChevronIcon open={open} stroke="#B31B38" strokeWidth={1.5} className="w-4 h-4" />
          </div>
        </button>
      )}

      {open && (
        <div className={`px-4 md:px-5 pb-4 md:pb-5 pt-1 md:pt-2${isPreview ? " pointer-events-none select-none" : ""}`}>
          {section.body}
        </div>
      )}
    </div>
  );
}
