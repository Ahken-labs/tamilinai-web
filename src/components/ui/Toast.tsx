"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "neutral";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (opts: { type: ToastType; title: string; message?: string }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

const DURATION = 3000;

const COLORS: Record<ToastType, { bar: string; icon: string; border: string }> = {
  success: { bar: "#2E7D32", icon: "#2E7D32", border: "#2E7D32" },
  error:   { bar: "#B31B38", icon: "#B31B38", border: "#B31B38" },
  neutral: { bar: "#555555", icon: "#555555", border: "#555555" },
};

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef<number>(0);
  const rafRef   = useRef<number>(0);
  const col = COLORS[item.type];

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    startRef.current = performance.now();

    function tick(now: number) {
      const elapsed = now - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setVisible(false);
        setTimeout(() => onRemove(item.id), 300);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [item.id, onRemove]);

  function dismiss() {
    cancelAnimationFrame(rafRef.current);
    setVisible(false);
    setTimeout(() => onRemove(item.id), 300);
  }

  return (
    <div
      className="relative overflow-hidden bg-white rounded-[14px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] pointer-events-auto
        transition-all duration-300 ease-out w-[320px] max-w-[calc(100vw-32px)]"
      style={{
        border: `1px solid ${col.border}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-16px)",
      }}
    >
      <div className="flex items-start max-[370px]:gap-1.5 gap-2 sm:gap-3 max-[370px]:px-3 max-[500px]:px-3 px-4 sm:px-4 max-[500px]:pt-3 pt-4 max-[500px]:pb-3 pb-3.5">
        <div className="shrink-0 mt-0.5">
          {item.type === "success" && (
            <svg viewBox="0 0 20 20" fill="none" className="max-[500px]:w-[16px] w-[18px] max-[500px]:h-[16px] h-[18px]" style={{ color: col.icon }}>
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M6.5 10.2L9 12.5L13.5 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {item.type === "error" && (
            <svg viewBox="0 0 20 20" fill="none" className="max-[500px]:w-[16px] w-[18px] max-[500px]:h-[16px] h-[18px]" style={{ color: col.icon }}>
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10 6v4.5M10 13.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          {item.type === "neutral" && (
            <svg viewBox="0 0 20 20" fill="none" className="max-[500px]:w-[16px] w-[18px] max-[500px]:h-[16px] h-[18px]" style={{ color: col.icon }}>
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10 9v5M10 6.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#222222] leading-snug">{item.title}</p>
          {item.message && (
            <p className="text-[13px] text-[#666] mt-0.5 leading-snug">{item.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full
            text-[#AAAAAA] hover:text-[#555] hover:bg-[#F2F2F2] transition-colors"
        >
          <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[4px] rounded-b-[14px] transition-none"
        style={{ width: `${progress}%`, backgroundColor: col.bar }}
      />
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(({ type, title, message }: { type: ToastType; title: string; message?: string }) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts([{ id, type, title, message }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2.5 items-center pointer-events-none">
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
