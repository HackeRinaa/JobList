import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { allocateTokensToUser, getPlanByPriceId } from '@/lib/token-management';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;
    
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      console.error('Error verifying webhook signature', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    console.log(`Received Stripe webhook: ${event.type}`);
    
    // Handle subscription events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Handle subscription checkout completed
      if (session.mode === 'subscription' && session.customer) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        // Find the user with the Stripe customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: session.customer as string }
        });
        
        if (!user) {
          console.error('User not found for Stripe customer ID:', session.customer);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        // Get plan details from price ID
        const priceId = subscription.items.data[0].price.id;
        const planDetails = getPlanByPriceId(priceId);
        
        if (!planDetails) {
          console.error(`Invalid price ID: ${priceId}`);
          return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }
        
        // Map plan to subscription enum
        let plan: 'BASIC' | 'PRO' | 'ELITE' = planDetails.plan;
        
        // Create or update the subscription in the database
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            stripeSubscriptionId: subscription.id,
            status: 'ACTIVE',
            plan,
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000)
          },
          create: {
            userId: user.id,
            stripeSubscriptionId: subscription.id,
            status: 'ACTIVE',
            plan,
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000)
          }
        });
        
        // Allocate tokens to user using the new token management system
        const newBalance = await allocateTokensToUser(user.id, plan);
        
        console.log(`✅ Subscription created for user ${user.id} (${user.email})`);
        console.log(`💰 Plan: ${plan}, Tokens allocated: ${planDetails.tokens}, New balance: ${newBalance}`);
      }
    } 
    // Handle subscription payment succeeded (renewal)
    else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      
      if (invoice.subscription && invoice.customer) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        
        // Find the user with this subscription
        const dbSubscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: invoice.subscription as string },
          include: { user: true }
        });
        
        if (dbSubscription) {
          // Update subscription dates
          await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              startDate: new Date(subscription.current_period_start * 1000),
              endDate: new Date(subscription.current_period_end * 1000)
            }
          });
          
          // Allocate tokens for renewal using the new token management system
          const newBalance = await allocateTokensToUser(dbSubscription.userId, dbSubscription.plan);
          
          console.log(`✅ Subscription renewed for user ${dbSubscription.userId} (${dbSubscription.user.email})`);
          console.log(`💰 Plan: ${dbSubscription.plan}, Tokens allocated, New balance: ${newBalance}`);
        }
      }
    } 
    // Handle subscription cancelled
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Update subscription status in the database
      const dbSubscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id }
      });
      
      if (dbSubscription) {
        await prisma.subscription.update({
          where: { id: dbSubscription.id },
          data: { status: 'CANCELLED' }
        });
        
        console.log(`❌ Subscription cancelled for subscription ID ${dbSubscription.id}`);
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 