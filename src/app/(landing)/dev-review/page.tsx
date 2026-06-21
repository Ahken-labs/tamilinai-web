"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function ReviewPage() {
  const widgetRef = useRef<HTMLDivElement>(null);

  function initWidget() {
    if (!widgetRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tp = (window as any).Trustpilot;
    if (tp) tp.loadFromElement(widgetRef.current, true);
  }

  useEffect(() => {
    initWidget();
  }, []);

  return (
    <main className="font-poppins min-h-screen bg-[#F8F5F2] flex flex-col items-center justify-center px-4 py-20">
      <h1 className="text-[24px] sm:text-[28px] font-semibold text-dark text-center mb-8">
        Share your experience with Inai
      </h1>

      <div className="w-full max-w-[600px]">
        <div
          ref={widgetRef}
          className="trustpilot-widget"
          data-locale="en-US"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="6a1917c6aab8a3bd7883b02f"
          data-style-height="52px"
          data-style-width="100%"
          data-token="ca90ca73-b344-44af-968e-803d9ff46f74"
        >
          <a href="https://www.trustpilot.com/evaluate/inai.lk" target="_blank" rel="noopener">
            Review us on Trustpilot
          </a>
        </div>
      </div>

      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="afterInteractive"
        onLoad={initWidget}
      />
    </main>
  );
}
