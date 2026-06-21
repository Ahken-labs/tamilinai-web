"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useScrollHide } from "@/src/hooks/useScrollHide";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe, StripeElements, StripeCardNumberElement } from "@stripe/stripe-js";
import {
  CheckmarkIcon, ChevronIcon, VisaIcon, MasterCardIcon,
  AmericanExpressIcon, DiscoverIcon, MaestroIcon, CardIcon,
  NotifPromoIcon, InterestLockIcon, WhatsAppIcon, MailIcon,
} from "@/src/assets/Icons";
import { EliteBasicTag, EliteProTag, EliteMaxTag } from "@/src/components/ui/Tags";
import { CONTACT } from "@/src/lib/contact";
import { readMeCache } from "@/src/components/AppHeader";
import { ELITE_PLANS, getPlanByKey, getPricing, isSriLanka } from "@/src/constants/elitePlans";
import { GoHeartFill } from "react-icons/go";
import Button from "@/src/components/common-layout/Button";
import Link from "next/link";
import { BiCheckCircle } from "react-icons/bi";
import {
  createPaymentIntent, confirmPayment as confirmPaymentApi,
  validatePromo, friendlyStripeError,
} from "@/src/lib/api/billing";
import BankTransferFlow, { STEPS } from "@/src/components/elite/BankTransferFlow";
import StepProgress from "@/src/components/more/StepProgress";
import RefundPolicyPopup from "@/src/components/footer/RefundPolicyPopup";

// ─────────────────────────────────────────────────────────────────────────────
// PaymentForm — kept for future card payment integration, not rendered yet
// ─────────────────────────────────────────────────────────────────────────────

const ELEMENT_STYLE = {
  base: { fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#222222", "::placeholder": { color: "#525252" } },
  invalid: { color: "#B31B38" },
};

const renewStr = "the renewal date";

function parseTotal(t: string) { return parseFloat(t.replace(/,/g, "")); }
function formatTotal(n: number, symbol: string) {
  return symbol === "Rs" ? n.toLocaleString("en-US", { minimumFractionDigits: 0 }) : n.toFixed(2);
}

function CloseCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 18.3332C14.5833 18.3332 18.3333 14.5832 18.3333 9.99984C18.3333 9.99984 14.5833 1.6665 10 1.6665C5.41667 1.6665 1.66667 5.4165 1.66667 9.99984C1.66667 14.5832 5.41667 18.3332 10 18.3332Z" stroke="#888" strokeWidth="1.5" />
      <path d="M7.64258 12.3582L12.3576 7.64319M12.3576 12.3582L7.64258 7.64319" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlanTag({ planKey, className }: { planKey: string; className?: string }) {
  if (planKey === "pro") return <EliteProTag className={className} />;
  if (planKey === "max") return <EliteMaxTag className={className} />;
  return <EliteBasicTag className={className} />;
}

function Feature({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <div className="flex items-center gap-1.5">
      <CheckmarkIcon className="h-4 md:h-5 w-4 md:w-5 shrink-0" />
      <span className="font-16 font-normal leading-[150%] text-dark">
        {parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)}
      </span>
    </div>
  );
}

// Stored for future card payment integration — not rendered
export function PaymentForm({
  buttonLabel, planKey, promoCode, autoRenew, onSuccess,
}: {
  buttonLabel: string; months: number; planKey: string;
  promoCode?: string; autoRenew: boolean; onSuccess: () => void;
}) {
  const [cardHolder, setCardHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);
  const [elementsReady, setElementsReady] = useState(false);

  const stripeRef = useRef<Stripe | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);
  const cardNumberRef = useRef<StripeCardNumberElement | null>(null);
  const cardNumberContainerRef = useRef<HTMLDivElement>(null);
  const cardExpiryContainerRef = useRef<HTMLDivElement>(null);
  const cardCvcContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) return;
    let destroyed = false;
    loadStripe(key).then((stripe) => {
      if (!stripe || destroyed) return;
      stripeRef.current = stripe;
      const elements = stripe.elements();
      elementsRef.current = elements;
      const cardNumber = elements.create("cardNumber", { style: ELEMENT_STYLE, placeholder: "1234 1234 1234 1234" });
      const cardExpiry = elements.create("cardExpiry", { style: ELEMENT_STYLE, placeholder: "MM / YY" });
      const cardCvc = elements.create("cardCvc", { style: ELEMENT_STYLE, placeholder: "CVC" });
      if (cardNumberContainerRef.current) cardNumber.mount(cardNumberContainerRef.current);
      if (cardExpiryContainerRef.current) cardExpiry.mount(cardExpiryContainerRef.current);
      if (cardCvcContainerRef.current) cardCvc.mount(cardCvcContainerRef.current);
      cardNumberRef.current = cardNumber;
      setElementsReady(true);
    });
    return () => { destroyed = true; cardNumberRef.current?.destroy(); };
  }, []);

  async function handlePay() {
    if (!cardHolder.trim()) { setPaymentError("Please enter the cardholder name."); return; }
    const stripe = stripeRef.current;
    const cardNumber = cardNumberRef.current;
    if (!stripe || !cardNumber) { setPaymentError("Payment system not loaded. Please refresh."); return; }
    setLoading(true);
    setPaymentError("");
    try {
      const { clientSecret, paymentIntentId } = await createPaymentIntent(planKey, autoRenew, promoCode);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({ type: "card", card: cardNumber, billing_details: { name: cardHolder.trim() } });
      if (pmError) { setPaymentError(friendlyStripeError(pmError.code)); return; }
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, { payment_method: paymentMethod!.id });
      if (confirmError) { setPaymentError(friendlyStripeError(confirmError.code)); return; }
      if (paymentIntent?.status !== "succeeded") { setPaymentError("Payment did not complete. Please try again."); return; }
      await confirmPaymentApi(paymentIntentId);
      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as { message?: string; status?: number; minutesLeft?: number; attemptsRemaining?: number };
      if (apiErr?.status === 429) {
        if (apiErr.minutesLeft) setLockoutMinutes(apiErr.minutesLeft);
        if (apiErr.attemptsRemaining !== undefined) setAttemptsRemaining(apiErr.attemptsRemaining);
        setPaymentError(apiErr.message ?? "Too many failed attempts. Please wait before trying again.");
      } else {
        setPaymentError(apiErr?.message ?? "Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputBox = "py-[11px] px-4 rounded-[12px] bg-[#F2F2F2] w-full";

  return (
    <div className="font-poppins min-w-[320px] w-full md:max-w-[640px] rounded-[24px] bg-white px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-poppins text-[16px] sm:text-[17px] md:text-[18px] font-semibold text-dark leading-[150%]">Credit or debit card</span>
        <CardIcon />
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <VisaIcon /><MasterCardIcon /><AmericanExpressIcon /><DiscoverIcon /><MaestroIcon />
      </div>
      <div className="mt-4 border-t border-[#D8D8D8]" />
      <div className="flex flex-col gap-2 mt-6">
        <label className="font-16 font-medium text-dark leading-[150%]">Cardholder name</label>
        <input type="text" placeholder="Name as on card" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)}
          className="flex py-[11px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]" />
      </div>
      <div className="flex flex-col gap-2 mt-6">
        <label className="font-16 font-medium text-dark leading-[150%]">Card number</label>
        <div ref={cardNumberContainerRef} className={inputBox} />
      </div>
      <div className="flex gap-4 mt-6">
        <div className="flex flex-1 flex-col gap-2">
          <label className="font-16 font-medium text-dark leading-[150%]">Expiration date</label>
          <div ref={cardExpiryContainerRef} className={inputBox} />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="font-16 font-medium text-dark leading-[150%]">Security code</label>
          <div ref={cardCvcContainerRef} className={inputBox} />
        </div>
      </div>
      {paymentError && (
        <div className="mt-4 rounded-[12px] bg-[#FFF0F3] px-4 py-3">
          <p className="font-16 text-[#B31B38] leading-[150%]">{paymentError}</p>
          {attemptsRemaining !== null && attemptsRemaining > 0 && (
            <p className="font-14 text-[#B31B38] mt-1">{attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining this hour.</p>
          )}
          {lockoutMinutes !== null && (
            <p className="font-14 text-[#B31B38] mt-1">Try again in {lockoutMinutes} minutes or <a href="mailto:support@inai.lk" className="underline font-medium">contact support</a>.</p>
          )}
        </div>
      )}
      <Button text={loading ? "Processing…" : buttonLabel} className="w-full mt-8"
        iconLeft={loading ? undefined : <GoHeartFill className="h-4 w-4 shrink-0" />}
        onPress={handlePay} disabled={loading || !elementsReady || lockoutMinutes !== null} />
      <p className="mt-2 text-center text-secondary3 text-[12px] font-normal leading-[150%] text-[#888888]">
        By paying you agree to our <Link href="/refund-policy" className="font-medium underline">Terms and Refund policy</Link>
        <br />You can cancel before {renewStr} to avoid next charge.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PlanSummary — right card
// ─────────────────────────────────────────────────────────────────────────────

function PlanSummary({
  symbol, perMonth, months, total, features, planKey, currency, onPromoApplied,
}: {
  symbol: string; perMonth: string; months: number;
  total: string; features: string[]; planKey: string;
  currency: "lkr" | "usd"; onPromoApplied: (code: string) => void;
}) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [benefitsExpanded, setBenefitsExpanded] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);

  const baseTotal = parseTotal(total);
  const discountInDisplay = appliedPromo ? appliedPromo.discount / 100 : 0;
  const discountedTotal = appliedPromo ? baseTotal - discountInDisplay : baseTotal;

  async function handleApply() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    const result = await validatePromo(code, planKey, currency);
    setPromoLoading(false);
    if (!result.valid) { setPromoError(result.error ?? "Invalid promo code."); return; }
    setAppliedPromo({ code, discount: result.discount });
    onPromoApplied(code);
    setPromoError("");
    setPromoInput(code);
  }

  function handleClear() {
    setPromoInput(""); setPromoError(""); setAppliedPromo(null); onPromoApplied("");
  }

  return (
    <>
      {/* Mobile collapsible card — visible only ≤500px */}
      <div className="hidden max-[500px]:block font-poppins w-full">
        <div className="p-4 border border-[#EAEAEA] bg-[#F2F2F2] rounded-[20px]">
          {/* Clickable header + summary row */}
          <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-normal leading-[150%] text-[#242424]">Order summary</span>
              <ChevronIcon open={isExpanded} className="w-4 h-4 shrink-0 transition-transform duration-200" stroke="#222222" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <PlanTag planKey={planKey} />
              {!isExpanded && <span className="text-[16px] font-semibold leading-[150%] text-[#222222]">{symbol} {formatTotal(discountedTotal, symbol)}</span>}
            </div>
          </div>
          {/* Accordion expanded content */}
          <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <div>
                <div className="mt-4 border-t border-[#D8D8D8]" />
                <div className="mt-3 flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-[16px] font-medium leading-[150%] text-[#222222]">Per month</span>
                    <span className="text-[16px] font-medium leading-[150%] text-[#222222]">{symbol} {perMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[16px] font-medium leading-[150%] text-[#222222]">{months} {months === 1 ? "month" : "months"}</span>
                    <span className="text-[16px] font-medium leading-[150%] text-[#222222]">{symbol} {total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[16px] font-medium leading-[150%] text-[#222222]">Tax</span>
                    <span className="text-[16px] font-medium leading-[150%] text-[#222222]">Included</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between">
                      <span className="text-[16px] font-medium leading-[150%] text-[#222222]">Promo discount</span>
                      <span className="text-[16px] font-medium leading-[150%] text-[#222222]">− {symbol} {formatTotal(appliedPromo.discount / 100, symbol)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 border-t border-[#EAEAEA]" />
                <div className="mt-4 flex justify-between">
                  <span className="text-[18px] font-semibold leading-[150%] text-[#222222]">Total</span>
                  <span className="text-[18px] font-semibold leading-[150%] text-[#222222]">{symbol} {formatTotal(discountedTotal, symbol)}</span>
                </div>
                <div className="mt-4">
                  <div className={`flex items-center gap-2 rounded-[12px] border bg-white py-2 pl-4 pr-2 ${promoError ? "border-[#B31B38]" : "border-dashed border-[#D8D8D8]"}`}>
                    <input type="text" placeholder="Promo code" value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                      disabled={!!appliedPromo}
                      className="flex-1 min-w-0 bg-transparent text-[16px] text-[#58585B] placeholder:text-[#58585B] outline-none disabled:opacity-100" />
                    {appliedPromo ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button type="button" onClick={handleClear} className="cursor-pointer shrink-0"><CloseCircleIcon /></button>
                        <Button text="Applied" className="!px-3 !bg-[#F2F2F2] !text-[#767676] !font-medium shrink-0"
                          iconLeft={<CheckmarkIcon className="w-4 h-4 shrink-0" />} disabled />
                      </div>
                    ) : (
                      <Button text={promoLoading ? "…" : "Apply"} className="!px-4 !bg-[#FFF0F3] !text-[#222] !font-medium shrink-0"
                        iconLeft={<NotifPromoIcon className="w-4 h-4" />} onPress={handleApply}
                        disabled={!promoInput.trim() || promoLoading} />
                    )}
                  </div>
                  {promoError && <p className="mt-1.5 text-[12px] text-[#B31B38] leading-[150%]">{promoError}</p>}
                </div>
                <div className="mt-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setBenefitsExpanded(!benefitsExpanded); }}
                  >
                    <span className="text-[16px] font-normal leading-[150%] text-[#222222]">Elite VIP benefits</span>
                    <ChevronIcon open={benefitsExpanded} className="w-4 h-4 shrink-0 transition-transform duration-200" stroke="#222222" />
                  </div>
                  <div className={`grid transition-all duration-300 ease-in-out ${benefitsExpanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-3">
                        {features.map((f, i) => {
                          const parts = f.split(/\*\*(.+?)\*\*/g);
                          return (
                            <div key={i} className="flex items-center gap-1">
                              <CheckmarkIcon className="w-5 h-5 shrink-0" />
                              <span className="text-[14px] font-normal leading-[150%] text-dark">
                                {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop full version — hidden ≤500px */}
      <div className="font-poppins w-full md:max-w-[360px] flex flex-col max-[500px]:hidden">
        <div className="py-6 px-5 bg-[#F2F2F2] border border-[#EAEAEA] rounded-t-[20px] rounded-b-[8px]">
          <PlanTag planKey={planKey} />
          <div className="flex items-end mt-5">
            <span className="text-[20px] font-medium leading-[100%] text-dark">{symbol} {perMonth} /month</span>
          </div>
          <div className="flex flex-col border-t border-[#D8D8D8] mt-4 py-3">
            <div className="flex justify-between">
              <span className="font-16 font-medium leading-[150%] text-dark">{months} {months === 1 ? "month" : "months"}</span>
              <span className="font-16 font-medium leading-[150%] text-dark">{symbol} {total}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-16 font-medium leading-[150%] text-dark">Tax</span>
              <span className="font-16 font-medium leading-[150%] text-dark">Included</span>
            </div>
            {appliedPromo && (
              <div className="flex justify-between">
                <span className="font-16 font-medium leading-[150%] text-dark">Promo discount</span>
                <span className="font-16 font-medium leading-[150%] text-dark">− {symbol} {formatTotal(appliedPromo.discount / 100, symbol)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between border-t border-[#D8D8D8] pt-3">
            <span className="text-[20px] font-semibold leading-[150%] text-dark">Total</span>
            <span className="text-[20px] font-semibold leading-[150%] text-dark">{symbol} {formatTotal(discountedTotal, symbol)}</span>
          </div>
          <div className="mt-4">
            <div className={`flex items-center gap-2 rounded-[12px] border bg-white py-2 pl-4 pr-2 ${promoError ? "border-[#B31B38]" : "border-dashed border-[#D8D8D8]"}`}>
              <input type="text" placeholder="Promo code" value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                disabled={!!appliedPromo}
                className="flex-1 py-2 min-w-0 bg-transparent text-[16px] text-[#58585B] placeholder:text-[#58585B] outline-none disabled:opacity-100" />
              {appliedPromo ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={handleClear} className="cursor-pointer shrink-0"><CloseCircleIcon /></button>
                  <Button text="Applied" className="!px-3 !bg-[#F2F2F2] !text-[#767676] !font-medium shrink-0"
                    iconLeft={<CheckmarkIcon className="w-4 h-4 shrink-0" />} disabled />
                </div>
              ) : (
                <Button text={promoLoading ? "…" : "Apply"} className="!px-4 !bg-[#FFF0F3] !text-[#222] !font-medium shrink-0"
                  iconLeft={<NotifPromoIcon className="w-4 h-4" />} onPress={handleApply}
                  disabled={!promoInput.trim() || promoLoading} />
              )}
            </div>
            {promoError && <p className="mt-1.5 text-[14px] text-[#B31B38] leading-[150%]">{promoError}</p>}
          </div>
          <div className="pt-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setBenefitsExpanded(!benefitsExpanded)}
            >
              <span className="text-[16px] font-normal leading-[150%] text-[#222222]">{planKey === "max" ? "Elite VIP" : planKey === "pro" ? "Elite pro" : "Elite basic"} benefits</span>
              <ChevronIcon open={benefitsExpanded} className="w-4 h-4 shrink-0 transition-transform duration-200" stroke="#222222" />
            </div>
            <div className={`grid transition-all duration-300 ease-in-out ${benefitsExpanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="flex flex-col gap-2">
                  {features.map((f, i) => <Feature key={i} text={f} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1 max-[500px]:hidden flex flex-col gap-2 py-4 px-5 bg-[#F2F2F2] border border-[#EAEAEA] rounded-b-[20px] rounded-t-[8px]">
          <a href={`${CONTACT.whatsappUrl}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#525252] hover:text-[#222222]">
            <WhatsAppIcon className="h-4 w-4 shrink-0" strokeWidth="1.6" stroke="#525252" fill="#525252" />
            <span className="text-[14px] font-normal leading-[150%] underline">+94 770 750 760</span>
          </a>
          <a href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2 text-[#525252] hover:text-[#222222]">
            <MailIcon className="h-4 w-4 shrink-0" />
            <span className="text-[14px] font-normal leading-[150%] underline">{CONTACT.email}</span>
          </a>
          <div className="flex items-center gap-2 text-[#525252]">
            <InterestLockIcon className="h-4 w-4 shrink-0" stroke="#525252" />
            <span className="text-[14px] font-normal leading-[150%]">Secure payment</span>
          </div>
          <button type="button" onClick={() => setShowRefundPolicy(true)}
            className="flex items-center gap-2 text-[#525252] hover:text-[#222222] cursor-pointer text-left">
            <BiCheckCircle className="h-4 w-4 shrink-0" />
            <span className="text-[14px] font-normal leading-[150%] underline">Refund &amp; Return Policy</span>
          </button>
        </div>
      </div>
      <RefundPolicyPopup isOpen={showRefundPolicy} onClose={() => setShowRefundPolicy(false)} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main checkout content
// ─────────────────────────────────────────────────────────────────────────────

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") ?? "basic";

  const [countryCode] = useState<string | undefined>(() => readMeCache()?.countryCode);

  const plan = getPlanByKey(planKey) ?? ELITE_PLANS[0];
  const pricing = getPricing(plan, countryCode);
  const currency: "lkr" | "usd" = isSriLanka(countryCode) ? "lkr" : "usd";

  const [promoCode, setPromoCode] = useState("");
  const handlePromoApplied = useCallback((code: string) => { setPromoCode(code); }, []);
  const [currentStep, setCurrentStep] = useState(1);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const headerVisible = useScrollHide();

  return (
    <>
      <main className="min-h-screen bg-[#F8F5F2] pb-20">
        {/* Sticky stepper — same pattern as close-account */}
        <div
          className="sticky max-[500px]:top-[66px] top-[66px] md:top-[74px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE] transition-transform duration-300"
          style={!headerVisible ? { transform: "translateY(-120%)" } : undefined}
        >
          <div className="flex justify-center items-center py-3 px-4">
            <div className="w-full max-w-[945px] px-0 md:px-8 lg:px-0">
              <StepProgress currentStep={currentStep} totalSteps={3} text={STEPS} lastStepActiveColor="#2E7D32" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1037px] px-4 sm:px-6 md:px-6 lg:px-10 max-[500px]:pt-4 pt-5 sm:pt-6 md:pt-7 lg:pt-8">
          <div className={currentStep < 3 ? "flex flex-col md:flex-row gap-5 md:gap-6 items-start" : "flex justify-center"}>
            {/* BankTransferFlow — order-2 on mobile (<500px), left column on desktop */}
            <div className="max-[500px]:order-2 w-full">
              <BankTransferFlow
                planKey={plan.key}
                planLabel={plan.label}
                months={plan.months}
                symbol={pricing.symbol}
                total={pricing.total}
                promoCode={promoCode || undefined}
                onStepChange={setCurrentStep}
              />
            </div>
            {currentStep < 3 && (
              <>
                {/* PlanSummary — order-1 on mobile (comes first), right column on desktop */}
                <div className="max-[500px]:order-1 w-full md:max-w-[360px]">
                  <PlanSummary
                    symbol={pricing.symbol}
                    perMonth={pricing.perMonth}
                    months={plan.months}
                    total={pricing.total}
                    features={plan.features}
                    planKey={plan.key}
                    currency={currency}
                    onPromoApplied={handlePromoApplied}
                  />
                </div>
                {/* Support card — order-3 on mobile (last), hidden on desktop (PlanSummary shows it) */}
                <div className="hidden max-[500px]:block max-[500px]:order-3 w-full font-poppins">
                  <div className="flex flex-col gap-1.5 py-3 px-4 bg-[#F2F2F2] border border-[#EAEAEA] rounded-[20px]">
                    <a href={`${CONTACT.whatsappUrl}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#525252] hover:text-[#222222]">
                      <WhatsAppIcon className="h-4 w-4 shrink-0" strokeWidth="1.6" stroke="#525252" fill="#525252" />
                      <span className="text-[14px] font-normal leading-[150%] underline">+94 770 750 760</span>
                    </a>
                    <a href={`mailto:${CONTACT.email}`}
                      className="flex items-center gap-2 text-[#525252] hover:text-[#222222]">
                      <MailIcon className="h-4 w-4 shrink-0" />
                      <span className="text-[14px] font-normal leading-[150%] underline">{CONTACT.email}</span>
                    </a>
                    <div className="flex items-center gap-2 text-[#525252]">
                      <InterestLockIcon className="h-4 w-4 shrink-0" stroke="#525252" />
                      <span className="text-[14px] font-normal leading-[150%]">Secure payment</span>
                    </div>
                    <button type="button" onClick={() => setShowRefundPolicy(true)}
                      className="flex items-center gap-2 text-[#525252] hover:text-[#222222] cursor-pointer text-left">
                      <BiCheckCircle className="h-4 w-4 shrink-0" />
                      <span className="font-16 font-normal leading-[150%] underline">Refund &amp; Return Policy</span>
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <RefundPolicyPopup isOpen={showRefundPolicy} onClose={() => setShowRefundPolicy(false)} />
    </>
  );
}

export default function EliteCheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
