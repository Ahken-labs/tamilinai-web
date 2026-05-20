// Other users' photos cached in sessionStorage — cleared automatically on logout (sessionStorage.clear())
// Keyed by userId, expires based on presigned URL expiry

const PREFIX = "inai_photo_";

interface CachedPhoto {
  url: string;
  expiresAt: number;
}

function parseExpiry(url: string): number {
  try {
    const u = new URL(url);
    const date = u.searchParams.get("X-Amz-Date") ?? "";
    const expires = Number(u.searchParams.get("X-Amz-Expires") ?? "3600");
    const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${date.slice(9, 11)}:${date.slice(11, 13)}:${date.slice(13, 15)}Z`;
    const issuedAt = new Date(iso).getTime();
    if (isNaN(issuedAt)) throw new Error("bad date");
    return issuedAt + expires * 1000 - 5 * 60 * 1000;
  } catch {
    return Date.now() + 55 * 60 * 1000;
  }
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
    sessionStorage.setItem(PREFIX + userId, JSON.stringify({ url, expiresAt: parseExpiry(url) } satisfies CachedPhoto));
  } catch { /* unavailable */ }
}
