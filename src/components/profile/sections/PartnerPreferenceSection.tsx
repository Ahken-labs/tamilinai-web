"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CloseCircleIcon, RadioCircleIcon, SearchIcon } from "../../../assets/Icons";
import DropdownField, { MultiSelectDropdown } from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import Button from "../../common-layout/Button";
import {
  EDUCATION_OPTIONS,
  RELIGION_OPTIONS,
  CASTE_OPTIONS,
  MARITAL_OPTIONS,
  CASTE_OPTIONS_HINDU,
  CASTE_OPTIONS_CHRISTIAN,
} from "@/src/constants/profiles";
import { COUNTRY_GROUPS } from "@/src/constants/location";
import { filterItems } from "../../../utils/formUtils";
import { countWords } from "../../../utils/wordCount";

const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]"
// Static option lists
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
const RELIGION_CASTE_MAP: Record<string, string[]> = {
  Hindu: CASTE_OPTIONS_HINDU,
  Christian: CASTE_OPTIONS_CHRISTIAN,
};
const MAX_ABOUT_WORDS = 60;

// RadioGroup
function RadioGroup({ options, value, onChange }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 md:gap-5 mt-3 md:mt-2">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)} className="flex items-center gap-2 cursor-pointer">
          <RadioCircleIcon checked={value === opt} />
          <span className="font-16 font-normal text-secondary4 leading-[150%]">{opt}</span>
        </button>
      ))}
    </div>
  );
}

// Shared popup shell 
function SelectionPopup({
  title,
  subtitle,
  onClose,
  children,
  onConfirm,
  confirmLabel,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[16px] bg-white shadow-2xl">

        {/* Fixed header */}
        <div className="shrink-0 px-4 md:px-5 pt-4 md:pt-5 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-24 font-semibold leading-[150%] text-dark">{title}</h2>
              <p className="mt-1 font-16 font-normal leading-[150%] text-dark">{subtitle}</p>
            </div>
            <button type="button" onClick={onClose} className="shrink-0 cursor-pointer" aria-label="Close">
              <CloseCircleIcon />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto border-t border-[#EAEAEA] px-4 md:px-5 py-3 md:py-4">
          {children}
        </div>

        {/* Fixed footer */}
        <div className="flex justify-end gap-4 md:gap-5 border-t border-[#EAEAEA] px-4 md:px-5 py-3 md:py-4 shrink-0">
          <div className="w-full" />
          <Button text={confirmLabel} onPress={onConfirm} className="w-full" />
        </div>

      </div>
    </div>,
    document.body
  );
}

// ── Country popup ─────────────────────────────────────────────────────────────
function CountryPopup({
  initialSelected,
  onClose,
  onConfirm,
}: {
  initialSelected: string[];
  onClose: () => void;
  onConfirm: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState<string[]>(initialSelected);
  const [search, setSearch] = useState("");

  const shownGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRY_GROUPS;
    return COUNTRY_GROUPS
      .map((g) => ({ ...g, items: g.items.filter((item) => item.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [search]);

  function toggle(item: string) {
    setDraft((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]);
  }

  return (
    <SelectionPopup
      title="Partner's Location"
      subtitle="Select the countries where you would like your potential matches to live."
      onClose={onClose}
      onConfirm={() => { onConfirm(draft); onClose(); }}
      confirmLabel="Add countries"
    >
      {draft.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          {draft.map((item) => (
            <button key={item} type="button" onClick={() => toggle(item)}
              className="flex items-center gap-2 rounded-[28px] border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] px-3 py-2.5 cursor-pointer">
              <span className="font-16 font-semibold leading-[125%] text-[#656565]">{item}</span>
              <span className="text-secondary3 text-[16px] leading-none">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-[41px] bg-[#E0E0E0] px-2 py-2">
        <SearchIcon className="h-4 md:h-5 w-4 md:w-5 shrink-0 text-[#525252]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search countries"
          className="flex-1 bg-transparent font-16 font-normal text-[#656565] placeholder:text-[#656565] outline-none" />
        {search && (
          <button type="button" onClick={() => setSearch("")} className="cursor-pointer pr-1">
            <CloseCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <hr className="my-4 border-t border-[#D8D8D8]" />

      <div className="flex flex-col gap-5 md:gap-6">
        {shownGroups.map((group, index) => (
          <div key={group.heading} className="flex flex-col gap-3 md:gap-4">
            <div className="font-16 font-medium leading-[150%] text-dark">{group.heading}</div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {group.items.map((item) => {
                const active = draft.includes(item);
                return (
                  <button key={item} type="button" onClick={() => toggle(item)}
                    className={`rounded-[28px] px-3 py-2.5 font-16 font-normal leading-[125%] transition-colors cursor-pointer ${active
                      ? "border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] text-[#656565]"
                      : "bg-[#F0F0F0] text-[#656565] hover:bg-[#EAEAEA]"
                      }`}>
                    {item}
                  </button>
                );
              })}
            </div>
            {index !== shownGroups.length - 1 && <div className="border-b border-[#D8D8D8]" />}
          </div>
        ))}
      </div>
    </SelectionPopup>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PartnerPreferenceSection() {
  // Age
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [ageMinOpen, setAgeMinOpen] = useState(false);
  const [ageMaxOpen, setAgeMaxOpen] = useState(false);

  // Height
  const [heightMin, setHeightMin] = useState("");
  const [heightMax, setHeightMax] = useState("");
  const [heightMinOpen, setHeightMinOpen] = useState(false);
  const [heightMaxOpen, setHeightMaxOpen] = useState(false);

  // About
  const [aboutPartner, setAboutPartner] = useState("");

  // Background & lifestyle
  const [marital, setMarital] = useState("Unmarried");
  const [physical, setPhysical] = useState("Open to all");
  const [edu, setEdu] = useState<string[]>(EDUCATION_OPTIONS);
  const [eduOpen, setEduOpen] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [countryPopupOpen, setCountryPopupOpen] = useState(false);
  const [religion, setReligion] = useState("Open to all");
  const [castes, setCastes] = useState<string[]>([]);
  const [casteOpen, setCasteOpen] = useState(false);
  const [food, setFood] = useState("Open to all");
  const [smoking, setSmoking] = useState("Open to all");
  const [drinking, setDrinking] = useState("Open to all");

  const wordCount = countWords(aboutPartner);

  const casteOptions = religion === "Open to all"
    ? CASTE_OPTIONS
    : (RELIGION_CASTE_MAP[religion] ?? CASTE_OPTIONS);

  function handleAboutChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (countWords(e.target.value) <= MAX_ABOUT_WORDS) setAboutPartner(e.target.value);
  }

  return (
    <div className="pt-3 md:pt-4">

      {/* Age & height range */}
      <h2 className="font-18 font-medium text-dark leading-[150%] pb-4 md:pb-5">
        Age &amp; height range
      </h2>

      <div className="flex flex-col gap-6">
        <FormRow leftWidth={leftWidth} label="Age" required>
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownField typeable compact placeholder="Min" value={ageMin} open={ageMinOpen} setOpen={setAgeMinOpen}
              onSelect={setAgeMin} items={filterItems(AGE_OPTIONS, ageMin)} className="flex-1" dropdownClassName="max-h-[200px]" />
            <span className="font-16 font-medium text-dark shrink-0">to</span>
            <DropdownField typeable compact placeholder="Max" value={ageMax} open={ageMaxOpen} setOpen={setAgeMaxOpen}
              onSelect={setAgeMax} items={filterItems(AGE_OPTIONS, ageMax)} className="flex-1" dropdownClassName="max-h-[200px]" />
          </div>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Height" required>
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownField typeable compact placeholder="Min" value={heightMin} open={heightMinOpen} setOpen={setHeightMinOpen}
              onSelect={setHeightMin} items={filterItems(HEIGHT_OPTIONS, heightMin)} className="flex-1" dropdownClassName="max-h-[200px]" />
            <span className="font-16 font-medium text-dark shrink-0">to</span>
            <DropdownField typeable compact placeholder="Max" value={heightMax} open={heightMaxOpen} setOpen={setHeightMaxOpen}
              onSelect={setHeightMax} items={filterItems(HEIGHT_OPTIONS, heightMax)} className="flex-1" dropdownClassName="max-h-[200px]" />
          </div>
        </FormRow>
      </div>

      <hr className="my-6 md:my-8 border-t border-[#EAEAEA]" />

      {/* ── About my partner ──────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <span className="font-16 font-medium text-dark leading-[150%]">
          About my partner (optional)
        </span>
        <textarea
          value={aboutPartner}
          onChange={handleAboutChange}
          placeholder="Share what genuinely matters to you — values, personality, life goals."
          className="w-full resize-none outline-none rounded-[12px] border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] pt-4 pb-4 pl-4 pr-0 font-16 font-normal text-dark placeholder:text-[#656565] leading-[150%] focus:border-[#B31B38] transition-colors"
          style={{ height: "126px" }}
        />
        <div className="font-14 text-secondary4">{wordCount} / {MAX_ABOUT_WORDS}</div>
      </div>

      <hr className="my-6 md:my-8 border-t border-[#EAEAEA]" />

      {/* ── Background & lifestyle ────────────────────────────────── */}
      <h2 className="font-18 font-medium text-dark leading-[150%]">
        Background &amp; lifestyle
      </h2>

      <div className="divide-y divide-[#EAEAEA]">

        <FormRow leftWidth={leftWidth} label="Marital history" required className="py-4 md:py-5">
          <RadioGroup options={[...MARITAL_OPTIONS, "Open to all"]} value={marital} onChange={setMarital} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Physical status" required className="py-4 md:py-5">
          <RadioGroup options={PHYSICAL_OPTIONS} value={physical} onChange={setPhysical} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Education" required className="py-4 md:py-5">
          <MultiSelectDropdown
            placeholder="Select education levels"
            options={EDUCATION_OPTIONS}
            selected={edu}
            onChange={setEdu}
            open={eduOpen}
            setOpen={setEduOpen}
            showAll
            typeable
          />
          <span className="font-14 ml-1 text-secondary4">Click to edit</span>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Country living in" required className="py-4 md:py-5">
          <MultiSelectDropdown
            placeholder="Show all"
            options={countries}
            selected={countries}
            onChange={setCountries}
            open={false}
            setOpen={() => setCountryPopupOpen(true)}
            showAll
          />
          <span className="font-14 ml-1 text-secondary4">Click to edit</span>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Religion" required className="py-4 md:py-5">
          <RadioGroup options={RELIGION_PREF} value={religion} onChange={setReligion} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Cast or denomination" required className="py-4 md:py-5">
          <MultiSelectDropdown
            placeholder="Show all"
            options={casteOptions}
            selected={castes}
            onChange={setCastes}
            open={casteOpen}
            setOpen={setCasteOpen}
            showAll
          />
          <span className="font-14 ml-1 text-secondary4">Click to edit</span>
        </FormRow>

        <div>
          <FormRow leftWidth={leftWidth} label="Food habits" required className="py-4 md:py-5">
            <RadioGroup options={FOOD_OPTIONS} value={food} onChange={setFood} />
          </FormRow>
          <FormRow leftWidth={leftWidth} label="Smoking habits" required className="py-4 md:py-5">
            <RadioGroup options={SMOKING_OPTIONS} value={smoking} onChange={setSmoking} />
          </FormRow>
          <FormRow leftWidth={leftWidth} label="Drinking habits" required className="py-4 md:py-5">
            <RadioGroup options={DRINKING_OPTIONS} value={drinking} onChange={setDrinking} />
          </FormRow>
        </div>

      </div>

      {/* Popups */}
      {countryPopupOpen && (
        <CountryPopup
          initialSelected={countries}
          onClose={() => setCountryPopupOpen(false)}
          onConfirm={setCountries}
        />
      )}
    </div>
  );
}
