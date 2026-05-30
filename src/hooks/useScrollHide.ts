"use client";

import { useState, useEffect, useRef } from "react";

export function useScrollHide(mobileBreakpoint = 900) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > mobileBreakpoint) { setVisible(true); return; }
      const y = window.scrollY;
      if (y <= 10) setVisible(true);
      else if (y > lastScrollY.current + 4) setVisible(false);
      else if (y < lastScrollY.current - 4) setVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileBreakpoint]);

  return visible;
}
