const PREFIX = 'inai_photo_';
const TTL_MS = 55 * 60 * 1000; // 55 minutes (expire before 1-hour presigned URL)

interface CacheEntry {
  url: string;
  expiresAt: number;
}

export function getCachedPhoto(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() >= entry.expiresAt) {
      sessionStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.url;
  } catch {
    return null;
  }
}

export function setCachedPhoto(key: string, url: string): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry = { url, expiresAt: Date.now() + TTL_MS };
    sessionStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // sessionStorage full — silently ignore
  }
}
