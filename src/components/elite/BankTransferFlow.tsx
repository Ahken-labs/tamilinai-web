"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/src/hooks/useScrollLock";
import { useRouter } from "next/navigation";
import { CopyIcon, CopiedCheckIcon, ReuploadIcon, ReceiptFileIcon, UploadIcon, ReceiptDocIcon, VerifiedCheckCircleIcon } from "@/src/assets/Icons";
import Button from "@/src/components/common-layout/Button";
import { useToast } from "@/src/components/ui/Toast";
import { createBankTransferOrder, preUploadReceipt, getPendingBankTransfer } from "@/src/lib/api/billing";
import { compressImageFile } from "@/src/lib/compressImage";
import { readMeCache } from "@/src/components/AppHeader";
import { BANK_DETAILS } from "@/src/constants/elitePlans";
import { CONTACT } from "@/src/lib/contact";
import { useLoadingText } from "@/src/hooks/useLoadingText";

const STEPS = ["1. Transfer", "2. Upload receipt", "3. Verify..."];

interface Props {
  planKey: string;
  planLabel: string;
  months: number;
  symbol: string;
  total: string;
  promoCode?: string;
  onStepChange?: (step: number) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function VerifyingDots() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d % 3) + 1), 420);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#2E7D32]">
      Verifying{".".repeat(dots)}
    </span>
  );
}

function BankDetailsCard({ copiedKey, onCopy, subtitle, uploaded = false }: {
  copiedKey: string | null;
  onCopy: (v: string) => void;
  subtitle?: string;
  uploaded?: boolean;
}) {
  return (
    <div className="font-poppins rounded-[20px] md:rounded-[24px] bg-white px-4 sm:px-5 md:px-6 pb-5 sm:pb-5.5 md:pb-6 pt-5 sm:pt-5.5 md:pt-8">
      <h2 className="max-[500px]:text-[16px] text-[17px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-semibold text-[#222222] leading-[150%]">
        1. Transfer payment to our account
      </h2>
      {subtitle && (
        <p className="mt-1 sm:mt-1.5 md:mt-2 text-[14px] sm:text-[15px] md:text-[16px] text-[#2E7D32] leading-[150%]">{subtitle}</p>
      )}
      <div className="mt-3 sm:mt-4 md:mt-5 border-[#D8D8D8] border-t flex flex-col">
        {BANK_DETAILS.map(({ label, displayValue, copyValue }) => (
          <div key={label} className="flex flex-col gap-[2px] sm:gap-[3px] md:gap-[4px] mt-3 sm:mt-3.5 md:mt-4">
            <span className="text-[14px] sm:text-[15px] md:text-[16px] text-[#525252]">{label}</span>
            <div className="flex items-center justify-between rounded-[12px] bg-[#F2F2F2] pr-1 pl-2 sm:pl-3 md:pl-4 py-1">
              <span className="text-[14px] sm:text-[15px] md:text-[16px] text-[#222222] font-medium flex-1 min-w-0 truncate">{displayValue}</span>
              <button
                type="button"
                onClick={() => onCopy(copyValue)}
                className={`shrink-0 max-[500px]:px-[14px] px-[16px] md:px-[18px] max-[500px]:py-[6px] py-[7px] md:py-[9px] bg-white border border-[#EBEBEB] rounded-full hover:bg-[#FFF0F3] transition-opacity cursor-pointer ${uploaded ? "text-[#222222]" : "text-[#B31B38]"}`}
                aria-label={`Copy ${label}`}
              >
                {copiedKey === copyValue ? <CopiedCheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function UploadReceiptPopup({ onClose, onFileSelected, displayId }: {
  onClose: () => void;
  onFileSelected: (file: File) => void;
  displayId: string;
}) {
  useScrollLock(true);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    onClose();
    onFileSelected(f);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="font-poppins w-full min-[500px]:max-w-[560px] bg-white rounded-t-[16px] min-[500px]:rounded-[16px] max-[500px]:px-4 px-5 sm:px-6 pt-5 sm:pt-6 max-[500px]:pb-8 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between max-[500px]:mb-3 mb-4 sm:mb-5">
          <h2 className="max-[500px]:text-[14px] text-[15px] md:text-[20px] font-semibold text-[#222222] leading-[150%]">Upload payment receipt</h2>
          <button
            type="button"
            onClick={onClose}
            className="max-[500px]:w-7 w-8 max-[500px]:h-7 h-8 flex items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#E0E0E0] active:scale-95 transition-all duration-150 cursor-pointer shrink-0"
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1L13 13" stroke="#222222" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Upload box */}
        <div className="flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-[#D8D8D8] bg-[#F2F2F2] px-4 py-6">
          <UploadIcon className="w-6 h-6 text-[#222222]" />
          <h2 className="mt-2 text-[16px] font-semibold text-[#222222] text-center">Upload payment receipt</h2>
          <p className="mt-2 text-[14px] text-[#525252] text-center">Upload your transfer receipt or screenshot here (PDF, PNG, JPG)</p>
          <Button
            text="Choose file"
            onPress={() => inputRef.current?.click()}
            className="flex-1 w-full mt-4"
            iconLeft={<ReceiptFileIcon className="w-5 h-5 text-white" />}
          />
          <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleChange} />
          <p className="mt-4 text-[12px] text-[#525252] text-center">
            Having trouble uploading?{" "}
            <a
              href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi, my Inai ID is: ${displayId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#525252] hover:text-[#B31B38] cursor-pointer"
            >
              Send receipt via WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function BankTransferFlow({ planKey, planLabel, symbol, total, promoCode, onStepChange }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptPublicId, setReceiptPublicId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const loadingText = useLoadingText(submitting, "upload");
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelUploadRef = useRef<(() => void) | null>(null);

  const [displayId] = useState(() => readMeCache()?.displayId ?? "");
  const hasTrustBadge = readMeCache()?.trustBadge ?? false;
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getPendingBankTransfer().then((pending) => {
      if (pending) { setStep(3); onStepChange?.(3); }
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeStep(s: 1 | 2 | 3) {
    setStep(s);
    onStepChange?.(s);
  }

  async function startUpload(f: File, prevKey?: string) {
    setFile(f);
    setReceiptUrl(null);
    setReceiptPublicId(null);
    setUploadPct(0);
    setUploading(true);
    changeStep(2);

    const compressed = await compressImageFile(f);
    setFile(compressed);
    const { cancel, promise } = preUploadReceipt(compressed, setUploadPct, prevKey);
    cancelUploadRef.current = cancel;
    try {
      const result = await promise;
      cancelUploadRef.current = null;
      setReceiptUrl(result.receiptUrl);
      setReceiptPublicId(result.receiptPublicId);
    } catch (err: unknown) {
      const isAborted = err instanceof Error && err.message === "aborted";
      if (!isAborted) toast({ type: "error", title: "Upload failed", message: "Please try again." });
      resetUpload();
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    e.target.value = "";
    startUpload(f);
  }

  function resetUpload() {
    cancelUploadRef.current?.();
    cancelUploadRef.current = null;
    setFile(null);
    setUploading(false);
    setUploadPct(0);
    setReceiptUrl(null);
    setReceiptPublicId(null);
    changeStep(1);
  }

  function handleCancelUpload() {
    resetUpload();
  }

  function handleReuploadClick() {
    setShowUploadPopup(true);
  }

  function handleFileSelectedFromPopup(f: File) {
    const prevKey = receiptPublicId ?? undefined;
    setShowUploadPopup(false);
    cancelUploadRef.current?.();
    cancelUploadRef.current = null;
    startUpload(f, prevKey);
  }

  async function handleSubmit() {
    if (!receiptUrl || !receiptPublicId || submitting) return;
    setSubmitting(true);
    try {
      await createBankTransferOrder(planKey, promoCode, receiptUrl, receiptPublicId);
      changeStep(3);
    } catch {
      toast({ type: "error", title: "Submit failed", message: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyClick(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(value);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // silently fail
    }
  }

  if (checking) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {/* Bank details card skeleton */}
        <div className="rounded-[20px] md:rounded-[24px] bg-white px-4 sm:px-5 md:px-6 pb-5 pt-5 md:pt-8">
          <div className="h-5 w-48 rounded-full bg-[#E8E8E8]" />
          <div className="mt-4 border-t border-[#F0F0F0]" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="mt-4 flex flex-col gap-2">
              <div className="h-3.5 w-24 rounded-full bg-[#E8E8E8]" />
              <div className="h-10 rounded-[12px] bg-[#E8E8E8]" />
            </div>
          ))}
        </div>
        {/* Upload card skeleton */}
        <div className="rounded-[20px] md:rounded-[24px] bg-white px-4 sm:px-5 md:px-6 pb-5 pt-5 md:pt-8">
          <div className="h-5 w-44 rounded-full bg-[#E8E8E8]" />
          <div className="mt-4 rounded-[16px] border-2 border-dashed border-[#E8E8E8] px-4 py-8 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E8E8E8]" />
            <div className="h-4 w-40 rounded-full bg-[#E8E8E8]" />
            <div className="h-3.5 w-56 rounded-full bg-[#E8E8E8]" />
            <div className="mt-2 h-11 w-full rounded-full bg-[#E8E8E8]" />
          </div>
        </div>
      </div>
    );
  }

  // Step 3 — full verify layout
  if (step === 3) {
    return (
      <div className="w-full flex flex-col gap-4 max-w-[640px] mx-auto">
        {/* Card 1: receipt received */}
        <div className="rounded-[24px] bg-white max-[500px]:px-4 px-5 sm:px-5.5 md:px-6 max-[500px]:pb-5 pb-6 sm:pb-7 md:pb-8 max-[500px]:pt-5 pt-6 sm:pt-7 md:pt-8 flex flex-col items-center text-center font-poppins">
          <div className="p-4 bg-[#E3FFD9] rounded-full">
            <VerifiedCheckCircleIcon className="w-8 h-8 shrink-0 text-[#2E7D32]" />
          </div>
          <h2 className="mt-4 sm:mt-3 md:mt-2 text-[18px] sm:text-[19px] md:text-[20px] font-semibold text-[#222222]">3. We&apos;ve got your receipt</h2>
          <p className="mt-2 sm:mt-3 md:mt-4 text-[16px] text-[#17761B]">
            Our team is verifying your payment now. Your {planLabel}{" "}account activates as soon as it&apos;s confirmed — usually within 6 hours.
          </p>

          <div className="mt-5 sm:mt-4 w-full p-4 bg-[#F2FFED] rounded-[16px] overflow-hidden text-left ">
            {[
              ["Order", planLabel],
              ["Inai ID", displayId],
              ["Amount", `${symbol} ${total}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center pb-1.5">
                <span className="text-[14px] sm:text-[15px] md:text-[16px] text-[#2C303A]">{label}</span>
                <span className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#2C303A]">{value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-[14px] sm:text-[15px] md:text-[16px] text-[#2C303A]">Status</span>
              <VerifyingDots />
            </div>
          </div>

          <p className="mt-4 text-[14px] text-[#656565] leading-[150%]">
            We&apos;ll message you on WhatsApp and email the moment {planLabel} is activated.
          </p>
          <p className="mt-4 md:mt-2 text-[#656565] text-[12px] sm:text-[13px] md:text-[14px]">
            Wrong receipt?{" "}
            <a
              href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi, my Inai ID is: ${displayId}\nI uploaded the wrong receipt on the Inai.lk subscription process.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline cursor-pointer hover:text-[#B31B38]"
            >Get help on WhatsApp</a>
          </p>
        </div>

        {/* Card 2: trust badge upsell */}
        <div className="rounded-[24px] bg-white px-6 max-[500px]:pb-5 pb-6 sm:pb-7 md:pb-8 pt-6 sm:pt-7 md:pt-8 flex flex-col items-center text-center font-poppins">
          <Image src="/icons/trust_Badge.png" alt="Trust Badge" width={44} height={48} className="object-contain" />
          <h3 className="mt-5 text-[18px] sm:text-[17px] sm:text-[18px] font-semibold text-[#222222] leading-tight">
            {hasTrustBadge ? "You're all set" : "Stand out from the crowd immediately."}
          </h3>
          <p className="mt-2 text-[14px] sm:text-[15px] sm:text-[16px] text-[#656565] leading-[150%] max-w-[440px]">
            {hasTrustBadge ? "Your profile is complete and verified. We'll notify you on WhatsApp the moment your Elite VIP features go live." : "While we verify your payment, complete 3 quick steps to unlock your Trust Badge. Verified profiles get significantly more match requests!"}

          </p>
          {!hasTrustBadge && (
            <Button text="Earn my free trust badge"
              className="mt-5 w-full max-[500px]:!px-4"
              onPress={() => router.push("/trust-badge")}
            />
          )}
          <Button className={`${hasTrustBadge ? "mt-5 w-full" : "mt-4 max-[500px]:!px-4 w-full !text-[#B31B38] bg-[#F2F2F2] hover:bg-[#cccccc]"}`}
            text="Take me to my dashboard"
            onPress={() => router.push("/matches")}
          />
        </div>

        {showUploadPopup && (
          <UploadReceiptPopup
            onClose={() => setShowUploadPopup(false)}
            onFileSelected={handleFileSelectedFromPopup}
            displayId={displayId}
          />
        )}
      </div>
    );
  }

  // Steps 1–2 — bank details + upload card
  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full md:max-w-[640px]">
        {/* Box 1: Transfer details */}
        <BankDetailsCard
          copiedKey={copiedKey}
          onCopy={handleCopyClick}
          subtitle={`Your ${planLabel} order is reserved. Finish the transfer to activate — no rush, your spot is saved.`}
          uploaded={!!receiptUrl}
        />

        {/* Box 2: Upload receipt */}
        <div className="font-poppins rounded-[20px] md:rounded-[24px] bg-white px-4 sm:px-5 md:px-6 pb-5 sm:pb-5.5 md:pb-6 pt-5 sm:pt-5.5 md:pt-8">
          <h2 className="max-[500px]:text-[16px] text-[17px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-semibold text-[#222222] leading-[150%]">
            2. Upload payment receipt
          </h2>

          {/* Empty state */}
          {!file && (
            <div className="mt-3 sm:mt-4 md:mt-5 flex flex-col items-center justify-center rounded-[36px] border-1 border-dashed border-[#656565] bg-[#F2F2F2] px-4 py-6">
              <UploadIcon className="w-6 h-6 text-[#222222]" />
              <h2 className="mt-2 text-[16px] text-[#222222] text-center">Upload payment receipt</h2>
              <p className="mt-2 text-[14px] text-[#525252] text-center">Upload your transfer receipt or screenshot here (PDF, PNG, JPG)</p>
              <Button
                text="Choose file"
                onPress={() => fileInputRef.current?.click()}
                className="flex-1 w-full mt-4 sm:mt-4.5 md:mt-5"
                iconLeft={<ReceiptFileIcon className="w-5 h-5 text-white" />}
              />
              <p className="m-4 sm:mt-4.5 md:mt-5 text-[12px] text-[#525252] text-center">
                Having trouble uploading?{" "}
                <a
                  href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hi, my Inai ID is: ${displayId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#525252] hover:text-[#B31B38] cursor-pointer"
                >
                  Send receipt via WhatsApp
                </a>
              </p>
            </div>
          )}

          {/* Uploading: progress bar + cancel */}
          {file && uploading && (
            <div className="mt-4 flex items-center gap-3 rounded-[36px] border-1 border-dashed border-[#656565] bg-[#F2F2F2] pl-4 pr-[14px] py-6">
              <div className="rounded-[8px] md:rounded-[12.8px] bg-[#fff] py-2 sm:py-[12.8px] px-2 sm:px-[12.8px] flex items-center justify-center shrink-0">
                <ReceiptDocIcon className="max-[500px]:w-6 w-7 sm:w-8 md:w-9.5 max-[500px]:h-6 h-7 sm:h-8 md:h-9.5 shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#222222] truncate">{file.name}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-[#FFF] overflow-hidden">
                    <div className="h-full bg-[#B31B38] rounded-full transition-all duration-200" style={{ width: `${uploadPct}%` }} />
                  </div>
                  <span className="text-[14px] sm:text-[15px] md:text-[16px] text-[#222222] shrink-0">{uploadPct}%</span>
                </div>
              </div>
              <button className="shrink-0 bg-[#FFF] rounded-full p-1 hover:bg-[#F2F2F2] cursor-pointer" type="button" onClick={handleCancelUpload}>
                <div
                  className="shrink-0 text-[#656565] hover:text-[#222222] cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </button>
            </div>
          )}

          {/* Uploaded: ready to submit */}
          {file && !uploading && receiptUrl && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="rounded-[36px] border-1 border-dashed border-[#656565] bg-[#F2F2F2] pl-4 pr-[14px] py-6">
                <div className="items-center flex gap-2 sm:gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => { const url = URL.createObjectURL(file); window.open(url, '_blank'); }}
                    className="rounded-[8px] md:rounded-[12.8px] bg-[#fff] py-2 sm:py-[12.8px] px-2 sm:px-[12.8px] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#F0F0F0] transition-colors"
                    aria-label="View receipt"
                  >
                    <ReceiptDocIcon className="max-[500px]:w-6 w-7 sm:w-8 md:w-9.5 max-[500px]:h-6 h-7 sm:h-8 md:h-9.5 shrink-0" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#222222] truncate">{file.name}</p>
                    <p className="text-[12px] text-[#2E7D32]">Ready to submit · {formatSize(file.size)}</p>
                  </div>
                  <button type="button" onClick={handleReuploadClick}
                    className="p-1.5 bg-[#FFF] rounded-full cursor-pointer"
                    aria-label="Re-upload receipt">
                    <ReuploadIcon className="shrink-0 text-[#656565] hover:text-[#B31B38] max-[500px]:w-[16.5px] w-5 max-[500px]:h-[16.5px] h-5" />
                  </button>
                </div>
                <Button className="w-full mt-5" onPress={handleSubmit} disabled={submitting}
                  text={submitting ? loadingText : "Submit receipt"} />
              </div>

            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileSelect}
      />

      {showUploadPopup && (
        <UploadReceiptPopup
          onClose={() => setShowUploadPopup(false)}
          onFileSelected={handleFileSelectedFromPopup}
          displayId={displayId}
        />
      )}
    </>
  );
}

export { STEPS };
