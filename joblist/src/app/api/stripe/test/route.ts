import { NextResponse } from 'next/server';
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe';

// This is just a test endpoint to verify your Stripe configuration
export async function GET() {
  try {
    // Get the price IDs from the environment
    const basicPriceId = process.env.STRIPE_BASIC_PLAN_PRICE_ID!;
    const premiumPriceId = process.env.STRIPE_PREMIUM_PLAN_PRICE_ID!;
    const professionalPriceId = process.env.STRIPE_PROFESSIONAL_PLAN_PRICE_ID!;
    
    // Try to retrieve each price from Stripe
    const results = await Promise.allSettled([
      stripe.prices.retrieve(basicPriceId),
      stripe.prices.retrieve(premiumPriceId),
      stripe.prices.retrieve(professionalPriceId)
    ]);
    
    // Prepare results
    const priceResults = {
      basic: {
        price_id: basicPriceId,
        success: results[0].status === 'fulfilled',
        details: results[0].status === 'fulfilled' ? 
          `${results[0].value.currency} ${(results[0].value.unit_amount || 0) / 100}` : 
          (results[0] as PromiseRejectedResult).reason.message
      },
      premium: {
        price_id: premiumPriceId,
        success: results[1].status === 'fulfilled',
        details: results[1].status === 'fulfilled' ? 
          `${results[1].value.currency} ${(results[1].value.unit_amount || 0) / 100}` : 
          (results[1] as PromiseRejectedResult).reason.message
      },
      professional: {
        price_id: professionalPriceId,
        success: results[2].status === 'fulfilled',
        details: results[2].status === 'fulfilled' ? 
          `${results[2].value.currency} ${(results[2].value.unit_amount || 0) / 100}` : 
          (results[2] as PromiseRejectedResult).reason.message
      }
    };
    
    // Return the results
    return NextResponse.json({
      config: {
        stripe_secret_key: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing',
        stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'Missing',
        stripe_publishable_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Missing',
      },
      plans: SUBSCRIPTION_PLANS,
      price_verification: priceResults
    });
  } catch (error) {
    console.error('Error testing Stripe configuration:', error);
    return NextResponse.json(
      { error: 'Failed to test Stripe configuration' },
      { status: 500 }
    );
  }
} 