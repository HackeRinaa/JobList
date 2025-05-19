import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession, cancelSubscription, createStripeCustomer, SUBSCRIPTION_PLANS } from '@/lib/stripe';
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
    const { planId, email, firstName, lastName } = await request.json();

    // Validate plan ID
    const planKey = planId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
    const plan = SUBSCRIPTION_PLANS[planKey];
    
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // First, try to get the authenticated user session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If user is authenticated, use the normal flow
    if (session && session.user) {
      // Find user by Supabase auth ID
      const user = await prisma.user.findUnique({
        where: { authId: session.user.id }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Make sure user has a Stripe customer ID or create one
      let stripeCustomerId = user.stripeCustomerId;
      
      if (!stripeCustomerId) {
        // Create a Stripe customer
        const customer = await createStripeCustomer(user.email, `${firstName || ''} ${lastName || ''}`.trim());
        stripeCustomerId = customer.id;
        
        // Update the user with the Stripe customer ID
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId }
        });
      }

      // Create checkout session
      const checkoutSession = await createCheckoutSession(
        plan.price_id,
        stripeCustomerId
      );

      return NextResponse.json({ 
        success: true, 
        checkoutUrl: checkoutSession.url
      });
    } 
    // If not authenticated (during registration), create a temporary checkout session
    else {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      // Check if a user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json({ 
          error: 'An account with this email already exists. Please sign in first.' 
        }, { status: 400 });
      }

      // Create a temporary Stripe customer that will be linked to the user account later
      const tempCustomer = await createStripeCustomer(
        email, 
        `${firstName || ''} ${lastName || ''}`.trim() || undefined
      );

      // Create checkout session
      const checkoutSession = await createCheckoutSession(
        plan.price_id,
        tempCustomer.id
      );

      return NextResponse.json({ 
        success: true, 
        checkoutUrl: checkoutSession.url,
        tempCustomerId: tempCustomer.id, // Return this so it can be saved with the user later
      });
    }
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