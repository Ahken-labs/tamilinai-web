"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ChevronIcon, RadioCircleIcon, CloseCircleIcon, SearchIcon, PartyIcon } from "../../assets/Icons";
import DropdownField, { MultiSelectDropdown } from "../common-layout/DropdownField";
import FormRow from "../common-layout/FormRow";
import Button from "../common-layout/Button";
import ToggleTabs from "../common-layout/ToggleTabs";
import {
  EDUCATION_OPTIONS,
  RELIGION_OPTIONS,
  CASTE_OPTIONS,
  MARITAL_OPTIONS,
} from "../../constants/profiles";
import { countWords } from "../../utils/wordCount";
import { COUNTRY_OPTIONS } from "@/src/constants/location";
import { getPartnerPreferences, savePartnerPreferences } from "../../lib/api/user";
import type { PartnerPreferences } from "../../types/user";

const PREF_CACHE_KEY = "inai_partner_pref";
const PREF_TTL_MS = 30 * 60 * 1000; // 30 min

function getCachedPrefs(): PartnerPreferences | null {
  try {
    const raw = sessionStorage.getItem(PREF_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data?: PartnerPreferences; expiresAt?: number } | PartnerPreferences;
    if ('expiresAt' in parsed && parsed.expiresAt) {
      if (Date.now() > parsed.expiresAt) { sessionStorage.removeItem(PREF_CACHE_KEY); return null; }
      return (parsed as { data: PartnerPreferences; expiresAt: number }).data;
    }
    // legacy format (no TTL) — treat as valid, will be overwritten on next save
    return parsed as PartnerPreferences;
  } catch { return null; }
}
function setCachedPrefs(prefs: PartnerPreferences): void {
  try { sessionStorage.setItem(PREF_CACHE_KEY, JSON.stringify({ data: prefs, expiresAt: Date.now() + PREF_TTL_MS })); } catch { /* unavailable */ }
}

// ── Static option lists ───────────────────────────────────────────────────

const AGE_OPTIONS = Array.from({ length: 53 }, (_, i) => String(18 + i));

const HEIGHT_OPTIONS: string[] = Array.from({ length: 81 }, (_, i) => `${140 + i} cm`);

const PHYSICAL_OPTIONS = ["Open to all", "Normal", "Physically challenged"];
const FOOD_OPTIONS = ["Open to all", "Vegetarian", "Non vegetarian"];
const SMOKING_OPTIONS = ["Open to all", "Okay", "No"];
const DRINKING_OPTIONS = ["Open to all", "Okay", "No", "Light / Social"];
const RELIGION_PREF = ["Open to all", ...RELIGION_OPTIONS.filter((r) => r !== "Not specified")];
const MAX_ABOUT_WORDS = 60;

const SEARCH_TABS = [
  { label: "Search", value: "search" },
  { label: "Advanced search", value: "advanced" },
];

// ── Small helpers ─────────────────────────────────────────────────────────

function RadioGroup({ options, value, onChange, className = "" }: {
  options: string[]; value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div className={`flex flex-wrap max-[500px]:gap-2 gap-4 md:gap-5 ${className}`}>
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)} className="flex items-center gap-2">
          <RadioCircleIcon checked={value === opt} />
          <span className="font-poppins text-[16px] text-left text-secondary4 leading-[150%]">{opt}</span>
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

type Variant = "onboarding" | "search" | "edit";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  variant?: Variant;
}

export default function PartnerPreferenceModal({ isOpen, onClose, variant = "onboarding" }: Props) {
  const router = useRouter();
  useScrollLock(isOpen);
  const originalPrefs = useRef<PartnerPreferences | null>(null);

  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [heightMin, setHeightMin] = useState("");
  const [heightMax, setHeightMax] = useState("");

  const [ageMinOpen, setAgeMinOpen] = useState(false);
  const [ageMaxOpen, setAgeMaxOpen] = useState(false);
  const [heightMinOpen, setHeightMinOpen] = useState(false);
  const [heightMaxOpen, setHeightMaxOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [casteOpen, setCasteOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [ageError, setAgeError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [isLifestyleOpen, setIsLifestyleOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<"search" | "advanced">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [marital, setMarital] = useState("Unmarried");
  const [physical, setPhysical] = useState("Open to all");
  const [eduTags, setEduTags] = useState<string[]>(EDUCATION_OPTIONS);
  const [countries, setCountries] = useState<string[]>([]);
  const [castes, setCastes] = useState<string[]>([]);
  const [religion, setReligion] = useState("Open to all");
  const [food, setFood] = useState("Open to all");
  const [smoking, setSmoking] = useState("Open to all");
  const [drinking, setDrinking] = useState("Open to all");
  const [aboutPartner, setAboutPartner] = useState("");

  // Apply saved preferences onto component state
  function applyPrefs(prefs: PartnerPreferences) {
    if (prefs.ageMin) setAgeMin(String(prefs.ageMin));
    if (prefs.ageMax) setAgeMax(String(prefs.ageMax));
    if (prefs.heightMinCm) setHeightMin(`${prefs.heightMinCm} cm`);
    if (prefs.heightMaxCm) setHeightMax(`${prefs.heightMaxCm} cm`);
    if (prefs.maritalStatuses?.[0]) setMarital(prefs.maritalStatuses[0]);
    if (prefs.physicalStatuses?.[0]) setPhysical(prefs.physicalStatuses[0]);
    if (prefs.educationLevels?.length) setEduTags(prefs.educationLevels);
    if (prefs.countries?.length) setCountries(prefs.countries);
    if (prefs.castes?.length) setCastes(prefs.castes);
    if (prefs.religions?.[0]) setReligion(prefs.religions[0]);
    if (prefs.foodHabits?.[0]) setFood(prefs.foodHabits[0]);
    if (prefs.smokingHabits?.[0]) setSmoking(prefs.smokingHabits[0]);
    if (prefs.drinkingHabits?.[0]) setDrinking(prefs.drinkingHabits[0]);
    if (prefs.aboutPartner) setAboutPartner(prefs.aboutPartner);
  }

  // Build API payload from current state
  function buildPayload(): PartnerPreferences {
    const p: PartnerPreferences = {};
    if (ageMin) p.ageMin = parseInt(ageMin);
    if (ageMax) p.ageMax = parseInt(ageMax);
    const minCm = heightMin ? parseInt(heightMin) : undefined;
    const maxCm = heightMax ? parseInt(heightMax) : undefined;
    if (minCm) p.heightMinCm = minCm;
    if (maxCm) p.heightMaxCm = maxCm;
    p.maritalStatuses = [marital];
    p.physicalStatuses = [physical];
    p.religions = [religion];
    p.foodHabits = [food];
    p.smokingHabits = [smoking];
    p.drinkingHabits = [drinking];
    // null = "show all"; subset = user's selection
    p.educationLevels = eduTags.length < EDUCATION_OPTIONS.length ? eduTags : null;
    p.countries = countries.length > 0 ? countries : null;
    p.castes = castes.length > 0 ? castes : null;
    if (aboutPartner) p.aboutPartner = aboutPartner;
    return p;
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isOpen) return;

    // Reset to defaults on every open so cancelled changes don't persist
    setAgeMin(""); setAgeMax(""); setAgeError("");
    setHeightMin(""); setHeightMax(""); setHeightError("");
    setMarital("Unmarried"); setPhysical("Open to all");
    setEduTags(EDUCATION_OPTIONS); setCountries([]); setCastes([]);
    setReligion("Open to all"); setFood("Open to all");
    setSmoking("Open to all"); setDrinking("Open to all");
    setAboutPartner("");

    // sessionStorage cache hit → instant population
    const cached = getCachedPrefs();
    if (cached) { originalPrefs.current = cached; applyPrefs(cached); return; }

    // Cache miss → fetch from API, then cache
    getPartnerPreferences()
      .then((prefs) => { originalPrefs.current = prefs; setCachedPrefs(prefs); applyPrefs(prefs); })
      .catch(() => { /* keep defaults */ });
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const wordCount = countWords(aboutPartner);
  if (!isOpen || typeof window === "undefined") return null;

  function handleSave() {
    setAgeError(""); setHeightError("");
    const payload = buildPayload();
    const changed = JSON.stringify(payload) !== JSON.stringify(originalPrefs.current);
    setCachedPrefs(payload);
    if (changed) {
      savePartnerPreferences(payload).catch(() => { });
    }
    onClose();
  }

  function handleSearchSave() {
    handleSave();
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (ageMin) params.set("minAge", ageMin);
    if (ageMax) params.set("maxAge", ageMax);
    if (religion !== "Open to all") params.set("religion", religion);
    if (marital !== "Open to all") params.set("maritalStatus", marital);
    if (countries.length === 1) params.set("country", countries[0]);
    onClose();
    const qs = params.toString();
    router.push(qs ? `/matches?${qs}` : "/matches");
  }

  function handleSimpleSearch() {
    const q = searchQuery.trim();
    if (!q) { onClose(); router.push("/matches"); return; }
    const params = new URLSearchParams();
    const isCountry = COUNTRY_OPTIONS.some((c) => c.toLowerCase() === q.toLowerCase());
    if (isCountry) {
      params.set("country", COUNTRY_OPTIONS.find((c) => c.toLowerCase() === q.toLowerCase()) ?? q);
    } else {
      params.set("displayId", q.toUpperCase());
    }
    onClose();
    router.push(`/matches?${params.toString()}`);
  }
  function handleAboutChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (countWords(e.target.value) <= MAX_ABOUT_WORDS) setAboutPartner(e.target.value);
  }
  function filterList(list: string[], q: string) {
    if (!q || list.includes(q)) return list;
    return list.filter((s) => s.toLowerCase().includes(q.toLowerCase()));
  }

  // Flags derived from variant
  const showSectionHeadings = variant === "onboarding";
  const lifestyleCollapsible = variant === "onboarding";
  const showAboutPartner = variant !== "search";
  const showSearchOnly = variant === "search" && activeSearchTab === "search";
  const showFooter = !showSearchOnly;

  // Lifestyle fields visible when not collapsible, or when collapsible and toggled open
  const showLifestyleFields = !lifestyleCollapsible || isLifestyleOpen;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/50">
      <div className="w-full min-[500px]:max-w-[784px] max-h-[90dvh] min-[500px]:max-h-[90vh] flex flex-col rounded-t-[20px] min-[500px]:rounded-[20px] bg-light shadow-2xl overflow-hidden">

        {/* Header: onboarding */}
        {variant === "onboarding" && (
          <div className="shrink-0 bg-[#F0F0F0] px-4 md:px-5 lg:px-6 py-4 md:py-5 lg:py-6">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-poppins fonts-16 font-normal text-dark leading-[150%]">
                  You successfully registered!
                </p>
                <p className="font-poppins text-[16px] md:text-[18px] font-medium text-dark leading-[150%]">
                  Tell us what matters to you in a partner &amp; we&apos;ll show your best matches.<span className="min-[500px]:hidden text-[18px]"> 🎉</span>
                </p>
              </div>
              <span className="hidden min-[500px]:block shrink-0"><PartyIcon /></span>
            </div>
          </div>
        )}

        {/* Header: search or edit */}
        {(variant === "search" || variant === "edit") && (
          <div className="shrink-0 bg-white border-b border-[#EAEAEA] rounded-t-[20px] px-6 pt-4 md:pt-5.5 pb-4 md:pb-5.5 flex items-center gap-4">
            <span className={`font-poppins fonts-24 font-semibold text-[dark leading-[150%] shrink-0${variant === "search" ? " max-[500px]:hidden" : ""}`}>
              {variant === "search" ? "Search" : "Edit partner preference"}
            </span>
            {variant === "search" && (
              <div className="flex-1 flex justify-center">
                {/* invisible spacer balances the close button so toggle is truly centered on mobile */}
                <div className="max-[500px]:block hidden w-8 shrink-0" />
                <ToggleTabs
                  tabs={SEARCH_TABS}
                  activeTab={activeSearchTab}
                  onTabChange={(v) => setActiveSearchTab(v as "search" | "advanced")}
                />
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto shrink-0 cursor-pointer"
              aria-label="Close"
            >
              <CloseCircleIcon className="h-8 w-8 transition-transform duration-200 hover:scale-110 active:scale-95 " />
            </button>
          </div>
        )}

        {/* Scrollable body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-5 lg:px-6">

          {/* Search tab: simple search bar only */}
          {showSearchOnly ? (
            <div className="py-6">
              <div
                className="flex items-center overflow-hidden rounded-[41px] bg-[#E0E0E0]"
                style={{ padding: "4px 4px 4px 16px" }}
              >
                <input
                  type="text"
                  placeholder="Search by ID and country"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSimpleSearch(); }}
                  className="flex-1 min-w-0 bg-transparent font-poppins text-base font-normal text-[#222222] placeholder:text-[#656565] outline-none"
                />
                <button
                  type="button"
                  onClick={handleSimpleSearch}
                  className="flex items-center justify-center h-10 px-4 rounded-full bg-[#B31B38] cursor-pointer"
                >
                  <SearchIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {showSectionHeadings && (
                <h2 className="font-poppins text-[16px] md:text-[18px] font-medium text-dark max-[500px]:py-5 py-6 md:py-7 lg:py-8 leading-[150%]">
                  Age &amp; height range
                </h2>
              )}

              <div className={`flex flex-col max-[500px]:gap-5 gap-6 ${!showSectionHeadings ? "pt-6" : ""}`}>
                {/* Age */}
                <FormRow label="Age" required error={ageError}>
                  <div className="flex flex-row items-center max-[500px]:gap-2 gap-4">
                    <DropdownField
                      typeable compact
                      placeholder="Min"
                      value={ageMin}
                      open={ageMinOpen}
                      setOpen={setAgeMinOpen}
                      onSelect={(v) => { setAgeMin(v); setAgeError(""); }}
                      items={filterList(AGE_OPTIONS, ageMin)}
                      className="flex-1"
                      dropdownClassName="max-h-[200px]"
                    />
                    <span className="ml-2 sm:ml-0 font-poppins text-[16px] font-medium text-dark">to</span>
                    <DropdownField
                      typeable compact
                      placeholder="Max"
                      value={ageMax}
                      open={ageMaxOpen}
                      setOpen={setAgeMaxOpen}
                      onSelect={(v) => { setAgeMax(v); setAgeError(""); }}
                      items={filterList(AGE_OPTIONS, ageMax)}
                      className="flex-1"
                      dropdownClassName="max-h-[200px]"
                    />
                  </div>
                </FormRow>

                {/* Height */}
                <FormRow label="Height" required error={heightError}>
                  <div className="flex flex-row items-center max-[500px]:gap-2 gap-4">
                    <DropdownField
                      typeable compact
                      placeholder="Min"
                      value={heightMin}
                      open={heightMinOpen}
                      setOpen={setHeightMinOpen}
                      onSelect={(v) => { setHeightMin(v); setHeightError(""); }}
                      items={filterList(HEIGHT_OPTIONS, heightMin)}
                      className="flex-1"
                      dropdownClassName="max-h-[200px]"
                    />
                    <span className="ml-2 sm:ml-0 font-poppins text-[16px] font-medium text-[#222]">to</span>
                    <DropdownField
                      typeable compact
                      placeholder="Max"
                      value={heightMax}
                      open={heightMaxOpen}
                      setOpen={setHeightMaxOpen}
                      onSelect={(v) => { setHeightMax(v); setHeightError(""); }}
                      items={filterList(HEIGHT_OPTIONS, heightMax)}
                      className="flex-1"
                      dropdownClassName="max-h-[200px]"
                    />
                  </div>
                </FormRow>
              </div>

              {/* Background & lifestyle */}
              <div className={`mt-5 sm:mt-6 md:mt-8 border-t border-[#EAEAEA]`}>
                {lifestyleCollapsible && (

                  <button
                    type="button"
                    onClick={() => setIsLifestyleOpen((o) => !o)}
                    className="w-full flex items-center justify-between gap-2 pt-6 md:pt-7 lg:pt-8 "
                  >
                    <h2 className="font-poppins text-[16x] md:text-[18px] pb-1 md:pb-3 font-medium text-dark leading-[150%] text-left">
                      {isLifestyleOpen ? "Background & lifestyle" : "Background & lifestyle (Optional)"}
                    </h2>
                    <ChevronIcon open={isLifestyleOpen} className="w-4 h-4 "/>
                  </button>
                )}

                {showLifestyleFields && (
                  <div className="divide-y divide-[#EAEAEA]">
                    <FormRow label="Marital history" required className="max-[500px]:py-5 py-4 lg:py-5">
                      <div className="flex flex-wrap max-[500px]:mt-1 mt-3 md:mt-2">
                        <RadioGroup options={[...MARITAL_OPTIONS, "Open to all"]} value={marital} onChange={setMarital} className="max-[370px]:flex-col min-[370px]:max-[500px]:!grid min-[370px]:max-[500px]:grid-cols-2" />
                      </div>
                    </FormRow>
                    <FormRow label="Physical ability" required className="max-[500px]:mt-0 -mt-2 max-[500px]:py-5 py-4 lg:py-5">
                      <div className="flex flex-wrap max-[500px]:mt-1 mt-3 md:mt-2">
                        <RadioGroup options={PHYSICAL_OPTIONS} value={physical} onChange={setPhysical} className="max-[500px]:flex-col" />
                      </div>
                    </FormRow>
                    <FormRow label="Education" required className="max-[500px]:py-5 py-4 lg:py-5">
                      <MultiSelectDropdown
                        placeholder="Select education levels"
                        options={EDUCATION_OPTIONS}
                        selected={eduTags}
                        onChange={setEduTags}
                        open={eduOpen}
                        setOpen={setEduOpen}
                        typeable
                      />
                      <span className="text-[12px] ml-1">Click to edit</span>
                    </FormRow>
                    <FormRow label="Country living in" required className="max-[500px]:py-5 py-4 lg:py-5">
                      <MultiSelectDropdown
                        placeholder="Show all"
                        options={COUNTRY_OPTIONS}
                        selected={countries}
                        onChange={setCountries}
                        open={countryOpen}
                        setOpen={setCountryOpen}
                        showAll
                        typeable
                      />
                      <span className="text-[12px] ml-1">Click to edit</span>
                    </FormRow>
                    <FormRow label="Religion" required className="max-[500px]:mt-0 -mt-2 max-[500px]:py-5 py-4 lg:py-5">
                      <div className="flex flex-wrap max-[500px]:mt-1 mt-3 md:mt-2">
                        <RadioGroup options={RELIGION_PREF} value={religion} onChange={setReligion} className="max-[370px]:flex-col min-[370px]:max-[500px]:gap-x-6" />
                      </div>
                    </FormRow>
                    <FormRow label="Cast or denomination" required className="max-[500px]:py-5 py-4 lg:py-5">
                      <MultiSelectDropdown
                        placeholder="Show all"
                        options={CASTE_OPTIONS}
                        selected={castes}
                        onChange={setCastes}
                        open={casteOpen}
                        setOpen={setCasteOpen}
                        showAll
                        typeable
                      />
                      <span className="text-[12px] ml-1">Click to edit</span>
                    </FormRow>
                    {/* Food/Smoking/Drinking grouped — no dividers between them */}
                    <div>
                      <FormRow label="Food habits" required className="max-[500px]:mt-0 -mt-2 max-[500px]:py-5 py-4 lg:py-5">
                        <div className="flex flex-wrap max-[500px]:mt-1 mt-3 md:mt-2">
                          <RadioGroup options={FOOD_OPTIONS} value={food} onChange={setFood} className="max-[452px]:flex-col min-[452px]:max-[500px]:gap-x-6"/>
                        </div>
                      </FormRow>
                      <FormRow label="Smoking habits" required className="max-[500px]:mt-0 -mt-2 max-[500px]:py-0 py-4 lg:py-5">
                        <div className="flex flex-wrap max-[500px]:mt-1 mt-3 md:mt-2">
                          <RadioGroup options={SMOKING_OPTIONS} value={smoking} onChange={setSmoking} className="max-[370px]:flex-col min-[370px]:max-[500px]:gap-x-6"/>
                        </div>
                      </FormRow>
                      <FormRow label="Drinking habits" required className={`max-[500px]:mt-0 -mt-2 max-[500px]:py-5 py-4 lg:py-5 ${variant === "search" ? "border-b border-[#EAEAEA]" : ""}`}>
                        <div className="flex flex-wrap max-[500px]:mt-1 mt-3 md:mt-2">
                          <RadioGroup options={DRINKING_OPTIONS} value={drinking} onChange={setDrinking} className="max-[370px]:flex-col min-[370px]:max-[500px]:gap-x-6"/>
                        </div>
                      </FormRow>
                    </div>

                    {showAboutPartner && (
                      <div className="pt-6 md:pt-7 lg:pt-8 pb-0 flex flex-col gap-2">
                        <span className="font-poppins text-[16px] font-medium text-dark leading-[150%]">
                          About my partner (optional)
                        </span>
                        <textarea
                          value={aboutPartner}
                          onChange={handleAboutChange}
                          placeholder="Share what genuinely matters to you — values, personality, life goals."
                          className="w-full h-[160px] md:h-[199px] p-3 sm:p-4 rounded-[12px] border border-[#D0D0D0] font-poppins text-[16px] text-dark placeholder:text-[#656565] resize-none outline-none focus:border-[#B31B38] transition-colors"
                        />
                        <div className="text-left font-poppins text-[12px] md:text-[14px] text-secondary4">
                          {wordCount} / {MAX_ABOUT_WORDS}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          {/* Footer — scrolls with body */}
          {showFooter && (
            <div className={`px-2 pb-6 pt-6 md:pt-7 lg:pt-8 flex ${variant === "search" ? "max-[591px]:flex-col" : variant === "onboarding" ? "max-[500px]:flex-col-reverse" : ""} max-[500px]:gap-0 gap-3 md:gap-4`}>
              {variant === "search" ? (
                <>
                  <Button
                    text="Save as partner preference"
                    onPress={handleSearchSave}
                    className="flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                  />
                  <Button
                    text="Search"
                    onPress={handleSearch}
                    iconLeft={<SearchIcon className="w-4 h-4 text-white" />}
                    className="flex-1 max-[500px]:mt-2"
                  />
                </>
              ) : variant === "edit" ? (
                <>
                  <div className="flex-1 mr-4" />
                  <Button text="Save" onPress={handleSave} className="flex-1" />
                </>
              ) : (
                <>
                  <Button
                    text="Skip"
                    onPress={onClose}
                    className="flex-1 max-[500px]:!bg-[#FFF] !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                  />
                  <Button text="Save" onPress={handleSave} className="flex-1" />
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
