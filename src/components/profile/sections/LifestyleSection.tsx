"use client";

import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import { DIET_OPTIONS, DRINKING_OPTIONS, SMOKING_OPTIONS } from "@/src/constants/profiles";

const leftWidth =
  "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";

type OpenKey = "dietHabit" | "smokingHabit" | "drinkingHabit";

const ALL_CLOSED: Record<OpenKey, boolean> = {
  dietHabit: false,
  smokingHabit: false,
  drinkingHabit: false,
};

export default function LifestyleSection() {
  const [opens, setOpens] =
    useState<Record<OpenKey, boolean>>(ALL_CLOSED);

  const [dietHabit, setDietHabit] = useState("");
  const [smokingHabit, setSmokingHabit] = useState("");
  const [drinkingHabit, setDrinkingHabit] = useState("");

  const setOpen = (key: OpenKey) => (val: boolean) =>
    setOpens({ ...ALL_CLOSED, [key]: val });

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        {/* Diet habit */}
        <FormRow leftWidth={leftWidth} label="Diet habit" align="center">
          <DropdownField
            typeable
            compact
            placeholder="Select"
            bgClassName="bg-[#FFF0F3]"
            borderClassName="border-[rgba(179,27,56,0.25)]"
            textClassName="text-[#656565]"
            value={dietHabit}
            open={opens.dietHabit}
            setOpen={setOpen("dietHabit")}
            onSelect={setDietHabit}
            items={DIET_OPTIONS}
          />
        </FormRow>

        {/* Smoking habit */}
        <FormRow leftWidth={leftWidth} label="Smoking habit" align="center">
          <DropdownField
            typeable
            compact
            placeholder="Select"
            bgClassName="bg-[#FFF0F3]"
            borderClassName="border-[rgba(179,27,56,0.25)]"
            textClassName="text-[#656565]"
            value={smokingHabit}
            open={opens.smokingHabit}
            setOpen={setOpen("smokingHabit")}
            onSelect={setSmokingHabit}
            items={SMOKING_OPTIONS}
          />
        </FormRow>

        {/* Drinking habit */}
        <FormRow leftWidth={leftWidth} label="Drinking habit" align="center">
          <DropdownField
            typeable
            compact
            placeholder="Select"
            bgClassName="bg-[#FFF0F3]"
            borderClassName="border-[rgba(179,27,56,0.25)]"
            textClassName="text-[#656565]"
            value={drinkingHabit}
            open={opens.drinkingHabit}
            setOpen={setOpen("drinkingHabit")}
            onSelect={setDrinkingHabit}
            items={DRINKING_OPTIONS}
          />
        </FormRow>
      </div>
    </div>
  );
}