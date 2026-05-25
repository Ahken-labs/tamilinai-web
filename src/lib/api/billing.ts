import { http, ApiError } from './client';

export interface SubscriptionDetail {
  id: string;
  planKey: 'basic' | 'pro' | 'max';
  months: number;
  amountCents: number;
  currency: string;
  autoRenew: boolean;
  status: string;
  eliteGrantedAt: string | null;
  periodEnd: string | null;
  cancelledAt: string | null;
}

export interface InvoiceRow {
  id: string;
  planKey: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
  periodEnd: string | null;
}

export interface CardInfo {
  brand: string;
  last4: string;
}

export interface SubscriptionResponse {
  isElite: boolean;
  subscription: SubscriptionDetail | null;
  card: CardInfo | null;
  invoices: InvoiceRow[];
}

export interface PromoValidationResult {
  valid: boolean;
  discount: number;
  finalAmountCents: number;
  promoId?: string;
  error?: string;
}

// Stripe-error code → user-friendly message
export function friendlyStripeError(code?: string): string {
  switch (code) {
    case 'card_declined':        return 'Your card was declined. Please try a different card.';
    case 'insufficient_funds':   return 'Insufficient funds. Please try a different card.';
    case 'incorrect_cvc':        return 'Security code is incorrect.';
    case 'expired_card':         return 'Your card has expired.';
    case 'incorrect_number':     return 'Card number is invalid.';
    case 'processing_error':     return 'A processing error occurred. Please try again.';
    default:                     return 'Payment failed. Please try again or contact your bank.';
  }
}

export async function validatePromo(
  code: string,
  planKey: string,
  currency: 'lkr' | 'usd',
): Promise<PromoValidationResult> {
  try {
    return await http<PromoValidationResult>('/api/billing/validate-promo', {
      method: 'POST',
      body: JSON.stringify({ code, planKey, currency }),
    });
  } catch (err) {
    if (err instanceof ApiError) return { valid: false, discount: 0, finalAmountCents: 0, error: err.message };
    return { valid: false, discount: 0, finalAmountCents: 0, error: 'Failed to validate promo code.' };
  }
}

export async function createPaymentIntent(
  planKey: string,
  autoRenew: boolean,
  promoCode?: string,
): Promise<{ clientSecret: string; paymentIntentId: string; subscriptionId: string }> {
  return http('/api/billing/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({ planKey, autoRenew, promoCode }),
  });
}

export async function confirmPayment(
  paymentIntentId: string,
): Promise<{ success: boolean; periodEnd: string | null }> {
  return http('/api/billing/confirm-payment', {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId }),
  });
}

export async function getSubscription(): Promise<SubscriptionResponse> {
  return http('/api/billing/subscription');
}

export async function toggleAutoRenew(enabled: boolean): Promise<void> {
  await http('/api/billing/auto-renew', {
    method: 'PATCH',
    body: JSON.stringify({ enabled }),
  });
}

export async function updatePaymentMethod(
  paymentMethodId: string,
): Promise<{ success: boolean; card: CardInfo }> {
  return http('/api/billing/update-payment-method', {
    method: 'POST',
    body: JSON.stringify({ paymentMethodId }),
  });
}

export async function cancelSubscription(
  reason: string,
  otherText?: string,
): Promise<{ success: boolean; periodEnd: string | null }> {
  return http('/api/billing/cancel', {
    method: 'POST',
    body: JSON.stringify({ reason, otherText }),
  });
}

export async function getCancelPreview(): Promise<{ mutualMatches: number; unreadInterests: number }> {
  return http('/api/billing/cancel-preview');
}

export async function requestRefund(
  reason: string,
  otherText?: string,
): Promise<{ success: boolean; refundRequestId: string; windowEndsAt: string }> {
  return http('/api/billing/request-refund', {
    method: 'POST',
    body: JSON.stringify({ reason, otherText }),
  });
}
