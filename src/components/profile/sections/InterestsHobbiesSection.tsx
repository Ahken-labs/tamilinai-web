"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChevronRightIcon, CloseCircleIcon, SearchIcon } from "@/src/assets/Icons";
import { INTEREST_GROUPS } from "@/src/constants/profiles";
import Button from "../../common-layout/Button";
import type { Me } from "@/src/types/user";
import { DRAFT_KEYS } from "@/src/constants/profileDraftKeys";

const KEY = DRAFT_KEYS.hobbies;

function getDraft() {
  try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

type Props = { me: Me | null; onDirty: () => void };

export default function InterestsHobbiesSection({ me, onDirty }: Props) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const saved = getDraft();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(saved?.hobbies ?? me?.profile?.hobbies ?? []);
  const [draft, setDraft] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const tagsRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Auto-scroll tags row to end when a new item is added
  useEffect(() => {
    const el = tagsRowRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [draft.length]);

  const shownGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INTEREST_GROUPS;
    return INTEREST_GROUPS
      .map(g => ({ ...g, items: g.items.filter(item => item.toLowerCase().includes(q)) }))
      .filter(g => g.items.length > 0);
  }, [search]);

  function toggleItem(item: string) {
    setDraft(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  }

  function handleConfirm() {
    setSelected(draft);
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ hobbies: draft }));
      onDirty();
    } catch {}
  }

  return (
    <div className="pt-3 md:pt-4 font-poppins">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setDraft(selected); setSearch(""); setOpen(true); }} className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-[48px] border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] px-3 py-1 text-left">
          <span className="text-[16px] text-[#656565] leading-[150%]">{mounted && selected.length > 0 ? "Edit interests" : "Add interests & hobbies"}</span>
          <ChevronRightIcon className="h-3 w-3 sm:h-3.3 sm:w-3.3 md:h-4 md:w-4 shrink-0" />
        </button>
        {mounted && selected.map(item => (
          <span key={item} className="inline-flex items-center rounded-[48px] border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] px-3 py-1 text-[16px] text-[#656565] leading-[150%]">{item}</span>
        ))}
      </div>

      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/50">
          <div className="flex max-h-[90dvh] min-[500px]:max-h-[90vh] w-full min-[500px]:max-w-[920px] flex-col overflow-hidden rounded-t-[16px] min-[500px]:rounded-[16px] bg-white shadow-2xl">

            {/* Header */}
            <div className="shrink-0 px-4 pt-4 pb-2 md:px-5 md:pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="fonts-24 font-semibold leading-[150%] text-dark">Interests & Hobbies</h2>
                  <p className="mt-1 font-16 font-normal leading-[150%] text-dark">Add your hobbies to find matches with similar interests.</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="shrink-0 cursor-pointer" aria-label="Close"><CloseCircleIcon /></button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto border-t border-[#EAEAEA] max-[500px]:px-0 px-4 md:px-5 max-[500px]:py-4 py-3 md:py-4 pb-[72px] min-[500px]:pb-3 md:pb-4">
              {draft.length > 0 && (
                <div
                  ref={tagsRowRef}
                  className="no-scrollbar flex max-[500px]:flex-nowrap max-[500px]:overflow-x-auto flex-wrap gap-2 md:gap-3 mb-4"
                >
                  {draft.map(item => (
                    <button key={item} type="button" onClick={() => toggleItem(item)}
                      className="flex shrink-0 items-center gap-2 rounded-[28px] border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] px-3 py-2.5 cursor-pointer">
                      <span className="text-[16px] font-medium leading-[125%] text-[#222]">{item}</span>
                      <span className="text-secondary3 text-[18px] leading-none">×</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 max-[500px]:mx-4 rounded-[41px] bg-[#E0E0E0] px-2 py-2">
                <SearchIcon className="h-6 w-6 shrink-0 text-[#525252]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search interests" className="flex-1 bg-transparent text-[16px] font-normal text-[#656565] placeholder:text-[#656565] outline-none" />
                {search && <button type="button" onClick={() => setSearch("")} className="cursor-pointer pr-1"><CloseCircleIcon stroke="#FFF" fill="#888888" fillOpacity="1" className="h-5 w-5" /></button>}
              </div>
              <hr className="my-4 max-[500px]:mx-4 border-t border-[#D8D8D8]" />
              {shownGroups.length === 0 && (
                <div className="max-[500px]:mx-4 py-8 flex flex-col items-center gap-2 text-center">
                  <p className="text-[16px] font-medium text-dark">No results found</p>
                  <p className="text-[14px] max-[500px]:mb-10 font-normal text-secondary3">Try a different spelling or interest name</p>
                </div>
              )}
              <div className="max-[500px]:mx-4 flex flex-col gap-5 mb-20 md:gap-6">
                {shownGroups.map((group, index) => (
                  <div key={group.heading} className="flex flex-col gap-3 md:gap-4">
                    <div className="font-16 font-medium leading-[150%] text-dark">{group.heading}</div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {group.items.map(item => {
                        const active = draft.includes(item);
                        return <button key={item} type="button" onClick={() => toggleItem(item)} className={`rounded-[28px] px-3 py-2.5 text-[16px] font-normal leading-[125%] transition-colors cursor-pointer ${active ? "border border-[rgba(179,27,56,0.25)] bg-[#FFF0F3] text-[#222]" : "bg-[#F0F0F0] text-[#656565] hover:bg-[#EAEAEA]"}`}>{item}</button>;
                      })}
                    </div>
                    {index !== shownGroups.length - 1 && <div className="border-b border-[#D8D8D8]" />}
                  </div>
                ))}
              </div>
              <div className="h-20" />
            </div>

            {/* Desktop footer — hidden on mobile */}
            <div className="hidden min-[500px]:flex justify-end gap-4 md:gap-5 border-t border-[#EAEAEA] px-4 md:px-5 py-3 md:py-4 shrink-0">
              <div className="w-full" />
              <Button text="Add interests & hobbies" onPress={handleConfirm} className="w-full" />
            </div>
          </div>

          {/* Mobile fixed bottom button */}
          <div
            className="min-[500px]:hidden fixed bottom-0 left-0 right-0 px-4 py-2 z-10"
            style={{ background: "rgba(255, 255, 255, 0.60)", backdropFilter: "blur(11px)" }}
          >
            <Button text="Add interests & hobbies" onPress={handleConfirm} className="!w-full" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
