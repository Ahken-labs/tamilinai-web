// Elite plan config — edit prices and features here

export interface BankDetail {
  label: string;
  displayValue: string;
  copyValue: string;
}

export const BANK_DETAILS: BankDetail[] = [
  { label: "Account name",   displayValue: "Ahken Nexus Pvt Ltd", copyValue: "Ahken Nexus Pvt Ltd" },
  { label: "Bank",           displayValue: "Sampath Bank PLC",     copyValue: "Sampath Bank PLC" },
  { label: "Account number", displayValue: "0148 1100 4426",       copyValue: "014811004426" },
  { label: "Branch",         displayValue: "Kilinochchi",          copyValue: "Kilinochchi" },
];

export type PlanKey = "basic" | "pro" | "max";

export interface PlanPricing {
  symbol: string;
  perMonth: string;
  total: string;
  originalTotal?: string;
}

// Plan box text: Tamil for LKR prices, English for GBP prices
export interface PlanCardCopy {
  duration: string;
  averageLabel?: string;
  summary?: string;
  tagLine?: string;
  features: string[];
  highlightedFeatures?: string[];
}

export interface ElitePlan {
  key: PlanKey;
  label: string;
  months: number;
  tagLine?: string;
  lkr: PlanPricing;
  gbp: PlanPricing;
  card: { lkr: PlanCardCopy; gbp: PlanCardCopy };
}

export const ELITE_PLANS: ElitePlan[] = [
  {
    key: "basic",
    label: "Elite basic",
    months: 3,
    lkr: { symbol: "Rs", perMonth: "1,967", total: "5,900" },
    gbp: { symbol: "£",  perMonth: "13",    total: "39" },
    card: {
      lkr: {
        duration: "3 மாதங்கள்",
        averageLabel: "சராசரியாக ஒரு மாதத்திற்கு.",
        features: [
          "**வரம்பற்ற** வரன் சுயவிவரப் பார்வைகள்",
          "**தினமும் 30** விருப்பக் கோரிக்கைகள் அனுப்பலாம்",
          "**மொத்தம் 20** சரிபார்க்கப்பட்ட வரன் தொடர்புகள்",
          "ஒவ்வொரு மாதத்திற்கும் **5 நாட்கள்** உங்கள் சுயவிவரம் முன்னிலைப் படுத்தப்படும்",
        ],
      },
      gbp: {
        duration: "3 Months",
        averageLabel: "per month on average",
        features: [
          "**Unlimited** profile views",
          "Send **30** express interests per day",
          "Unlock **20** verified contact numbers",
          "**5 days** profile boost every month for higher visibility",
        ],
      },
    },
  },
  {
    key: "pro",
    label: "Elite pro",
    months: 6,
    tagLine: "Save 16%",
    lkr: { symbol: "Rs", perMonth: "1,650", total: "9,900", originalTotal: "11,800" },
    gbp: { symbol: "£",  perMonth: "11.50", total: "69", originalTotal: "78" },
    card: {
      lkr: {
        duration: "6 மாதங்கள்",
        averageLabel: "சராசரியாக ஒரு மாதத்திற்கு.",
        tagLine: "16% சேமிப்பு",
        features: [
          "**வரம்பற்ற** வரன் சுயவிவரப் பார்வைகள்",
          "**தினமும் 100** விருப்பக் கோரிக்கைகள் அனுப்பலாம்",
          "**மொத்தம் 50** சரிபார்க்கப்பட்ட வரன் தொடர்புகள்",
          "ஒவ்வொரு மாதத்திற்கும் **14 நாட்கள்** உங்கள் சுயவிவரம் முன்னிலைப் படுத்தப்படும்",
        ],
      },
      gbp: {
        duration: "6 Months",
        averageLabel: "per month on average",
        tagLine: "Save 12% (£9)",
        features: [
          "**Unlimited** profile views",
          "Send **100** express interests per day",
          "Unlock **50** verified contact numbers",
          "**14 days** profile boost every month for higher visibility",
        ],
      },
    },
  },
  {
    key: "max",
    label: "Elite VIP",
    months: 10,
    tagLine: "Full-service matchmaking.",
    lkr: { symbol: "Rs", perMonth: "2,490", total: "24,900" },
    gbp: { symbol: "£",  perMonth: "17.90", total: "179" },
    card: {
      lkr: {
        duration: "10 மாதங்கள்",
        summary: "நேரடி குழு உதவி + பிரத்யேக விளம்பரங்கள் உள்ளடக்கம்.",
        tagLine: "முழுமையான வரன் தேடல்",
        features: [
          "**வரம்பற்ற** வரன் சுயவிவரப் பார்வைகள்",
          "**வரம்பற்ற** விருப்பக் கோரிக்கைகள் அனுப்பலாம்",
          "**மொத்தம் 120** சரிபார்க்கப்பட்ட வரன் தொடர்புகள்",
          "**10 மாதங்கள்** உங்கள் சுயவிவரம் முன்னிலைப் படுத்தப்படும்",
        ],
        highlightedFeatures: [
          "உங்களுக்கென **பிரத்யேக விளம்பரங்கள்**",
          "இணை குழுவின் **நேரடி வரன் தேடல் உதவி மற்றும் ஆலோசனைகள்**",
          "**உள்நாடு, வெளிநாட்டு** தனிப்பட்ட வரன் தேடல் உதவி",
        ],
      },
      gbp: {
        duration: "10 Months",
        summary: "Direct team assistance + dedicated promotions.",
        tagLine: "End-to-End Matchmaking",
        features: [
          "**Unlimited** profile views",
          "Send **Unlimited** express interests per day",
          "Unlock **120** verified contact numbers",
          "**Continuous** profile spotlight across all 10 months",
        ],
        highlightedFeatures: [
          "**Custom spotlight campaigns** curated specifically for your profile",
          "**Dedicated relationship manager** for personalized match-hunting & consultation",
          "**Handpicked** domestic & international match discovery",
        ],
      },
    },
  },
];

export function getPlanByKey(key: string): ElitePlan | undefined {
  return ELITE_PLANS.find((p) => p.key === key);
}

export function isSriLanka(countryCode?: string | null): boolean {
  return (countryCode ?? "").replace(/\s/g, "") === "+94";
}

export function getPricing(plan: ElitePlan, countryCode?: string | null): PlanPricing {
  return isSriLanka(countryCode) ? plan.lkr : plan.gbp;
}
