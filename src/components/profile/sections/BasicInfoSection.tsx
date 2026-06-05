"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronIcon, RadioCircleIcon, SearchIcon, CloseCircleIcon } from "../../../assets/Icons";
import DropdownField from "../../common-layout/DropdownField";
import FormRow from "../../common-layout/FormRow";
import { useDOBState } from "../../../hooks/useDOBState";
import { filterItems, filterSearch } from "../../../utils/formUtils";
import { MARITAL_OPTIONS, PHYSICAL_BUILD_OPTIONS, HEIGHTS, WEIGHTS } from "@/src/constants/profiles";
import { ALL_LANGUAGES } from "@/src/constants/languages";
import Button from "../../common-layout/Button";
import type { Me } from "@/src/types/user";
import { MARITAL_FROM_BE, BUILD_FROM_BE, toCmDisplay, toKgDisplay, parseDOB } from "@/src/utils/profileMappers";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";

const KEY = DRAFT_KEYS.basic;

function getDraft() {
  try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function mergeDraft(partial: Record<string, unknown>, onDirty: () => void) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...getDraft(), ...partial }));
    onDirty();
  } catch { }
}

// ── Language data ─────────────────────────────────────────────────────────────
const SL_MOST_SELECTED = ["Tamil", "English", "Sinhala"];
const SL_HIGHLIGHTED = new Set(["Tamil"]);
const MAIN_LANGUAGES = ALL_LANGUAGES.filter((l) => !SL_MOST_SELECTED.includes(l));
const leftWidth = "w-[100px] sm:w-[120px] md:w-[140px] lg:w-[250px]";

function LanguagePopup({ initialSelected, onClose, onConfirm }: {
  initialSelected: string[]; onClose: () => void; onConfirm: (langs: string[]) => void;
}) {
  const [draft, setDraft] = useState<string[]>(initialSelected);
  const [search, setSearch] = useState("");
  const tagsRowRef = useRef<HTMLDivElement>(null);
  const shownMost = useMemo(() => filterSearch(SL_MOST_SELECTED, search), [search]);
  const shownMain = useMemo(() => filterSearch(MAIN_LANGUAGES, search), [search]);
  const noResults = shownMost.length === 0 && shownMain.length === 0;

  useEffect(() => {
    const el = tagsRowRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [draft.length]);

  function toggle(lang: string) {
    setDraft(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  }

  const langBtn = (lang: string) => {
    const isSel = draft.includes(lang);
    const isHL = SL_HIGHLIGHTED.has(lang);
    return (
      <button key={lang} type="button" onClick={() => toggle(lang)}
        className={`rounded-[28px] px-3 py-2.5 text-[16px] font-normal leading-[125%] transition-colors cursor-pointer ${isSel || isHL ? "border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] text-[#222]" : "bg-[#F0F0F0] text-[#656565] hover:bg-[#EAEAEA]"}`}>
        {lang}
      </button>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/50">
      <div className="flex max-h-[90dvh] min-[500px]:max-h-[90vh] w-full min-[500px]:max-w-[920px] flex-col overflow-hidden rounded-t-[16px] min-[500px]:rounded-[16px] bg-white shadow-2xl">

        {/* Header */}
        <div className="shrink-0 px-4 md:px-5 pb-2 pt-4 md:pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="fonts-24 font-semibold text-dark leading-[150%]">Languages spoken</h2>
              <p className="mt-1 font-16 font-normal text-dark leading-[150%]">Select languages you know and add them to your profile.</p>
            </div>
            <button type="button" onClick={onClose} className="cursor-pointer shrink-0"><CloseCircleIcon /></button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto border-t border-[#EAEAEA] max-[500px]:px-0 px-4 md:px-5 max-[500px]:py-4 py-3 md:py-4 pb-[72px] min-[500px]:pb-3 md:pb-4">
          {draft.length > 0 && (
            <div ref={tagsRowRef} className="no-scrollbar flex max-[500px]:flex-nowrap max-[500px]:overflow-x-auto flex-wrap gap-2 md:gap-3 mb-4">
              {draft.map(lang => (
                <button key={lang} type="button" onClick={() => toggle(lang)}
                  className="flex shrink-0 items-center gap-2 rounded-[28px] border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] px-3 py-2.5 cursor-pointer">
                  <span className="text-[16px] font-medium leading-[125%] text-[#222]">{lang}</span>
                  <span className="text-secondary3 text-[18px] leading-none">×</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 max-[500px]:mx-4 rounded-[41px] bg-[#E0E0E0] px-2 py-2">
            <SearchIcon className="h-6 w-6 shrink-0 text-[#525252]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search languages" className="flex-1 bg-transparent font-16 font-normal text-[#656565] placeholder:text-[#656565] outline-none" />
            {search && <button type="button" onClick={() => setSearch("")} className="cursor-pointer pr-1"><CloseCircleIcon fillOpacity="1" fill="#888888" stroke="#FFF" className="w-5 h-5" /></button>}
          </div>
          <hr className="my-4 max-[500px]:mx-4 border-t border-[#D8D8D8]" />
          {noResults && (
            <div className="max-[500px]:mx-4 py-8 flex flex-col items-center gap-2 text-center">
              <p className="text-[16px] font-medium text-dark">No results found</p>
              <p className="text-[14px] max-[500px]:mb-10 font-normal text-secondary3">Try a different spelling or language name</p>
            </div>
          )}
          <div className="max-[500px]:mx-4 flex flex-col gap-5 md:gap-6">
            {shownMost.length > 0 && (
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="text-[16px] font-medium leading-[150%] text-dark">Popular</div>
                <div className="flex flex-wrap gap-2 md:gap-3">{shownMost.map(langBtn)}</div>
                <div className="border-b border-[#D8D8D8]" />
              </div>
            )}
            {shownMain.length > 0 && (
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="text-[16px] font-medium leading-[150%] text-dark">All languages</div>
                <div className="flex flex-wrap gap-2 md:gap-3">{shownMain.map(langBtn)}</div>
              </div>
            )}
          </div>
           <div className="h-20" />
        </div>

        {/* Desktop footer — hidden on mobile */}
        <div className="hidden min-[500px]:flex justify-end gap-4 md:gap-5 border-t border-[#EAEAEA] px-4 md:px-5 py-3 md:py-4 shrink-0">
          <div className="w-full" />
          <Button text="Add languages" onPress={() => { onConfirm(draft); onClose(); }} className="w-full" />
        </div>
      </div>

      {/* Mobile fixed bottom button */}
      <div
        className="min-[500px]:hidden fixed bottom-0 left-0 right-0 px-4 py-2 z-10"
        style={{ background: "rgba(255, 255, 255, 0.60)", backdropFilter: "blur(11px)" }}
      >
        <Button text="Add languages" onPress={() => { onConfirm(draft); onClose(); }} className="!w-full" />
      </div>
    </div>,
    document.body
  );
}

type OpenKey = "height" | "weight" | "physBuild";
const ALL_CLOSED: Record<OpenKey, boolean> = { height: false, weight: false, physBuild: false };
type Props = { me: Me | null; onDirty: () => void };

export default function BasicInfoSection({ me, onDirty }: Props) {
  const p = me?.profile;
  const saved = getDraft();
  const dob = parseDOB(saved?.dateOfBirth ?? p?.dateOfBirth);

  const { birthYear, birthMonth, birthDay, setBirthDay, setMonth, setYear, filtYears, filtMonths, filtDays, dobOpen, setDobFieldOpen } =
    useDOBState({ year: saved?.birthYear ?? dob.year, month: saved?.birthMonth ?? dob.month, day: saved?.birthDay ?? dob.day });

  const serverName = me?.name ?? "";
  const [name, setName] = useState(saved?.name ?? serverName);
  const [maritalStatus, setMaritalStatus] = useState(saved?.maritalStatus ?? MARITAL_FROM_BE[p?.maritalStatus ?? ""] ?? "Unmarried");
  const [height, setHeight] = useState(saved?.height ?? toCmDisplay(p?.heightCm));
  const [weight, setWeight] = useState(saved?.weight ?? toKgDisplay(p?.weightKg));
  const [physicalChallenge, setPhysicalChallenge] = useState<"no" | "yes">(saved?.physicalChallenge ?? (p?.hasPhysicalChallenge ? "yes" : "no"));
  const [disability, setDisability] = useState(saved?.disability ?? p?.disabilityType ?? "");
  const [physBuild, setPhysBuild] = useState(saved?.physBuild ?? BUILD_FROM_BE[p?.physicalBuild ?? ""] ?? "");
  const [languages, setLanguages] = useState<string[]>(saved?.languages ?? p?.languagesSpoken ?? ["Tamil"]);
  const [langPopupOpen, setLangPopupOpen] = useState(false);
  const [opens, setOpens] = useState<Record<OpenKey, boolean>>(ALL_CLOSED);

  const setOpen = (key: OpenKey) => (val: boolean) => setOpens({ ...ALL_CLOSED, [key]: val });
  const filtHeights = useMemo(() => filterItems(HEIGHTS, height), [height]);
  const filtWeights = useMemo(() => filterItems(WEIGHTS, weight), [weight]);

  const sync = useCallback((partial: Record<string, unknown>) => mergeDraft(partial, onDirty), [onDirty]);

  // Always write all three DOB fields together so formatDOB never gets partial data
  const wrappedSetYear = (y: string) => { setYear(y); sync({ birthYear: y, birthMonth, birthDay }); };
  const wrappedSetMonth = (m: string) => { setMonth(m); sync({ birthYear, birthMonth: m, birthDay }); };
  const wrappedSetDay = (d: string) => { setBirthDay(d); sync({ birthYear, birthMonth, birthDay: d }); };

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-col gap-6 md:gap-8">
        <FormRow leftWidth={leftWidth} required label="Name" align="center">
          <input
            value={name}
            onChange={e => { setName(e.target.value); sync({ name: e.target.value }); }}
            onBlur={() => {
              const trimmed = name.trim();
              const invalid = !trimmed || trimmed.length < 3 || /^\d+$/.test(trimmed);
              if (invalid) { setName(serverName); sync({ name: serverName }); }
              else if (trimmed !== name) { setName(trimmed); sync({ name: trimmed }); }
            }}
            placeholder="Your name"
            className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 text-[16px] text-dark outline-none placeholder:text-[#525252]" />
        </FormRow>
        <FormRow leftWidth={leftWidth} label="Date of birth" required>
          <div className="flex gap-4 flex-wrap">
            <DropdownField typeable compact placeholder="Year" value={birthYear} open={dobOpen.year} setOpen={setDobFieldOpen("year")} onSelect={wrappedSetYear} items={filtYears} dropdownClassName="max-h-[300px]" className="flex-1" />
            <DropdownField typeable compact placeholder="Month" value={birthMonth} open={dobOpen.month} setOpen={setDobFieldOpen("month")} onSelect={wrappedSetMonth} items={filtMonths} dropdownClassName="max-h-[300px]" className="flex-1" />
            <DropdownField typeable compact placeholder="Day" value={birthDay} open={dobOpen.day} setOpen={setDobFieldOpen("day")} onSelect={wrappedSetDay} items={filtDays} dropdownClassName="max-h-[300px]" className="flex-1" />
          </div>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Marital status" required>
          <div className="flex max-[370px]:flex-col flex-wrap gap-5 max-[370px]:gap-3 max-[500px]:mt-0.5 mt-3 md:mt-2">
            {MARITAL_OPTIONS.map(opt => (
              <button key={opt} type="button" onClick={() => { setMaritalStatus(opt); sync({ maritalStatus: opt }); }} className="flex items-center gap-2 cursor-pointer">
                <RadioCircleIcon checked={maritalStatus === opt} />
                <span className="text-[16px] font-normal text-secondary4 leading-[125%]">{opt}</span>
              </button>
            ))}
          </div>
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Height" align="center" required>
          <DropdownField typeable compact placeholder="Enter height in Cm" value={height} open={opens.height} setOpen={setOpen("height")} onSelect={v => { setHeight(v); sync({ height: v }); }} items={filtHeights} dropdownClassName="max-h-[200px]" />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Weight" align="center" required>
          <DropdownField typeable compact placeholder="Enter weight in Kg" value={weight} open={opens.weight} setOpen={setOpen("weight")} onSelect={v => { setWeight(v); sync({ weight: v }); }} items={filtWeights} dropdownClassName="max-h-[200px]" />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Any physical challenge?" required>
          <div className="flex items-center gap-5 max-[500px]:mt-0.5 mt-3 md:mt-2">
            {(["no", "yes"] as const).map(val => (
              <button key={val} type="button" onClick={() => { setPhysicalChallenge(val); if (val === "no") setDisability(""); sync({ physicalChallenge: val, disability: val === "no" ? "" : disability }); }} className="flex items-center gap-2 cursor-pointer">
                <RadioCircleIcon checked={physicalChallenge === val} />
                <span className="text-[16px] font-normal text-secondary4 leading-[125%]">{val === "no" ? "No" : "Yes"}</span>
              </button>
            ))}
          </div>
        </FormRow>

        {physicalChallenge === "yes" && (
          <FormRow leftWidth={leftWidth} label="Disability details" align="center" required>
            <input value={disability} onChange={e => { setDisability(e.target.value); sync({ disability: e.target.value }); }} placeholder="Details" className="flex h-[40px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]" />
          </FormRow>
        )}

        <FormRow leftWidth={leftWidth} label="Physical build" align="center">
          <DropdownField typeable compact placeholder="Select fitness type" value={physBuild} open={opens.physBuild} setOpen={setOpen("physBuild")} onSelect={v => { setPhysBuild(v); sync({ physBuild: v }); }} items={PHYSICAL_BUILD_OPTIONS} bgClassName="bg-[#FFF0F3]" borderClassName="border-[rgba(179,27,56,0.25)]" textClassName="text-[#656565]" />
        </FormRow>

        <FormRow leftWidth={leftWidth} label="Languages spoken" align="center">
          <div className="max-[500px]:mt-0.5 mt-3 md:mt-0">
            <button type="button" onClick={() => setLangPopupOpen(true)} className="flex py-5 px-4 items-center w-full rounded-[12px] border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] cursor-pointer">
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                {languages.map(lang => <span key={lang} className="px-3 py-1 rounded-[48px] bg-white text-[16px] font-normal text-dark">{lang}</span>)}
              </div>
              <ChevronIcon open={false} className="shrink-0 ml-2 w-3.5 h-3 md:w-4 md:h-4 transition-transform duration-200" />
            </button>
          </div>
        </FormRow>
      </div>

      {langPopupOpen && (
        <LanguagePopup initialSelected={languages} onClose={() => setLangPopupOpen(false)} onConfirm={langs => { setLanguages(langs); sync({ languages: langs }); }} />
      )}
    </div>
  );
}
