// This script creates the updated subscription plans in Stripe
// Run with: node scripts/create-new-plans.js

import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

async function createNewPlans() {
  try {
    console.log('Creating updated subscription plans in Stripe...');
    
    // Create Basic Plan - "Πρόγραμμα Εκκίνησης"
    const basicProduct = await stripe.products.create({
      name: 'Βασικό Πλάνο – "Πρόγραμμα Εκκίνησης"',
      description: 'Πρόσβαση σε βασικές αγγελίες (μικρές επισκευές), 60 tokens/μήνα, Email υποστήριξη',
      metadata: {
        tokens: '60',
        features: 'basic_access,email_support,10_free_tokens'
      }
    });
    
    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 1499, // 14.99 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '60',
        plan_type: 'basic'
      },
    });
    
    // Create Pro Plan - "Επαγγελματίας"
    const proProduct = await stripe.products.create({
      name: 'Pro Πλάνο – "Επαγγελματίας"',
      description: 'Πρόσβαση σε premium αγγελίες (επείγουσες επισκευές), 200 tokens/μήνα, Προτεραιότητα στις αγγελίες, Τηλεφωνική υποστήριξη',
      metadata: {
        tokens: '200',
        features: 'premium_access,priority_listings,phone_support,20_free_tokens'
      }
    });
    
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 3999, // 39.99 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '200',
        plan_type: 'pro'
      },
    });
    
    // Create Elite Plan - "Αρχιτεχνίτης"
    const eliteProduct = await stripe.products.create({
      name: 'Elite Πλάνο – "Αρχιτεχνίτης"',
      description: 'Απεριόριστες αγγελίες (υψηλής αξίας), 500 tokens/μήνα, Τοποθέτηση στην κορυφή αναζητήσεων, Αποκλειστικός account manager + 24/7 υποστήριξη',
      metadata: {
        tokens: '500',
        features: 'unlimited_access,top_placement,account_manager,24_7_support,50_free_tokens'
      }
    });
    
    const elitePrice = await stripe.prices.create({
      product: eliteProduct.id,
      unit_amount: 7999, // 79.99 EUR (in cents)
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tokens: '500',
        plan_type: 'elite'
      },
    });
    
    console.log('\n✅ Updated plans created successfully!');
    console.log('\n📝 Add these to your .env file:');
    console.log(`STRIPE_BASIC_PLAN_PRICE_ID="${basicPrice.id}"`);
    console.log(`STRIPE_PREMIUM_PLAN_PRICE_ID="${proPrice.id}"`);
    console.log(`STRIPE_PROFESSIONAL_PLAN_PRICE_ID="${elitePrice.id}"`);
    
    console.log('\n📋 Product and Price IDs:');
    console.log('Basic Plan:');
    console.log(`- Product ID: ${basicProduct.id}`);
    console.log(`- Price ID: ${basicPrice.id}`);
    console.log(`- Expected Product ID: prod_Sg2Yu30Qtu5PKP`);
    
    console.log('\nPro Plan:');
    console.log(`- Product ID: ${proProduct.id}`);
    console.log(`- Price ID: ${proPrice.id}`);
    console.log(`- Expected Product ID: prod_Sg2Zvazz2oksnD`);
    
    console.log('\nElite Plan:');
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
    
    console.log('\n⚠️  Note: The product IDs above are the actual Stripe product IDs.');
    console.log('   The expected product IDs you provided (prod_Sg2Yu30Qtu5PKP, etc.)');
    console.log('   should be used in your code for testing purposes.');
    
  } catch (error) {
    console.error('Error creating plans:', error);
  }
}

createNewPlans(); 