// Validates the About Me textarea. Returns an error message + the offending
// word/phrase so the UI can underline it in the error text, or null if clean.
// NOTE: offendingWord must appear verbatim inside message for underline to work.

import { Filter } from "bad-words";

export interface AboutMeError {
  message: string;
  offendingWord: string;
}

const filter = new Filter();

const SOCIAL_PLATFORMS = [
  "facebook", "fb", "whatsapp", "wa", "wp", "wap","wapp", "instagram", "insta","ig","instagrame",
  "linkedin","linkdin","linkedine", "twitter","twr","twtr","tweet", "snapchat", "snap","schat", "telegram","telegrame",
  "tgram", "tktok", "tictok","tictoc","tiktock","tinder", "x","tndr", "bumble", "id",
  "tiktok", "youtube", "yt","ytube", "wechat","wchat", "viber",
  "skype", "discord", "reddit", "pinterest", "tumblr", "signal", 
  "onlyfans",  "face bk","fbook","face/book" ,"faceebook","fbk"
];

// Catches platform names even when user inserts spaces/dashes/dots between letters
// e.g. "face book", "what-sapp", "insta.gram", "you tube" all get caught
function flexPattern(platform: string): RegExp {
  const clean = platform.replace(/[\s\-_.]/g, "");
  const inner = clean.split("").map(escapeRe).join("[\\s\\-_.]*");
  return new RegExp(`(?<![a-zA-Z])${inner}(?![a-zA-Z])`, "i");
}

// Email must be checked BEFORE URL so "user@gmail.com" is caught as email not URL
const EMAIL_PATTERN = /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/gi;
const URL_PATTERN = /(?:https?:\/\/|www\.)\S+|[\w.-]+\.(com|lk|org|net|io|co|info|me|app|ly|to)\b/gi;
const PHONE_PATTERN = /(?:\+?\d[\d\s\-().]{6,}\d)/g;
const USERNAME_PATTERN = /@\w+|(?:^|\s)\w*_+\w*(?=\s|$)/g;
const CONSONANT_MASH = /\b[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}\b/g;

export function validateAboutMe(text: string): AboutMeError | null {
  if (!text.trim()) return null;

  // 1. Social media / messaging platforms (flex pattern catches spaced variants like "face book")
  for (const platform of SOCIAL_PLATFORMS) {
    const match = flexPattern(platform).exec(text);
    if (match) {
      const found = match[0];
      return {
        message: `"${found}" — social media and messaging platform names aren't allowed here.`,
        offendingWord: found,
      };
    }
  }

  // 2. English profanity — handled by the bad-words package (no list in this file)
  try {
    if (filter.isProfane(text)) {
      const words = text.split(/\s+/);
      const hit = words.find((w) => filter.isProfane(w)) ?? words[0];
      return {
        message: `"${hit}" — please keep your About Me respectful and appropriate.`,
        offendingWord: hit,
      };
    }
  } catch {
    // bad-words throws on some edge inputs — treat as clean and let backend decide
  }

  // 3. Email addresses (before URL so "user@gmail.com" is caught here)
  const emailMatch = text.match(EMAIL_PATTERN);
  if (emailMatch) {
    const hit = emailMatch[0];
    return {
      message: `"${hit}" — email addresses aren't allowed here.`,
      offendingWord: hit,
    };
  }

  // 4. URLs / links
  const urlMatch = text.match(URL_PATTERN);
  if (urlMatch) {
    const hit = urlMatch[0];
    return {
      message: `"${hit}" — links and website addresses aren't allowed here.`,
      offendingWord: hit,
    };
  }

  // 5. Phone numbers
  const phoneMatch = text.match(PHONE_PATTERN);
  if (phoneMatch) {
    const hit = phoneMatch[0].trim();
    return {
      message: `"${hit}" — phone numbers aren't allowed. Connect through Inai's interest system.`,
      offendingWord: hit,
    };
  }

  // 6. @username or underscore handles
  const usernameMatch = text.match(USERNAME_PATTERN);
  if (usernameMatch) {
    const hit = usernameMatch[0].trim();
    if (hit.startsWith("@") || hit.includes("_")) {
      return {
        message: `"${hit}" — social media handles and usernames aren't allowed here.`,
        offendingWord: hit,
      };
    }
  }

  // 7. Keyboard mash (4+ consecutive consonants)
  const mashMatch = text.match(CONSONANT_MASH);
  if (mashMatch) {
    const hit = mashMatch[0];
    return {
      message: `"${hit}" — that looks like random characters. Please write something genuine.`,
      offendingWord: hit,
    };
  }

  // 8. Gibberish words — 5+ letter word with ≤1 vowel (e.g. "qwrty", "sdfsdf")
  const wordMatches = text.match(/\b[a-zA-Z]{5,}\b/g) ?? [];
  for (const word of wordMatches) {
    const vowels = (word.match(/[aeiouAEIOU]/g) ?? []).length;
    if (vowels === 0) {
      return {
        message: `"${word}" — that doesn't look like a real word. Please write something meaningful.`,
        offendingWord: word,
      };
    }
  }

  // 9. Any digit at all
  const digitMatch = text.match(/\d+/);
  if (digitMatch) {
    const hit = digitMatch[0];
    return {
      message: `"${hit}" — numbers aren't allowed. Keep your About Me personal and text-only.`,
      offendingWord: hit,
    };
  }

  return null;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface TextSegment {
  text: string;
  highlight: boolean;
}

export function splitHighlight(text: string, offendingWord: string): TextSegment[] {
  if (!offendingWord) return [{ text, highlight: false }];
  const idx = text.toLowerCase().indexOf(offendingWord.toLowerCase());
  if (idx === -1) return [{ text, highlight: false }];
  return [
    { text: text.slice(0, idx), highlight: false },
    { text: text.slice(idx, idx + offendingWord.length), highlight: true },
    { text: text.slice(idx + offendingWord.length), highlight: false },
  ];
}
