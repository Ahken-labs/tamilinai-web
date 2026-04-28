"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../common/Button";
import DropdownField from "../common/DropdownField";
import InputBox from "../common/InputBox";
import StepProgress from "../common/StepProgress";
import FormRow from "../more/FormRow";
import FormCardLayout from "../common/FormCardLayout";
import { useLang } from "@/src/context/LangContext";
import {
  EDUCATION_OPTIONS,
  RELIGION_OPTIONS,
  CASTE_OPTIONS,
  COUNTRY_OPTIONS,
  CITY_OPTIONS,
  CITIZENSHIP_OPTIONS,
} from "@/src/constants/profiles";

function filterItems(items: string[], query: string) {
  if (!query || items.includes(query)) return items;
  return items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}

type OpenKey = "education" | "religion" | "caste" | "country" | "city" | "citizenship";
const ALL_CLOSED: Record<OpenKey, boolean> = {
  education: false, religion: false, caste: false,
  country: false,   city: false,     citizenship: false,
};

const STORAGE_KEY = "tamilinai_personal";

export default function PersonalDetailsForm() {
  const router = useRouter();
  const { t } = useLang();

  const [education,   setEducation]   = useState("");
  const [occupation,  setOccupation]  = useState("");
  const [religion,    setReligion]    = useState("");
  const [caste,       setCaste]       = useState("");
  const [country,     setCountry]     = useState("");
  const [city,        setCity]        = useState("");
  const [citizenship, setCitizenship] = useState("");

  const [opens,  setOpens]  = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Restore saved values when returning to this step.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, string>;
      if (d.education)   setEducation(d.education);
      if (d.occupation)  setOccupation(d.occupation);
      if (d.religion)    setReligion(d.religion);
      if (d.caste)       setCaste(d.caste);
      if (d.country)     setCountry(d.country);
      if (d.city)        setCity(d.city);
      if (d.citizenship) setCitizenship(d.citizenship);
    } catch { /* ignore malformed storage */ }
  }, []);

  const setOpen = (key: OpenKey) => (val: boolean) =>
    setOpens({ ...ALL_CLOSED, [key]: val });

  // ── Filtered dropdown items ───────────────────────────────────────
  const filtEducation   = useMemo(() => filterItems(EDUCATION_OPTIONS,   education),   [education]);
  const filtReligion    = useMemo(() => filterItems(RELIGION_OPTIONS,    religion),    [religion]);
  const filtCaste       = useMemo(() => filterItems(CASTE_OPTIONS,       caste),       [caste]);
  const filtCountry     = useMemo(() => filterItems(COUNTRY_OPTIONS,     country),     [country]);
  const filtCity        = useMemo(() => filterItems(CITY_OPTIONS,        city),        [city]);
  const filtCitizenship = useMemo(() => filterItems(CITIZENSHIP_OPTIONS, citizenship), [citizenship]);

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
    if (!education)          errs.education   = "*Highest education is required";
    if (!occupation.trim())  errs.occupation  = "*Occupation is required";
    if (!religion)           errs.religion    = "*Religion is required";
    if (!caste)              errs.caste       = "*Caste or denomination is required";
    if (!country)            errs.country     = "*Country is required";
    if (!city)               errs.city        = "*District or city is required";
    if (!citizenship)        errs.citizenship = "*Citizenship is required";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    persist();
    router.push("/photo-upload");
  }

  return (
    <FormCardLayout 
      childrenTopMargin="mt-6 md:mt-8"
      footer={
        <div className="flex gap-5 w-full">
          <Button
            text={t("Back")}
            onPress={handleBack}
            className="flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
          />
          <Button
            text={t("Done")}
            onPress={handleDone}
            className="flex-1"
          />
        </div>
      }
    >
      <StepProgress currentStep={2} />

      <h1 className="mt-6 md:mt-8 lg:mt-10 font-24 font-semibold text-dark leading-[150%]">
        {t("Education_Religion_Location")}
      </h1>

      <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col gap-6 md:gap-8">

        {/* ── Education & Occupation ─────────────────────────────── */}

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

        <FormRow label={t("Occupation")} align="center"required error={errors.occupation}>
          <InputBox
            compact
            value={occupation}
            onChange={setOccupation}
            label={t("Enter_job_work")}
          />
        </FormRow>

        {/* ── Divider ───────────────────────────────────────────── */}
        <hr className="border-0 border-t border-[#EAEAEA]" />

        {/* ── Religion & Caste ──────────────────────────────────── */}

        <FormRow label={t("Religion")} align="center" required error={errors.religion}>
          <DropdownField
            typeable compact
            placeholder={t("Select_religion")}
            value={religion}
            open={opens.religion}
            setOpen={setOpen("religion")}
            onSelect={setReligion}
            items={filtReligion}
            dropdownClassName="max-h-[220px]"
          />
        </FormRow>

        <FormRow label={t("Caste_or_denomination")} align="center" required error={errors.caste}>
          <DropdownField
            typeable compact
            placeholder={t("Select_caste")}
            value={caste}
            open={opens.caste}
            setOpen={setOpen("caste")}
            onSelect={setCaste}
            items={filtCaste}
            dropdownClassName="max-h-[220px]"
          />
        </FormRow>

        {/* ── Divider ───────────────────────────────────────────── */}
        <hr className="border-0 border-t border-[#EAEAEA]" />

        {/* ── Location ──────────────────────────────────────────── */}

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
          <DropdownField
            typeable compact
            placeholder={t("Select_district_city")}
            value={city}
            open={opens.city}
            setOpen={setOpen("city")}
            onSelect={setCity}
            items={filtCity}
            dropdownClassName="max-h-[220px]"
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
  );
}
