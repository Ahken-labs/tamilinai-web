"use client";

import { useEffect, useState } from "react";
import type { ImageProps } from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const BLOB_TTL_MS = 55 * 60 * 1000;
interface BlobEntry { url: string; expiresAt: number; }
const _blobCache = new Map<string, BlobEntry>();

function getCachedBlob(key: string): string | null {
  const entry = _blobCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { URL.revokeObjectURL(entry.url); _blobCache.delete(key); return null; }
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
  style?: ImageProps["style"];
}

export default function ProtectedImage({ src, alt, fill, width, height, className, style }: Props) {
  const isProtected = src.startsWith("/api/photos");
  const fetchUrl = isProtected ? `${API_BASE}${src}` : src;

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

  const imgStyle: React.CSSProperties = {
    ...(style as React.CSSProperties ?? {}),
    ...(fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : {}),
  };

  if (!displaySrc) {
    const placeholderStyle: React.CSSProperties = fill
      ? { position: "absolute", inset: 0, width: "100%", height: "100%", backgroundColor: "#FFDED3" }
      : { width, height, backgroundColor: "#FFDED3" };
    return <div className={className} style={placeholderStyle} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
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
  );
}
