// Own photo cached in localStorage — persists until logout (localStorage.clear()) or new upload.
// Presigned URLs expire after 1 hour; we parse expiry from the URL and add a 5-min buffer.

import { parsePresignedExpiry } from "./photoUrlExpiry";

const KEY = "inai_own_photo";

interface CachedPhoto {
  url: string;
  expiresAt: number;
}

export function getCachedOwnPhoto(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { url, expiresAt } = JSON.parse(raw) as CachedPhoto;
    return Date.now() < expiresAt ? url : null;
  } catch { return null; }
}

export function setCachedOwnPhoto(url: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ url, expiresAt: parsePresignedExpiry(url) } satisfies CachedPhoto));
  } catch { /* storage unavailable */ }
}

export function clearCachedOwnPhoto(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

/**
 * Returns the cached own photo URL if still valid.
 * If the cache is empty/expired but a fresh presigned URL is provided, caches it and returns it.
 * Eliminates repeat R2 requests for the user's own photo within a session.
 */
export function getOrCacheOwnPhoto(presignedUrl: string | null | undefined): string | null {
  if (!presignedUrl) return null;
  const cached = getCachedOwnPhoto();
  if (cached) return cached;
  setCachedOwnPhoto(presignedUrl);
  return presignedUrl;
}
