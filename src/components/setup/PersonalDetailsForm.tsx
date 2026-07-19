"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import DropdownField from "../common-layout/DropdownField";
import StepProgress from "../more/StepProgress";
import FormRow from "../common-layout/FormRow";
import FormCardLayout from "../common-layout/FormCardLayout";
import { useLang } from "@/src/context/LangContext";
import {
  EDUCATION_OPTIONS, RELIGION_OPTIONS,
  CASTE_OPTIONS_HINDU, CASTE_OPTIONS_CHRISTIAN,
  SECTOR, DIET_OPTIONS, SMOKING_OPTIONS, DRINKING_OPTIONS,
} from "@/src/constants/profiles";
import { HobbiesPopup } from "../profile/sections/InterestsHobbiesSection";
import { COUNTRY_OPTIONS, RESIDENT_STATUS_OPTIONS } from "@/src/constants/location";
import { CURRENCY_OPTIONS } from "@/src/constants/currencies";
import { savePersonalDetails, saveCareerDetails, saveLifestyleDetails } from "../../lib/api/user";
import { BUILD_TO_BE, DIET_TO_BE, SMOKE_TO_BE, DRINK_TO_BE, RESIDENT_TO_BE } from "@/src/utils/profileMappers";


function filterItems(items: string[], query: string) {
  if (!query || items.includes(query)) return items;
  return items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
}

type OpenKey = "education" | "religion" | "caste" | "country" | "city" | "citizenship" | "sector" | "currency" | "diet" | "smoking" | "drinking" | "residentStatus";
const ALL_CLOSED: Record<OpenKey, boolean> = {
  education: false, religion: false, caste: false,
  country: false, city: false, citizenship: false,
  sector: false, currency: false, diet: false, smoking: false, drinking: false,
  residentStatus: false,
};

const STORAGE_KEY = "inai_setup_personal";

export default function PersonalDetailsForm() {
  const router = useRouter();
  const { t } = useLang();

  useEffect(() => { router.prefetch("/photo-upload"); }, [router]);

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function getSaved() {
    if (typeof window === "undefined") return {} as Record<string, string>;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch { return {}; }
  }

  const saved = getSaved();

  // Career
  const [education, setEducation] = useState(saved.education ?? "");
  const [educationDetail, setEducationDetail] = useState(saved.educationDetail ?? "");
  const [occupation, setOccupation] = useState(saved.occupation ?? "");
  const [sector, setSector] = useState(saved.sector ?? "");
  const [currency, setCurrency] = useState(saved.currency ?? "");
  const [monthlyIncome, setMonthlyIncome] = useState(saved.monthlyIncome ?? "");
  // Location
  const [country, setCountry] = useState(saved.country ?? "");
  const [city, setCity] = useState(saved.city ?? "");
  const [citizenship, setCitizenship] = useState(saved.citizenship ?? "");
  const [residentStatus, setResidentStatus] = useState(saved.residentStatus ?? "");
  // Religion
  const [religion, setReligion] = useState(saved.religion ?? "");
  const [caste, setCaste] = useState(saved.caste ?? "");
  const [casteOther, setCasteOther] = useState(saved.casteOther ?? "");
  // Lifestyle
  const [dietHabit, setDietHabit] = useState(saved.dietHabit ?? "");
  const [smokingHabit, setSmokingHabit] = useState(saved.smokingHabit ?? "");
  const [drinkingHabit, setDrinkingHabit] = useState(saved.drinkingHabit ?? "");
  // Hobbies popup
  const [hobbies, setHobbies] = useState<string[]>(
    saved.hobbies ? JSON.parse(saved.hobbies) : []
  );
  const [hobbiesOpen, setHobbiesOpen] = useState(false);

  const setOpen = (key: OpenKey) => (val: boolean) => {
    if (key === "caste" && val && !religion) {
      setOpens({ ...ALL_CLOSED, religion: true });
      return;
    }
    setOpens({ ...ALL_CLOSED, [key]: val });
  };

  const filtEducation = useMemo(() => filterItems(EDUCATION_OPTIONS, education), [education]);
  const filtReligion = useMemo(() => filterItems(RELIGION_OPTIONS, religion), [religion]);
  const filtCountry = useMemo(() => filterItems(COUNTRY_OPTIONS, country), [country]);
  const filtCitizenship = useMemo(() => filterItems(COUNTRY_OPTIONS, citizenship), [citizenship]);

  const casteOptions = useMemo(() => {
    if (religion === "Hindu") return CASTE_OPTIONS_HINDU;
    if (religion === "Christian") return CASTE_OPTIONS_CHRISTIAN;
    if (religion === "Prefer not to say") {
      const tail = ["Other", "Prefer not to say"];
      const merged = [...CASTE_OPTIONS_HINDU, ...CASTE_OPTIONS_CHRISTIAN].filter(c => !tail.includes(c));
      return [...new Set(merged), ...tail];
    }
    return [];
  }, [religion]);

  const filtCaste = useMemo(() => filterItems(casteOptions, caste), [casteOptions, caste]);

  function persist() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        education, educationDetail, occupation, sector, currency, monthlyIncome,
        country, city, citizenship, residentStatus,
        religion, caste, casteOther,
        dietHabit, smokingHabit, drinkingHabit,
        hobbies: JSON.stringify(hobbies),
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
    if (caste === "Other" && !casteOther.trim()) errs.casteOther = "*Please specify your caste";
    if (!country) errs.country = "*Country is required";
    if (!city) errs.city = "*District or city is required";
    if (!citizenship) errs.citizenship = "*Citizenship is required";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    persist();
    router.push("/photo-upload");

    savePersonalDetails({
      education, occupation,
      religion, caste: caste === "Other" ? casteOther.trim() : caste,
      country, city, citizenship,
    }).catch(() => {});
    saveCareerDetails({
      educationDetail: educationDetail || undefined,
      sector: sector || undefined,
      monthlyIncome: monthlyIncome ? parseInt(monthlyIncome, 10) : undefined,
      incomeCurrency: currency ? currency.split(" - ")[0] : undefined,
    }).catch(() => {});
    const basicSaved = (() => { try { return JSON.parse(sessionStorage.getItem("inai_setup_basic") ?? "{}"); } catch { return {}; } })();
    saveLifestyleDetails({
      physicalBuild: (basicSaved.physBuild ? BUILD_TO_BE[basicSaved.physBuild] : undefined),
      languagesSpoken: basicSaved.languages ? JSON.parse(basicSaved.languages) : undefined,
      dietHabit: (dietHabit ? DIET_TO_BE[dietHabit] : undefined),
      smokingHabit: (smokingHabit ? SMOKE_TO_BE[smokingHabit] : undefined),
      drinkingHabit: (drinkingHabit ? DRINK_TO_BE[drinkingHabit] : undefined),
      hobbies: hobbies.length > 0 ? hobbies : undefined,
      residentStatus: residentStatus ? (RESIDENT_TO_BE[residentStatus] ?? "other") : undefined,
    }).catch(() => {});

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
              <Button text={t("Back")} onPress={handleBack} className="!w-full !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]" />
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
          <button type="button" onClick={handleBack} className="min-[500px]:hidden flex items-center justify-center shrink-0">
            <ChevronIcon open={false} className="mt-1 w-5 h-5 rotate-90" />
          </button>
          <h1 className="font-24 font-semibold text-dark leading-[150%]">{t("Career_education")}</h1>
        </div>

        <div className="max-[500px]:mt-5 mt-6 sm:mt-7 lg:mt-8 flex flex-col max-[500px]:gap-5 gap-6 sm:gap-7 md:gap-8">

          <FormRow label={t("Highest_education")} align="center" required error={errors.education}>
            <DropdownField typeable compact placeholder={t("Select_education")} value={education} open={opens.education} setOpen={setOpen("education")} onSelect={setEducation} items={filtEducation} dropdownClassName="max-h-[220px]" />
          </FormRow>

          <FormRow label={t("Education_detail")} align="center">
            <input value={educationDetail} onChange={e => setEducationDetail(e.target.value)} placeholder={t("Type_here")} className="font-poppins flex-1 h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#656565]" />
          </FormRow>

          <FormRow label={t("Occupation")} align="center" required error={errors.occupation}>
            <input value={occupation} onChange={e => setOccupation(e.target.value)} placeholder={t("Enter_job_work")} className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#525252]" />
          </FormRow>

          <FormRow label={t("sector")} align="center">
            <DropdownField typeable compact placeholder={t("Select_sector")} value={sector} open={opens.sector} setOpen={setOpen("sector")} onSelect={setSector} items={SECTOR} dropdownClassName="max-h-[220px]" />
          </FormRow>

          <FormRow label={t("Monthly_income")} align="center">
            <div className="flex max-[500px]:gap-2 gap-4 max-[500px]:flex-col flex-wrap">
              <DropdownField search compact placeholder={t("Select_currency")} value={currency} open={opens.currency} setOpen={setOpen("currency")} onSelect={setCurrency} items={CURRENCY_OPTIONS} dropdownClassName="max-h-[260px] min-[500px]:min-w-[220px]" className="flex-1 min-w-0 min-[500px]:max-w-[200px]" />
              <input value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value.replace(/\D/g, ""))} placeholder={t("Enter_monthly_income")} className="flex-1 py-2 h-10 w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#656565]" />
            </div>
          </FormRow>

        </div>

        <hr className="min-[500px]:mt-6 mt-5 mb-6 border-t border-[#EAEAEA]" />
        <h1 className="font-24 font-semibold text-dark leading-[150%]">{t("Location")}</h1>
        <div className="max-[500px]:mt-5 mt-6 sm:mt-7 lg:mt-8 flex flex-col max-[500px]:gap-5 gap-6 sm:gap-7 md:gap-8">

          <FormRow label={t("Country_living_in")} align="center" required error={errors.country}>
            <DropdownField search compact placeholder={t("Select_country")} value={country} open={opens.country} setOpen={setOpen("country")} onSelect={setCountry} items={filtCountry} dropdownClassName="max-h-[260px]" />
          </FormRow>

          <FormRow label={t("Residing_district_or_city")} align="center" required error={errors.city}>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder={t("Enter_city_or_district")} className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#525252]" />
          </FormRow>

          <FormRow label={t("Citizenship")} align="center" required error={errors.citizenship}>
            <DropdownField search compact placeholder={t("Select_citizenship")} value={citizenship} open={opens.citizenship} setOpen={setOpen("citizenship")} onSelect={setCitizenship} items={filtCitizenship} dropdownClassName="max-h-[260px]" />
          </FormRow>

          <FormRow label="Resident Status" align="center">
            <DropdownField typeable compact placeholder={t("Select")} value={residentStatus} open={opens.residentStatus} setOpen={setOpen("residentStatus")} onSelect={setResidentStatus} items={RESIDENT_STATUS_OPTIONS} dropdownClassName="max-h-[220px]" />
          </FormRow>

        </div>

        <hr className="min-[500px]:mt-6 mt-5 mb-6 border-t border-[#EAEAEA]" />
        <h1 className="font-24 font-semibold text-dark leading-[150%]">{t("Religion_and_Caste")}</h1>
        <div className="max-[500px]:mt-5 mt-6 sm:mt-7 lg:mt-8 flex flex-col max-[500px]:gap-5 gap-6 sm:gap-7 md:gap-8">

          <FormRow label={t("Religion")} align="center" required error={errors.religion}>
            <DropdownField typeable compact placeholder={t("Select_religion")} value={religion} open={opens.religion} setOpen={setOpen("religion")} onSelect={v => { setReligion(v); setCaste(""); }} items={filtReligion} dropdownClassName="max-h-[220px]" />
          </FormRow>

          <FormRow label={t("Caste_or_denomination")} align="center" required error={errors.caste}>
            <DropdownField typeable compact placeholder={religion ? t("Select_caste") : "Select religion first"} value={caste} open={opens.caste} setOpen={setOpen("caste")} onSelect={v => { setCaste(v); setCasteOther(""); }} items={filtCaste} dropdownClassName="max-h-[220px]" />
          </FormRow>

          {caste === "Other" && (
            <FormRow label="Please specify" align="center" required error={errors.casteOther}>
              <input value={casteOther} onChange={e => setCasteOther(e.target.value)} placeholder="Type here..." className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#525252]" />
            </FormRow>
          )}

        </div>

        <hr className="min-[500px]:mt-6 mt-5 mb-6 border-t border-[#EAEAEA]" />
        <h1 className="font-24 font-semibold text-dark leading-[150%]">{t("Lifestyle")}</h1>
        <div className="max-[500px]:mt-5 mt-6 sm:mt-7 lg:mt-8 flex flex-col max-[500px]:gap-5 gap-6 sm:gap-7 md:gap-8">

          <FormRow label={t("Diet_habit")} align="center">
            <DropdownField typeable compact placeholder={t("Select")} value={dietHabit} open={opens.diet} setOpen={setOpen("diet")} onSelect={setDietHabit} items={DIET_OPTIONS} dropdownClassName="max-h-[220px]" />
          </FormRow>

          <FormRow label={t("Smoking_habit")} align="center">
            <DropdownField typeable compact placeholder={t("Select")} value={smokingHabit} open={opens.smoking} setOpen={setOpen("smoking")} onSelect={setSmokingHabit} items={SMOKING_OPTIONS} dropdownClassName="max-h-[220px]" />
          </FormRow>

          <FormRow label={t("Drinking_habit")} align="center">
            <DropdownField typeable compact placeholder={t("Select")} value={drinkingHabit} open={opens.drinking} setOpen={setOpen("drinking")} onSelect={setDrinkingHabit} items={DRINKING_OPTIONS} dropdownClassName="max-h-[220px]" />
          </FormRow>

          <FormRow label={t("Interests_hobbies")} align="center">
            <button type="button" onClick={() => setHobbiesOpen(true)} className="flex py-5 px-4 items-center w-full rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] cursor-pointer">
              <div className="flex flex-wrap gap-2 sm:gap-3 flex-1 min-w-0">
                {hobbies.length > 0
                  ? hobbies.map(item => <span key={item} className="px-3 py-1 rounded-[48px] bg-white text-[16px] font-normal text-dark">{item}</span>)
                  : <span className="text-[16px] font-normal text-left text-[#525252]">{t("Add_interests_hobbies")}</span>}
              </div>
              <ChevronIcon open={false} className="shrink-0 ml-2 w-3.5 h-3 md:w-4 md:h-4 transition-transform duration-200" />
            </button>
          </FormRow>

        </div>

      </FormCardLayout>

      {hobbiesOpen && (
        <HobbiesPopup initialSelected={hobbies} onClose={() => setHobbiesOpen(false)} onConfirm={items => setHobbies(items)} />
      )}

      {/* Mobile fixed bottom button */}
      <div className="min-[500px]:hidden fixed bottom-0 left-0 right-0 px-4 py-2" style={{ background: "rgba(255, 255, 255, 0.60)", backdropFilter: "blur(11px)" }}>
        <Button text={t("Next")} onPress={handleDone} className="!w-full" icon={<ArrowRightIcon />} />
      </div>
    </>
  );
}
