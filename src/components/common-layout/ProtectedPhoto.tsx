"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  watermark?: string; // text shown on photo e.g. "inai.lk"
}

export default function ProtectedPhoto({ src, alt, fill, width, height, className, sizes, priority, watermark = "inai.lk" }: Props) {
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

  return (
    <div className="relative w-full h-full select-none">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={className}
        sizes={sizes}
        priority={priority}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        style={{ pointerEvents: "none" }}
      />

      {/* Invisible overlay — blocks right-click on the image in DevTools */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />

      {/* Watermark */}
      {watermark && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
          <div
            className="w-full px-2 pb-1.5 flex justify-between"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 100%)" }}
          >
            <span
              className="font-poppins text-[10px] font-medium tracking-widest select-none"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {watermark}
            </span>
            <span
              className="font-poppins text-[10px] font-medium tracking-widest select-none"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {watermark}
            </span>
          </div>
        </div>
      )}

      {/* Blur overlay on window unfocus */}
      {blurred && (
        <div className="absolute inset-0 z-30 backdrop-blur-xl bg-black/10 rounded-inherit" />
      )}
    </div>
  );
}
