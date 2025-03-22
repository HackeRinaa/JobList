import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, TOKEN_PACKAGES } from '@/lib/stripe';
import { getUser } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId } = await req.json();
    const tokenPackage = TOKEN_PACKAGES[packageId as keyof typeof TOKEN_PACKAGES];
    
    if (!tokenPackage) {
      return NextResponse.json({ error: 'Invalid token package' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
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
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: tokenPackage.price_id,
          quantity: 1,
        },
      ],
      metadata: {
        tokenAmount: tokenPackage.amount.toString(),
        userId: dbUser.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    });

    await prisma.tokenPurchase.create({
      data: {
        userId: dbUser.id,
        amount: tokenPackage.amount,
        cost: tokenPackage.price,
        stripePaymentId: session.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Token purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Endpoint to check token balance
export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { tokens: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ tokens: dbUser.tokens });
  } catch (error) {
    console.error('Token balance check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 