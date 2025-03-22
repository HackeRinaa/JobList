import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { getUser } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
    
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { subscription: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!dbUser.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: dbUser.name || undefined,
      });
      
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: dbUser.stripeCustomerId!,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { subscription: true },
    });

    if (!dbUser?.subscription?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    await stripe.subscriptions.cancel(dbUser.subscription.stripeSubscriptionId);

    await prisma.subscription.update({
      where: { id: dbUser.subscription.id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ message: 'Subscription cancelled' });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 