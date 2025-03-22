import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    name: 'Basic Plan',
    price_id: process.env.STRIPE_BASIC_PLAN_PRICE_ID!,
    tokens: 10,
    price: 9.99,
  },
  PREMIUM: {
    name: 'Premium Plan',
    price_id: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID!,
    tokens: 25,
    price: 19.99,
  },
  PROFESSIONAL: {
    name: 'Professional Plan',
    price_id: process.env.STRIPE_PROFESSIONAL_PLAN_PRICE_ID!,
    tokens: 50,
    price: 29.99,
  },
};

export const TOKEN_PACKAGES = {
  SMALL: {
    amount: 5,
    price_id: process.env.STRIPE_TOKEN_SMALL_PRICE_ID!,
    price: 4.99,
  },
  MEDIUM: {
    amount: 15,
    price_id: process.env.STRIPE_TOKEN_MEDIUM_PRICE_ID!,
    price: 13.99,
  },
  LARGE: {
    amount: 30,
    price_id: process.env.STRIPE_TOKEN_LARGE_PRICE_ID!,
    price: 24.99,
  },
};

export async function createCheckoutSession(priceId: string, customerId: string) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
  });

  return session;
}

export async function createTokenPurchaseSession(priceId: string, customerId: string) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
  });

  return session;
}

export async function createStripeCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
} 