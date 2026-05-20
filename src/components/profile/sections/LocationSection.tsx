"use client";

import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import { COUNTRY_OPTIONS, RESIDENT_STATUS_OPTIONS } from "@/src/constants/location";
import type { Me } from "@/src/types/user";
import { RESIDENT_FROM_BE } from "@/src/utils/profileMappers";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";

const KEY = DRAFT_KEYS.location;
const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";

function getDraft() {
  try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function mergeDraft(partial: Record<string, unknown>, onDirty: () => void) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ...getDraft(), ...partial })); onDirty(); } catch {}
}

type OpenKey = "countryLivingIn" | "citizenship" | "residentStatus";
const ALL_CLOSED: Record<OpenKey, boolean> = { countryLivingIn: false, citizenship: false, residentStatus: false };
type Props = { me: Me | null; onDirty: () => void };

export default function LocationSection({ me, onDirty }: Props) {
  const p = me?.profile;
  const saved = getDraft();

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [countryLivingIn, setCountryLivingIn] = useState(saved?.countryLivingIn ?? p?.country ?? "");
  const [city, setCity] = useState(saved?.city ?? p?.city ?? "");
  const [citizenship, setCitizenship] = useState(saved?.citizenship ?? p?.citizenship ?? "");
  const [residentStatus, setResidentStatus] = useState(saved?.residentStatus ?? RESIDENT_FROM_BE[p?.residentStatus ?? ""] ?? "");

  const setOpen = (key: OpenKey) => (val: boolean) => setOpens({ ...ALL_CLOSED, [key]: val });
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty);

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        <FormRow leftWidth={leftWidth} required label="Country living in" align="center">
          <DropdownField typeable compact placeholder="Select country" value={countryLivingIn} open={opens.countryLivingIn} setOpen={setOpen("countryLivingIn")} onSelect={v => { setCountryLivingIn(v); sync({ countryLivingIn: v }); }} items={COUNTRY_OPTIONS} dropdownClassName="max-h-[300px]" />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Residing district or city" align="center">
          <input value={city} onChange={e => { setCity(e.target.value); sync({ city: e.target.value }); }} placeholder="Enter city or district" className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]" />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Citizenship" align="center">
          <DropdownField typeable compact placeholder="Select country" value={citizenship} open={opens.citizenship} setOpen={setOpen("citizenship")} onSelect={v => { setCitizenship(v); sync({ citizenship: v }); }} items={COUNTRY_OPTIONS} dropdownClassName="max-h-[300px]" />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Resident status" align="center">
          <DropdownField typeable compact placeholder="Select" value={residentStatus} open={opens.residentStatus} setOpen={setOpen("residentStatus")} onSelect={v => { setResidentStatus(v); sync({ residentStatus: v }); }} items={RESIDENT_STATUS_OPTIONS} dropdownClassName="max-h-[260px]" />
        </FormRow>

      </div>
    </div>
  );
}
