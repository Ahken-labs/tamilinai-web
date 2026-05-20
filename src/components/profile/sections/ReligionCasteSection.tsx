"use client";

import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import { RELIGION_OPTIONS, CASTE_OPTIONS_HINDU, CASTE_OPTIONS_CHRISTIAN } from "@/src/constants/profiles";
import type { Me } from "@/src/types/user";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";

const KEY = DRAFT_KEYS.religion;
const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";

function getDraft() {
  try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function mergeDraft(partial: Record<string, unknown>, onDirty: () => void) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ...getDraft(), ...partial })); onDirty(); } catch {}
}

type OpenKey = "religion" | "caste";
const ALL_CLOSED: Record<OpenKey, boolean> = { religion: false, caste: false };
type Props = { me: Me | null; onDirty: () => void };

export default function ReligionCasteSection({ me, onDirty }: Props) {
  const p = me?.profile;
  const saved = getDraft();

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [religion, setReligion] = useState(saved?.religion ?? p?.religion ?? "");
  const [caste, setCaste] = useState(saved?.caste ?? p?.caste ?? "");

  const setOpen = (key: OpenKey) => (val: boolean) => setOpens({ ...ALL_CLOSED, [key]: val });
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty);

  let casteOptions: string[] = [];
  if (religion === "Hindu") casteOptions = CASTE_OPTIONS_HINDU;
  else if (religion === "Christian") casteOptions = CASTE_OPTIONS_CHRISTIAN;

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        <FormRow leftWidth={leftWidth} required label="Religion" align="center">
          <DropdownField typeable compact placeholder="Select religion" value={religion} open={opens.religion} setOpen={setOpen("religion")}
            onSelect={v => { setReligion(v); setCaste(""); sync({ religion: v, caste: "" }); }} items={RELIGION_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Caste or denomination" align="center">
          <DropdownField typeable compact placeholder={religion ? "Select caste / denomination" : "Select religion first"} value={caste} open={opens.caste} setOpen={setOpen("caste")} onSelect={v => { setCaste(v); sync({ caste: v }); }} items={casteOptions} dropdownClassName="max-h-[300px]" />
        </FormRow>

      </div>
    </div>
  );
}
