import { prisma } from './prisma';
import { SubscriptionPlan } from '@prisma/client';

export interface TokenAllocation {
  plan: SubscriptionPlan;
  tokens: number;
  price: number;
}

export const PLAN_TOKEN_ALLOCATION: Record<SubscriptionPlan, TokenAllocation> = {
  BASIC: {
    plan: 'BASIC',
    tokens: 50,
    price: 30.00
  },
  PRO: {
    plan: 'PRO',
    tokens: 80,
    price: 50.00
  },
  ELITE: {
    plan: 'ELITE',
    tokens: 120,
    price: 80.00
  }
};

/**
 * Allocate tokens to a user based on their subscription plan
 */
export async function allocateTokensToUser(userId: string, plan: SubscriptionPlan): Promise<number> {
  try {
    const allocation = PLAN_TOKEN_ALLOCATION[plan];
    if (!allocation) {
      throw new Error(`Invalid plan: ${plan}`);
    }

    // Update user's token balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        tokens: { increment: allocation.tokens }
      }
    });

    console.log(`✅ Allocated ${allocation.tokens} tokens to user ${userId} for ${plan} plan`);
    
    return updatedUser.tokens;
  } catch (error) {
    console.error(`❌ Error allocating tokens to user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get user's current token balance
 */
export async function getUserTokenBalance(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokens: true }
    });

    return user?.tokens || 0;
  } catch (error) {
    console.error(`❌ Error getting token balance for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Deduct tokens from user's balance (for job applications)
 */
export async function deductTokensFromUser(userId: string, amount: number): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokens: true }
    });

    if (!user || user.tokens < amount) {
      console.log(`❌ Insufficient tokens for user ${userId}. Required: ${amount}, Available: ${user?.tokens || 0}`);
      return false;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { tokens: { decrement: amount } }
    });

    console.log(`✅ Deducted ${amount} tokens from user ${userId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deducting tokens from user ${userId}:`, error);
    throw error;
  }
}

/**
 * Check if user has sufficient tokens for an action
 */
export async function hasSufficientTokens(userId: string, requiredAmount: number): Promise<boolean> {
  try {
    const balance = await getUserTokenBalance(userId);
    return balance >= requiredAmount;
  } catch (error) {
    console.error(`❌ Error checking token balance for user ${userId}:`, error);
    return false;
  }
}

/**
 * Get subscription plan details by Stripe price ID
 */
export function getPlanByPriceId(priceId: string): TokenAllocation | null {
  const basicPriceId = process.env.STRIPE_BASIC_PLAN_PRICE_ID;
  const premiumPriceId = process.env.STRIPE_PREMIUM_PLAN_PRICE_ID;
  const professionalPriceId = process.env.STRIPE_PROFESSIONAL_PLAN_PRICE_ID;

  if (priceId === basicPriceId) {
    return PLAN_TOKEN_ALLOCATION.BASIC;
  } else if (priceId === premiumPriceId) {
    return PLAN_TOKEN_ALLOCATION.PRO;
  } else if (priceId === professionalPriceId) {
    return PLAN_TOKEN_ALLOCATION.ELITE;
  }

  return null;
} 