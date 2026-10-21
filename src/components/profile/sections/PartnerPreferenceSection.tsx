"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { RadioCircleIcon } from "../../../assets/Icons";
import DropdownField, { MultiSelectDropdown } from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import Button from "../../common-layout/Button";
import CountryPopup from "../../ui/CountryPopup";
import {
  EDUCATION_OPTIONS,
  RELIGION_OPTIONS,
  CASTE_OPTIONS,
  MARITAL_OPTIONS,
  CASTE_OPTIONS_HINDU,
  CASTE_OPTIONS_CHRISTIAN,
} from "@/src/constants/profiles";
import { filterItems } from "../../../utils/formUtils";
import { countWords } from "../../../utils/wordCount";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";
import type { PartnerPreferences } from "@/src/types/user";
import { useLoadingText } from "../../../hooks/useLoadingText";

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

// Section display format (the sessionStorage draft) → API format. Reverse of
// convertApiToDisplay, mirroring PartnerPreferenceModal.buildPayload. The draft may only
// hold the fields the user touched, so only keys present in it are sent — the API leaves
// the rest unchanged. Empty age/height → null ("no preference").
export function convertDisplayToApi(draft: Record<string, unknown>): PartnerPreferences {
  const p: PartnerPreferences = {};
  const has = (k: string) => k in draft;
  const num = (v: unknown) => {
    const n = parseInt(String(v ?? ""), 10);
    return Number.isFinite(n) ? n : null;
  };
  const one = (v: unknown) => [String(v)];
  const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

  if (has("ageMin")) p.ageMin = num(draft.ageMin);
  if (has("ageMax")) p.ageMax = num(draft.ageMax);
  if (has("heightMin")) p.heightMinCm = num(draft.heightMin);
  if (has("heightMax")) p.heightMaxCm = num(draft.heightMax);
  if (has("marital")) p.maritalStatuses = one(draft.marital);
  if (has("physical")) p.physicalStatuses = one(draft.physical);
  if (has("religion")) p.religions = one(draft.religion);
  if (has("food")) p.foodHabits = one(draft.food);
  if (has("smoking")) p.smokingHabits = one(draft.smoking);
  if (has("drinking")) p.drinkingHabits = one(draft.drinking);
  // null = "show all"; subset = user's selection
  if (has("edu")) {
    const edu = list(draft.edu);
    p.educationLevels = edu.length && edu.length < EDUCATION_OPTIONS.length ? edu : null;
  }
  if (has("countries")) p.countries = list(draft.countries).length ? list(draft.countries) : null;
  if (has("castes")) p.castes = list(draft.castes).length ? list(draft.castes) : null;
  if (has("aboutPartner")) p.aboutPartner = String(draft.aboutPartner ?? "");
  return p;
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
    <div className="flex max-[370px]:flex-col flex-wrap gap-4 max-[370px]:gap-3 md:gap-5 mt-3 md:mt-2">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)} className="flex items-center gap-2 cursor-pointer">
          <RadioCircleIcon checked={value === opt} />
          <span className="text-[16px] font-normal text-secondary4 leading-[150%]">{opt}</span>
        </button>
      ))}
    </div>
  );
}


// Called as a useState lazy initializer. Only safe after mount — see PartnerPreferenceSection.
function getInitialDraft(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  return getDraft() ?? {};
}

type SectionProps = { onDirty?: () => void; onSave?: () => Promise<void> };

// The section is server-rendered (collapsed, not unmounted), and its initial values come
// from sessionStorage, which the server can't see. Render the form only after mount so
// the first client render matches the server HTML instead of causing a hydration error.
export default function PartnerPreferenceSection(props: SectionProps) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  return mounted ? <PartnerPreferenceForm {...props} /> : null;
}

function PartnerPreferenceForm({ onDirty, onSave }: SectionProps) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const [saving, setSaving] = useState(false);
  const [saveReady, setSaveReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const loadingText = useLoadingText(saving, "save");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveReady(true);
    try { if (sessionStorage.getItem(KEY)) setDirty(true); } catch {}
  }, []);

  const sync = (partial: Record<string, unknown>) => {
    mergeDraft(partial, onDirty ?? (() => {}));
    setDirty(true);
  };

  async function handleSave() {
    if (saving || !onSave) return;
    setSaving(true);
    try { await onSave(); } finally { setSaving(false); }
  }

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
      <h2 className="text-[16px] md:text-[18px] font-medium text-dark leading-[150%] pb-4 md:pb-5">Age &amp; height range</h2>

      <div className="flex flex-col gap-6">
        <FormRow leftWidth={leftWidth} label="Age" required>
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownField typeable numberOnly compact placeholder="Min" value={ageMin} open={ageMinOpen} setOpen={setAgeMinOpen}
              onSelect={v => { setAgeMin(v); sync({ ageMin: v }); }} items={filterItems(AGE_OPTIONS, ageMin)} className="flex-1" dropdownClassName="max-h-[200px]" bgClassName={mounted && ageMin ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && ageMin ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && ageMin ? "text-[#222222]" : "text-[#656565]"} />
            <span className="text-[16px] font-medium text-dark shrink-0">to</span>
            <DropdownField typeable numberOnly compact placeholder="Max" value={ageMax} open={ageMaxOpen} setOpen={setAgeMaxOpen}
              onSelect={v => { setAgeMax(v); sync({ ageMax: v }); }} items={filterItems(AGE_OPTIONS, ageMax)} className="flex-1" dropdownClassName="max-h-[200px]" bgClassName={mounted && ageMax ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && ageMax ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && ageMax ? "text-[#222222]" : "text-[#656565]"} />
          </div>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Height" required>
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownField typeable compact placeholder="Min cm" value={heightMin} open={heightMinOpen} setOpen={setHeightMinOpen}
              onSelect={v => { setHeightMin(v); sync({ heightMin: v }); }} items={filterItems(HEIGHT_OPTIONS, heightMin)} className="flex-1" dropdownClassName="max-h-[200px]" bgClassName={mounted && heightMin ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && heightMin ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && heightMin ? "text-[#222222]" : "text-[#656565]"} />
            <span className="text-[16px] font-medium text-dark shrink-0">to</span>
            <DropdownField typeable compact placeholder="Max cm" value={heightMax} open={heightMaxOpen} setOpen={setHeightMaxOpen}
              onSelect={v => { setHeightMax(v); sync({ heightMax: v }); }} items={filterItems(HEIGHT_OPTIONS, heightMax)} className="flex-1" dropdownClassName="max-h-[200px]" bgClassName={mounted && heightMax ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && heightMax ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && heightMax ? "text-[#222222]" : "text-[#656565]"} />
          </div>
        </FormRow>
      </div>

      <hr className="my-6 md:my-8 border-t border-[#EAEAEA]" />

      <div className="flex flex-col gap-2">
        <span className="text-[16px] md:text-[18px] font-medium text-dark leading-[150%]">About my partner (optional)</span>
        <textarea
          value={aboutPartner}
          onChange={handleAboutChange}
          placeholder="Share what genuinely matters to you — values, personality, life goals."
          className={`w-full resize-none outline-none rounded-[12px] border pt-4 pb-4 pl-4 pr-0 text-[14px] sm:text-[15px] md:text-[16px] font-normal text-dark placeholder:text-[#656565] leading-[150%] focus:border-[#B31B38] transition-colors ${mounted && aboutPartner ? "border-[#F2F2F2] bg-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)] bg-[#FFF0F3]"}`}
          style={{ height: "126px" }}
        />
        <div className="text-[14px] text-secondary4">{wordCount} / {MAX_ABOUT_WORDS}</div>
      </div>

      <hr className="my-6 md:my-8 border-t border-[#EAEAEA]" />

      <h2 className="text-[16px] md:text-[18px] font-medium text-dark leading-[150%]">Background &amp; lifestyle</h2>

      <div className="divide-y divide-[#EAEAEA]">
        <FormRow leftWidth={leftWidth} label="Marital history" required className="py-4 md:py-5">
          <div className="max-[500px]:mt-[-10px]">
          <RadioGroup options={[...MARITAL_OPTIONS, "Open to all"]} value={marital} onChange={v => { setMarital(v); sync({ marital: v }); }} />
            </div>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Physical status" required className="py-4 md:py-5">
          <div className="max-[500px]:mt-[-10px]">
          <RadioGroup options={PHYSICAL_OPTIONS} value={physical} onChange={v => { setPhysical(v); sync({ physical: v }); }} />
            </div>
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
          <span className="text-[14px] ml-1 text-secondary4">Click to edit</span>
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
          <span className="text-[14px] ml-1 text-secondary4">Click to edit</span>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Religion" required className="py-4 md:py-5">
          <div className="max-[500px]:mt-[-10px]">
          <RadioGroup options={RELIGION_PREF} value={religion} onChange={v => { setReligion(v); sync({ religion: v }); }} />
            </div>
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
          <span className="text-[14px] ml-1 text-secondary4">Click to edit</span>
        </FormRow>

        <div>
          <FormRow leftWidth={leftWidth} label="Food habits" required className="py-4 md:py-5">
            <div className="max-[500px]:mt-[-10px]">
            <RadioGroup options={FOOD_OPTIONS} value={food} onChange={v => { setFood(v); sync({ food: v }); }} />
              </div>
          </FormRow>
          <FormRow leftWidth={leftWidth} label="Smoking habits" required className="py-4 md:py-5">
            <div className="max-[500px]:mt-[-10px]">
            <RadioGroup options={SMOKING_OPTIONS} value={smoking} onChange={v => { setSmoking(v); sync({ smoking: v }); }} />
              </div>
          </FormRow>
          <FormRow leftWidth={leftWidth} label="Drinking habits" required className="py-4 md:py-5">
            <div className="max-[500px]:mt-[-10px]">
            <RadioGroup options={DRINKING_OPTIONS} value={drinking} onChange={v => { setDrinking(v); sync({ drinking: v }); }} />
              </div>
          </FormRow>
        </div>
      </div>

      {saveReady && dirty && (
        <div className="mt-6 md:mt-8 pt-4 border-t border-[#EAEAEA]">
          <div className="flex">
            <div className="flex-1 hidden min-[500px]:block" />
            <Button text={saving ? loadingText : "Save"} onPress={handleSave} className="flex-1" />
          </div>
        </div>
      )}

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
