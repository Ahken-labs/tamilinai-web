"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import Button from "../../common-layout/Button";
import type { Me } from "@/src/types/user";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";
import { useLoadingText } from "@/src/hooks/useLoadingText";

const KEY = DRAFT_KEYS.family;
const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";
const NUMBER_OPTIONS = Array.from({ length: 9 }, (_, i) => String(i));

function getDraft() {
  try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function mergeDraft(partial: Record<string, unknown>, onDirty: () => void) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ...getDraft(), ...partial })); onDirty(); } catch {}
}

type OpenKey = "brothers" | "brothersMarried" | "sisters" | "sistersMarried";
const ALL_CLOSED: Record<OpenKey, boolean> = { brothers: false, brothersMarried: false, sisters: false, sistersMarried: false };
type Props = { me: Me | null; onDirty: () => void; onSave: () => Promise<void> };

export default function FamilyBackgroundSection({ me, onDirty, onSave }: Props) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const p = me?.profile;
  const saved = getDraft();

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [fatherOccupation, setFatherOccupation] = useState(saved?.fatherOccupation ?? p?.fatherOccupation ?? "");
  const [motherOccupation, setMotherOccupation] = useState(saved?.motherOccupation ?? p?.motherOccupation ?? "");
  const [brothers, setBrothers] = useState(saved?.brothers ?? (p?.brotherCount != null ? String(p.brotherCount) : ""));
  const [brothersMarried, setBrothersMarried] = useState(saved?.brothersMarried ?? (p?.brothersMarried != null ? String(p.brothersMarried) : ""));
  const [sisters, setSisters] = useState(saved?.sisters ?? (p?.sisterCount != null ? String(p.sisterCount) : ""));
  const [sistersMarried, setSistersMarried] = useState(saved?.sistersMarried ?? (p?.sistersMarried != null ? String(p.sistersMarried) : ""));
  const [saving, setSaving] = useState(false);
  const [saveReady, setSaveReady] = useState(false);
  const loadingText = useLoadingText(saving, "save");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSaveReady(true); }, []);

  const setOpen = (key: OpenKey) => (val: boolean) => setOpens({ ...ALL_CLOSED, [key]: val });
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty);

  const isDirty = saveReady && (
    fatherOccupation !== (p?.fatherOccupation ?? "") ||
    motherOccupation !== (p?.motherOccupation ?? "") ||
    brothers !== (p?.brotherCount != null ? String(p.brotherCount) : "") ||
    brothersMarried !== (p?.brothersMarried != null ? String(p.brothersMarried) : "") ||
    sisters !== (p?.sisterCount != null ? String(p.sisterCount) : "") ||
    sistersMarried !== (p?.sistersMarried != null ? String(p.sistersMarried) : "")
  );

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try { await onSave(); } finally { setSaving(false); }
  }

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        <FormRow leftWidth={leftWidth} label="Father's occupation" align="center">
          <input value={fatherOccupation} onChange={e => { setFatherOccupation(e.target.value); sync({ fatherOccupation: e.target.value }); }} placeholder="Type here" className={`font-poppins flex-1 h-[40px] w-full items-center rounded-[12px] border px-4 text-[16px] text-dark outline-none placeholder:text-[#656565] ${mounted && fatherOccupation ? "border-[#F2F2F2] bg-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)] bg-[#FFF0F3]"}`} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Mom's occupation" align="center">
          <input value={motherOccupation} onChange={e => { setMotherOccupation(e.target.value); sync({ motherOccupation: e.target.value }); }} placeholder="Type here" className={`font-poppins flex-1 h-[40px] w-full items-center rounded-[12px] border px-4 text-[16px] text-dark outline-none placeholder:text-[#656565] ${mounted && motherOccupation ? "border-[#F2F2F2] bg-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)] bg-[#FFF0F3]"}`} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Number of brother(s)" align="center">
          <DropdownField typeable numberOnly compact placeholder="Select" bgClassName={mounted && brothers ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && brothers ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && brothers ? "text-[#222222]" : "text-[#656565]"} value={brothers} open={opens.brothers} setOpen={setOpen("brothers")} onSelect={v => { setBrothers(v); sync({ brothers: v }); }} items={NUMBER_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Brother(s) married" align="center">
          <DropdownField typeable numberOnly compact placeholder="Select" bgClassName={mounted && brothersMarried ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && brothersMarried ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && brothersMarried ? "text-[#222222]" : "text-[#656565]"} value={brothersMarried} open={opens.brothersMarried} setOpen={setOpen("brothersMarried")} onSelect={v => { setBrothersMarried(v); sync({ brothersMarried: v }); }} items={NUMBER_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Number of sister(s)" align="center">
          <DropdownField typeable numberOnly compact placeholder="Select" bgClassName={mounted && sisters ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && sisters ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && sisters ? "text-[#222222]" : "text-[#656565]"} value={sisters} open={opens.sisters} setOpen={setOpen("sisters")} onSelect={v => { setSisters(v); sync({ sisters: v }); }} items={NUMBER_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Sister(s) married" align="center">
          <DropdownField typeable numberOnly compact placeholder="Select" bgClassName={mounted && sistersMarried ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && sistersMarried ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && sistersMarried ? "text-[#222222]" : "text-[#656565]"} value={sistersMarried} open={opens.sistersMarried} setOpen={setOpen("sistersMarried")} onSelect={v => { setSistersMarried(v); sync({ sistersMarried: v }); }} items={NUMBER_OPTIONS} />
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
