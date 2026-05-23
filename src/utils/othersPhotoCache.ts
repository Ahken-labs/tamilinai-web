// Other users' photos cached in sessionStorage — cleared automatically on logout (sessionStorage.clear()).
// Keyed by userId; expires based on presigned URL expiry.

import { parsePresignedExpiry } from "./photoUrlExpiry";

const PREFIX = "inai_photo_";

interface CachedPhoto {
  url: string;
  expiresAt: number;
}

export function getCachedPhoto(userId: string): string | null {
  try {
    const raw = sessionStorage.getItem(PREFIX + userId);
    if (!raw) return null;
    const { url, expiresAt } = JSON.parse(raw) as CachedPhoto;
    return Date.now() < expiresAt ? url : null;
  } catch { return null; }
}

export function setCachedPhoto(userId: string, url: string): void {
  try {
    sessionStorage.setItem(PREFIX + userId, JSON.stringify({ url, expiresAt: parsePresignedExpiry(url) } satisfies CachedPhoto));
  } catch { /* storage unavailable */ }
}

/**
 * Returns cached URL if valid; otherwise caches rawUrl and returns it.
 * Eliminates repeat R2 requests for a profile seen multiple times in the same session.
 */
export function getOrCachePhoto(userId: string, rawUrl: string): string {
  const cached = getCachedPhoto(userId);
  if (cached) return cached;
  setCachedPhoto(userId, rawUrl);
  return rawUrl;
}
