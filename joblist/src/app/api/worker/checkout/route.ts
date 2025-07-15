import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe, createCheckoutSession, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Role Key');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract the Supabase access token
    const accessToken = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get request body
    const { planId, email, firstName, lastName } = await req.json();

    if (!planId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let stripeCustomer;
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { stripeCustomerId: true }
    });

    if (existingUser?.stripeCustomerId) {
      stripeCustomer = await stripe.customers.retrieve(existingUser.stripeCustomerId);
    } else {
      stripeCustomer = await stripe.customers.create({
        email,
        name: `${firstName} ${lastName}`,
        metadata: {
          supabaseUserId: user.id
        }
      });
    }

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