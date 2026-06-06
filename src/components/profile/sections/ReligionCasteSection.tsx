"use client";

import { useState, useEffect } from "react";
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

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [religion, setReligion] = useState(p?.religion ?? "");
  const [caste, setCaste] = useState(p?.caste ?? "");
  const [casteOther, setCasteOther] = useState("");
  const [casteOtherError, setCasteOtherError] = useState("");

  useEffect(() => {
    const saved = getDraft();
    if (!saved) return;
    if (saved.religion !== undefined) setReligion(saved.religion);
    if (saved.caste !== undefined) setCaste(saved.caste);
  }, []);

  const setOpen = (key: OpenKey) => (val: boolean) => {
    if (key === "caste" && val && !religion) {
      setOpens({ ...ALL_CLOSED, religion: true });
      return;
    }
    setOpens({ ...ALL_CLOSED, [key]: val });
  };
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty);

  let casteOptions: string[] = [];
  if (religion === "Hindu") casteOptions = CASTE_OPTIONS_HINDU;
  else if (religion === "Christian") casteOptions = CASTE_OPTIONS_CHRISTIAN;
  else if (religion === "Prefer not to say") {
    const tail = ["Other", "Prefer not to say"];
    const merged = [...CASTE_OPTIONS_HINDU, ...CASTE_OPTIONS_CHRISTIAN].filter(c => !tail.includes(c));
    casteOptions = [...new Set(merged), ...tail];
  }

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        <FormRow leftWidth={leftWidth} required label="Religion" align="center">
          <DropdownField typeable compact placeholder="Select religion" value={religion} open={opens.religion} setOpen={setOpen("religion")}
            onSelect={v => { setReligion(v); setCaste(""); sync({ religion: v, caste: "" }); }} items={RELIGION_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Caste or denomination" align="center">
          <DropdownField typeable compact placeholder={religion ? "Select caste / denomination" : "Select religion first"} value={caste} open={opens.caste} setOpen={setOpen("caste")} onSelect={v => { setCaste(v); setCasteOther(""); sync({ caste: v === "Other" ? "" : v }); }} items={casteOptions} dropdownClassName="max-h-[300px]" />
        </FormRow>

        {caste === "Other" && (
          <FormRow leftWidth={leftWidth} required label="Please specify" align="center" error={casteOtherError}>
            <input
              value={casteOther}
              onChange={(e) => {
                setCasteOther(e.target.value);
                setCasteOtherError("");
                sync({ caste: e.target.value.trim() });
              }}
              onBlur={() => {
                if (!casteOther.trim()) setCasteOtherError("*Please specify your caste");
              }}
              placeholder="Type here..."
              className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#525252]"
            />
          </FormRow>
        )}

      </div>
    </div>
  );
}
