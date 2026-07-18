"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronIcon, RadioCircleIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import DropdownField from "../common-layout/DropdownField";
import StepProgress from "../more/StepProgress";
import FormRow from "../common-layout/FormRow";
import FormCardLayout from "../common-layout/FormCardLayout";
import { useLang } from "@/src/context/LangContext";
import { validateDOB } from "../../utils/dateUtils";
import { filterItems } from "../../utils/formUtils";
import { useDOBState } from "../../hooks/useDOBState";
import { MARITAL_OPTIONS, HEIGHTS, WEIGHTS, PHYSICAL_BUILD_OPTIONS } from "@/src/constants/profiles";
import { CITY_OPTIONS } from "@/src/constants/location";
import { LanguagePopup } from "../profile/sections/BasicInfoSection";
import { saveBasicDetails, saveFamilyDetails } from "../../lib/api/user";

const STORAGE_KEY = "inai_setup_basic";

const MONTH_TO_NUM: Record<string, string> = {
  January: "01", February: "02", March: "03", April: "04",
  May: "05", June: "06", July: "07", August: "08",
  September: "09", October: "10", November: "11", December: "12",
};
const MARITAL_STATUS_MAP: Record<string, string> = {
  Unmarried: "unmarried",
  "Widow/Widower": "widow_widower",
  Divorced: "divorced",
  Separated: "separated",
};

function getSavedBasicDetails() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

const NUMBER_OPTIONS = Array.from({ length: 9 }, (_, i) => String(i));

type OpenKey = "height" | "weight" | "physBuild" | "familyOrigin" | "brothers" | "brothersMarried" | "sisters" | "sistersMarried";
const ALL_CLOSED: Record<OpenKey, boolean> = { height: false, weight: false, physBuild: false, familyOrigin: false, brothers: false, brothersMarried: false, sisters: false, sistersMarried: false };

export default function BasicDetailsForm() {
  const router = useRouter();
  const { t } = useLang();
  const saved = getSavedBasicDetails();

  const { birthYear, birthMonth, birthDay, setBirthDay, setMonth, setYear, filtYears, filtMonths, filtDays, dobOpen, setDobFieldOpen } =
    useDOBState({ year: saved.birthYear, month: saved.birthMonth, day: saved.birthDay });

  const [maritalStatus, setMaritalStatus] = useState(saved.maritalStatus ?? "Unmarried");
  const [height, setHeight] = useState(saved.height ?? "");
  const [weight, setWeight] = useState(saved.weight ?? "");
  const [physicalChallenge, setPhysicalChallenge] = useState<"no" | "yes">(
    saved.physicalChallenge === "yes" ? "yes" : "no"
  );
  const [disability, setDisability] = useState(saved.disability ?? "");
  const [physBuild, setPhysBuild] = useState(saved.physBuild ?? "");
  const [languages, setLanguages] = useState<string[]>(
    saved.languages ? JSON.parse(saved.languages) : ["Tamil"]
  );
  const [langPopupOpen, setLangPopupOpen] = useState(false);
  const [fatherOccupation, setFatherOccupation] = useState(saved.fatherOccupation ?? "");
  const [motherOccupation, setMotherOccupation] = useState(saved.motherOccupation ?? "");
  const [familyOrigin, setFamilyOrigin] = useState(saved.familyOrigin ?? "");
  const [brothers, setBrothers] = useState(saved.brothers ?? "");
  const [brothersMarried, setBrothersMarried] = useState(saved.brothersMarried ?? "");
  const [sisters, setSisters] = useState(saved.sisters ?? "");
  const [sistersMarried, setSistersMarried] = useState(saved.sistersMarried ?? "");
  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setOpen = (key: OpenKey) => (val: boolean) =>
    setOpens({ ...ALL_CLOSED, [key]: val });

  const filtHeights = useMemo(() => filterItems(HEIGHTS, height), [height]);
  const filtWeights = useMemo(() => filterItems(WEIGHTS, weight), [weight]);

  const liveDobError = useMemo(() => {
    if (!birthYear || !birthMonth || !birthDay) return null;
    if (!/^\d{4}$/.test(birthYear)) return null;
    return validateDOB(birthYear, birthMonth, birthDay);
  }, [birthYear, birthMonth, birthDay]);

  const handleNext = () => {
    const errs: Record<string, string> = {};
    if (!birthYear || !birthMonth || !birthDay) {
      errs.dob = "*Date of birth is required";
    } else {
      const dobErr = validateDOB(birthYear, birthMonth, birthDay);
      if (dobErr) errs.dob = dobErr;
    }
    if (!height) errs.height = "*Height is required";
    if (!weight) errs.weight = "*Weight is required";
    if (physicalChallenge === "yes" && !disability)
      errs.disability = "*Please provide disability details";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        birthYear, birthMonth, birthDay, maritalStatus,
        height, weight, physicalChallenge, disability,
        physBuild, languages: JSON.stringify(languages),
        fatherOccupation, motherOccupation, familyOrigin,
        brothers, brothersMarried, sisters, sistersMarried,
      }));
    } catch { /* storage unavailable */ }

    router.push("/personal-details");

    // Fire all three in background — user is already navigating forward
    const mm = MONTH_TO_NUM[birthMonth] ?? birthMonth;
    saveBasicDetails({
      dateOfBirth: `${birthYear}-${mm}-${birthDay.padStart(2, "0")}`,
      maritalStatus: MARITAL_STATUS_MAP[maritalStatus] ?? maritalStatus.toLowerCase(),
      heightCm: parseInt(height, 10) || undefined,
      weightKg: parseInt(weight, 10) || undefined,
      hasPhysicalChallenge: physicalChallenge === "yes",
      disabilityType: physicalChallenge === "yes" ? disability : undefined,
    }).catch(() => {});
    saveFamilyDetails({
      familyOrigin: familyOrigin || undefined,
      fatherOccupation: fatherOccupation || undefined,
      motherOccupation: motherOccupation || undefined,
      brotherCount: brothers !== "" ? parseInt(brothers, 10) : undefined,
      brothersMarried: brothersMarried !== "" ? parseInt(brothersMarried, 10) : undefined,
      sisterCount: sisters !== "" ? parseInt(sisters, 10) : undefined,
      sistersMarried: sistersMarried !== "" ? parseInt(sistersMarried, 10) : undefined,
    }).catch(() => {});
  };

  return (
    <>
      {/* Mobile: StepProgress outside the card */}
      <div className="mb-4 min-[500px]:hidden">
        <div className="fixed top-[68px] bg-light left-0 right-0 z-40 px-4 pb-2">
          <StepProgress currentStep={1} />
        </div>
      </div>

      <FormCardLayout
        childrenTopMargin="mt-6 md:mt-8"
        paddingBottom="max-[500px]:pb-0 pb-8 md:pb-10"
        footer={
          <div className="hidden min-[500px]:flex gap-3 md:gap-5 w-full">
            <div className="flex-1" />
            <Button text={t("Next")} icon={<ArrowRightIcon />} onPress={handleNext} className="flex-1" />
          </div>
        }
      >
        {/* Desktop: StepProgress inside the card */}
        <div className="hidden min-[500px]:block">
          <StepProgress currentStep={1} />
        </div>

        <h1 className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 font-24 font-semibold text-dark leading-[150%]">
          {t("Basic_details")}
        </h1>

        <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col gap-6 md:gap-8">

          {/* Date of birth */}
          <FormRow label={t("DOB")} required error={liveDobError ?? errors.dob}>
            <div className="flex gap-2">
              <DropdownField typeable compact placeholder={t("Year")} value={birthYear} open={dobOpen.year} setOpen={setDobFieldOpen("year")} onSelect={setYear} items={filtYears} dropdownClassName="max-h-[300px]" className="flex-1" />
              <DropdownField typeable compact placeholder={t("Month")} value={birthMonth} open={dobOpen.month} setOpen={setDobFieldOpen("month")} onSelect={setMonth} items={filtMonths} dropdownClassName="max-h-[300px]" className="flex-1" />
              <DropdownField typeable compact placeholder={t("Day")} value={birthDay} open={dobOpen.day} setOpen={setDobFieldOpen("day")} onSelect={setBirthDay} items={filtDays} dropdownClassName="max-h-[300px]" className="flex-1" />
            </div>
          </FormRow>

          {/* Marital status */}
          <FormRow label={t("Marital_status")} required>
            <div className="flex flex-col min-[500px]:flex-row min-[500px]:flex-wrap gap-3 min-[500px]:gap-5 max-[500px]:mt-0 mt-3 md:mt-2">
              {MARITAL_OPTIONS.map((opt) => (
                <button key={opt} type="button" onClick={() => setMaritalStatus(opt)} className="flex items-center gap-1 cursor-pointer">
                  <RadioCircleIcon checked={maritalStatus === opt} />
                  <span className="text-[16px] font-normal text-secondary4 leading-[125%]">{opt}</span>
                </button>
              ))}
            </div>
          </FormRow>

          {/* Height */}
          <FormRow label={t("Height")} align="center" required error={errors.height}>
            <DropdownField typeable compact placeholder={t("Select_height_in_Cm")} value={height} open={opens.height} setOpen={setOpen("height")} onSelect={setHeight} items={filtHeights} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* Weight */}
          <FormRow label={t("Weight")} align="center" required error={errors.weight}>
            <DropdownField typeable compact placeholder={t("Select_weight_in_Kg")} value={weight} open={opens.weight} setOpen={setOpen("weight")} onSelect={setWeight} items={filtWeights} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* Any physical challenge */}
          <FormRow label={t("Any_physical_challenge")} required>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-[500px]:gap-5 max-[500px]:mt-0 mt-3 md:mt-2">
              {(["no", "yes"] as const).map((val) => (
                <button key={val} type="button" onClick={() => { setPhysicalChallenge(val); if (val === "no") setDisability(""); }} className="flex items-center gap-2 cursor-pointer">
                  <RadioCircleIcon checked={physicalChallenge === val} />
                  <span className="text-[16px] font-normal text-secondary4 leading-[125%] whitespace-nowrap">
                    {val === "no" ? "No disability" : "Differently abled"}
                  </span>
                </button>
              ))}
            </div>
          </FormRow>

          {/* Disability details */}
          {physicalChallenge === "yes" && (
            <FormRow label={t("Please_specify_Optional")} align="center" required error={errors.disability}>
              <input
                value={disability}
                onChange={(e) => setDisability(e.target.value)}
                placeholder="Details"
                className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#525252]"
              />
            </FormRow>
          )}

          {/* physical build */}
          <FormRow label={t("Physical_build")} align="center">
            <DropdownField typeable compact placeholder={t("Select_fitness_type")} value={physBuild} open={opens.physBuild} setOpen={setOpen("physBuild")} onSelect={setPhysBuild} items={PHYSICAL_BUILD_OPTIONS} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* Languages spoken */}
          <FormRow label={t("Languages_spoken")} align="center">
            <button type="button" onClick={() => setLangPopupOpen(true)} className="flex py-5 px-4 items-center w-full rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] cursor-pointer">
              <div className="flex flex-wrap gap-2 sm:gap-3 flex-1 min-w-0">
                {languages.length > 0
                  ? languages.map(lang => <span key={lang} className="px-3 py-1 rounded-[48px] bg-white text-[16px] font-normal text-dark">{lang}</span>)
                  : <span className="text-[16px] font-normal text-[#525252]">Select languages</span>}
              </div>
              <ChevronIcon open={false} className="shrink-0 ml-2 w-3.5 h-3 md:w-4 md:h-4 transition-transform duration-200" />
            </button>
          </FormRow>
        </div>

        <div className="my-6 border-t border-[#EAEAEA]" />

        {/* Family details */}
        <div className="flex flex-col gap-6 md:gap-8">
          <h1 className="font-24 font-semibold text-dark leading-[150%]">
            {t("Family_details")}
          </h1>

          {/* father's occupation */}
          <FormRow label={t("Father_occupation")} align="center">
            <input value={fatherOccupation} onChange={e => setFatherOccupation(e.target.value)} placeholder={t("Type_here")} className="font-poppins flex-1 h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#656565]" />
          </FormRow>

          {/* mother's occupation */}
          <FormRow label={t("Mom_occupation")} align="center">
            <input value={motherOccupation} onChange={e => setMotherOccupation(e.target.value)} placeholder={t("Type_here")} className="font-poppins flex-1 h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#656565]" />
          </FormRow>

          {/* origin */}
          <FormRow align="center" label={t("Family_origin_Ancestral")}>
            <DropdownField typeable compact placeholder={t("Select_district")} value={familyOrigin} open={opens.familyOrigin} setOpen={setOpen("familyOrigin")} onSelect={setFamilyOrigin} items={CITY_OPTIONS} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* number of brothers */}
          <FormRow label={t("Number_of_brothers")} align="center">
            <DropdownField typeable numberOnly compact placeholder={t("Select")} value={brothers} open={opens.brothers} setOpen={setOpen("brothers")} onSelect={setBrothers} items={NUMBER_OPTIONS} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* brothers married */}
          <FormRow label={t("Brothers_married")} align="center">
            <DropdownField typeable numberOnly compact placeholder={t("Select")} value={brothersMarried} open={opens.brothersMarried} setOpen={setOpen("brothersMarried")} onSelect={setBrothersMarried} items={NUMBER_OPTIONS} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* number of sisters */}
          <FormRow label={t("Number_of_sisters")} align="center">
            <DropdownField typeable numberOnly compact placeholder={t("Select")} value={sisters} open={opens.sisters} setOpen={setOpen("sisters")} onSelect={setSisters} items={NUMBER_OPTIONS} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* sisters married */}
          <FormRow label={t("Sisters_married")} align="center">
            <DropdownField typeable numberOnly compact placeholder={t("Select")} value={sistersMarried} open={opens.sistersMarried} setOpen={setOpen("sistersMarried")} onSelect={setSistersMarried} items={NUMBER_OPTIONS} dropdownClassName="max-h-[200px]" />
          </FormRow>

        </div>

      </FormCardLayout>

      {langPopupOpen && (
        <LanguagePopup initialSelected={languages} onClose={() => setLangPopupOpen(false)} onConfirm={langs => setLanguages(langs)} />
      )}

      {/* Mobile fixed bottom button (<500px) */}
      <div
        className="min-[500px]:hidden fixed bottom-0 left-0 right-0 px-4 py-2"
        style={{ background: "rgba(255, 255, 255, 0.60)", backdropFilter: "blur(11px)" }}
      >
        <Button text={t("Next")} icon={<ArrowRightIcon />} onPress={handleNext} className="!w-full" />
      </div>
    </>
  );
}
