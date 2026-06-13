"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe, StripeElements, StripeCardNumberElement } from "@stripe/stripe-js";
import {
  EliteCrownIcon, CheckmarkIcon, VisaIcon, MasterCardIcon,
  AmericanExpressIcon, DiscoverIcon, MaestroIcon, CardIcon,
  NotifPromoIcon, InterestLockIcon,
} from "@/src/assets/Icons";
import { readMeCache } from "@/src/components/AppHeader";
import { ELITE_PLANS, getPlanByKey, getPricing, getSavePct, isSriLanka } from "@/src/constants/elitePlans";
import { GoHeartFill } from "react-icons/go";
import Button from "@/src/components/common-layout/Button";
import Link from "next/link";
import { BiCheckCircle } from "react-icons/bi";
import {
  createPaymentIntent, confirmPayment as confirmPaymentApi,
  validatePromo, friendlyStripeError,
} from "@/src/lib/api/billing";

// ── Feature renderer — supports **bold** markdown ─────────────────────────────
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

function CloseCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20Z" fill="#888888"/>
      <path d="M6.69531 13.298L13.2953 6.698" stroke="white" strokeWidth="1.93907" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.2953 13.298L6.69531 6.698" stroke="white" strokeWidth="1.93907" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function parseTotal(total: string): number {
  return parseFloat(total.replace(/,/g, ""));
}

function formatTotal(value: number, symbol: string): string {
  if (symbol === "Rs") return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return value.toFixed(2);
}

// Stripe Element shared style — matches the existing input design exactly
const ELEMENT_STYLE = {
  base: {
    fontSize: "16px",
    color: "#222222",
    fontFamily: "Poppins",
    "::placeholder": { color: "#525252" },
  },
  invalid: { color: "#B31B38" },
};

// ── Left card — payment form ──────────────────────────────────────────────────
export function PaymentForm({
  buttonLabel,
  months,
  planKey,
  promoCode,
  autoRenew,
  onSuccess,
}: {
  buttonLabel: string;
  months: number;
  planKey: string;
  promoCode?: string;
  autoRenew: boolean;
  onSuccess: () => void;
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

  // Mount Stripe Elements once on load
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
      const cardCvc   = elements.create("cardCvc",    { style: ELEMENT_STYLE, placeholder: "CVC" });

      if (cardNumberContainerRef.current) cardNumber.mount(cardNumberContainerRef.current);
      if (cardExpiryContainerRef.current) cardExpiry.mount(cardExpiryContainerRef.current);
      if (cardCvcContainerRef.current)    cardCvc.mount(cardCvcContainerRef.current);

      cardNumberRef.current = cardNumber;
      setElementsReady(true);
    });

    return () => {
      destroyed = true;
      cardNumberRef.current?.destroy();
    };
  }, []);

  const renewDate = new Date();
  renewDate.setMonth(renewDate.getMonth() + months);
  const renewStr = renewDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  async function handlePay() {
    if (!cardHolder.trim()) {
      setPaymentError("Please enter the cardholder name.");
      return;
    }
    const stripe = stripeRef.current;
    const cardNumber = cardNumberRef.current;
    if (!stripe || !cardNumber) {
      setPaymentError("Payment system not loaded. Please refresh.");
      return;
    }

    setLoading(true);
    setPaymentError("");

    try {
      // 1. Create PaymentIntent on our backend
      const { clientSecret, paymentIntentId } = await createPaymentIntent(planKey, autoRenew, promoCode);

      // 2. Tokenise via Stripe Elements — card data goes directly to Stripe, never to our server
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: { name: cardHolder.trim() },
      });

      if (pmError) {
        setPaymentError(friendlyStripeError(pmError.code));
        return;
      }

      // 3. Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod!.id,
      });

      if (confirmError) {
        setPaymentError(friendlyStripeError(confirmError.code));
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setPaymentError("Payment did not complete. Please try again.");
        return;
      }

      // 4. Activate elite on our backend
      await confirmPaymentApi(paymentIntentId);
      onSuccess();
    } catch (err: unknown) {
      const apiErr = err as { message?: string; status?: number };
      if (apiErr?.status === 429) {
        const e = err as { minutesLeft?: number; attemptsRemaining?: number; message?: string };
        if (e.minutesLeft) setLockoutMinutes(e.minutesLeft);
        if (e.attemptsRemaining !== undefined) setAttemptsRemaining(e.attemptsRemaining);
        setPaymentError(e.message ?? "Too many failed attempts. Please wait before trying again.");
      } else {
        setPaymentError(apiErr?.message ?? "Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Shared container class — matches the existing input visual exactly
  const inputBox = "py-[11px] px-4 rounded-[12px] bg-[#F2F2F2] w-full";

  return (
    <div className="font-poppins min-w-[320px] w-full md:max-w-[640px] rounded-[24px] bg-white px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-poppins font-18 font-semibold text-dark leading-[150%]">
          Credit or debit card
        </span>
        <CardIcon />
      </div>

      {/* Card logos */}
      <div className="flex items-center gap-1.5 mt-1">
        <VisaIcon />
        <MasterCardIcon />
        <AmericanExpressIcon />
        <DiscoverIcon />
        <MaestroIcon />
      </div>

      <div className="mt-4 border-t border-[#D8D8D8]" />

      {/* Cardholder name — regular input, Stripe doesn't need to handle this */}
      <div className="flex flex-col gap-2 mt-6">
        <label className="font-16 font-medium text-dark leading-[150%]">Cardholder name</label>
        <input
          type="text"
          placeholder="Name as on card"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          className="flex py-[11px] w-full items-center rounded-[12px] border border-[#F2F2F2] bg-[#F2F2F2] px-4 font-16 text-dark outline-none placeholder:text-[#525252]"
        />
      </div>

      {/* Card number — Stripe Element, styled to match design */}
      <div className="flex flex-col gap-2 mt-6">
        <label className="font-16 font-medium text-dark leading-[150%]">Card number</label>
        <div ref={cardNumberContainerRef} className={inputBox} />
      </div>

      {/* Expiry + CVC — Stripe Elements */}
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

      {/* Payment error */}
      {paymentError && (
        <div className="mt-4 rounded-[12px] bg-[#FFF0F3] px-4 py-3">
          <p className="font-16 text-[#B31B38] leading-[150%]">{paymentError}</p>
          {attemptsRemaining !== null && attemptsRemaining > 0 && (
            <p className="font-14 text-[#B31B38] mt-1">{attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining this hour.</p>
          )}
          {lockoutMinutes !== null && (
            <p className="font-14 text-[#B31B38] mt-1">
              Try again in {lockoutMinutes} minutes or{" "}
              <a href="mailto:support@inai.lk" className="underline font-medium">contact support</a>.
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <Button
        text={loading ? "Processing…" : buttonLabel}
        className="w-full mt-8"
        iconLeft={loading ? undefined : <GoHeartFill className="h-4 w-4 shrink-0" />}
        onPress={handlePay}
        disabled={loading || !elementsReady || lockoutMinutes !== null}
      />

      {/* Legal */}
      <p className="mt-2 text-center text-secondary3 text-[12px] font-normal leading-[150%] text-[#888888]">
        By paying you agree to our{" "}
        <Link href="/refund-policy" className="font-medium underline">Terms and Refund policy</Link>
        <br />
        You can cancel before {renewStr} to avoid next charge.
      </p>
    </div>
  );
}

// ── Right card — plan summary ─────────────────────────────────────────────────
function PlanSummary({
  planLabel,
  symbol,
  perMonth,
  months,
  total,
  features,
  savePct,
  planKey,
  currency,
  onPromoApplied,
}: {
  planLabel: string;
  symbol: string;
  perMonth: string;
  months: number;
  total: string;
  features: string[];
  savePct?: number;
  planKey: string;
  currency: "lkr" | "usd";
  onPromoApplied: (code: string) => void;
}) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  const baseTotal = parseTotal(total);
  const isLkr = symbol === "Rs";
  const discountInDisplay = appliedPromo
    ? isLkr ? appliedPromo.discount / 100 : appliedPromo.discount / 100
    : 0;
  const discountedTotal = appliedPromo ? baseTotal - discountInDisplay : baseTotal;

  async function handleApply() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    const result = await validatePromo(code, planKey, currency);
    setPromoLoading(false);
    if (!result.valid) {
      setPromoError(result.error ?? "Invalid promo code.");
      return;
    }
    setAppliedPromo({ code, discount: result.discount });
    onPromoApplied(code);
    setPromoError("");
    // keep promoInput showing the code
    setPromoInput(code);
  }

  function handleClear() {
    setPromoInput("");
    setPromoError("");
    setAppliedPromo(null);
    onPromoApplied("");
  }

  return (
    <div className="font-poppins w-full md:max-w-[360px] flex flex-col">
      <div className="py-6 px-5 bg-[#F2F2F2] border border-[#EAEAEA] rounded-t-[20px] rounded-b-[8px]">
        {/* Plan badge */}
        <div className="inline-flex w-fit items-center gap-1 rounded-[38px] bg-[#FFDED3] px-2 py-0.5">
          <EliteCrownIcon className="h-5 w-5 shrink-0" />
          <span className="font-16 font-normal leading-[150%] text-[#A97216]">{planLabel}</span>
        </div>

        {/* Price per month */}
        <div className="flex items-end gap-1 mt-5">
          <span className="font-20 font-medium leading-[100%] text-dark">
            {symbol} {perMonth} /month
          </span>
        </div>
        {savePct && (
          <div className="mt-2 italic font-16 leading-[100%] text-[#8D5900]">Save {savePct}%</div>
        )}

        {/* Line items */}
        <div className="flex flex-col border-t border-[#D8D8D8] mt-4 py-3 gap-1">
          <div className="flex justify-between">
            <span className="font-16 font-medium leading-[150%] text-dark">
              {months} {months === 1 ? "month" : "months"}
            </span>
            <span className="font-16 font-medium leading-[150%] text-dark">{symbol} {total}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-16 font-medium leading-[150%] text-dark">Tax</span>
            <span className="font-16 font-medium leading-[150%] text-dark">Included</span>
          </div>
          {appliedPromo && (
            <div className="flex justify-between">
              <span className="font-16 font-medium leading-[150%] text-dark">Promo discount</span>
              <span className="font-16 font-medium leading-[150%] text-dark">
                − {symbol} {formatTotal(appliedPromo.discount / 100, symbol)}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between border-t border-[#EAEAEA] pt-3">
          <span className="font-20 font-semibold leading-[150%] text-dark">Total due today</span>
          <span className="font-20 font-semibold leading-[150%] text-dark">
            {symbol} {formatTotal(discountedTotal, symbol)}
          </span>
        </div>

        {/* Promo code input */}
        <div className="mt-4">
          <div className={`flex items-center gap-2 rounded-[12px] border bg-white py-2 pl-4 pr-2 ${promoError ? "border-[#B31B38]" : "border-dashed border-[#D8D8D8]"}`}>
            <input
              type="text"
              placeholder="Promo code"
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
              disabled={!!appliedPromo}
              className="flex-1 py-[11px] min-w-0 bg-transparent font-16 text-[#58585B] placeholder:text-[#58585B] outline-none disabled:opacity-100"
            />
            {appliedPromo ? (
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={handleClear} className="cursor-pointer shrink-0">
                  <CloseCircleIcon />
                </button>
                <Button
                  text="Applied"
                  className="!px-3 !bg-[#F2F2F2] !text-[#767676] !font-medium shrink-0"
                  iconLeft={<CheckmarkIcon className="w-4 h-4 shrink-0" />}
                  disabled
                />
              </div>
            ) : (
              <Button
                text={promoLoading ? "…" : "Apply"}
                className="!px-4 !bg-[#FFF0F3] !text-[#222] !font-medium shrink-0"
                iconLeft={<NotifPromoIcon className="w-4 h-4" />}
                onPress={handleApply}
                disabled={!promoInput.trim() || promoLoading}
              />
            )}
          </div>
          {promoError && <p className="mt-1.5 text-[12px] text-[#B31B38] leading-[150%]">{promoError}</p>}
        </div>

        {/* Features */}
        <div className="flex flex-col gap-2 border-t border-[#EAEAEA] mt-4 pt-4">
          {features.map((f, i) => <Feature key={i} text={f} />)}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-1 flex flex-col py-4 px-5 bg-[#F2F2F2] border border-[#EAEAEA] rounded-b-[20px] rounded-t-[8px]">
        <div className="flex items-center gap-2 text-[#525252]">
          <InterestLockIcon className="h-4 w-4 shrink-0" stroke="#525252" />
          <span className="font-16 font-normal leading-[150%]">Secure payment</span>
        </div>
        <div className="flex items-center gap-2 text-[#525252]">
          <BiCheckCircle className="h-4 w-4 shrink-0" />
          <span className="font-16 font-normal leading-[150%]">Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planKey = searchParams.get("plan") ?? "basic";
  const autoRenew = searchParams.get("autoRenew") !== "false";

  const [countryCode, setCountryCode] = useState<string | undefined>(undefined);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setCountryCode(readMeCache()?.countryCode); }, []);

  const plan = getPlanByKey(planKey) ?? ELITE_PLANS[0];
  const pricing = getPricing(plan, countryCode);
  const savePct = getSavePct(plan, countryCode);
  const currency: "lkr" | "usd" = isSriLanka(countryCode) ? "lkr" : "usd";

  const [promoCode, setPromoCode] = useState("");
  const handlePromoApplied = useCallback((code: string) => {
    setPromoCode(code);
  }, []);

  function handleSuccess() {
    router.replace("/invoice");
  }

  return (
    <main className="min-h-screen bg-[#F8F5F2] pb-20">
      <div className="mx-auto max-w-[1024px] px-4 sm:px-6 md:px-10 pt-10">
        <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
          {/* Left — card details */}
          <PaymentForm
            buttonLabel={`Get ${plan.label}`}
            months={plan.months}
            planKey={plan.key}
            promoCode={promoCode || undefined}

            autoRenew={autoRenew}
            onSuccess={handleSuccess}
          />

          {/* Right — plan summary */}
          <PlanSummary
            planLabel={plan.label}
            symbol={pricing.symbol}
            perMonth={pricing.perMonth}
            months={plan.months}
            total={pricing.total}
            features={plan.features}
            savePct={savePct}
            planKey={plan.key}
            currency={currency}
            onPromoApplied={handlePromoApplied}
          />
        </div>
      </div>
    </main>
  );
}

export default function EliteCheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
