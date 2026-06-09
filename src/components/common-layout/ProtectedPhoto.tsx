"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const BLOB_TTL_MS = 55 * 60 * 1000; // 55 min — expires before 1-hr presigned URL

interface BlobEntry { url: string; expiresAt: number; }
// Shared in-memory blob URL cache — tab-local, entries expire after 55 min
const _blobCache = new Map<string, BlobEntry>();

export function clearBlobCache() {
  _blobCache.forEach((entry) => URL.revokeObjectURL(entry.url));
  _blobCache.clear();
}

function getCachedBlob(key: string): string | null {
  const entry = _blobCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    URL.revokeObjectURL(entry.url);
    _blobCache.delete(key);
    return null;
  }
  return entry.url;
}

function setCachedBlob(key: string, url: string) {
  _blobCache.set(key, { url, expiresAt: Date.now() + BLOB_TTL_MS });
}

interface Props {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  watermark?: string;
  style?: React.CSSProperties;
}

export default function ProtectedPhoto({ src, alt, fill, width, height, className, watermark = "inai.lk" }: Props) {
  const isProtected = src.startsWith("/api/photos");
  const fetchUrl = isProtected ? `${API_BASE}${src}` : src;

  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    const onBlur = () => setBlurred(true);
    const onFocus = () => setBlurred(false);
    const onVisibility = () => setBlurred(document.hidden);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const [displaySrc, setDisplaySrc] = useState<string | null>(() => {
    if (!isProtected) return src || null;
    return getCachedBlob(fetchUrl);
  });

  useEffect(() => {
    if (!isProtected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplaySrc(src || null);
      return;
    }

    const cached = getCachedBlob(fetchUrl);
    if (cached) {
      setDisplaySrc(cached);
      return;
    }

    const token = typeof window !== "undefined"
      ? localStorage.getItem("tamilinai_access_token")
      : null;
    if (!token) return;

    let cancelled = false;

    fetch(fetchUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setCachedBlob(fetchUrl, url);
        setDisplaySrc(url);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [fetchUrl, isProtected, src]);

  const imgStyle: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }
    : { pointerEvents: "none" };

  if (!displaySrc) {
    // Placeholder skeleton while loading
    const placeholderStyle: React.CSSProperties = fill
      ? { position: "absolute", inset: 0, width: "100%", height: "100%", backgroundColor: "#FFDED3" }
      : { width, height, backgroundColor: "#FFDED3" };
    return <div className={className} style={placeholderStyle} />;
  }

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-[inherit]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={className}
        style={imgStyle}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Blocks right-click / DevTools overlay */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />

      {blurred && (
        <div className="absolute inset-0 z-30 backdrop-blur-xl bg-black/10 rounded-[inherit]" />
      )}

      {watermark && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
          <div
            className="w-full px-2 pb-1.5 flex justify-between"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 100%)" }}
          >
            <span className="font-poppins text-[10px] font-medium tracking-widest select-none" style={{ color: "rgba(255,255,255,0.45)" }}>
              {watermark}
            </span>
            <span className="font-poppins text-[10px] font-medium tracking-widest select-none" style={{ color: "rgba(255,255,255,0.45)" }}>
              {watermark}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
