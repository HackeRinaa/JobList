import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession, cancelSubscription, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET worker subscription details
export async function GET() {
  try {
    // Get session to authenticate request
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findUnique({
      where: { authId: session.user.id },
      include: { subscription: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'WORKER') {
      return NextResponse.json({ error: 'User is not a worker' }, { status: 403 });
    }

    return NextResponse.json({ subscription: user.subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

// POST - Create a new subscription checkout session
export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();

    // Get session to authenticate request
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findUnique({
      where: { authId: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'WORKER') {
      return NextResponse.json({ error: 'User is not a worker' }, { status: 403 });
    }

    // Make sure user has a Stripe customer ID
    if (!user.stripeCustomerId) {
      return NextResponse.json({ error: 'User does not have a payment method set up' }, { status: 400 });
    }

    // Validate plan ID
    const planKey = planId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
    const plan = SUBSCRIPTION_PLANS[planKey];
    
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      plan.price_id,
      user.stripeCustomerId
    );

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: checkoutSession.url
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

// DELETE - Cancel subscription
export async function DELETE() {
  try {
    // Get session to authenticate request
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findUnique({
      where: { authId: session.user.id },
      include: { subscription: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'WORKER') {
      return NextResponse.json({ error: 'User is not a worker' }, { status: 403 });
    }

    if (!user.subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    // Cancel the subscription in Stripe
    await cancelSubscription(user.subscription.stripeSubscriptionId);

    // Update subscription status in the database
    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: { status: 'CANCELLED' }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
} 