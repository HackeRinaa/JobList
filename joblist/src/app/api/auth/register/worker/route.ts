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

    if (authError || !authData.user) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user account' },
        { status: 400 }
      );
    }

    try {
      // Create Stripe customer
      const fullName = `${firstName} ${lastName}`;
      const stripeCustomer = await createStripeCustomer(email, fullName);

      // Create user in database
      const user = await prisma.user.create({
        data: {
          email,
          name: fullName,
          role: 'WORKER',
          authId: authData.user.id,
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
      let checkoutUrl: string | null = null;
      if (selectedPlan) {
        const planKey = selectedPlan.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
        const plan = SUBSCRIPTION_PLANS[planKey];
        
        if (plan) {
          const checkoutSession = await createCheckoutSession(
            plan.price_id,
            stripeCustomer.id
          );
          checkoutUrl = checkoutSession.url || null;
        }
      }

      return NextResponse.json({ 
        success: true, 
        userId: user.id, 
        checkoutUrl 
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Note: We can't delete the Supabase user without admin access
      // The user will need to use password reset if they want to try again
      return NextResponse.json(
        { error: 'Failed to create worker account. Please try again or reset your password if you need to register again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Worker registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create worker account' },
      { status: 500 }
    );
  }
} 