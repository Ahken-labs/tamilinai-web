// Own photo cached in localStorage — persists until logout (localStorage.clear()) or new upload
// Presigned URLs expire after 1 hour, so we store the expiry from the URL itself.
// If expired, caller should refetch getMe() to get a fresh URL.

const KEY = "inai_own_photo";

interface CachedPhoto {
  url: string;
  expiresAt: number; // parsed from X-Amz-Expires + X-Amz-Date in the presigned URL
}

function parseExpiry(url: string): number {
  try {
    const u = new URL(url);
    const date = u.searchParams.get("X-Amz-Date") ?? ""; // e.g. 20260520T114328Z
    const expires = Number(u.searchParams.get("X-Amz-Expires") ?? "3600");
    // Parse ISO-like date: YYYYMMDDTHHmmssZ
    const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${date.slice(9, 11)}:${date.slice(11, 13)}:${date.slice(13, 15)}Z`;
    const issuedAt = new Date(iso).getTime();
    if (isNaN(issuedAt)) throw new Error("bad date");
    return issuedAt + expires * 1000 - 5 * 60 * 1000; // 5 min buffer before true expiry
  } catch {
    return Date.now() + 55 * 60 * 1000; // fallback: 55 min from now
  }
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
    localStorage.setItem(KEY, JSON.stringify({ url, expiresAt: parseExpiry(url) } satisfies CachedPhoto));
  } catch { /* unavailable */ }
}

export function clearCachedOwnPhoto(): void {
  try { localStorage.removeItem(KEY); } catch { /* unavailable */ }
}
