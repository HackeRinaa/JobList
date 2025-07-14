// This script creates the corrected subscription plans in Stripe
// Run with: node scripts/create-corrected-plans.js

import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

async function createCorrectedPlans() {
  try {
    console.log('Creating corrected subscription plans in Stripe...');
    
    // Create Basic Plan - "Πρόγραμμα Εκκίνησης"
    const basicProduct = await stripe.products.create({
      name: 'Βασικό Πλάνο – "Πρόγραμμα Εκκίνησης"',
      description: 'Πρόσβαση σε βασικές αγγελίες (μικρές επισκευές), 50 tokens/μήνα, Email υποστήριξη',
      metadata: {
        tokens: '50',
        features: 'basic_access,email_support,10_free_tokens'
      }
    });
    
    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 3000, // 30.00 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '50',
        plan_type: 'basic'
      },
    });
    
    // Create Pro Plan - "Επαγγελματίας"
    const proProduct = await stripe.products.create({
      name: 'Pro Πλάνο – "Επαγγελματίας"',
      description: 'Πρόσβαση σε premium αγγελίες (επείγουσες επισκευές), 80 tokens/μήνα, Προτεραιότητα στις αγγελίες, Τηλεφωνική υποστήριξη',
      metadata: {
        tokens: '80',
        features: 'premium_access,priority_listings,phone_support,20_free_tokens'
      }
    });
    
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 5000, // 50.00 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '80',
        plan_type: 'pro'
      },
    });
    
    // Create Elite Plan - "Αρχιτεχνίτης"
    const eliteProduct = await stripe.products.create({
      name: 'Elite Πλάνο – "Αρχιτεχνίτης"',
      description: 'Απεριόριστες αγγελίες (υψηλής αξίας), 120 tokens/μήνα, Τοποθέτηση στην κορυφή αναζητήσεων, Αποκλειστικός account manager + 24/7 υποστήριξη',
      metadata: {
        tokens: '120',
        features: 'unlimited_access,top_placement,account_manager,24_7_support,50_free_tokens'
      }
    });
    
    const elitePrice = await stripe.prices.create({
      product: eliteProduct.id,
      unit_amount: 8000, // 80.00 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '120',
        plan_type: 'elite'
      },
    });
    
    console.log('\n✅ Corrected plans created successfully!');
    console.log('\n📝 Add these to your .env file:');
    console.log(`STRIPE_BASIC_PLAN_PRICE_ID="${basicPrice.id}"`);
    console.log(`STRIPE_PREMIUM_PLAN_PRICE_ID="${proPrice.id}"`);
    console.log(`STRIPE_PROFESSIONAL_PLAN_PRICE_ID="${elitePrice.id}"`);
    
    console.log('\n📋 Product and Price IDs:');
    console.log('Basic Plan (30€ - 50 tokens):');
    console.log(`- Product ID: ${basicProduct.id}`);
    console.log(`- Price ID: ${basicPrice.id}`);
    console.log(`- Expected Product ID: prod_Sg2Yu30Qtu5PKP`);
    
    console.log('\nPro Plan (50€ - 80 tokens):');
    console.log(`- Product ID: ${proProduct.id}`);
    console.log(`- Price ID: ${proPrice.id}`);
    console.log(`- Expected Product ID: prod_Sg2Zvazz2oksnD`);
    
    console.log('\nElite Plan (80€ - 120 tokens):');
    console.log(`- Product ID: ${eliteProduct.id}`);
    console.log(`- Price ID: ${elitePrice.id}`);
    console.log(`- Expected Product ID: prod_Sg2afptzMEEp3N`);
    
    // Generate a sample .env update
    console.log('\n🔄 Copy and paste this to update your .env file:');
    console.log('-------------------------------------------------------');
    console.log(`STRIPE_BASIC_PLAN_PRICE_ID="${basicPrice.id}"`);
    console.log(`STRIPE_PREMIUM_PLAN_PRICE_ID="${proPrice.id}"`);
    console.log(`STRIPE_PROFESSIONAL_PLAN_PRICE_ID="${elitePrice.id}"`);
    console.log('-------------------------------------------------------');
    
    console.log('\n💰 Pricing Summary:');
    console.log('- Basic: 30€/month (50 tokens)');
    console.log('- Pro: 50€/month (80 tokens)');
    console.log('- Elite: 80€/month (120 tokens)');
    
  } catch (error) {
    console.error('Error creating plans:', error);
  }
}

createCorrectedPlans(); 