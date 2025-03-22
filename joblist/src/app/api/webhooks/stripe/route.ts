import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await prisma.subscription.create({
            data: {
              userId: session.metadata?.userId,
              stripeSubscriptionId: subscription.id,
              status: 'ACTIVE',
              plan: subscription.metadata?.plan || 'BASIC',
              startDate: new Date(subscription.current_period_start * 1000),
              endDate: new Date(subscription.current_period_end * 1000),
            },
          });

          // Add tokens based on the subscription plan
          const planTokens = subscription.metadata?.tokens ? parseInt(subscription.metadata.tokens) : 0;
          await prisma.user.update({
            where: { id: session.metadata?.userId },
            data: {
              tokens: {
                increment: planTokens,
              },
            },
          });
        } else if (session.mode === 'payment') {
          // Handle token purchase
          const tokenAmount = session.metadata?.tokenAmount ? parseInt(session.metadata.tokenAmount) : 0;
          
          await prisma.tokenPurchase.update({
            where: {
              stripePaymentId: session.id,
            },
            data: {
              status: 'COMPLETED',
            },
          });

          await prisma.user.update({
            where: { id: session.metadata?.userId },
            data: {
              tokens: {
                increment: tokenAmount,
              },
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: 'CANCELLED',
            endDate: new Date(),
          },
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELLED',
            endDate: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 