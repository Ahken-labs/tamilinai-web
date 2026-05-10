"use client";

import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import { COUNTRY_OPTIONS, RESIDENT_STATUS_OPTIONS } from "@/src/constants/location";

const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";

type OpenKey = "countryLivingIn" | "citizenship" | "residentStatus";

const ALL_CLOSED: Record<OpenKey, boolean> = {
  countryLivingIn: false,
  citizenship: false,
  residentStatus: false,
};

export default function LocationSection() {
  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);

  const [countryLivingIn, setCountryLivingIn] = useState("");
  const [city, setCity] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [residentStatus, setResidentStatus] = useState("");

  const setOpen = (key: OpenKey) => (val: boolean) =>
    setOpens({ ...ALL_CLOSED, [key]: val });

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">
        <FormRow leftWidth={leftWidth} required label="Country living in" align="center">
          <DropdownField
            typeable
            compact
            placeholder="Select country"
            value={countryLivingIn}
            open={opens.countryLivingIn}
            setOpen={setOpen("countryLivingIn")}
            onSelect={setCountryLivingIn}
            items={COUNTRY_OPTIONS}
            dropdownClassName="max-h-[300px]"
          />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Residing district or city" align="center">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city or district"
            className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]"
          />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Citizenship" align="center">
          <DropdownField
            typeable
            compact
            placeholder="Select country"
            value={citizenship}
            open={opens.citizenship}
            setOpen={setOpen("citizenship")}
            onSelect={setCitizenship}
            items={COUNTRY_OPTIONS}
            dropdownClassName="max-h-[300px]"
          />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Resident status" align="center">
          <DropdownField
            typeable
            compact
            placeholder="Select"
            value={residentStatus}
            open={opens.residentStatus}
            setOpen={setOpen("residentStatus")}
            onSelect={setResidentStatus}
            items={RESIDENT_STATUS_OPTIONS}
            dropdownClassName="max-h-[260px]"
          />
        </FormRow>
      </div>
    </div>
  );
}