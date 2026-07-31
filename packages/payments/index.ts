export interface PaymentCheckoutOptions {
  planId: string;
  amount: number;
  currency: string;
  product: "AURA" | "NURSEPASS" | "FMGE";
  couponCode?: string;
}

export function buildRazorpayOptions(opts: PaymentCheckoutOptions, orderId: string, keyId: string) {
  return {
    key: keyId,
    amount: opts.amount * 100,
    currency: opts.currency,
    name: `${opts.product} - Healthcare AI Suite`,
    description: `Subscription Payment for ${opts.planId}`,
    order_id: orderId
  };
}
