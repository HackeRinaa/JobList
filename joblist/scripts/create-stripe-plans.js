// This script creates subscription plans in Stripe
// Run with: node --experimental-modules scripts/create-stripe-plans.mjs

import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

async function createPlans() {
  try {
    console.log('Creating subscription plans in Stripe...');
    
    // Create Basic Plan
    const basicProduct = await stripe.products.create({
      name: 'Βασικό Πλάνο',
      description: '50 credits για ξεκλείδωμα αγγελιών, Βασικό προφίλ, Email υποστήριξη',
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
      name: 'Επαγγελματικό Πλάνο',
      description: '120 credits, Προτεραιότητα στις αναζητήσεις, Προφίλ με badge επαλήθευσης, Τηλεφωνική υποστήριξη',
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
      name: 'Premium Πλάνο',
      description: '250 credits, Κορυφαία θέση στις αναζητήσεις, Προφίλ με badge premium, Προτεραιότητα στην υποστήριξη 24/7',
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
    
    console.log('\nPlans created successfully!');
    console.log('\nAdd these to your .env file:');
    console.log(`STRIPE_BASIC_PLAN_PRICE_ID="${basicPrice.id}"`);
    console.log(`STRIPE_PREMIUM_PLAN_PRICE_ID="${premiumPrice.id}"`);
    console.log(`STRIPE_PROFESSIONAL_PLAN_PRICE_ID="${professionalPrice.id}"`);
    
    console.log('\nProduct and Price IDs:');
    console.log('Basic Plan:');
    console.log(`- Product ID: ${basicProduct.id}`);
    console.log(`- Price ID: ${basicPrice.id}`);
    
    console.log('\nPremium Plan:');
    console.log(`- Product ID: ${premiumProduct.id}`);
    console.log(`- Price ID: ${premiumPrice.id}`);
    
    console.log('\nProfessional Plan:');
    console.log(`- Product ID: ${professionalProduct.id}`);
    console.log(`- Price ID: ${professionalPrice.id}`);
    
  } catch (error) {
    console.error('Error creating plans:', error);
  }
}

createPlans(); 