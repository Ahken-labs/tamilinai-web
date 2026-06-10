"use client";
import { useEffect } from "react";

export default function SectionScroller({ sectionId }: { sectionId: string }) {
  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "instant" });
  }, [sectionId]);
  return null;
}
