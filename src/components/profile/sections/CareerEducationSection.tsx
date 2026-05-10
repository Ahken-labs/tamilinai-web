"use client";
import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import { EDUCATION_OPTIONS, SECTOR, } from "@/src/constants/profiles";
import { CURRENCY_OPTIONS } from "@/src/constants/currencies";

const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]"

type OpenKey = "education" | "sector" | "currency";

const ALL_CLOSED: Record<OpenKey, boolean> = {
  education: false,
  sector: false,
  currency: false,
};

export default function CareerEducationSection() {
  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);

  const [highestEducation, setHighestEducation] = useState("");
  const [educationDetail, setEducationDetail] = useState("");
  const [sector, setSector] = useState("");
  const [currency, setCurrency] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  const setOpen = (key: OpenKey) => (val: boolean) =>
    setOpens({ ...ALL_CLOSED, [key]: val });

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        {/* Heghest education */}
        <FormRow leftWidth={leftWidth} required label="Highest education" align="center">
          <DropdownField
            typeable
            compact
            placeholder="Select"
            value={highestEducation}
            open={opens.education}
            setOpen={setOpen("education")}
            onSelect={setHighestEducation}
            items={EDUCATION_OPTIONS}
          />
        </FormRow>

        {/* Education detail*/}
        <FormRow leftWidth={leftWidth} label="Education detail" align="center">
          <input
            value={educationDetail}
            onChange={(e) => setEducationDetail(e.target.value)}
            placeholder="Type here"
            className="font-poppins flex-1 h-[40px] border-[rgba(179,27,56,0.25)] w-full items-center rounded-[12px] border bg-[#FFF0F3] px-4 font-16 text-dark outline-none placeholder:text-[#656565]"
          />

        </FormRow>

        {/* sector*/}
        <FormRow leftWidth={leftWidth} label="Sector" align="center">
          <DropdownField
            typeable compact
            placeholder="Select sector"
            bgClassName="bg-[#FFF0F3]"
            borderClassName="border-[rgba(179,27,56,0.25)]"
            textClassName="text-[#656565]"
            value={sector}
            open={opens.sector}
            setOpen={setOpen("sector")}
            onSelect={setSector}
            items={SECTOR}
          />
        </FormRow>

        {/* Occupation*/}
        <FormRow leftWidth={leftWidth} required label="Occupation" align="center">
          <input
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="Enter your job / Work"
            className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]"
          />
        </FormRow>

        {/* Income*/}
        <FormRow leftWidth={leftWidth} label="Monthly income">
          <div className="flex gap-4 flex-wrap">
            <DropdownField typeable compact placeholder="Select currency"
              value={currency}
              open={opens.currency}
              setOpen={setOpen("currency")}
              onSelect={setCurrency}
              items={CURRENCY_OPTIONS}
              dropdownClassName="max-h-[300px]"
              className="flex-1"
              bgClassName="bg-[#FFF0F3]"
              borderClassName="border-[rgba(179,27,56,0.25)]"
              textClassName="text-[#656565]"
            />
            <input
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="Enter monthly income"
              className="flex-1 h-[40px] border-[rgba(179,27,56,0.25)] w-full items-center rounded-[12px] border bg-[#FFF0F3] px-4 font-16 text-dark outline-none placeholder:text-[#656565]"
            />
          </div>
        </FormRow>
      </div>
    </div>
  );
}
