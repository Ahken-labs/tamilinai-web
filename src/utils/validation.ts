// ─── Phone lengths (digits after stripping country code + leading zeros) ───────
// [min, max]
const PHONE_LENGTHS: Record<string, [number, number]> = {
  '+94':  [9, 9],    // Sri Lanka
  '+91':  [10, 10],  // India
  '+44':  [10, 10],  // UK
  '+61':  [9, 9],    // Australia
  '+1':   [10, 10],  // USA / Canada
  '+971': [9, 9],    // UAE
  '+65':  [8, 8],    // Singapore
  '+60':  [9, 10],   // Malaysia
  '+33':  [9, 9],    // France
  '+49':  [10, 11],  // Germany
  '+92':  [10, 10],  // Pakistan
  '+880': [10, 10],  // Bangladesh
  '+86':  [11, 11],  // China
  '+81':  [10, 11],  // Japan
  '+82':  [9, 10],   // South Korea
  '+39':  [9, 10],   // Italy
  '+34':  [9, 9],    // Spain
  '+55':  [10, 11],  // Brazil
  '+52':  [10, 10],  // Mexico
  '+27':  [9, 9],    // South Africa
  '+234': [10, 10],  // Nigeria
  '+254': [9, 9],    // Kenya
  '+63':  [10, 10],  // Philippines
  '+62':  [9, 12],   // Indonesia
  '+66':  [9, 9],    // Thailand
  '+84':  [9, 10],   // Vietnam
  '+98':  [10, 10],  // Iran
  '+90':  [10, 10],  // Turkey
  '+966': [9, 9],    // Saudi Arabia
  '+974': [8, 8],    // Qatar
  '+965': [8, 8],    // Kuwait
  '+973': [8, 8],    // Bahrain
  '+968': [8, 8],    // Oman
  '+64':  [8, 9],    // New Zealand
  '+31':  [9, 9],    // Netherlands
  '+32':  [9, 9],    // Belgium
  '+41':  [9, 9],    // Switzerland
  '+46':  [9, 9],    // Sweden
  '+47':  [8, 8],    // Norway
  '+45':  [8, 8],    // Denmark
  '+358': [9, 10],   // Finland
  '+7':   [10, 10],  // Russia / Kazakhstan
  '+40':  [9, 9],    // Romania
  '+48':  [9, 9],    // Poland
  '+30':  [10, 10],  // Greece
  '+351': [9, 9],    // Portugal
  '+43':  [10, 13],  // Austria
  '+20':  [10, 10],  // Egypt
  '+212': [9, 9],    // Morocco
  '+213': [9, 9],    // Algeria
  '+216': [8, 8],    // Tunisia
  '+233': [9, 9],    // Ghana
  '+255': [9, 9],    // Tanzania
  '+256': [9, 9],    // Uganda
  '+260': [9, 9],    // Zambia
  '+263': [9, 9],    // Zimbabwe
};

const DEFAULT_MIN = 7;
const DEFAULT_MAX = 12;

// Extract country code like "+94" from "Sri Lanka (+94)"
export function extractCountryCode(countryString: string): string {
  return countryString.match(/\+\d+/)?.[0] ?? '';
}

// Get [min, max] digit count for a country code
function getPhoneLengths(code: string): [number, number] {
  return PHONE_LENGTHS[code] ?? [DEFAULT_MIN, DEFAULT_MAX];
}

// Get max digits allowed for a country code — used to limit input
export function getPhoneMaxLength(countryString: string): number {
  const code = extractCountryCode(countryString);
  return getPhoneLengths(code)[1];
}

// Sanitize phone input live:
// - digits only
// - strip leading zeros
// - cap at max length for the country
export function sanitizePhoneInput(value: string, countryString: string): string {
  const digitsOnly = value.replace(/\D/g, '');
  const stripped = digitsOnly.replace(/^0+/, '');
  const max = getPhoneMaxLength(countryString);
  return stripped.slice(0, max);
}

// Validate phone — returns error string or null
export function validatePhone(phone: string, countryString: string): string | null {
  const code = extractCountryCode(countryString);
  const [min, max] = getPhoneLengths(code);
  const digits = phone.replace(/\D/g, '').replace(/^0+/, '');

  if (!digits) return '*Phone number is required';
  if (digits.length < min) {
    return min === max
      ? `*Must be ${min} digits`
      : `*Must be ${min}–${max} digits`;
  }
  if (digits.length > max) return `*Too long — max ${max} digits`;
  return null;
}

// Common typos: wrong domain → suggested correction
const DOMAIN_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com','gamil.cm': 'gmail.com',
  'gmail.con': 'gmail.com', 'gmail.comm': 'gmail.com', 'gmail.coom': 'gmail.com',
  'gmail.co': 'gmail.com', 'gmail.cm': 'gmail.com', 'gmail.ocm': 'gmail.com', 'gmail.cmo': 'gmail.com',
  'gmaill.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmail.om': 'gmail.com','gmail.copm': 'gmail.com',
  'gmail.coim': 'gmail.com','gmail.dom': 'gmail.com','gmail.fom': 'gmail.com','gmail.vom': 'gmail.com',
  'gmail.xom': 'gmail.com','gmail.conm': 'gmail.com',
  'gmaial.com': 'gmail.com','gmeil.com': 'gmail.com','gmil.com': 'gmail.com', 'gmsil.com': 'gmail.com',
  'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'yahoo.comm': 'yahoo.com', 'yhaoo.com': 'yahoo.com', 'yahoo.cm': 'yahoo.com', 'yahoo.co': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotmail.comm': 'hotmail.com',
  'hotmai.com': 'hotmail.com', 'homail.com': 'hotmail.com', 'hotmail.cm': 'hotmail.com',
  'outloo.com': 'outlook.com', 'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com',
  'outlook.comm': 'outlook.com',
  'iclod.com': 'icloud.com', 'icloud.con': 'icloud.com', 'icloud.comm': 'icloud.com',
  'iclud.com': 'icloud.com',
};

// Validate email — returns { error, warning }
// error blocks submit, warning just shows a hint but allows submit
export function validateEmail(email: string): { error: string | null; warning: string | null } {
  const val = email.trim();
  if (!val) return { error: '*Email is required', warning: null };

  const atIndex = val.indexOf('@');
  if (atIndex <= 0) return { error: '*Please include an @ in the email address', warning: null };

  const local = val.slice(0, atIndex);
  const domain = val.slice(atIndex + 1);

  if (!local) return { error: '*Please enter the part before @', warning: null };
  if (!domain) return { error: '*Please enter a domain after @', warning: null };

  const dotIndex = domain.lastIndexOf('.');
  if (dotIndex <= 0) return { error: '*Please enter a valid domain (e.g. gmail.com)', warning: null };
  if (dotIndex === domain.length - 1) return { error: '*The domain looks incomplete', warning: null };

  const tld = domain.slice(dotIndex + 1);
  if (tld.length < 2) return { error: '*Please enter a valid email address', warning: null };

  // Check for known domain typos — warn but don't block
  const suggestion = DOMAIN_TYPOS[domain.toLowerCase()];
  if (suggestion) {
    return { error: null, warning: `Did you mean ${local}@${suggestion}?` };
  }

  return { error: null, warning: null };
}
