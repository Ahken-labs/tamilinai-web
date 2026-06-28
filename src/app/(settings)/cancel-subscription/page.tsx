"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { RadioCircleIcon, TermsIcon } from "@/src/assets/Icons";
import Button from "@/src/components/common-layout/Button";
import { BiCheckCircle } from "react-icons/bi";
import RefundPolicyPopup from "@/src/components/footer/RefundPolicyPopup";
import { cancelSubscription, getCancelPreview } from "@/src/lib/api/billing";

const REASONS = [
  "I found a match! 💍",
  "I'm not getting enough matches",
  "It's too expensive",
  "I'm taking a break from searching",
  "Other",
];

function CancelledPopup({ periodEnd, onClose }: { periodEnd: string | null; onClose: () => void }) {
  const router = useRouter();
  const endDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[784px] bg-white rounded-[20px] pt-[22px] pb-6 shadow-xl">
        <div className="flex items-center gap-2 px-6">
          <BiCheckCircle className="w-6 h-6 text-dark shrink-0" />
          <span className="font-24 font-semibold text-dark leading-[150%] mb-1.5">Subscription Cancelled</span>
        </div>
        <div className="border-t border-[#EAEAEA] my-4" />
        <p className="mx-6 font-16 font-normal text-dark leading-[150%]">
          {endDate
            ? `Your plan will remain active until ${endDate}. Once it expires, you will be switched to our free plan. You can upgrade again anytime.`
            : "Your subscription has been cancelled. Once your current period ends, you will be switched to our free plan. You can upgrade again anytime."
          }
        </p>
        <div className="mx-6 flex justify-end mt-6">
          <Button text="Got it" onPress={() => { onClose(); router.replace("/account-settings"); }} className="!px-8" />
        </div>
      </div>
    </div>
  );
}

export default function CancelSubscriptionPage() {
  const { data: preview } = useQuery({
    queryKey: ["cancel-preview"],
    queryFn: getCancelPreview,
    staleTime: 60 * 1000,
  });
  const [selected, setSelected] = useState<string>(REASONS[0]);
  const [otherText, setOtherText] = useState("");
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setLoading(true);
    setError("");
    try {
      const reason = selected === "Other" ? `Other: ${otherText.trim()}` : selected;
      const result = await cancelSubscription(reason, selected === "Other" ? otherText : undefined);
      setPeriodEnd(result.periodEnd);
      setCancelled(true);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? "Failed to cancel subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-8 pb-16 font-poppins min-h-screen bg-[#F8F5F2] px-4 md:px-6 lg:px-10">
      <div className="bg-[#FFF] rounded-[20px] mx-auto max-w-[800px] p-6">
        <h1 className="font-20 text-dark font-semibold">We&apos;re sorry to see you go!</h1>
        <div className="border-t border-[#EAEAEA] my-4" />
        <p className="font-16 text-[#B31B38]">You currently have {preview?.mutualMatches ?? "—"} mutual matches and {preview?.unreadInterests ?? "—"} unread interests. Cancelling will pause your boosted visibility and you&apos;ll lose contact access. Are you sure?</p>

        {/* Reasons */}
        <div className="mt-6 flex flex-col gap-4">
          {REASONS.map((reason) => (
            <div key={reason}>
              <button
                type="button"
                onClick={() => setSelected(reason)}
                className="flex items-center gap-4 w-full text-left cursor-pointer"
              >
                <RadioCircleIcon checked={selected === reason} className="w-[22px] h-[22px] shrink-0" />
                <span className="font-16 font-normal text-dark leading-[150%]">{reason}</span>
              </button>

              {reason === "Other" && selected === "Other" && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Tell us more"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    className="w-full py-[11px] px-4 rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] font-16 text-dark outline-none placeholder:text-[#888888]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 bg-[#FFF] rounded-[20px] mx-auto max-w-[800px] p-6">
        <h1 className="font-20 text-dark font-semibold">Before you cancel, please know:</h1>
        <div className="mt-4 gap-2">
          <ul className="list-disc list-outside pl-5 flex flex-col gap-3">
            <li className="font-16 text-dark2">You won&apos;t lose your matches immediately. You can continue to use your Elite features until the end of your current paid period.</li>
            <li className="font-16 text-dark2">We&apos;ll be here when you&apos;re ready. Your profile will be safe after your subscription ends. You can easily pick up where you left off anytime.</li>
            <li className="font-16 text-dark2">Having trouble? Before you go, our support team would love to help resolve any issues. Reach out to us at <span className="underline font-medium">support@inai.lk</span> or call <span className="underline font-medium">+94 750207507</span>.</li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 rounded-[12px] bg-[#FFF0F3] px-4 py-3">
            <p className="font-16 text-[#B31B38] leading-[150%]">{error}</p>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <Button
            text="Continue Elite"
            className="flex-1"
            onPress={() => window.history.back()}
          />
          <Button
            text={loading ? "Cancelling…" : "Cancel subscription"}
            className="flex-1 !bg-[#FFF0F3] !text-[#B31B38]"
            onPress={handleCancel}
            disabled={loading || (selected === "Other" && !otherText.trim())}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowRefund(true)}
        className="mt-3 bg-[#FFF] items-center rounded-[20px] flex mx-auto max-w-[800px] py-6 px-4 gap-4 w-full text-left cursor-pointer"
      >
        <div className="rounded-full bg-[#F0F0F0] p-4">
          <TermsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-medium text-[16px] sm:text-[17px] md:text-[18px]">Refund and cancellation policy</h2>
          <p className="mt-1.5 font-16 text-[#767676]">Rules for cancelling your plan, downgrading, and refunds.</p>
        </div>
      </button>

      <RefundPolicyPopup isOpen={showRefund} onClose={() => setShowRefund(false)} />

      {cancelled && <CancelledPopup periodEnd={periodEnd} onClose={() => setCancelled(false)} />}
    </div>
  );
}
