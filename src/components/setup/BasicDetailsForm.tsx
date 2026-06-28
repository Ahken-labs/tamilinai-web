"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, RadioCircleIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import DropdownField from "../common-layout/DropdownField";
import StepProgress from "../more/StepProgress";
import FormRow from "../common-layout/FormRow";
import FormCardLayout from "../common-layout/FormCardLayout";
import { useLang } from "@/src/context/LangContext";
import { validateDOB } from "../../utils/dateUtils";
import { filterItems } from "../../utils/formUtils";
import { useDOBState } from "../../hooks/useDOBState";
import { MARITAL_OPTIONS, HEIGHTS, WEIGHTS } from "@/src/constants/profiles";
import { saveBasicDetails } from "../../lib/api/user";

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

type OpenKey = "height" | "weight";
const ALL_CLOSED: Record<OpenKey, boolean> = { height: false, weight: false };

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
      }));
    } catch { /* storage unavailable */ }

    router.push("/personal-details");

    // Fire in background — user is already navigating forward
    const mm = MONTH_TO_NUM[birthMonth] ?? birthMonth;
    saveBasicDetails({
      dateOfBirth: `${birthYear}-${mm}-${birthDay.padStart(2, "0")}`,
      maritalStatus: MARITAL_STATUS_MAP[maritalStatus] ?? maritalStatus.toLowerCase(),
      heightCm: parseInt(height, 10) || undefined,
      weightKg: parseInt(weight, 10) || undefined,
      hasPhysicalChallenge: physicalChallenge === "yes",
      disabilityType: physicalChallenge === "yes" ? disability : undefined,
    }).catch(() => { /* user can re-enter in profile */ });
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

        <h1 className="mt-6 md:mt-8 lg:mt-10 font-24 font-semibold text-dark leading-[150%]">
          {t("Basic_details")}
        </h1>

        <div className="max-[500px]:mt-4 mt-6 md:mt-8 lg:mt-10 flex flex-col gap-6 md:gap-8">

          {/* Date of birth */}
          <FormRow label={t("DOB")} required error={liveDobError ?? errors.dob}>
            <div className="flex gap-2">
              <DropdownField typeable compact placeholder="Year" value={birthYear} open={dobOpen.year} setOpen={setDobFieldOpen("year")} onSelect={setYear} items={filtYears} dropdownClassName="max-h-[300px]" className="flex-1" />
              <DropdownField typeable compact placeholder="Month" value={birthMonth} open={dobOpen.month} setOpen={setDobFieldOpen("month")} onSelect={setMonth} items={filtMonths} dropdownClassName="max-h-[300px]" className="flex-1" />
              <DropdownField typeable compact placeholder="Day" value={birthDay} open={dobOpen.day} setOpen={setDobFieldOpen("day")} onSelect={setBirthDay} items={filtDays} dropdownClassName="max-h-[300px]" className="flex-1" />
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
            <DropdownField typeable compact placeholder="Select height in Cm" value={height} open={opens.height} setOpen={setOpen("height")} onSelect={setHeight} items={filtHeights} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* Weight */}
          <FormRow label={t("Weight")} align="center" required error={errors.weight}>
            <DropdownField typeable compact placeholder="Select weight in Kg" value={weight} open={opens.weight} setOpen={setOpen("weight")} onSelect={setWeight} items={filtWeights} dropdownClassName="max-h-[200px]" />
          </FormRow>

          {/* Any physical challenge */}
          <FormRow label={t("Any_physical_challenge")} required>
            <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-3 min-[500px]:gap-5 max-[500px]:mt-0 mt-3 md:mt-2">
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

        </div>
      </FormCardLayout>

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
