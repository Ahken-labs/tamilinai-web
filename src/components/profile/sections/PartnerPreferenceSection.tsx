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
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";
import type { PartnerPreferences } from "@/src/types/user";

const KEY = DRAFT_KEYS.partner;
const MODAL_CACHE_KEY = "inai_partner_pref";

// Convert API-format prefs (saved by modal or fetched from backend) → section display format
function convertApiToDisplay(prefs: PartnerPreferences): Record<string, unknown> {
  return {
    ageMin: prefs.ageMin ? String(prefs.ageMin) : "",
    ageMax: prefs.ageMax ? String(prefs.ageMax) : "",
    heightMin: prefs.heightMinCm ? `${prefs.heightMinCm} cm` : "",
    heightMax: prefs.heightMaxCm ? `${prefs.heightMaxCm} cm` : "",
    marital: prefs.maritalStatuses?.[0] ?? "Unmarried",
    physical: prefs.physicalStatuses?.[0] ?? "Open to all",
    edu: prefs.educationLevels?.length ? prefs.educationLevels : EDUCATION_OPTIONS,
    countries: prefs.countries ?? [],
    religion: prefs.religions?.[0] ?? "Open to all",
    castes: prefs.castes ?? [],
    food: prefs.foodHabits?.[0] ?? "Open to all",
    smoking: prefs.smokingHabits?.[0] ?? "Open to all",
    drinking: prefs.drinkingHabits?.[0] ?? "Open to all",
    aboutPartner: prefs.aboutPartner ?? "",
  };
}

function getDraft() {
  try {
    // 1. Section's own draft (unsaved edits take priority)
    const r = sessionStorage.getItem(KEY);
    if (r) return JSON.parse(r);
    // 2. Fall back to what the modal saved (onboarding / search popup)
    const modal = sessionStorage.getItem(MODAL_CACHE_KEY);
    if (modal) {
      const parsed = JSON.parse(modal) as { data?: PartnerPreferences; expiresAt?: number } | PartnerPreferences;
      const prefs = ('expiresAt' in parsed && parsed.data) ? parsed.data : parsed as PartnerPreferences;
      return convertApiToDisplay(prefs);
    }
    return null;
  } catch { return null; }
}

function mergeDraft(partial: Record<string, unknown>, onDirty: () => void) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ...getDraft(), ...partial })); onDirty(); } catch {}
}

const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";
const AGE_OPTIONS = Array.from({ length: 53 }, (_, i) => String(18 + i));
const HEIGHT_OPTIONS: string[] = Array.from({ length: 81 }, (_, i) => `${140 + i} cm`);
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

function RadioGroup({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
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

function SelectionPopup({ title, subtitle, onClose, children, onConfirm, confirmLabel }: {
  title: string; subtitle: string; onClose: () => void;
  children: React.ReactNode; onConfirm: () => void; confirmLabel: string;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[16px] bg-white shadow-2xl">
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
        <div className="flex-1 overflow-y-auto border-t border-[#EAEAEA] px-4 md:px-5 py-3 md:py-4">
          {children}
        </div>
        <div className="flex justify-end gap-4 md:gap-5 border-t border-[#EAEAEA] px-4 md:px-5 py-3 md:py-4 shrink-0">
          <div className="w-full" />
          <Button text={confirmLabel} onPress={onConfirm} className="w-full" />
        </div>
      </div>
    </div>,
    document.body
  );
}

function CountryPopup({ initialSelected, onClose, onConfirm }: {
  initialSelected: string[]; onClose: () => void; onConfirm: (items: string[]) => void;
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
                      : "bg-[#F0F0F0] text-[#656565] hover:bg-[#EAEAEA]"}`}>
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

// Called as a useState lazy initializer — only runs on first client render.
// Safe because PartnerPreferenceSection only ever mounts client-side ({open && body}).
function getInitialDraft(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  return getDraft() ?? {};
}

export default function PartnerPreferenceSection({ onDirty }: { onDirty?: () => void }) {
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty ?? (() => {}));

  // useState(fn) — fn runs once on mount, reads sessionStorage on the client
  const [init] = useState(getInitialDraft);

  const [ageMin, setAgeMin] = useState<string>((init.ageMin as string) ?? "");
  const [ageMax, setAgeMax] = useState<string>((init.ageMax as string) ?? "");
  const [ageMinOpen, setAgeMinOpen] = useState(false);
  const [ageMaxOpen, setAgeMaxOpen] = useState(false);

  const [heightMin, setHeightMin] = useState<string>((init.heightMin as string) ?? "");
  const [heightMax, setHeightMax] = useState<string>((init.heightMax as string) ?? "");
  const [heightMinOpen, setHeightMinOpen] = useState(false);
  const [heightMaxOpen, setHeightMaxOpen] = useState(false);

  const [aboutPartner, setAboutPartner] = useState<string>((init.aboutPartner as string) ?? "");
  const [marital, setMarital] = useState<string>((init.marital as string) || "Unmarried");
  const [physical, setPhysical] = useState<string>((init.physical as string) || "Open to all");
  const [edu, setEdu] = useState<string[]>(Array.isArray(init.edu) && (init.edu as string[]).length ? (init.edu as string[]) : EDUCATION_OPTIONS);
  const [eduOpen, setEduOpen] = useState(false);
  const [countries, setCountries] = useState<string[]>(Array.isArray(init.countries) ? (init.countries as string[]) : []);
  const [countryPopupOpen, setCountryPopupOpen] = useState(false);
  const [religion, setReligion] = useState<string>((init.religion as string) || "Open to all");
  const [castes, setCastes] = useState<string[]>(Array.isArray(init.castes) ? (init.castes as string[]) : []);
  const [casteOpen, setCasteOpen] = useState(false);
  const [food, setFood] = useState<string>((init.food as string) || "Open to all");
  const [smoking, setSmoking] = useState<string>((init.smoking as string) || "Open to all");
  const [drinking, setDrinking] = useState<string>((init.drinking as string) || "Open to all");

  const wordCount = countWords(aboutPartner);
  const casteOptions = religion === "Open to all" ? CASTE_OPTIONS : (RELIGION_CASTE_MAP[religion] ?? CASTE_OPTIONS);

  function handleAboutChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (countWords(e.target.value) <= MAX_ABOUT_WORDS) {
      setAboutPartner(e.target.value);
      sync({ aboutPartner: e.target.value });
    }
  }

  return (
    <div className="pt-3 md:pt-4">
      <h2 className="font-18 font-medium text-dark leading-[150%] pb-4 md:pb-5">Age &amp; height range</h2>

      <div className="flex flex-col gap-6">
        <FormRow leftWidth={leftWidth} label="Age" required>
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownField typeable compact placeholder="Min" value={ageMin} open={ageMinOpen} setOpen={setAgeMinOpen}
              onSelect={v => { setAgeMin(v); sync({ ageMin: v }); }} items={filterItems(AGE_OPTIONS, ageMin)} className="flex-1" dropdownClassName="max-h-[200px]" />
            <span className="font-16 font-medium text-dark shrink-0">to</span>
            <DropdownField typeable compact placeholder="Max" value={ageMax} open={ageMaxOpen} setOpen={setAgeMaxOpen}
              onSelect={v => { setAgeMax(v); sync({ ageMax: v }); }} items={filterItems(AGE_OPTIONS, ageMax)} className="flex-1" dropdownClassName="max-h-[200px]" />
          </div>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Height" required>
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownField typeable compact placeholder="Min cm" value={heightMin} open={heightMinOpen} setOpen={setHeightMinOpen}
              onSelect={v => { setHeightMin(v); sync({ heightMin: v }); }} items={filterItems(HEIGHT_OPTIONS, heightMin)} className="flex-1" dropdownClassName="max-h-[200px]" />
            <span className="font-16 font-medium text-dark shrink-0">to</span>
            <DropdownField typeable compact placeholder="Max cm" value={heightMax} open={heightMaxOpen} setOpen={setHeightMaxOpen}
              onSelect={v => { setHeightMax(v); sync({ heightMax: v }); }} items={filterItems(HEIGHT_OPTIONS, heightMax)} className="flex-1" dropdownClassName="max-h-[200px]" />
          </div>
        </FormRow>
      </div>

      <hr className="my-6 md:my-8 border-t border-[#EAEAEA]" />

      <div className="flex flex-col gap-2">
        <span className="font-16 font-medium text-dark leading-[150%]">About my partner (optional)</span>
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

      <h2 className="font-18 font-medium text-dark leading-[150%]">Background &amp; lifestyle</h2>

      <div className="divide-y divide-[#EAEAEA]">
        <FormRow leftWidth={leftWidth} label="Marital history" required className="py-4 md:py-5">
          <RadioGroup options={[...MARITAL_OPTIONS, "Open to all"]} value={marital} onChange={v => { setMarital(v); sync({ marital: v }); }} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Physical status" required className="py-4 md:py-5">
          <RadioGroup options={PHYSICAL_OPTIONS} value={physical} onChange={v => { setPhysical(v); sync({ physical: v }); }} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Education" required className="py-4 md:py-5">
          <MultiSelectDropdown
            placeholder="Select education levels"
            options={EDUCATION_OPTIONS}
            selected={edu}
            onChange={v => { setEdu(v); sync({ edu: v }); }}
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
            onChange={v => { setCountries(v); sync({ countries: v }); }}
            open={false}
            setOpen={() => setCountryPopupOpen(true)}
            showAll
          />
          <span className="font-14 ml-1 text-secondary4">Click to edit</span>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Religion" required className="py-4 md:py-5">
          <RadioGroup options={RELIGION_PREF} value={religion} onChange={v => { setReligion(v); sync({ religion: v }); }} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Cast or denomination" required className="py-4 md:py-5">
          <MultiSelectDropdown
            placeholder="Show all"
            options={casteOptions}
            selected={castes}
            onChange={v => { setCastes(v); sync({ castes: v }); }}
            open={casteOpen}
            setOpen={setCasteOpen}
            showAll
          />
          <span className="font-14 ml-1 text-secondary4">Click to edit</span>
        </FormRow>

        <div>
          <FormRow leftWidth={leftWidth} label="Food habits" required className="py-4 md:py-5">
            <RadioGroup options={FOOD_OPTIONS} value={food} onChange={v => { setFood(v); sync({ food: v }); }} />
          </FormRow>
          <FormRow leftWidth={leftWidth} label="Smoking habits" required className="py-4 md:py-5">
            <RadioGroup options={SMOKING_OPTIONS} value={smoking} onChange={v => { setSmoking(v); sync({ smoking: v }); }} />
          </FormRow>
          <FormRow leftWidth={leftWidth} label="Drinking habits" required className="py-4 md:py-5">
            <RadioGroup options={DRINKING_OPTIONS} value={drinking} onChange={v => { setDrinking(v); sync({ drinking: v }); }} />
          </FormRow>
        </div>
      </div>

      {countryPopupOpen && (
        <CountryPopup
          initialSelected={countries}
          onClose={() => setCountryPopupOpen(false)}
          onConfirm={v => { setCountries(v); sync({ countries: v }); }}
        />
      )}
    </div>
  );
}
