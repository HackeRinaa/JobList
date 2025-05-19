// Simple script to create Stripe test plans using CommonJS
// Run with: node dist/run-test-plans.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Parse command line arguments 
const args = process.argv.slice(2);
const shouldUpdate = args.includes('--update-env');

// Load environment variables
dotenv.config();

// Check Stripe API key
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey || !stripeKey.startsWith('sk_test_')) {
  console.error('Error: You must use a test mode API key (starts with sk_test_)');
  process.exit(1);
}

// Helper function to create a test plan
async function createTestPlans() {
  try {
    console.log('Creating test plans in Stripe...');
    
    // Use Stripe CLI through a temporary script
    const tempFile = path.join(__dirname, 'temp-stripe.js');
    fs.writeFileSync(tempFile, `
      const stripe = require('stripe')('${stripeKey}');
      
      async function run() {
        try {
          // Basic Plan
          const basicProduct = await stripe.products.create({
            name: 'Βασικό Πλάνο (Test)',
            description: '50 credits για ξεκλείδωμα αγγελιών',
            active: true,
          });
          
          const basicPrice = await stripe.prices.create({
            product: basicProduct.id,
            unit_amount: 2999,
            currency: 'eur',
            recurring: { interval: 'month' },
          });
          
          // Premium Plan
          const premiumProduct = await stripe.products.create({
            name: 'Επαγγελματικό Πλάνο (Test)',
            description: '120 credits, Προτεραιότητα στις αναζητήσεις',
            active: true,
          });
          
          const premiumPrice = await stripe.prices.create({
            product: premiumProduct.id,
            unit_amount: 5999,
            currency: 'eur',
            recurring: { interval: 'month' },
          });
          
          // Professional Plan
          const proProduct = await stripe.products.create({
            name: 'Premium Πλάνο (Test)',
            description: '250 credits, Κορυφαία θέση',
            active: true,
          });
          
          const proPrice = await stripe.prices.create({
            product: proProduct.id,
            unit_amount: 9999,
            currency: 'eur',
            recurring: { interval: 'month' },
          });
          
          console.log(JSON.stringify({
            basic: {
              product: basicProduct.id,
              price: basicPrice.id
            },
            premium: {
              product: premiumProduct.id,
              price: premiumPrice.id
            },
            professional: {
              product: proProduct.id,
              price: proPrice.id
            }
          }));
        } catch (error) {
          console.error('Error:', error.message);
          process.exit(1);
        }
      }
      
      run();
    `);
    
    // Run the temp script
    const result = execSync(`node "${tempFile}"`, { encoding: 'utf-8' });
    
    // Parse the result
    const data = JSON.parse(result);
    
    console.log('\nTest plans created successfully! 🎉');
    console.log('\nAdd these to your .env file:');
    console.log(`STRIPE_BASIC_PLAN_PRICE_ID="${data.basic.price}"`);
    console.log(`STRIPE_PREMIUM_PLAN_PRICE_ID="${data.premium.price}"`);
    console.log(`STRIPE_PROFESSIONAL_PLAN_PRICE_ID="${data.professional.price}"`);
    
    // Update .env file if requested
    if (shouldUpdate) {
      console.log('\nUpdating .env file...');
      const envPath = path.join(process.cwd(), '.env');
      let envContent = fs.readFileSync(envPath, 'utf-8');
      
      // Replace the price IDs
      envContent = envContent.replace(
        /STRIPE_BASIC_PLAN_PRICE_ID="[^"]*"/,
        `STRIPE_BASIC_PLAN_PRICE_ID="${data.basic.price}"`
      );
      
      envContent = envContent.replace(
        /STRIPE_PREMIUM_PLAN_PRICE_ID="[^"]*"/,
        `STRIPE_PREMIUM_PLAN_PRICE_ID="${data.premium.price}"`
      );
      
      envContent = envContent.replace(
        /STRIPE_PROFESSIONAL_PLAN_PRICE_ID="[^"]*"/,
        `STRIPE_PROFESSIONAL_PLAN_PRICE_ID="${data.professional.price}"`
      );
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ .env file updated successfully!');
    }
    
    // Clean up
    fs.unlinkSync(tempFile);
    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the function
createTestPlans(); 