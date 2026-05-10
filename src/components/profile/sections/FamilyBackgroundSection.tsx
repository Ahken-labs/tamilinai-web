"use client";
import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";

const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]"

type OpenKey =
  | "brothers"
  | "brothersMarried"
  | "sisters"
  | "sistersMarried";

const ALL_CLOSED: Record<OpenKey, boolean> = {
  brothers: false,
  brothersMarried: false,
  sisters: false,
  sistersMarried: false,
};
export default function FamilyBackgroundSection() {

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);

  const [fatherOccupation, setFatherOccupation] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");

  const [brothers, setBrothers] = useState("");
  const [brothersMarried, setBrothersMarried] = useState("");

  const [sisters, setSisters] = useState("");
  const [sistersMarried, setSistersMarried] = useState("");

  const setOpen = (key: OpenKey) => (val: boolean) =>
    setOpens({ ...ALL_CLOSED, [key]: val });

  const NUMBER_OPTIONS = Array.from({ length: 9 }, (_, i) => String(i));

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        {/* Father’s occupation*/}
        <FormRow leftWidth={leftWidth} label="Father’s occupation" align="center">
          <input
            value={fatherOccupation}
            onChange={(e) => setFatherOccupation(e.target.value)}
            placeholder="Type here"
            className="font-poppins flex-1 h-[40px] border-[rgba(179,27,56,0.25)] w-full items-center rounded-[12px] border bg-[#FFF0F3] px-4 font-16 text-dark outline-none placeholder:text-[#656565]"
          />
        </FormRow>

        {/* Mom’s occupation*/}
        <FormRow leftWidth={leftWidth} label="Mom’s occupation" align="center">
          <input
            value={motherOccupation}
            onChange={(e) => setMotherOccupation(e.target.value)}
            placeholder="Type here"
            className="font-poppins flex-1 h-[40px] border-[rgba(179,27,56,0.25)] w-full items-center rounded-[12px] border bg-[#FFF0F3] px-4 font-16 text-dark outline-none placeholder:text-[#656565]"
          />
        </FormRow>

        {/* Number of brother(s)*/}
        <FormRow leftWidth={leftWidth} label="Number of brother(s)" align="center">
          <DropdownField
            typeable compact
            placeholder="Select"
            bgClassName="bg-[#FFF0F3]"
            borderClassName="border-[rgba(179,27,56,0.25)]"
            textClassName="text-[#656565]"
            value={brothers}
            open={opens.brothers}
            setOpen={setOpen("brothers")}
            onSelect={setBrothers}
            items={NUMBER_OPTIONS}
          />
        </FormRow>

        {/* Brother(s) married*/}
        <FormRow leftWidth={leftWidth} label="Brother(s) married" align="center">
          <DropdownField
            typeable compact
            placeholder="Select"
            bgClassName="bg-[#FFF0F3]"
            borderClassName="border-[rgba(179,27,56,0.25)]"
            textClassName="text-[#656565]"
            value={brothersMarried}
            open={opens.brothersMarried}
            setOpen={setOpen("brothersMarried")}
            onSelect={setBrothersMarried}
            items={NUMBER_OPTIONS}
          />
        </FormRow>

        {/* Number of sister(s)*/}
        <FormRow leftWidth={leftWidth} label="Number of sister(s)" align="center">
          <DropdownField
            typeable compact
            placeholder="Select"
            bgClassName="bg-[#FFF0F3]"
            borderClassName="border-[rgba(179,27,56,0.25)]"
            textClassName="text-[#656565]"
            value={sisters}
            open={opens.sisters}
            setOpen={setOpen("sisters")}
            onSelect={setSisters}
            items={NUMBER_OPTIONS}
          />
        </FormRow>

        {/* Sister(s) married*/}
        <FormRow leftWidth={leftWidth} label="Sister(s) married" align="center">
          <DropdownField
            typeable compact
            placeholder="Select"
            bgClassName="bg-[#FFF0F3]"
            borderClassName="border-[rgba(179,27,56,0.25)]"
            textClassName="text-[#656565]"
            value={sistersMarried}
            open={opens.sistersMarried}
            setOpen={setOpen("sistersMarried")}
            onSelect={setSistersMarried}
            items={NUMBER_OPTIONS}
          />
        </FormRow>
      </div>
    </div>
  );
}
