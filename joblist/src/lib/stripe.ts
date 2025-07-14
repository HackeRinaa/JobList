import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    name: 'Βασικό Πλάνο – "Πρόγραμμα Εκκίνησης"',
    price_id: process.env.STRIPE_BASIC_PLAN_PRICE_ID!,
    stripeProductId: 'prod_Sg2Yu30Qtu5PKP',
    tokens: 50,
    price: 30.00,
  },
  PRO: {
    name: 'Pro Πλάνο – "Επαγγελματίας"',
    price_id: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID!,
    stripeProductId: 'prod_Sg2Zvazz2oksnD',
    tokens: 80,
    price: 50.00,
  },
  ELITE: {
    name: 'Elite Πλάνο – "Αρχιτεχνίτης"',
    price_id: process.env.STRIPE_PROFESSIONAL_PLAN_PRICE_ID!,
    stripeProductId: 'prod_Sg2afptzMEEp3N',
    tokens: 120,
    price: 80.00,
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

export async function createStripeCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

export async function createCheckoutSession(priceId: string, customerId: string) {
  try {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('Missing NEXT_PUBLIC_APP_URL environment variable');
    }

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
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
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

export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
} 