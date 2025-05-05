import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createStripeCustomer, createCheckoutSession, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      email,
      password,
      firstName,
      lastName,
      phone,
      bio,
      expertise,
      regions,
      selectedPlan,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sign up the user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          role: 'WORKER'
        }
      }
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create Stripe customer
    const fullName = `${firstName} ${lastName}`;
    const stripeCustomer = await createStripeCustomer(email, fullName);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        role: 'WORKER',
        authId: authData.user?.id,
        stripeCustomerId: stripeCustomer.id,
        profile: {
          create: {
            bio: bio || '',
            profession: expertise ? expertise.join(', ') : '',
            location: regions ? regions.join(', ') : '',
            phone: phone || '',
            preferences: expertise || []
          }
        }
      }
    });

    // If a plan was selected, create a checkout session
    let checkoutSession = null;
    if (selectedPlan) {
      const planKey = selectedPlan.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
      const plan = SUBSCRIPTION_PLANS[planKey];
      
      if (plan) {
        checkoutSession = await createCheckoutSession(
          plan.price_id,
          stripeCustomer.id
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      userId: user.id, 
      checkoutUrl: checkoutSession?.url || null 
    });
  } catch (error) {
    console.error('Worker signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create worker account' },
      { status: 500 }
    );
  }
} 