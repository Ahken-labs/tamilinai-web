"use client";

import { useState } from "react";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import { DIET_OPTIONS, DRINKING_OPTIONS, SMOKING_OPTIONS } from "@/src/constants/profiles";
import type { Me } from "@/src/types/user";
import { DIET_FROM_BE, SMOKE_FROM_BE, DRINK_FROM_BE } from "@/src/utils/profileMappers";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";

const KEY = DRAFT_KEYS.lifestyle;
const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";

function getDraft() {
  try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function mergeDraft(partial: Record<string, unknown>, onDirty: () => void) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ ...getDraft(), ...partial })); onDirty(); } catch {}
}

type OpenKey = "dietHabit" | "smokingHabit" | "drinkingHabit";
const ALL_CLOSED: Record<OpenKey, boolean> = { dietHabit: false, smokingHabit: false, drinkingHabit: false };
type Props = { me: Me | null; onDirty: () => void };

export default function LifestyleSection({ me, onDirty }: Props) {
  const p = me?.profile;
  const saved = getDraft();

  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);
  const [dietHabit, setDietHabit] = useState(saved?.dietHabit ?? DIET_FROM_BE[p?.dietHabit ?? ""] ?? "");
  const [smokingHabit, setSmokingHabit] = useState(saved?.smokingHabit ?? SMOKE_FROM_BE[p?.smokingHabit ?? ""] ?? "");
  const [drinkingHabit, setDrinkingHabit] = useState(saved?.drinkingHabit ?? DRINK_FROM_BE[p?.drinkingHabit ?? ""] ?? "");

  const setOpen = (key: OpenKey) => (val: boolean) => setOpens({ ...ALL_CLOSED, [key]: val });
  const sync = (partial: Record<string, unknown>) => mergeDraft(partial, onDirty);

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">

        <FormRow leftWidth={leftWidth} label="Diet habit" align="center">
          <DropdownField typeable compact placeholder="Select" bgClassName="bg-[#FFF0F3]" borderClassName="border-[rgba(179,27,56,0.25)]" textClassName="text-[#656565]" value={dietHabit} open={opens.dietHabit} setOpen={setOpen("dietHabit")} onSelect={v => { setDietHabit(v); sync({ dietHabit: v }); }} items={DIET_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Smoking habit" align="center">
          <DropdownField typeable compact placeholder="Select" bgClassName="bg-[#FFF0F3]" borderClassName="border-[rgba(179,27,56,0.25)]" textClassName="text-[#656565]" value={smokingHabit} open={opens.smokingHabit} setOpen={setOpen("smokingHabit")} onSelect={v => { setSmokingHabit(v); sync({ smokingHabit: v }); }} items={SMOKING_OPTIONS} />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Drinking habit" align="center">
          <DropdownField typeable compact placeholder="Select" bgClassName="bg-[#FFF0F3]" borderClassName="border-[rgba(179,27,56,0.25)]" textClassName="text-[#656565]" value={drinkingHabit} open={opens.drinkingHabit} setOpen={setOpen("drinkingHabit")} onSelect={v => { setDrinkingHabit(v); sync({ drinkingHabit: v }); }} items={DRINKING_OPTIONS} />
        </FormRow>

      </div>
    </div>
  );
}
