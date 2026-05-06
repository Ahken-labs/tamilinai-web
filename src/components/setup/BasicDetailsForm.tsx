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
import { getDaysInMonth, validateDOB } from "../../utils/dateUtils";
import { DISABILITY_OPTIONS, MARITAL_OPTIONS } from "@/src/constants/profiles";

// ── Static data ───────────────────────────────────────────────────────
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - 18 - 1939 }, (_, i) =>
  String(THIS_YEAR - 18 - i)
);
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const HEIGHTS = Array.from({ length: 81 }, (_, i) => `${140 + i} cm`);
const WEIGHTS = Array.from({ length: 111 }, (_, i) => `${40 + i} kg`);


function filterItems(items: string[], query: string) {
  if (!query || items.includes(query)) return items;
  return items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}

type OpenKey = "year" | "month" | "day" | "height" | "weight" | "disability";
const ALL_CLOSED: Record<OpenKey, boolean> = {
  year: false, month: false, day: false,
  height: false, weight: false, disability: false,
};

const STORAGE_KEY = "tamilinai_basic";

export default function BasicDetailsForm() {
  const router = useRouter();
  const { t } = useLang();

  function getSavedBasicDetails() {
    if (typeof window === "undefined") return {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  }
  const saved = getSavedBasicDetails();

  const [birthYear, setBirthYear] = useState(saved.birthYear ?? "");
  const [birthMonth, setBirthMonth] = useState(saved.birthMonth ?? "");
  const [birthDay, setBirthDay] = useState(saved.birthDay ?? "");
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

  // ── Dynamic days based on selected month / year ───────────────────
  const maxDaysInMonth = useMemo(
    () => getDaysInMonth(birthMonth, birthYear),
    [birthMonth, birthYear]
  );
  const validDays = useMemo(
    () => Array.from({ length: maxDaysInMonth }, (_, i) => String(i + 1)),
    [maxDaysInMonth]
  );

  function handleSetMonth(m: string) {
    setBirthMonth(m);
    if (birthDay && parseInt(birthDay, 10) > getDaysInMonth(m, birthYear))
      setBirthDay("");
  }
  function handleSetYear(y: string) {
    setBirthYear(y);
    if (birthDay && birthMonth && parseInt(birthDay, 10) > getDaysInMonth(birthMonth, y))
      setBirthDay("");
  }

  // ── Filtered dropdown items ───────────────────────────────────────
  const filtYears = useMemo(() => filterItems(YEARS, birthYear), [birthYear]);
  const filtMonths = useMemo(() => filterItems(MONTHS, birthMonth), [birthMonth]);
  const filtDays = useMemo(() => filterItems(validDays, birthDay), [validDays, birthDay]);
  const filtHeights = useMemo(() => filterItems(HEIGHTS, height), [height]);
  const filtWeights = useMemo(() => filterItems(WEIGHTS, weight), [weight]);
  const filtDisability = useMemo(() => filterItems(DISABILITY_OPTIONS, disability), [disability]);

  // Live DOB error — only fires when year looks like a full 4-digit number.
  const liveDobError = useMemo(() => {
    if (!birthYear || !birthMonth || !birthDay) return null;
    if (!/^\d{4}$/.test(birthYear)) return null;
    return validateDOB(birthYear, birthMonth, birthDay);
  }, [birthYear, birthMonth, birthDay]);

  // ── Submit ────────────────────────────────────────────────────────
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
  };

  return (
    <>
      <FormCardLayout
        childrenTopMargin="mt-6 md:mt-8"
        footer={
          <div className="flex gap-3 md:gap-5 w-full">
            <div className="flex-1" />
            <Button
              text={t("Next")}
              icon={<ArrowRightIcon />}
              onPress={handleNext}
              className="flex-1"
            />
          </div>
        }
      >
        <StepProgress currentStep={1} />

        <h1 className="mt-6 md:mt-8 lg:mt-10 font-24 font-semibold text-dark leading-[150%]">
          {t("Basic_details")}
        </h1>

        <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col gap-6 md:gap-8">

          {/* Date of birth */}
          <FormRow label={t("DOB")} required error={liveDobError ?? errors.dob}>
            <div className="flex gap-4 flex-wrap">
              <DropdownField
                typeable compact
                placeholder="Year"
                value={birthYear}
                open={opens.year}
                setOpen={setOpen("year")}
                onSelect={handleSetYear}
                items={filtYears}
                dropdownClassName="max-h-[300px]"
                className="flex-1"
              />
              <DropdownField
                typeable compact
                placeholder="Month"
                value={birthMonth}
                open={opens.month}
                setOpen={setOpen("month")}
                onSelect={handleSetMonth}
                items={filtMonths}
                dropdownClassName="max-h-[300px]"
                className="flex-1"
              />
              <DropdownField
                typeable compact
                placeholder="Day"
                value={birthDay}
                open={opens.day}
                setOpen={setOpen("day")}
                onSelect={setBirthDay}
                items={filtDays}
                dropdownClassName="max-h-[300px]"
                className="flex-1"
              />
            </div>
          </FormRow>

          {/* Marital status */}
          <FormRow label={t("Marital_status")} required>
            <div className="flex flex-wrap gap-5 mt-3 md:mt-2">
              {MARITAL_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMaritalStatus(opt)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RadioCircleIcon checked={maritalStatus === opt} />
                  <span className="font-16 font-normal text-secondary4 leading-[125%]">
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          </FormRow>

          {/* Height */}
          <FormRow label={t("Height")} align="center" required error={errors.height}>
            <DropdownField
              typeable compact
              placeholder="Select height in Cm"
              value={height}
              open={opens.height}
              setOpen={setOpen("height")}
              onSelect={setHeight}
              items={filtHeights}
              dropdownClassName="max-h-[200px]"
            />
          </FormRow>

          {/* Weight */}
          <FormRow label={t("Weight")} align="center" required error={errors.weight}>
            <DropdownField
              typeable compact
              placeholder="Select weight in Kg"
              value={weight}
              open={opens.weight}
              setOpen={setOpen("weight")}
              onSelect={setWeight}
              items={filtWeights}
              dropdownClassName="max-h-[200px]"
            />
          </FormRow>

          {/* Any physical challenge */}
          <FormRow label={t("Any_physical_challenge")} required>
            <div className="flex items-center gap-5 mt-3 md:mt-2">
              {(["no", "yes"] as const).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setPhysicalChallenge(val);
                    if (val === "no") setDisability("");
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RadioCircleIcon checked={physicalChallenge === val} />
                  <span className="font-16 font-normal text-secondary4 leading-[125%]">
                    {val === "no" ? "No" : "Yes"}
                  </span>
                </button>
              ))}
            </div>
          </FormRow>

          {/* Disability details — only visible when "yes" */}
          {physicalChallenge === "yes" && (
            <FormRow label={t("Disability_details")} align="center" required error={errors.disability}>
              <DropdownField
                typeable compact
                placeholder="Details"
                value={disability}
                open={opens.disability}
                setOpen={setOpen("disability")}
                onSelect={setDisability}
                items={filtDisability}
                dropdownClassName="max-h-[200px]"
              />
            </FormRow>
          )}
        </div>
      </FormCardLayout>
    </>
  );
}
