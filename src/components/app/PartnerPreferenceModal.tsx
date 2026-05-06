"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronIcon, RadioCircleIcon, CloseCircleIcon, SearchIcon } from "../../assets/Icons";
import DropdownField, { MultiSelectDropdown } from "../common-layout/DropdownField";
import FormRow from "../common-layout/FormRow";
import Button from "../common-layout/Button";
import ToggleTabs from "../common-layout/ToggleTabs";
import {
  EDUCATION_OPTIONS,
  RELIGION_OPTIONS,
  CASTE_OPTIONS,
  COUNTRY_OPTIONS,
  MARITAL_OPTIONS,
} from "../../constants/profiles";
import { countWords } from "../../utils/wordCount";

// ── Static option lists ───────────────────────────────────────────────────

const AGE_OPTIONS = Array.from({ length: 53 }, (_, i) => String(18 + i));

const HEIGHT_OPTIONS: string[] = (() => {
  const opts: string[] = [];
  for (let ft = 4; ft <= 7; ft++) {
    const max = ft === 7 ? 0 : 11;
    for (let inch = 0; inch <= max; inch++) opts.push(`${ft}'${inch}"`);
  }
  return opts;
})();

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

function PartyIcon() {
  return (
    <span
      className="shrink-0 select-none text-[42px] leading-[1] w-[53.333px] h-[53.333px] rounded-full"
      role="img"
      aria-label="party popper"
    >
      🎉
    </span>
  );
}

function RadioGroup({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 md:gap-5">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)} className="flex items-center gap-2">
          <RadioCircleIcon checked={value === opt} />
          <span className="font-poppins font-16 text-left text-secondary4 leading-[150%]">{opt}</span>
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
  const [activeSearchTab, setActiveSearchTab] = useState<"search" | "advanced">("advanced");
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const wordCount = countWords(aboutPartner);
  if (!isOpen) return null;

  function handleSave() {
    let err = false;
    if (!ageMin || !ageMax) { setAgeError("* Please select age range"); err = true; } else setAgeError("");
    if (!heightMin || !heightMax) { setHeightError("* Please select height range"); err = true; } else setHeightError("");
    if (err) { scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); return; }
    onClose();
  }
  function handleAboutChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (countWords(e.target.value) <= MAX_ABOUT_WORDS) setAboutPartner(e.target.value);
  }
  function filterList(list: string[], q: string) {
    if (!q) return list;
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-[784px] max-h-[90vh] flex flex-col rounded-[20px] bg-light shadow-2xl overflow-hidden">

        {/* Header: onboarding */}
        {variant === "onboarding" && (
          <div className="shrink-0 bg-[#F0F0F0] px-4 md:px-5 lg:px-6 py-4 md:py-5 lg:py-6">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-poppins font-16 font-normal text-dark leading-[150%]">
                  You successfully registered!
                </p>
                <p className="font-poppins font-18 font-medium text-dark leading-[150%]">
                  Tell us what matters to you in a partner &amp; we&apos;ll show your best matches.
                </p>
              </div>
              <PartyIcon />
            </div>
          </div>
        )}

        {/* Header: search or edit */}
        {(variant === "search" || variant === "edit") && (
          <div className="shrink-0 bg-white border-b border-[#EAEAEA] rounded-t-[20px] px-6 pt-4 md:pt-5.5 pb-4 md:pb-5.5 flex items-center gap-4">
            <span className="font-poppins font-24 font-semibold text-[dark leading-[150%] shrink-0">
              {variant === "search" ? "Search" : "Edit partner preference"}
            </span>
            {variant === "search" && (
              <div className="flex-1 flex justify-center">
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
                className="flex items-center rounded-[41px] bg-[#E0E0E0]"
                style={{ padding: "4px 4px 4px 16px" }}
              >
                <span className="flex-1 font-poppins text-base font-normal text-[#656565] leading-[150%]">
                  Search by ID and country
                </span>
                <button
                  type="button"
                  className="flex items-center justify-center h-10 px-4 rounded-full bg-[#B31B38] cursor-pointer"
                >
                  <SearchIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {showSectionHeadings && (
                <h2 className="font-poppins font-18 font-medium text-dark py-6 md:py-7 lg:py-8 leading-[150%]">
                  Age &amp; height range
                </h2>
              )}

              <div className={`flex flex-col gap-6 ${!showSectionHeadings ? "pt-6" : ""}`}>
                {/* Age */}
                <FormRow label="Age" required error={ageError}>
                  <div className="flex flex-col min-[430px]:flex-row items-stretch min-[430px]:items-center gap-2 min-[430px]:gap-4">
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
                    <span className="ml-2 sm:ml-0 font-poppins font-16 font-medium text-dark">to</span>
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
                  <div className="flex flex-col min-[430px]:flex-row items-stretch min-[430px]:items-center gap-2 min-[430px]:gap-4">
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
                    <span className="ml-2 sm:ml-0 font-poppins font-16 font-medium text-[#222]">to</span>
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
              <div className={`mt-3 md:mt-4 lg:mt-5 border-t border-[#EAEAEA]`}>
                {lifestyleCollapsible && (
                  
                  <button
                    type="button"
                    onClick={() => setIsLifestyleOpen((o) => !o)}
                    className="w-full flex items-center justify-between"
                  >
                    <h2 className="font-poppins font-18 pb-1 md:pb-3 pt-6 md:pt-7 lg:pt-8 font-medium text-dark leading-[150%]">
                      {isLifestyleOpen ? "Background & lifestyle" : "Background & lifestyle (Optional)"}
                    </h2>
                    <ChevronIcon open={isLifestyleOpen} />
                  </button>
                )}

                {showLifestyleFields && (
                  <div className="divide-y divide-[#EAEAEA]">
                    <FormRow label="Marital history" required className="py-3 md:py-4 lg:py-5">
                      <div className="flex flex-wrap mt-3 md:mt-2">
                        <RadioGroup options={[...MARITAL_OPTIONS, "Open to all"]} value={marital} onChange={setMarital} />
                      </div>
                    </FormRow>
                    <FormRow label="Physical ability" required className="-mt-2 py-3 md:py-4 lg:py-5">
                      <div className="flex flex-wrap mt-3 md:mt-2">
                        <RadioGroup options={PHYSICAL_OPTIONS} value={physical} onChange={setPhysical} />
                      </div>
                    </FormRow>
                    <FormRow label="Education" required className="py-3 md:py-4 lg:py-5">
                      <MultiSelectDropdown
                        placeholder="Select education levels"
                        options={EDUCATION_OPTIONS}
                        selected={eduTags}
                        onChange={setEduTags}
                        open={eduOpen}
                        setOpen={setEduOpen}
                      />
                      <span className="font-14 ml-1">Click to edit</span>
                    </FormRow>
                    <FormRow label="Country Living In" required className="py-3 md:py-4 lg:py-5">
                      <MultiSelectDropdown
                        placeholder="Show all"
                        options={COUNTRY_OPTIONS}
                        selected={countries}
                        onChange={setCountries}
                        open={countryOpen}
                        setOpen={setCountryOpen}
                        showAll
                      />
                       <span className="font-14 ml-1">Click to edit</span>
                    </FormRow>
                    <FormRow label="Religion" required className="-mt-2 py-3 md:py-4 lg:py-5">
                      <div className="flex flex-wrap mt-3 md:mt-2">
                        <RadioGroup options={RELIGION_PREF} value={religion} onChange={setReligion} />
                      </div>
                    </FormRow>
                    <FormRow label="Cast or denomination" required className="py-3 md:py-4 lg:py-5">
                      <MultiSelectDropdown
                        placeholder="Show all"
                        options={CASTE_OPTIONS}
                        selected={castes}
                        onChange={setCastes}
                        open={casteOpen}
                        setOpen={setCasteOpen}
                        showAll
                      />
                       <span className="font-14 ml-1">Click to edit</span>
                    </FormRow>
                    {/* Food/Smoking/Drinking grouped — no dividers between them */}
                    <div>
                      <FormRow label="Food Habits" required className="-mt-2 py-3 md:py-4 lg:py-5">
                        <div className="flex flex-wrap mt-3 md:mt-2">
                          <RadioGroup options={FOOD_OPTIONS} value={food} onChange={setFood} />
                        </div>
                      </FormRow>
                      <FormRow label="Smoking Habits" required className="-mt-2 py-3 md:py-4 lg:py-5">
                        <div className="flex flex-wrap mt-3 md:mt-2">
                          <RadioGroup options={SMOKING_OPTIONS} value={smoking} onChange={setSmoking} />
                        </div>
                      </FormRow>
                      <FormRow label="Drinking Habits" required className={`-mt-2 py-3 md:py-4 lg:py-5 ${variant === "search" ? "border-b border-[#EAEAEA]" : ""}`}>
                        <div className="flex flex-wrap mt-3 md:mt-2">
                          <RadioGroup options={DRINKING_OPTIONS} value={drinking} onChange={setDrinking} />
                        </div>
                      </FormRow>
                    </div>

                    {showAboutPartner && (
                      <div className="pt-6 md:pt-7 lg:pt-8 pb-6 flex flex-col gap-2">
                        <span className="font-poppins font-16 font-medium text-dark leading-[150%]">
                          About my partner (optional)
                        </span>
                        <textarea
                          value={aboutPartner}
                          onChange={handleAboutChange}
                          placeholder="Share what genuinely matters to you - values, personality, life goals."
                          className="w-full h-[160px] md:h-[199px] p-3 sm:p-4 rounded-[12px] border border-[#D0D0D0] font-poppins font-16 text-dark placeholder:text-[#656565] resize-none outline-none focus:border-[#B31B38] transition-colors"
                        />
                        <div className="text-left font-poppins font-14 text-secondary4">
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
            <div className={`px-2 pb-6 pt-4 md:pt-5 lg:pt-6 flex ${variant === "search" ? "max-[544px]:flex-col" : ""} gap-3 md:gap-4`}>
              {variant === "search" ? (
                <>
                  <Button
                    text="Save as partner preference"
                    onPress={handleSave}
                    className="flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                  />
                  <Button
                    text="Search"
                    onPress={handleSave}
                    iconLeft={<SearchIcon className="w-4 h-4 text-white" />}
                    className="flex-1"
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
                    className="flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
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
