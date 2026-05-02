"use client";

import { useEffect, useState } from "react";
import { ChevronIcon, RadioCircleIcon } from "../../assets/Icons";
import DropdownField, { MultiSelectDropdown } from "../common/DropdownField";
import FormRow from "../more/FormRow";
import Button from "../common/Button";
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

interface Props { isOpen: boolean; onClose: () => void; }

export default function PartnerPreferenceModal({ isOpen, onClose }: Props) {
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

  const [isLifestyleOpen, setIsLifestyleOpen] = useState(false);
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
  function handleAboutChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (countWords(e.target.value) <= MAX_ABOUT_WORDS) setAboutPartner(e.target.value);
  }
  function filterList(list: string[], q: string) {
    if (!q) return list;
    return list.filter((s) => s.toLowerCase().includes(q.toLowerCase()));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-[784px] max-h-[90vh] flex flex-col rounded-[20px] bg-light shadow-2xl overflow-hidden">

        {/* Header */}
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-5 lg:px-6">
          <h2 className="font-poppins font-18 font-medium text-dark py-6 md:py-7 lg:py-8 leading-[150%]">
            Age &amp; height range
          </h2>

          <div className="flex flex-col gap-6">
            {/* Age */}
            <FormRow label="Age" required >
              <div className="flex flex-col min-[430px]:flex-row items-stretch min-[430px]:items-center gap-2 min-[430px]:gap-4">
                <DropdownField
                  typeable compact
                  placeholder="Min"
                  value={ageMin}
                  open={ageMinOpen}
                  setOpen={setAgeMinOpen}
                  onSelect={setAgeMin}
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
                  onSelect={setAgeMax}
                  items={filterList(AGE_OPTIONS, ageMax)}
                  className="flex-1"
                  dropdownClassName="max-h-[200px]"
                />
              </div>
            </FormRow>

            {/* Height */}
            <FormRow label="Height" required >
              <div className="flex flex-col min-[430px]:flex-row items-stretch min-[430px]:items-center gap-2 min-[430px]:gap-4">
                <DropdownField
                  typeable compact
                  placeholder="Min"
                  value={heightMin}
                  open={heightMinOpen}
                  setOpen={setHeightMinOpen}
                  onSelect={setHeightMin}
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
                  onSelect={setHeightMax}
                  items={filterList(HEIGHT_OPTIONS, heightMax)}
                  className="flex-1"
                  dropdownClassName="max-h-[200px]"
                />
              </div>
            </FormRow>
          </div>

          {/* Background & lifestyle */}
          <div className="mt-6 md:mt-7 lg:mt-8">
            <button
              type="button"
              onClick={() => setIsLifestyleOpen((o) => !o)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="font-poppins font-18 font-medium text-dark leading-[150%]">
                {isLifestyleOpen ? "Background & lifestyle" : "Background & lifestyle (Optional)"}
              </h2>
              <ChevronIcon open={isLifestyleOpen} />
            </button>

            {isLifestyleOpen && (
              <div className="divide-y gap:8 divide-[#EAEAEA]">
                <FormRow label="Marital history" required className="py-6 md:py-7 lg:py-8">
                  <div className="flex flex-wrap mt-3 md:mt-2">
                    <RadioGroup options={[...MARITAL_OPTIONS, "Open to all"]} value={marital} onChange={setMarital} />
                  </div>
                </FormRow>
                <FormRow label="Physical ability" required className="-mt-2 py-6 md:py-7 lg:py-8">
                  <div className="flex flex-wrap mt-3 md:mt-2">
                    <RadioGroup options={PHYSICAL_OPTIONS} value={physical} onChange={setPhysical} />
                  </div>
                </FormRow>
                <FormRow label="Education" required className="py-6 md:py-7 lg:py-8">
                  <MultiSelectDropdown
                    placeholder="Select education levels"
                    options={EDUCATION_OPTIONS}
                    selected={eduTags}
                    onChange={setEduTags}
                    open={eduOpen}
                    setOpen={setEduOpen}
                  />
                </FormRow>
                <FormRow label="Country Living In" required className="py-6 md:py-7 lg:py-8">
                  <MultiSelectDropdown
                    placeholder="Show all"
                    options={COUNTRY_OPTIONS}
                    selected={countries}
                    onChange={setCountries}
                    open={countryOpen}
                    setOpen={setCountryOpen}
                    showAll
                  />
                </FormRow>
                <FormRow label="Religion" required className="-mt-2 py-6 md:py-7 lg:py-8">
                  <div className="flex flex-wrap mt-3 md:mt-2">
                    <RadioGroup options={RELIGION_PREF} value={religion} onChange={setReligion} />
                  </div>
                </FormRow>
                <FormRow label="Cast or denomination" required className="py-6 md:py-7 lg:py-8">
                  <MultiSelectDropdown
                    placeholder="Show all"
                    options={CASTE_OPTIONS}
                    selected={castes}
                    onChange={setCastes}
                    open={casteOpen}
                    setOpen={setCasteOpen}
                    showAll
                  />
                </FormRow>
                <FormRow label="Food Habits" required className="-mt-2 py-6 md:py-7 lg:py-8">
                  <div className="flex flex-wrap mt-3 md:mt-2">
                    <RadioGroup options={FOOD_OPTIONS} value={food} onChange={setFood} />
                  </div>
                </FormRow>
                <FormRow label="Smoking Habits" required className="-mt-2 py-6 md:py-7 lg:py-8">
                  <div className="flex flex-wrap mt-3 md:mt-2">
                    <RadioGroup options={SMOKING_OPTIONS} value={smoking} onChange={setSmoking} />
                  </div>
                </FormRow>
                <FormRow label="Drinking Habits" required className="-mt-2 py-6 md:py-7 lg:py-8">
                  <div className="flex flex-wrap mt-3 md:mt-2">
                    <RadioGroup options={DRINKING_OPTIONS} value={drinking} onChange={setDrinking} />
                  </div>
                </FormRow>
                <div className="pt-6 md:pt-7 lg:pt-8 flex flex-col gap-2">
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
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 pb-6 pt-6 md:pt-7 lg:pt-8 flex gap-3 md:gap-4">
          <Button
            text="Skip"
            onPress={onClose}
            className="flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
          />
          <Button
            text="Save"
            onPress={onClose}
            className="flex-1"
          />
        </div>

      </div>
    </div>
  );
}
