"use client";

import { useEffect, useState } from "react";
import { useScrollHide } from "@/src/hooks/useScrollHide";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EliteCrownIcon, CardIcon } from "@/src/assets/Icons";
import Button from "@/src/components/common-layout/Button";
import { getSubscription, updatePaymentMethod, friendlyStripeError } from "@/src/lib/api/billing";
import { loadStripe } from "@stripe/stripe-js";
import {
  VisaIcon, MasterCardIcon, AmericanExpressIcon, DiscoverIcon, MaestroIcon,
} from "@/src/assets/Icons";

const PLAN_LABELS: Record<string, string> = { basic: "Elite basic", pro: "Elite pro", max: "Elite max" };

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatAmount(cents: number, currency: string): string {
  const symbol = currency.toLowerCase() === "lkr" ? "Rs" : "$";
  const amount = cents / 100;
  return `${symbol} ${currency === "lkr" ? Math.round(amount).toLocaleString() : amount.toFixed(2)}`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function InvoiceSkeleton() {
  return (
    <div className="font-poppins min-h-screen bg-[#F8F5F2]">
      <div className="sticky top-[64px] lg:top-[74px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE]">
        <div className="flex items-center justify-center px-4 py-3">
          <span className="select-none fonts-24 font-semibold text-dark">Subscription & Billing</span>
        </div>
      </div>
      <div className="mx-auto max-w-[1024px] px-4 pt-8 pb-16 flex flex-col gap-6 animate-pulse">
        {/* Plan card skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-[72px] h-[72px] rounded-full bg-[#E8E8E8] shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 w-32 rounded-full bg-[#E8E8E8]" />
            <div className="h-4 w-48 rounded-full bg-[#E8E8E8]" />
            <div className="h-4 w-40 rounded-full bg-[#E8E8E8]" />
          </div>
        </div>
        <div className="border-t border-[#D8D8D8]" />
        {/* Payment skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-5 w-24 rounded-full bg-[#E8E8E8]" />
          <div className="flex items-center justify-between">
            <div className="h-5 w-48 rounded-full bg-[#E8E8E8]" />
            <div className="h-10 w-20 rounded-[12px] bg-[#E8E8E8]" />
          </div>
        </div>
        {/* Invoices skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-5 w-20 rounded-full bg-[#E8E8E8]" />
          <div className="rounded-[12px] overflow-hidden border border-[#EAEAEA]">
            {[1, 2].map((i) => (
              <div key={i} className="flex border-b border-[#D8D8D8] last:border-b-0 bg-[#F2F2F2]">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex-1 px-4 py-3 border-r border-[#D8D8D8] last:border-r-0">
                    <div className="h-4 w-20 rounded-full bg-[#E8E8E8]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Update payment method modal ───────────────────────────────────────────────
function UpdatePaymentModal({ onClose, onUpdated }: { onClose: () => void; onUpdated: () => void }) {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatCardNumber(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(val: string) {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  }

  async function handleUpdate() {
    if (!cardHolder.trim() || cardNumber.replace(/\s/g, "").length < 16 || expiry.length < 7 || cvc.length < 3) {
      setError("Please fill in all card details.");
      return;
    }
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) { setError("Payment system not configured."); return; }

    setLoading(true);
    setError("");
    try {
      const stripe = await loadStripe(stripeKey);
      if (!stripe) throw new Error("Stripe failed to load.");

      const expiryDigits = expiry.replace(/\D/g, "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: stripeErr, paymentMethod } = await (stripe as any).createPaymentMethod({
        type: "card",
        card: {
          number: cardNumber.replace(/\s/g, ""),
          exp_month: parseInt(expiryDigits.slice(0, 2), 10),
          exp_year: parseInt(`20${expiryDigits.slice(2, 4)}`, 10),
          cvc,
        },
        billing_details: { name: cardHolder.trim() },
      }) as { error?: { code?: string }; paymentMethod?: { id: string } };

      if (stripeErr) { setError(friendlyStripeError(stripeErr.code)); return; }

      await updatePaymentMethod(paymentMethod!.id);
      onUpdated();
      onClose();
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[560px] rounded-[24px] bg-white shadow-xl">
        <div className="font-poppins px-6 py-6 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-18 font-semibold text-dark leading-[150%]">Update payment method</span>
              <div className="flex items-center gap-1.5 mt-1">
                <VisaIcon /><MasterCardIcon /><AmericanExpressIcon /><DiscoverIcon /><MaestroIcon />
              </div>
            </div>
            <CardIcon />
          </div>

          <div className="mt-4 border-t border-[#D8D8D8]" />

          <div className="flex flex-col gap-2 mt-6">
            <label className="font-16 font-medium text-dark leading-[150%]">Cardholder name</label>
            <input type="text" placeholder="Name as on card" value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="flex py-[11px] w-full rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]" />
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <label className="font-16 font-medium text-dark leading-[150%]">Card number</label>
            <input type="text" inputMode="numeric" placeholder="1234 1234 1234 1234" value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="flex py-[11px] w-full rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252] tracking-widest" />
          </div>

          <div className="flex gap-4 mt-6">
            <div className="flex flex-1 flex-col gap-2">
              <label className="font-16 font-medium text-dark leading-[150%]">Expiration date</label>
              <input type="text" inputMode="numeric" placeholder="MM / YY" value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="w-full py-[11px] rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="font-16 font-medium text-dark leading-[150%]">Security code</label>
              <input type="text" inputMode="numeric" placeholder="CVC" value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full py-[11px] rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]" />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-[12px] bg-[#FFF0F3] px-4 py-3">
              <p className="font-16 text-[#B31B38] leading-[150%]">{error}</p>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button text="Cancel" onPress={onClose} className="flex-1 !bg-[#FFF0F3] !text-[#B31B38]" />
            <Button text={loading ? "Updating…" : "Update"} onPress={handleUpdate} className="flex-1" disabled={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
  const router = useRouter();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const headerVisible = useScrollHide();

  // Intercept browser back → go to matches
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => { router.replace("/matches"); };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) return <InvoiceSkeleton />;

  const sub = data?.subscription;
  const card = data?.card;
  const invoices = data?.invoices ?? [];
  const isElite = data?.isElite ?? false;

  const isPastDue = sub?.status === 'failed';
  const failedInvoice = invoices.find((inv) => inv.status === 'failed');
  const failedDate = failedInvoice
    ? new Date(failedInvoice.createdAt)
    : sub?.periodEnd ? new Date(sub.periodEnd) : null;
  const deadlineDate = failedDate ? new Date(failedDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null;

  // No active subscription
  if (!sub || !isElite) {
    return (
      <div className="font-poppins min-h-screen bg-[#F8F5F2]">
       <div className="sticky top-[64px] lg:top-[74px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE] transition-transform duration-300" style={!headerVisible ? { transform: "translateY(-110%)" } : undefined}>
          <div className="flex items-center justify-center px-4 py-3">
            <span className="select-none fonts-24 font-semibold text-dark">Subscription & Billing</span>
          </div>
        </div>
        <div className="mx-auto max-w-[1024px] px-4 pt-20 pb-16 flex flex-col items-center text-center gap-4">
          <EliteCrownIcon className="w-16 h-16 text-[#B31B38]" />
          <p className="font-20 font-semibold text-dark">No active subscription</p>
          <p className="font-16 text-[#767676]">Upgrade to Elite to unlock all features.</p>
          <Button text="Upgrade to Elite" onPress={() => router.push("/elite-upgrade")} className="mt-2 !px-8" />
        </div>
      </div>
    );
  }

  const planLabel = PLAN_LABELS[sub.planKey] ?? sub.planKey;
  const periodEndStr = formatDate(sub.periodEnd);
  const autoRenew = sub.autoRenew && !sub.cancelledAt;

  return (
    <div className="font-poppins min-h-screen bg-[#F8F5F2]">
      {/* Sticky sub-header */}
      <div className="sticky top-[66px] md:top-[74px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE] transition-transform duration-300" style={!headerVisible ? { transform: "translateY(-128%)" } : undefined}>
        <div className="flex items-center justify-center px-4 py-3">
          <span className="select-none fonts-24 font-semibold text-dark">Subscription & Billing</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1024px] px-4 pt-8 pb-16 flex flex-col">

        {/* Past Due banner */}
        {isPastDue && (
          <div className="border border-[#B31B38] rounded-[16px] px-5 py-4 bg-white mb-6">
            <button
              type="button"
              onClick={() => setShowUpdateModal(true)}
              className="flex items-center gap-1 mb-2 cursor-pointer"
            >
              <span className="font-16 font-semibold text-[#B31B38]">Action Required:</span>
              <span className="text-[#B31B38] text-lg leading-none">›</span>
            </button>
            <p className="font-16 text-dark2 leading-[150%]">
              We couldn&apos;t process the renewal for your {planLabel} subscription
              {failedDate ? ` on ${formatDate(failedDate.toISOString())}` : ""}.
              {deadlineDate
                ? ` Please update your payment method by ${formatDate(deadlineDate.toISOString())} to avoid losing access to your premium features.`
                : " Please update your payment method to avoid losing access to your premium features."}
            </p>
          </div>
        )}

        {/* Plan card */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center py-9 px-3 rounded-full bg-[#FFDED3] shrink-0">
            <EliteCrownIcon className="w-[34px] h-[34px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-20 font-semibold text-dark leading-[150%]">{planLabel}</span>
            <div className="flex items-center gap-4">
              <span className="font-16 font-normal leading-[150%]">{sub.months} months</span>
              {isPastDue ? (
                <span className="flex items-center gap-1 font-16 font-medium text-[#E65100]">
                  <span className="w-2 h-2 rounded-full bg-[#E65100] inline-block" />
                  Past Due
                </span>
              ) : isElite ? (
                <span className="flex items-center gap-1 font-16 font-medium text-[#2E7D32]">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32] inline-block" />
                  Active
                </span>
              ) : null}
            </div>
            <span className="mt-1 font-16 font-normal text-[#656565] leading-[150%]">
              {formatAmount(sub.amountCents, sub.currency)} · {sub.months} months
            </span>
            {isPastDue && failedDate && (
              <button
                type="button"
                onClick={() => setShowUpdateModal(true)}
                className="mt-1 font-16 font-medium text-[#B31B38] underline text-left w-fit"
              >
                Action needed as of {formatDate(failedDate.toISOString())}
              </button>
            )}
            {sub.periodEnd && (
              <span className="font-16 font-normal text-[#656565] leading-[150%] mt-1">
                {autoRenew
                  ? `Auto-renews on ${periodEndStr}`
                  : sub.cancelledAt
                    ? `Cancelled — active until ${periodEndStr}`
                    : `Expires on ${periodEndStr}`}
              </span>
            )}
          </div>
        </div>

        <div className="my-6 border-[#D8D8D8] border-t" />

        {/* Payment method */}
        <div>
          <span className="font-20 font-semibold text-dark leading-[150%]">Payment</span>
          <div className="flex items-center justify-between mt-2">
            {card ? (
              <div className="flex items-center gap-2">
                <CardIcon className="w-6 h-6" />
                <span className="font-16 font-normal text-dark leading-[150%]">
                  {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} •••• {card.last4}
                </span>
                {isPastDue && <span className="text-[#E65100] text-lg leading-none">⚠</span>}
              </div>
            ) : (
              <span className="font-16 font-normal text-[#767676]">No card on file</span>
            )}
            <Button
              text="Update"
              className="border-[#EAEAEA] border !bg-[#FFF] !px-4 !py-3 !text-[#222] !font-medium"
              onPress={() => setShowUpdateModal(true)}
            />
          </div>
        </div>

        {/* Invoices */}
        <div className="mt-8">
          <span className="font-20 font-semibold text-dark leading-[150%]">Invoices</span>

          <div className="mt-5 overflow-hidden rounded-[12px] border border-[#EAEAEA]">
            <table className="w-full border-collapse bg-[#F2F2F2]">
              <thead>
                <tr>
                  <th className="border-r border-b border-[#D8D8D8] px-4 py-3 text-left font-16 font-semibold text-dark">Date</th>
                  <th className="border-r border-b border-[#D8D8D8] px-4 py-3 text-left font-16 font-semibold text-dark">Plan</th>
                  <th className="border-r border-b border-[#D8D8D8] px-4 py-3 text-left font-16 font-semibold text-dark">Total</th>
                  <th className="border-b border-[#D8D8D8] px-4 py-3 text-left font-16 font-semibold text-dark">Status</th>
                </tr>
              </thead>
              <tbody className="[&>tr:last-child>td]:border-b-0">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center font-16 text-[#767676]">No invoices yet.</td>
                  </tr>
                ) : invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="border-r border-b border-[#D8D8D8] px-4 py-3 font-16 font-normal text-dark">{formatDate(inv.createdAt)}</td>
                    <td className="border-r border-b border-[#D8D8D8] px-4 py-3 font-16 font-normal text-dark">{PLAN_LABELS[inv.planKey] ?? inv.planKey}</td>
                    <td className="border-r border-b border-[#D8D8D8] px-4 py-3 font-16 font-normal text-dark">{formatAmount(inv.amountCents, inv.currency)}</td>
                    <td className={`border-b border-[#D8D8D8] px-4 py-3 font-16 font-normal capitalize ${inv.status === 'failed' ? 'text-[#B31B38]' : 'text-dark'}`}>
                      {inv.status === 'failed' ? 'Declined' : inv.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cancellation */}
        {!sub.cancelledAt && (
          <div className="mt-8">
            <span className="font-20 font-semibold text-dark leading-[150%]">Cancellation</span>
            <div className="flex items-center justify-between mt-2">
              <span className="font-16 font-normal text-dark leading-[150%]">
                Cancel {planLabel} subscription
              </span>
              <Button
                text="Cancel"
                className="border-[#EAEAEA] border !bg-[#FFF] !px-4 !py-3 !text-[#222] !font-medium"
                onPress={() => router.push("/cancel-subscription")}
              />
            </div>
          </div>
        )}
      </div>

      {showUpdateModal && (
        <UpdatePaymentModal
          onClose={() => setShowUpdateModal(false)}
          onUpdated={() => refetch()}
        />
      )}
    </div>
  );
}
