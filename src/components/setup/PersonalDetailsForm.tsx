"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import DropdownField from "../common-layout/DropdownField";
import InputBox from "../common-layout/InputBox";
import StepProgress from "../more/StepProgress";
import FormRow from "../common-layout/FormRow";
import FormCardLayout from "../common-layout/FormCardLayout";
import { useLang } from "@/src/context/LangContext";
import {
  EDUCATION_OPTIONS, RELIGION_OPTIONS,
  CASTE_OPTIONS_HINDU,
  CASTE_OPTIONS_CHRISTIAN,
} from "@/src/constants/profiles";
import { COUNTRY_OPTIONS } from "@/src/constants/location";
import { savePersonalDetails } from "../../lib/api/user";

function filterItems(items: string[], query: string) {
  if (!query || items.includes(query)) return items;
  return items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}

type OpenKey = "education" | "religion" | "caste" | "country" | "city" | "citizenship";
const ALL_CLOSED: Record<OpenKey, boolean> = {
  education: false, religion: false, caste: false,
  country: false, city: false, citizenship: false,
};

const STORAGE_KEY = "inai_setup_personal";

export default function PersonalDetailsForm() {
  const router = useRouter();
  const { t } = useLang();

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function getSavedPersonalDetails() {
    if (typeof window === "undefined") return {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  }

  const saved = getSavedPersonalDetails();

  const [education, setEducation] = useState(saved.education ?? "");
  const [occupation, setOccupation] = useState(saved.occupation ?? "");
  const [religion, setReligion] = useState(saved.religion ?? "");
  const [caste, setCaste] = useState(saved.caste ?? "");
  const [country, setCountry] = useState(saved.country ?? "");
  const [city, setCity] = useState(saved.city ?? "");
  const [citizenship, setCitizenship] = useState(saved.citizenship ?? "");

  const setOpen = (key: OpenKey) => (val: boolean) =>
    setOpens({ ...ALL_CLOSED, [key]: val });

  const filtEducation = useMemo(() => filterItems(EDUCATION_OPTIONS, education), [education]);
  const filtReligion = useMemo(() => filterItems(RELIGION_OPTIONS, religion), [religion]);
  const filtCountry = useMemo(() => filterItems(COUNTRY_OPTIONS, country), [country]);
  const filtCitizenship = useMemo(() => filterItems(COUNTRY_OPTIONS, citizenship), [citizenship]);

  const casteOptions = useMemo(() => {
    if (religion === "Hindu") return CASTE_OPTIONS_HINDU;
    if (religion === "Christian") return CASTE_OPTIONS_CHRISTIAN;
    return [];
  }, [religion]);

  const filtCaste = useMemo(
    () => filterItems(casteOptions, caste),
    [casteOptions, caste]
  );

  function persist() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        education, occupation, religion, caste, country, city, citizenship,
      }));
    } catch { /* storage unavailable */ }
  }

  function handleBack() {
    persist();
    router.push("/basic-details");
  }

  function handleDone() {
    const errs: Record<string, string> = {};
    if (!education) errs.education = "*Highest education is required";
    if (!occupation.trim()) errs.occupation = "*Occupation is required";
    if (!religion) errs.religion = "*Religion is required";
    if (!caste) errs.caste = "*Caste or denomination is required";
    if (!country) errs.country = "*Country is required";
    if (!city) errs.city = "*District or city is required";
    if (!citizenship) errs.citizenship = "*Citizenship is required";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    persist();
    router.push("/photo-upload");

    savePersonalDetails({ education, occupation, religion, caste, country, city, citizenship })
      .catch(() => { /* user can re-enter in profile */ });
  }

  return (
    <>
      {/* Mobile: StepProgress fixed at top */}
      <div className="mb-4 min-[500px]:hidden">
        <div className="fixed top-[68px] bg-light left-0 right-0 z-40 px-4 pb-2">
          <StepProgress currentStep={2} />
        </div>
      </div>

      <FormCardLayout
        childrenTopMargin="mt-6 md:mt-8"
        paddingBottom="max-[500px]:pb-0 pb-8 md:pb-10"
        footer={
          <div className="hidden min-[500px]:flex gap-5 w-full">
            <div className="hidden min-[500px]:block flex-1">
              <Button
                text={t("Back")}
                onPress={handleBack}
                className="!w-full !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
              />
            </div>
            <div className="flex-1">
              <Button text={t("Next")} icon={<ArrowRightIcon />} onPress={handleDone} className="!w-full" />
            </div>
          </div>
        }
      >
        {/* Desktop: StepProgress inside card */}
        <div className="hidden min-[500px]:block">
          <StepProgress currentStep={2} />
        </div>

        {/* Title with mobile chevron back */}
        <div className="flex items-start gap-2 mt-6 md:mt-8 lg:mt-10">
          <button
            type="button"
            onClick={handleBack}
            className="min-[500px]:hidden flex items-center justify-center shrink-0"
          >
            <ChevronIcon open={false} className="mt-1 w-5 h-5 rotate-90" />
          </button>
          <h1 className="fonts-24 font-semibold text-dark leading-[150%]">
            {t("Education_Religion_Location")}
          </h1>
        </div>

        <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col max-[500px]:gap-5 gap-6 md:gap-8">

          <FormRow label={t("Highest_education")} align="center" required error={errors.education}>
            <DropdownField
              typeable compact
              placeholder={t("Select_education")}
              value={education}
              open={opens.education}
              setOpen={setOpen("education")}
              onSelect={setEducation}
              items={filtEducation}
              dropdownClassName="max-h-[220px]"
            />
          </FormRow>

          <FormRow label={t("Occupation")} align="center" required error={errors.occupation}>
            <InputBox
              compact
              value={occupation}
              onChange={setOccupation}
              label={t("Enter_job_work")}
            />
          </FormRow>

          <hr className="border-0 border-t border-[#EAEAEA]" />

          <FormRow label={t("Religion")} align="center" required error={errors.religion}>
            <DropdownField
              typeable compact
              placeholder={t("Select_religion")}
              value={religion}
              open={opens.religion}
              setOpen={setOpen("religion")}
              onSelect={(value) => {
                setReligion(value);
                setCaste("");
              }}
              items={filtReligion}
              dropdownClassName="max-h-[220px]"
            />
          </FormRow>

          <FormRow label={t("Caste_or_denomination")} align="center" required error={errors.caste}>
            <DropdownField
              typeable compact
              placeholder={religion ? t("Select_caste") : "Select religion first"}
              value={caste}
              open={opens.caste}
              setOpen={setOpen("caste")}
              onSelect={setCaste}
              items={filtCaste}
              dropdownClassName="max-h-[220px]"
            />
          </FormRow>

          <hr className="border-0 border-t border-[#EAEAEA]" />

          <FormRow label={t("Country_living_in")} align="center" required error={errors.country}>
            <DropdownField
              typeable compact
              placeholder={t("Select_country")}
              value={country}
              open={opens.country}
              setOpen={setOpen("country")}
              onSelect={setCountry}
              items={filtCountry}
              dropdownClassName="max-h-[220px]"
            />
          </FormRow>

          <FormRow label={t("Residing_district_or_city")} align="center" required error={errors.city}>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city or district"
              className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#525252]"
            />
          </FormRow>

          <FormRow label={t("Citizenship")} align="center" required error={errors.citizenship}>
            <DropdownField
              typeable compact
              placeholder={t("Select_citizenship")}
              value={citizenship}
              open={opens.citizenship}
              setOpen={setOpen("citizenship")}
              onSelect={setCitizenship}
              items={filtCitizenship}
              dropdownClassName="max-h-[220px]"
            />
          </FormRow>

        </div>
      </FormCardLayout>

      {/* Mobile fixed bottom button (<500px) */}
      <div
        className="min-[500px]:hidden fixed bottom-0 left-0 right-0 px-4 py-2"
        style={{ background: "rgba(255, 255, 255, 0.60)", backdropFilter: "blur(11px)" }}
      >
        <Button text={t("Next")} onPress={handleDone} className="!w-full" 
        icon={<ArrowRightIcon />}/>
      </div>
    </>
  );
}
