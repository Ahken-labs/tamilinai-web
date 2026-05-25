// ── Elite plan config ─────────────────────────────────────────────────────────
// Edit prices and features here — nowhere else needs to change.

export type PlanKey = "basic" | "pro" | "max";

export interface PlanPricing {
  symbol: string;          // currency symbol
  perMonth: string;        // e.g. "1,725" or "14.99"
  total: string;           // e.g. "3,450" or "29.98"
}

export interface ElitePlan {
  key: PlanKey;
  label: string;           // "Elite basic" | "Elite pro" | "Elite max"
  months: number;
  savePctLkr?: number;     // save % shown for LKR users
  savePctUsd?: number;     // save % shown for USD users
  lkr: PlanPricing;
  usd: PlanPricing;
  features: string[];      // bullet points shown on both plan card and checkout summary
  boostWeeks: string;      // e.g. "1 week" | "2 weeks" | "4 weeks"
  whatsappLimit: number;   // 30 | 60 | 90
}

export const ELITE_PLANS: ElitePlan[] = [
  {
    key: "basic",
    label: "Elite basic",
    months: 2,
    lkr: { symbol: "Rs", perMonth: "1,725", total: "3,450" },
    usd: { symbol: "$",  perMonth: "14.99", total: "29.98" },
    boostWeeks: "1 week",
    whatsappLimit: 30,
    features: [
      "Boost your profile **1 week**",
      "Send unlimited interest requests",
      "Connect with up to 30 inai.lk users via WhatsApp",
    ],
  },
  {
    key: "pro",
    label: "Elite pro",
    months: 3,
    savePctLkr: 14,
    savePctUsd: 13,
    lkr: { symbol: "Rs", perMonth: "1,483", total: "4,450" },
    usd: { symbol: "$",  perMonth: "12.99", total: "38.97" },
    boostWeeks: "2 weeks",
    whatsappLimit: 60,
    features: [
      "Boost your profile **2 weeks**",
      "Send unlimited interest requests",
      "Connect with up to 60 inai.lk users via WhatsApp",
      "Priority customer service",
    ],
  },
  {
    key: "max",
    label: "Elite max",
    months: 6,
    savePctLkr: 28,
    savePctUsd: 33,
    lkr: { symbol: "Rs", perMonth: "1,241", total: "7,450" },
    usd: { symbol: "$",  perMonth: "9.99",  total: "59.94" },
    boostWeeks: "4 weeks",
    whatsappLimit: 90,
    features: [
      "Boost your profile **4 weeks**",
      "Send unlimited interest requests",
      "Connect with up to 90 inai.lk users via WhatsApp",
      "Priority customer service",
      "Dedicated support from Inai team",
    ],
  },
];

export function getPlanByKey(key: string): ElitePlan | undefined {
  return ELITE_PLANS.find((p) => p.key === key);
}

/** Returns true for Sri Lanka (+94), false for all other country codes */
export function isSriLanka(countryCode?: string | null): boolean {
  return (countryCode ?? "").replace(/\s/g, "") === "+94";
}

export function getPricing(plan: ElitePlan, countryCode?: string | null): PlanPricing {
  return isSriLanka(countryCode) ? plan.lkr : plan.usd;
}

/** Returns the save% for the user's currency, or undefined for basic (no badge) */
export function getSavePct(plan: ElitePlan, countryCode?: string | null): number | undefined {
  return isSriLanka(countryCode) ? plan.savePctLkr : plan.savePctUsd;
}
