import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
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
        
        // Map Stripe product to subscription plan
        const priceId = subscription.items.data[0].price.id;
        let plan: 'BASIC' | 'PREMIUM' | 'PROFESSIONAL' = 'BASIC';
        
        if (priceId === process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
          plan = 'PREMIUM';
        } else if (priceId === process.env.STRIPE_PROFESSIONAL_PLAN_PRICE_ID) {
          plan = 'PROFESSIONAL';
        }
        
        // Add tokens based on plan
        let tokens = 0;
        if (plan === 'BASIC') tokens = 50;
        else if (plan === 'PREMIUM') tokens = 120;
        else if (plan === 'PROFESSIONAL') tokens = 250;
        
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
        
        // Update user's tokens
        await prisma.user.update({
          where: { id: user.id },
          data: { tokens: { increment: tokens } }
        });
        
        console.log(`Subscription created for user ${user.id}`);
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
          
          // Add tokens based on plan
          let tokens = 0;
          if (dbSubscription.plan === 'BASIC') tokens = 50;
          else if (dbSubscription.plan === 'PREMIUM') tokens = 120;
          else if (dbSubscription.plan === 'PROFESSIONAL') tokens = 250;
          
          // Add tokens to user's balance
          await prisma.user.update({
            where: { id: dbSubscription.userId },
            data: { tokens: { increment: tokens } }
          });
          
          console.log(`Subscription renewed for user ${dbSubscription.userId}`);
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
        
        console.log(`Subscription cancelled for subscription ID ${dbSubscription.id}`);
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