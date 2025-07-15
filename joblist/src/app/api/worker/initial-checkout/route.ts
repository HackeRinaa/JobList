import { NextRequest, NextResponse } from 'next/server';
import { stripe, createCheckoutSession, SUBSCRIPTION_PLANS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    // Get request body
    const { planId, email, firstName, lastName } = await req.json();

    if (!planId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      metadata: {
        isNewRegistration: 'true'
      }
    });

    // Get plan price ID
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan) {
      return NextResponse.json(
        { message: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await createCheckoutSession(plan.price_id, stripeCustomer.id);

    return NextResponse.json({
      checkoutUrl: session.url,
      tempCustomerId: stripeCustomer.id
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { message: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 