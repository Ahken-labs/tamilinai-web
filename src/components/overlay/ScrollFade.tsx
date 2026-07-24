'use client';

interface ScrollFadeProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollFade({ containerRef }: ScrollFadeProps) {
  return null; // handled via mask on the container
}

export function applyScrollFadeMask(el: HTMLElement | null) {
  if (!el) return;
  el.style.webkitMaskImage =
    'linear-gradient(to right, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%)';
  el.style.maskImage =
    'linear-gradient(to right, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%)';
}
