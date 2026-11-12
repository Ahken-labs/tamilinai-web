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
const upTo = (total: string) => Array.from({ length: Number(total) + 1 }, (_, i) => String(i));
// Married can't be more than the total, and is 0 when the total is 0
function capMarried(total: string, married: string): string {
  if (total === "0") return "0";
  return married !== "" && total !== "" && Number(married) > Number(total) ? total : married;
}

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

  // Married is locked at 0 brothers/sisters, so an empty saved value would be stuck forever; fill it with 0 so Save can store it
  useEffect(() => {
    const fix: Record<string, string> = {};
    if (brothers === "0" && brothersMarried !== "0") fix.brothersMarried = "0";
    if (sisters === "0" && sistersMarried !== "0") fix.sistersMarried = "0";
    if (!Object.keys(fix).length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fix.brothersMarried) setBrothersMarried("0");
    if (fix.sistersMarried) setSistersMarried("0");
    mergeDraft(fix, onDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const brothersMarriedLocked = brothers === "" || brothers === "0";
  const sistersMarriedLocked = sisters === "" || sisters === "0";
  // Clicking a locked "married" field opens its total instead, like caste opens religion
  const setOpen = (key: OpenKey) => (val: boolean) => {
    if (val && key === "brothersMarried" && brothersMarriedLocked) return setOpens({ ...ALL_CLOSED, brothers: true });
    if (val && key === "sistersMarried" && sistersMarriedLocked) return setOpens({ ...ALL_CLOSED, sisters: true });
    setOpens({ ...ALL_CLOSED, [key]: val });
  };
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty);

  function selectBrothers(v: string) {
    const married = capMarried(v, brothersMarried);
    setBrothers(v); setBrothersMarried(married);
    sync({ brothers: v, brothersMarried: married });
  }
  function selectSisters(v: string) {
    const married = capMarried(v, sistersMarried);
    setSisters(v); setSistersMarried(married);
    sync({ sisters: v, sistersMarried: married });
  }

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
          <DropdownField compact placeholder="Select" bgClassName={mounted && brothers ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && brothers ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && brothers ? "text-[#222222]" : "text-[#656565]"} value={mounted ? brothers : ""} open={opens.brothers} setOpen={setOpen("brothers")} onSelect={selectBrothers} items={NUMBER_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Brother(s) married" align="center">
          <DropdownField compact placeholder="Select" bgClassName={mounted && (brothersMarried || brothersMarriedLocked) ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && (brothersMarried || brothersMarriedLocked) ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && brothersMarried && !brothersMarriedLocked ? "text-[#222222]" : "text-[#656565]"} value={mounted ? brothersMarried : ""} open={!brothersMarriedLocked && opens.brothersMarried} setOpen={setOpen("brothersMarried")} onSelect={v => { setBrothersMarried(v); sync({ brothersMarried: v }); }} items={brothersMarriedLocked ? [] : upTo(brothers)} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Number of sister(s)" align="center">
          <DropdownField compact placeholder="Select" bgClassName={mounted && sisters ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && sisters ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && sisters ? "text-[#222222]" : "text-[#656565]"} value={mounted ? sisters : ""} open={opens.sisters} setOpen={setOpen("sisters")} onSelect={selectSisters} items={NUMBER_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Sister(s) married" align="center">
          <DropdownField compact placeholder="Select" bgClassName={mounted && (sistersMarried || sistersMarriedLocked) ? "bg-[#F2F2F2]" : "bg-[#FFF0F3]"} borderClassName={mounted && (sistersMarried || sistersMarriedLocked) ? "border-[#F2F2F2]" : "border-[rgba(179,27,56,0.25)]"} textClassName={mounted && sistersMarried && !sistersMarriedLocked ? "text-[#222222]" : "text-[#656565]"} value={mounted ? sistersMarried : ""} open={!sistersMarriedLocked && opens.sistersMarried} setOpen={setOpen("sistersMarried")} onSelect={v => { setSistersMarried(v); sync({ sistersMarried: v }); }} items={sistersMarriedLocked ? [] : upTo(sisters)} />
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
