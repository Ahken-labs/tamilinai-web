import { MONTHS } from "../constants/profiles";

// ── Marital status ────────────────────────────────────────────────────────────
export const MARITAL_TO_BE: Record<string, string> = {
  "Unmarried": "unmarried",
  "Widow/Widower": "widow_widower",
  "Divorced": "divorced",
  "Separated": "separated",
};
export const MARITAL_FROM_BE: Record<string, string> = {
  "unmarried": "Unmarried",
  "widow_widower": "Widow/Widower",
  "divorced": "Divorced",
  "separated": "Separated",
};

// ── Physical build ────────────────────────────────────────────────────────────
export const BUILD_TO_BE: Record<string, string> = {
  "Slim": "slim", "Fit": "fit", "Muscular": "muscular",
  "Average": "average", "Heavy": "heavy",
};
export const BUILD_FROM_BE: Record<string, string> = {
  "slim": "Slim", "fit": "Fit", "athletic": "Fit", "muscular": "Muscular",
  "average": "Average", "heavy": "Heavy", "plus_size": "Heavy",
};

// ── Diet ─────────────────────────────────────────────────────────────────────
export const DIET_TO_BE: Record<string, string> = {
  "Vegetarian": "vegetarian", "Non-Vegetarian": "non_vegetarian",
  "Eggetarian": "eggetarian", "Vegan": "vegan",
};
export const DIET_FROM_BE: Record<string, string> = {
  "vegetarian": "Vegetarian", "non_vegetarian": "Non-Vegetarian",
  "eggetarian": "Eggetarian", "vegan": "Vegan",
};

// ── Smoking ───────────────────────────────────────────────────────────────────
export const SMOKE_TO_BE: Record<string, string> = {
  "Non-Smoker": "never", "Occasionally": "occasionally", "Regularly": "regularly",
};
export const SMOKE_FROM_BE: Record<string, string> = {
  "never": "Non-Smoker", "occasionally": "Occasionally", "regularly": "Regularly",
};

// ── Drinking ──────────────────────────────────────────────────────────────────
export const DRINK_TO_BE: Record<string, string> = {
  "Never": "never", "Occasionally": "occasionally", "Regularly": "regularly",
};
export const DRINK_FROM_BE: Record<string, string> = {
  "never": "Never", "occasionally": "Occasionally", "regularly": "Regularly",
  "socially": "Occasionally",
};

// ── Resident status ───────────────────────────────────────────────────────────
export const RESIDENT_TO_BE: Record<string, string> = {
  "Citizen": "citizen",
  "Permanent Resident (PR)": "permanent_resident",
  "Work Permit / Visa": "work_visa",
  "Student Visa": "student_visa",
  "Temporary Visa": "other",
};
export const RESIDENT_FROM_BE: Record<string, string> = {
  "citizen": "Citizen",
  "permanent_resident": "Permanent Resident (PR)",
  "work_visa": "Work Permit / Visa",
  "student_visa": "Student Visa",
  "other": "Temporary Visa",
};

// ── Height / Weight ───────────────────────────────────────────────────────────
export function parseCm(s: string): number | undefined {
  const n = parseInt(s); return isNaN(n) ? undefined : n;
}
export function parseKg(s: string): number | undefined {
  const n = parseInt(s); return isNaN(n) ? undefined : n;
}
export function toCmDisplay(cm: number | null | undefined): string {
  return cm ? `${cm} cm` : "";
}
export function toKgDisplay(kg: number | null | undefined): string {
  return kg ? `${kg} kg` : "";
}

// ── Date of birth ─────────────────────────────────────────────────────────────
export function parseDOB(iso: string | null | undefined): { year: string; month: string; day: string } {
  if (!iso) return { year: "", month: "", day: "" };
  const [y, m, d] = iso.split("T")[0].split("-");
  const month = MONTHS[parseInt(m, 10) - 1] ?? "";
  return { year: y ?? "", month, day: String(parseInt(d ?? "0", 10)) };
}
export function formatDOB(year: string, month: string, day: string): string | undefined {
  const mIdx = MONTHS.indexOf(month);
  if (!year || mIdx < 0 || !day) return undefined;
  return `${year}-${String(mIdx + 1).padStart(2, "0")}-${String(parseInt(day)).padStart(2, "0")}`;
}

// ── Null check for numbers (0 is valid) ───────────────────────────────────────
export function nn(v: unknown): boolean {
  return v !== null && v !== undefined;
}
