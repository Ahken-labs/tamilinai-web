"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useScrollLock } from "@/src/hooks/useScrollLock";
import { CopiedCheckIcon, CopyIcon, WhatsAppIcon, XIcon } from "@/src/assets/Icons";

interface ShareModalProps {
  url: string;
  title?: string;
  onClose: () => void;
}

function FacebookIcon({ className = "w-5 h-5 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function XTwitterIcon({ className = "w-5 h-5 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ShareOption({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#F2F2F2] group-hover:bg-[#E5E5E5] transition-colors">
        {icon}
      </div>
      <span className="font-poppins text-[12px] text-[#525252] leading-[150%]">{label}</span>
    </button>
  );
}

export default function ShareModal({ url, title = "Check this out on Inai", onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);
  useScrollLock(true);

  function handleDownloadQr() {
    const canvas = qrCanvasRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "inai-qr.png";
    a.click();
  }

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(title + "\n" + url)}`, "_blank", "noopener");
  }

  function handleFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener");
  }

  function handleTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank", "noopener");
  }

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between pl-5 pr-2 pt-2 pb-3 shrink-0 border-b border-[#F0F0F0]">
        <span className="font-poppins text-[18px] font-semibold text-[#222]">Share</span>
        <button type="button" onClick={onClose} aria-label="Close" className="flex items-center justify-center p-2 cursor-pointer">
          <XIcon className="w-7 h-7" stroke="#222" />
        </button>
      </div>

      {/* Share options */}
      <div className="flex justify-around px-6 py-6">
        <ShareOption
          icon={<WhatsAppIcon className="w-7 h-7" stroke="#25D366" fill="#25D366" />}
          label="WhatsApp"
          onClick={handleWhatsApp}
        />
        <ShareOption
          icon={<FacebookIcon className="w-7 h-7 text-[#1877F2]" />}
          label="Facebook"
          onClick={handleFacebook}
        />
        <ShareOption
          icon={<XTwitterIcon className="w-6 h-6 text-[#222]" />}
          label="X / Twitter"
          onClick={handleTwitter}
        />
        <ShareOption
          icon={
            copied
              ? <CopiedCheckIcon className="w-6 h-6 text-[#B31B38]" />
              : <CopyIcon className="w-6 h-6 text-[#222]" />
          }
          label={copied ? "Copied!" : "Copy link"}
          onClick={handleCopy}
        />
      </div>

      {/* Copy link bar */}
      <div className="mx-5 flex items-center gap-2 rounded-[12px] border border-[#E5E5E5] bg-[#F9F9F9] px-3 py-2.5">
        <span className="flex-1 font-poppins text-[13px] text-[#767676] truncate">{url}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 font-poppins text-[13px] font-semibold text-[#B31B38] cursor-pointer hover:text-[#8E162D] transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* QR toggle */}
      <div className="mx-5 mt-3 mb-5">
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-[12px] border border-[#E5E5E5] font-poppins text-[13px] font-medium text-[#525252] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0">
            <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="12" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="12" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="3" width="3" height="3" fill="currentColor" />
            <rect x="14" y="3" width="3" height="3" fill="currentColor" />
            <rect x="3" y="14" width="3" height="3" fill="currentColor" />
            <rect x="13" y="13" width="2" height="2" fill="currentColor" />
            <rect x="16" y="13" width="2" height="2" fill="currentColor" />
            <rect x="13" y="16" width="2" height="2" fill="currentColor" />
            <rect x="16" y="16" width="2" height="2" fill="currentColor" />
          </svg>
          {showQr ? "Hide QR code" : "Scan QR code"}
        </button>

        {showQr && (
          <div className="mt-3 flex flex-col items-center gap-3 py-4 rounded-[16px] bg-[#F9F9F9] border border-[#E5E5E5]">
            <QRCodeSVG value={url} size={160} bgColor="#F9F9F9" fgColor="#222222" level="M" />
            {/* Hidden canvas used only for PNG download */}
            <div ref={qrCanvasRef} className="hidden">
              <QRCodeCanvas value={url} size={400} bgColor="#ffffff" fgColor="#222222" level="M" />
            </div>
            <p className="font-poppins text-[12px] text-[#888]">Scan with your phone camera</p>
            <button
              type="button"
              onClick={handleDownloadQr}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#E5E5E5] bg-white font-poppins text-[13px] font-medium text-[#525252] hover:bg-[#F0F0F0] transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
                <path d="M8 2v8m0 0L5 7m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Download QR
            </button>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/60"
      onClick={onClose}
    >
      {/* Mobile: bottom sheet */}
      <div
        className="min-[500px]:hidden w-full flex flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>

      {/* Desktop: centered popup */}
      <div
        className="hidden min-[500px]:flex flex-col w-full max-w-[400px] overflow-hidden rounded-[24px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>,
    document.body
  );
}
