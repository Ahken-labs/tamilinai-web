"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import Button from "../../common-layout/Button";
import { EDUCATION_OPTIONS, SECTOR } from "@/src/constants/profiles";
import { CURRENCY_OPTIONS } from "@/src/constants/currencies";
import type { Me } from "@/src/types/user";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";
import { useLoadingText } from "@/src/hooks/useLoadingText";

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
type Props = { me: Me | null; onDirty: () => void; onSave: () => Promise<void> };

export default function CareerEducationSection({ me, onDirty, onSave }: Props) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const p = me?.profile;
  const saved = getDraft();

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [highestEducation, setHighestEducation] = useState(saved?.education ?? p?.education ?? "");
  const [educationDetail, setEducationDetail] = useState(saved?.educationDetail ?? p?.educationDetail ?? "");
  const [occupation, setOccupation] = useState(saved?.occupation ?? p?.occupation ?? "");
  const [sector, setSector] = useState(saved?.sector ?? p?.sector ?? "");
  const [currency, setCurrency] = useState(saved?.currency ?? p?.incomeCurrency ?? "");
  const [monthlyIncome, setMonthlyIncome] = useState(saved?.monthlyIncome ?? (p?.monthlyIncome != null ? String(p.monthlyIncome) : ""));
  const [saving, setSaving] = useState(false);
  const [saveReady, setSaveReady] = useState(false);
  const loadingText = useLoadingText(saving, "save");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSaveReady(true); }, []);

  const setOpen = (key: OpenKey) => (val: boolean) => setOpens({ ...ALL_CLOSED, [key]: val });
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty);

  const isDirty = saveReady && (
    highestEducation !== (p?.education ?? "") ||
    educationDetail !== (p?.educationDetail ?? "") ||
    occupation !== (p?.occupation ?? "") ||
    sector !== (p?.sector ?? "") ||
    currency !== (p?.incomeCurrency ?? "") ||
    monthlyIncome !== (p?.monthlyIncome != null ? String(p.monthlyIncome) : "")
  );

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try { await onSave(); } finally { setSaving(false); }
  }

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        <FormRow leftWidth={leftWidth} required label="Highest education" align="center">
          <DropdownField typeable compact placeholder="Select" value={highestEducation} open={opens.education} setOpen={setOpen("education")} onSelect={v => { setHighestEducation(v); sync({ education: v }); }} items={EDUCATION_OPTIONS} bgClassName={mounted && highestEducation ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && highestEducation ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && highestEducation ? "text-[#222222]" : "text-[#656565]"} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Education detail" align="center">
          <input value={educationDetail} onChange={e => { setEducationDetail(e.target.value); sync({ educationDetail: e.target.value }); }} placeholder="Type here" className={`font-poppins flex-1 h-[40px] w-full items-center rounded-[12px] border px-4 text-[16px] text-dark outline-none placeholder:text-[#656565] ${mounted && educationDetail ? "border-[#F2F2F2] bg-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)] bg-[#FFF0F3]"}`} />
        </FormRow>

        <FormRow leftWidth={leftWidth} required label="Occupation" align="center">
          <input value={occupation} onChange={e => { setOccupation(e.target.value); sync({ occupation: e.target.value }); }} placeholder="Enter your job / work" className={`flex h-[40px] w-full items-center rounded-[12px] border px-4 text-[16px] text-dark outline-none placeholder:text-[#525252] ${mounted && occupation ? "border-[#F2F2F2] bg-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)] bg-[#FFF0F3]"}`} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Sector" align="center">
          <DropdownField typeable compact placeholder="Select sector" textClassName={mounted && sector ? "text-[#222222]" : "text-[#656565]"} value={sector} open={opens.sector} setOpen={setOpen("sector")} onSelect={v => { setSector(v); sync({ sector: v }); }} items={SECTOR} bgClassName={mounted && sector ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && sector ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Monthly income">
          <div className="flex gap-4 max-[400px]:flex-col flex-wrap">
            <DropdownField typeable compact placeholder="Select currency" value={currency} open={opens.currency} setOpen={setOpen("currency")} onSelect={v => { setCurrency(v); sync({ currency: v }); }} items={CURRENCY_OPTIONS} dropdownClassName="max-h-[300px] min-[401px]:min-w-[200px]" className="flex-1 min-[401px]:max-w-[200px]" textClassName={mounted && currency ? "text-[#222222]" : "text-[#656565]"} bgClassName={mounted && currency ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && currency ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} />
            <input value={monthlyIncome} onChange={e => { const v = e.target.value.replace(/\D/g, ""); setMonthlyIncome(v); sync({ monthlyIncome: v }); }} placeholder="Enter monthly income" className={`flex-1 max-[400]:py-[10px] h-[40px] w-full items-center rounded-[12px] border px-4 text-[16px] text-dark outline-none placeholder:text-[#656565] ${mounted && monthlyIncome ? "border-[#F2F2F2] bg-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)] bg-[#FFF0F3]"}`} />
          </div>
        </FormRow>

      </div>

      {isDirty && (
        <div className="mt-6 md:mt-8 pt-4 border-t border-[#EAEAEA]">
          <div className="flex">
            <div className="flex-1 hidden min-[500px]:block" />
            <Button text={saving ? loadingText : "Save"} onPress={handleSave} className="flex-1" />
          </div>
        </div>
      )}
    </div>
  );
}
