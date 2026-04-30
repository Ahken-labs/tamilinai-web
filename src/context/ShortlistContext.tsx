"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { dummyProfiles } from "../data/dummyProfiles";

interface ShortlistContextType {
  isShortlisted: (id: string) => boolean;
  toggle: (id: string) => void;
  shortlistedIds: Set<string>;
}

const ShortlistContext = createContext<ShortlistContextType | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(
    () => new Set(dummyProfiles.filter((p) => p.isShortlisted).map((p) => p.id))
  );

  function toggle(id: string) {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <ShortlistContext.Provider
      value={{ isShortlisted: (id) => ids.has(id), toggle, shortlistedIds: ids }}
    >
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used within ShortlistProvider");
  return ctx;
}
