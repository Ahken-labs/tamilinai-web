// Shared presigned URL expiry parser for photo caches.
// Reads X-Amz-Date + X-Amz-Expires from Cloudflare R2 / S3 presigned URLs.
export function parsePresignedExpiry(url: string): number {
  try {
    const u = new URL(url);
    const date = u.searchParams.get("X-Amz-Date") ?? "";
    const expires = Number(u.searchParams.get("X-Amz-Expires") ?? "3600");
    const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${date.slice(9, 11)}:${date.slice(11, 13)}:${date.slice(13, 15)}Z`;
    const issuedAt = new Date(iso).getTime();
    if (isNaN(issuedAt)) throw new Error("bad date");
    return issuedAt + expires * 1000 - 5 * 60 * 1000; // 5 min buffer
  } catch {
    return Date.now() + 55 * 60 * 1000; // fallback: 55 min from now
  }
}
