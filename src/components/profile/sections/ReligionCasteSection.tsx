"use client";

import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";

import {
  RELIGION_OPTIONS,
  CASTE_OPTIONS_HINDU,
  CASTE_OPTIONS_CHRISTIAN,
} from "@/src/constants/profiles";

const leftWidth =
  "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";

type OpenKey = "religion" | "caste";

const ALL_CLOSED: Record<OpenKey, boolean> = {
  religion: false,
  caste: false,
};

export default function ReligionCasteSection() {
  const [opens, setOpens] =
    useState<Record<OpenKey, boolean>>(ALL_CLOSED);

  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");

  const setOpen = (key: OpenKey) => (val: boolean) =>
    setOpens({ ...ALL_CLOSED, [key]: val });

  // Dynamic caste options
  let casteOptions: string[] = [];

  if (religion === "Hindu") {
    casteOptions = CASTE_OPTIONS_HINDU;
  } else if (religion === "Christian") {
    casteOptions = CASTE_OPTIONS_CHRISTIAN;
  }

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        {/* Religion */}
        <FormRow
          leftWidth={leftWidth}
          required
          label="Religion"
          align="center"
        >
          <DropdownField
            typeable
            compact
            placeholder="Select religion"
            value={religion}
            open={opens.religion}
            setOpen={setOpen("religion")}
            onSelect={(value) => {
              setReligion(value);
              setCaste(""); // reset caste when religion changes
            }}
            items={RELIGION_OPTIONS}
          />
        </FormRow>

        {/* Caste / denomination */}
        <FormRow
          leftWidth={leftWidth}
          required
          label="Caste or denomination"
          align="center"
        >
          <DropdownField
            typeable
            compact
            placeholder={
              religion
                ? "Select caste / denomination"
                : "Select religion first"
            }
            value={caste}
            open={opens.caste}
            setOpen={setOpen("caste")}
            onSelect={setCaste}
            items={casteOptions}
            dropdownClassName="max-h-[300px]"
          />
        </FormRow>

      </div>
    </div>
  );
}