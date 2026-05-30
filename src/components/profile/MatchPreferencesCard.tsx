"use client";

import { CheckboxIcon } from "@/src/assets/Icons";
import { calculateAge } from "@/src/utils/calculateAge";
import ProtectedPhoto from "@/src/components/common-layout/ProtectedPhoto";
import type { PartnerPreferences, UserProfileSection } from "@/src/types/user";

interface Props {
  theirPrefs: PartnerPreferences | null | undefined;
  theirPhotoUrl: string | null | undefined;
  theirGender: string | undefined;
  myPhotoUrl: string | null | undefined;
  myGender: string | undefined;
  myProfile: UserProfileSection;
  isLoading: boolean;
}

// "Open to all" or null/empty → anything matches
function openToAll(arr: string[] | null | undefined): boolean {
  return !arr || arr.length === 0 || arr[0] === "Open to all";
}

function displayVal(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return "Any";
  if (arr.length === 1) return arr[0];
  return arr.join(", ");
}

function buildRows(prefs: PartnerPreferences, my: UserProfileSection) {
  const myAge = calculateAge(my.dateOfBirth);

  // Age range
  const ageSpecified = !!(prefs.ageMin || prefs.ageMax);
  const ageValue = ageSpecified
    ? `${prefs.ageMin ?? "—"} – ${prefs.ageMax ?? "—"} yrs`
    : "Any";
  const ageMatch = !ageSpecified || (
    myAge != null &&
    (!prefs.ageMin || myAge >= prefs.ageMin) &&
    (!prefs.ageMax || myAge <= prefs.ageMax)
  );

  // Mother tongue: this platform is Tamil matrimony, always Tamil
  const myLanguages = my.languagesSpoken ?? [];
  const speaksTamil = myLanguages.length === 0 || myLanguages.some(l => l.toLowerCase() === "tamil");

  // Physical status: "Normal" = no challenge, "Physically challenged" = has challenge
  const physVal = displayVal(prefs.physicalStatuses);
  const physMatch = openToAll(prefs.physicalStatuses) || (() => {
    const v = prefs.physicalStatuses![0];
    if (v === "Normal") return !my.hasPhysicalChallenge;
    if (v === "Physically challenged") return !!my.hasPhysicalChallenge;
    return true;
  })();

  // Marital status: stored as "Unmarried", my value stored as "unmarried"
  const maritalVal = displayVal(prefs.maritalStatuses);
  const maritalMatch = openToAll(prefs.maritalStatuses) ||
    prefs.maritalStatuses!.some(v => v.toLowerCase() === (my.maritalStatus ?? "").toLowerCase());

  // Eating/food habit: stored as "Vegetarian", my value as "vegetarian"
  const foodVal = displayVal(prefs.foodHabits);
  const foodMatch = openToAll(prefs.foodHabits) ||
    prefs.foodHabits!.some(v => v.toLowerCase().replace(" ", "_") === (my.dietHabit ?? "").toLowerCase());

  // Smoking: "No" = want non-smoker (never), "Okay" = fine with smoker (any)
  const smokingVal = displayVal(prefs.smokingHabits);
  const smokingMatch = openToAll(prefs.smokingHabits) || (() => {
    const v = prefs.smokingHabits![0];
    if (v === "No") return my.smokingHabit === "never";
    return true; // "Okay" = fine with any
  })();

  // Drinking: "No" = never, "Light / Social" = socially/occasionally, "Okay" = any
  const drinkingVal = displayVal(prefs.drinkingHabits);
  const drinkingMatch = openToAll(prefs.drinkingHabits) || (() => {
    const v = prefs.drinkingHabits![0];
    if (v === "No") return my.drinkingHabit === "never";
    if (v === "Light / Social") return my.drinkingHabit === "socially" || my.drinkingHabit === "occasionally";
    return true; // "Okay" = any
  })();

  // Education: null = all, subset = specific levels
  const eduVal = !prefs.educationLevels?.length ? "Any" : prefs.educationLevels.join(", ");
  const eduMatch = !prefs.educationLevels?.length ||
    prefs.educationLevels.some(v => v.toLowerCase() === (my.education ?? "").toLowerCase());

  // Country
  const countryVal = !prefs.countries?.length ? "Any" : prefs.countries.join(", ");
  const countryMatch = !prefs.countries?.length ||
    prefs.countries.some(v => v.toLowerCase() === (my.country ?? "").toLowerCase());

  // Religion
  const religionVal = displayVal(prefs.religions);
  const religionMatch = openToAll(prefs.religions) ||
    prefs.religions!.some(v => v.toLowerCase() === (my.religion ?? "").toLowerCase());

  // Caste: null = any
  const casteVal = !prefs.castes?.length ? "Any" : prefs.castes.join(", ");
  const casteMatch = !prefs.castes?.length ||
    prefs.castes.some(v => v.toLowerCase() === (my.caste ?? "").toLowerCase());

  // Original UI order — exact
  return [
    { label: "Marital status",   value: maritalVal,    matched: maritalMatch },
    { label: "Age",              value: ageValue,       matched: ageMatch },
    { label: "Mother tongue",    value: "Tamil",        matched: speaksTamil },
    { label: "Physical status",  value: physVal,        matched: physMatch },
    { label: "Eating habit",     value: foodVal,        matched: foodMatch },
    { label: "Drinking habit",   value: drinkingVal,    matched: drinkingMatch },
    { label: "Smoking habit",    value: smokingVal,     matched: smokingMatch },
    { label: "Education",        value: eduVal,         matched: eduMatch },
    { label: "Occupation",       value: "Any",          matched: true },
    { label: "Country living in",value: countryVal,     matched: countryMatch },
    { label: "Citizenship",      value: "Any",          matched: true },
    { label: "Resident status",  value: "Any",          matched: true },
    { label: "Religion",         value: religionVal,    matched: religionMatch },
    { label: "Caste",            value: casteVal,       matched: casteMatch },
  ];
}

function calcPercentage(rows: { value: string; matched: boolean }[]): number | null {
  const specified = rows.filter(r => r.value !== "Any");
  if (specified.length === 0) return null;
  return Math.round((specified.filter(r => r.matched).length / specified.length) * 100);
}

function PhotoCircle({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-10 md:h-14 lg:h-16 w-10 w-10 md:w-14 lg:w-16 rounded-full overflow-hidden shrink-0">
      <ProtectedPhoto
        src={src}
        alt={alt}
        width={64}
        height={64}
        watermark=""
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="font-poppins w-full max-w-[1160px] px-6 md:px-10 mx-auto animate-pulse">
      <div className="rounded-[60px] bg-white p-2">
        <div className="flex items-center gap-2">
          <div className="h-10 md:h-14 lg:h-16 w-10 md:w-14 lg:w-16 rounded-full bg-[#EAEAEA] shrink-0" />
          <div className="flex-1 h-3 bg-[#EAEAEA] rounded-full mx-4" />
          <div className="h-8 sm:h-10 md:h-14 lg:h-16 w-8 sm:w-10 md:w-14 lg:w-16 rounded-full bg-[#EAEAEA] shrink-0" />
        </div>
      </div>
      <div className="mt-4 md:mt-6 flex justify-between">
        <div className="h-5 w-40 bg-[#EAEAEA] rounded" />
        <div className="h-5 w-8 bg-[#EAEAEA] rounded" />
      </div>
      <div className="mt-4 md:mt-6 space-y-0">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-[#D7D7D7] py-3">
            <div className="h-4 w-28 bg-[#EAEAEA] rounded" />
            <div className="flex-1 h-4 bg-[#EAEAEA] rounded" />
            <div className="h-5 w-5 bg-[#EAEAEA] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatchPreferencesCard({
  theirPrefs,
  theirPhotoUrl,
  theirGender,
  myPhotoUrl,
  myGender,
  myProfile,
  isLoading,
}: Props) {
  if (isLoading) return <SkeletonCard />;

  const theirPhoto = theirPhotoUrl ?? (theirGender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png");
  const myPhoto = myPhotoUrl ?? (myGender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png");
  const theirPronoun = theirGender === "male" ? "His" : "Her";

  // null prefs = no preferences saved yet, show all rows as "Any" (all matched)
  const rows = buildRows(theirPrefs ?? {}, myProfile);
  const pct = calcPercentage(rows);

  return (
    <div className="font-poppins w-full max-w-[1160px] px-6 md:px-10 mx-auto">
      {/* Top match bar */}
      <div className="rounded-[60px] bg-white max-[500px]:p-1 p-2">
        <div className="flex items-center">
          <div className="shrink-0">
            <PhotoCircle src={theirPhoto} alt="their profile" />
          </div>
          <div className="flex flex-1 items-center">
            <div className="h-px flex-1 bg-[#D7D7D7]" />
            <span className="mx-3 sm:mx-4 shrink-0 text-[16px] font-semibold leading-[150%] text-primary">
              {pct !== null ? `${pct}% match` : "Match"}
            </span>
            <div className="h-px flex-1 bg-[#D7D7D7]" />
          </div>
          <div className="shrink-0">
            <PhotoCircle src={myPhoto} alt="your profile" />
          </div>
        </div>
      </div>

      {/* Header row */}
      <div className="mt-5 md:mt-6 flex items-center justify-between gap-4">
        <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[150%] text-dark">
          {theirPronoun} partner preferences
        </h2>
        <span className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[150%] text-dark">You</span>
      </div>

      {/* Rows */}
      <div className="mt-5 md:mt-6">
        {rows.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-0 sm:gap-2 md:gap-8 border-b border-[#D7D7D7] max-[370px]:py-2 py-3"
          >
            <div className="min-w-[140px] sm:min-w-[160px] text-[14px] md:text-[16px] font-normal italic leading-[150%] text-dark">
              {item.label}
            </div>
            <div className="flex-1 text-[14px] md:text-[16px] font-medium not-italic leading-[150%] text-dark">
              {item.value}
            </div>
            <div className="shrink-0">
              <CheckboxIcon
                checked={item.matched}
                className="h-5 md:h-5.5 lg:h-6 w-5 md:w-5.5 lg:w-6"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
