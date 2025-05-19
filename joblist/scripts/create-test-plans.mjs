#!/usr/bin/env node
// This script creates test subscription plans in Stripe
// Run with: node scripts/create-test-plans.mjs

import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Make sure we're using the test key
const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey?.startsWith('sk_test_')) {
  console.error('⚠️ WARNING: You are not using a test API key. This script is meant for test mode only.');
  process.exit(1);
}

// Initialize Stripe
const stripe = new Stripe(apiKey, {
  apiVersion: '2025-02-24.acacia',
});

async function createTestPlans() {
  try {
    console.log('🚀 Creating test subscription plans in Stripe...');
    
    // Create Basic Plan
    const basicProduct = await stripe.products.create({
      name: 'Βασικό Πλάνο (Test)',
      description: '50 credits για ξεκλείδωμα αγγελιών, Βασικό προφίλ, Email υποστήριξη',
      active: true,
    });
    
    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 2999, // 29.99 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '50',
      },
    });
    
    // Create Premium Plan
    const premiumProduct = await stripe.products.create({
      name: 'Επαγγελματικό Πλάνο (Test)',
      description: '120 credits, Προτεραιότητα στις αναζητήσεις, Προφίλ με badge επαλήθευσης, Τηλεφωνική υποστήριξη',
      active: true,
    });
    
    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 5999, // 59.99 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '120',
      },
    });
    
    // Create Professional Plan
    const professionalProduct = await stripe.products.create({
      name: 'Premium Πλάνο (Test)',
      description: '250 credits, Κορυφαία θέση στις αναζητήσεις, Προφίλ με badge premium, Προτεραιότητα στην υποστήριξη 24/7',
      active: true,
    });
    
    const professionalPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 9999, // 99.99 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '250',
      },
    });
    
    console.log('\n✅ Test plans created successfully!');
    console.log('\n📝 Add these to your .env file:');
    console.log(`STRIPE_BASIC_PLAN_PRICE_ID="${basicPrice.id}"`);
    console.log(`STRIPE_PREMIUM_PLAN_PRICE_ID="${premiumPrice.id}"`);
    console.log(`STRIPE_PROFESSIONAL_PLAN_PRICE_ID="${professionalPrice.id}"`);
    
    console.log('\n📋 Test Product and Price IDs:');
    console.log('Basic Plan:');
    console.log(`- Product ID: ${basicProduct.id}`);
    console.log(`- Price ID: ${basicPrice.id}`);
    
    console.log('\nPremium Plan:');
    console.log(`- Product ID: ${premiumProduct.id}`);
    console.log(`- Price ID: ${premiumPrice.id}`);
    
    console.log('\nProfessional Plan:');
    console.log(`- Product ID: ${professionalProduct.id}`);
    console.log(`- Price ID: ${professionalPrice.id}`);
    
    // Generate a sample .env update
    console.log('\n🔄 Copy and paste this to update your .env file:');
    console.log('-------------------------------------------------------');
    console.log(`STRIPE_BASIC_PLAN_PRICE_ID="${basicPrice.id}"`);
    console.log(`STRIPE_PREMIUM_PLAN_PRICE_ID="${premiumPrice.id}"`);
    console.log(`STRIPE_PROFESSIONAL_PLAN_PRICE_ID="${professionalPrice.id}"`);
    console.log('-------------------------------------------------------');
    
  } catch (error) {
    console.error('❌ Error creating test plans:', error);
  }
}

createTestPlans(); 