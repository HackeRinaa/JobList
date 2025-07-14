import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserTokenBalance, deductTokensFromUser, hasSufficientTokens } from '@/lib/token-management';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Get user's token balance
export async function GET() {
  try {
    // Get the authenticated user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findFirst({
      where: { authId: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const balance = await getUserTokenBalance(user.id);

    return NextResponse.json({ 
      success: true, 
      tokens: balance,
      userId: user.id
    });
  } catch (error) {
    console.error('Error getting token balance:', error);
    return NextResponse.json({ error: 'Failed to get token balance' }, { status: 500 });
  }
}

// POST - Deduct tokens for job application
export async function POST(request: NextRequest) {
  try {
    const { jobId, amount = 1 } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Get the authenticated user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findFirst({
      where: { authId: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has sufficient tokens
    const hasTokens = await hasSufficientTokens(user.id, amount);
    
    if (!hasTokens) {
      const balance = await getUserTokenBalance(user.id);
      return NextResponse.json({ 
        error: 'Insufficient tokens',
        currentBalance: balance,
        requiredAmount: amount
      }, { status: 400 });
    }

    // Check if user has already applied to this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        workerId: user.id
      }
    });

    if (existingApplication) {
      return NextResponse.json({ 
        error: 'You have already applied to this job' 
      }, { status: 400 });
    }

    // Deduct tokens
    const success = await deductTokensFromUser(user.id, amount);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to deduct tokens' }, { status: 500 });
    }

    // Get updated balance
    const newBalance = await getUserTokenBalance(user.id);

    return NextResponse.json({ 
      success: true, 
      tokensDeducted: amount,
      newBalance,
      message: `Successfully applied to job. ${amount} token(s) deducted.`
    });
  } catch (error) {
    console.error('Error processing token deduction:', error);
    return NextResponse.json({ error: 'Failed to process token deduction' }, { status: 500 });
  }
} 