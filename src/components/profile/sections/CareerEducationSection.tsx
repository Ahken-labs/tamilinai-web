"use client";

import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import { EDUCATION_OPTIONS, SECTOR } from "@/src/constants/profiles";
import { CURRENCY_OPTIONS } from "@/src/constants/currencies";
import type { Me } from "@/src/types/user";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";

const KEY = DRAFT_KEYS.career;
const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";

function getDraft() {
  try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function mergeDraft(partial: Record<string, unknown>, onDirty: () => void) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ...getDraft(), ...partial })); onDirty(); } catch {}
}

type OpenKey = "education" | "sector" | "currency";
const ALL_CLOSED: Record<OpenKey, boolean> = { education: false, sector: false, currency: false };
type Props = { me: Me | null; onDirty: () => void };

export default function CareerEducationSection({ me, onDirty }: Props) {
  const p = me?.profile;
  const saved = getDraft();

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [highestEducation, setHighestEducation] = useState(saved?.education ?? p?.education ?? "");
  const [educationDetail, setEducationDetail] = useState(saved?.educationDetail ?? p?.educationDetail ?? "");
  const [occupation, setOccupation] = useState(saved?.occupation ?? p?.occupation ?? "");
  const [sector, setSector] = useState(saved?.sector ?? p?.sector ?? "");
  const [currency, setCurrency] = useState(saved?.currency ?? p?.incomeCurrency ?? "");
  const [monthlyIncome, setMonthlyIncome] = useState(saved?.monthlyIncome ?? (p?.monthlyIncome != null ? String(p.monthlyIncome) : ""));

  const setOpen = (key: OpenKey) => (val: boolean) => setOpens({ ...ALL_CLOSED, [key]: val });
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty);

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        <FormRow leftWidth={leftWidth} required label="Highest education" align="center">
          <DropdownField typeable compact placeholder="Select" value={highestEducation} open={opens.education} setOpen={setOpen("education")} onSelect={v => { setHighestEducation(v); sync({ education: v }); }} items={EDUCATION_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Education detail" align="center">
          <input value={educationDetail} onChange={e => { setEducationDetail(e.target.value); sync({ educationDetail: e.target.value }); }} placeholder="Type here" className="font-poppins flex-1 h-[40px] border-[rgba(179,27,56,0.25)] w-full items-center rounded-[12px] border bg-[#FFF0F3] px-4 font-16 text-dark outline-none placeholder:text-[#656565]" />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Occupation" align="center">
          <input value={occupation} onChange={e => { setOccupation(e.target.value); sync({ occupation: e.target.value }); }} placeholder="Enter your job / work" className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]" />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Sector" align="center">
          <DropdownField typeable compact placeholder="Select sector" bgClassName="bg-[#FFF0F3]" borderClassName="border-[rgba(179,27,56,0.25)]" textClassName="text-[#656565]" value={sector} open={opens.sector} setOpen={setOpen("sector")} onSelect={v => { setSector(v); sync({ sector: v }); }} items={SECTOR} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Monthly income">
          <div className="flex gap-4 flex-wrap">
            <DropdownField typeable compact placeholder="Select currency" value={currency} open={opens.currency} setOpen={setOpen("currency")} onSelect={v => { setCurrency(v); sync({ currency: v }); }} items={CURRENCY_OPTIONS} dropdownClassName="max-h-[300px]" className="flex-1" bgClassName="bg-[#FFF0F3]" borderClassName="border-[rgba(179,27,56,0.25)]" textClassName="text-[#656565]" />
            <input value={monthlyIncome} onChange={e => { setMonthlyIncome(e.target.value); sync({ monthlyIncome: e.target.value }); }} placeholder="Enter monthly income" className="flex-1 h-[40px] border-[rgba(179,27,56,0.25)] w-full items-center rounded-[12px] border bg-[#FFF0F3] px-4 font-16 text-dark outline-none placeholder:text-[#656565]" />
          </div>
        </FormRow>

      </div>
    </div>
  );
}
