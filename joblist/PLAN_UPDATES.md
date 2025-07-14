# Plan Updates Summary

## Updated Subscription Plans

### 1. Βασικό Πλάνο – "Πρόγραμμα Εκκίνησης"
- **Price**: 30.00€/μήνα
- **Tokens**: 50 tokens/μήνα
- **Stripe Product ID**: prod_Sg2Yu30Qtu5PKP
- **Features**:
  - Πρόσβαση σε βασικές αγγελίες (μικρές επισκευές)
  - 10 δωρεάν τόκενς/μήνα (από εργασιάκια)
  - Στοιχεία επικοινωνίας πελάτη μετά από προσφορά
  - Υποστήριξη μέσω email

### 2. Pro Πλάνο – "Επαγγελματίας"
- **Price**: 50.00€/μήνα
- **Tokens**: 80 tokens/μήνα
- **Stripe Product ID**: prod_Sg2Zvazz2oksnD
- **Features**:
  - Πρόσβαση σε premium αγγελίες (επείγουσες επισκευές)
  - 20 δωρεάν τόκενς/μήνα (από εργασιάκια)
  - Άμεση επικοινωνία με πελάτες
  - Προτεραιότητα στις αγγελίες
  - Υποστήριξη τηλέφωνο + email

### 3. Elite Πλάνο – "Αρχιτεχνίτης"
- **Price**: 80.00€/μήνα
- **Tokens**: 120 tokens/μήνα
- **Stripe Product ID**: prod_Sg2afptzMEEp3N
- **Features**:
  - Απεριόριστες αγγελίες (υψηλής αξίας)
  - 50 δωρεάν τόκενς/μήνα
  - Απευθείας διαπραγμάτευση με πελάτες
  - Τοποθέτηση στην κορυφή αναζητήσεων
  - Αποκλειστικός account manager + 24/7 υποστήριξη

## Files Updated

### 1. `src/lib/stripe.ts`
- Updated `SUBSCRIPTION_PLANS` with corrected pricing and token amounts
- Added `stripeProductId` field for each plan
- Updated plan names to match new structure

### 2. `src/components/ChoosePlan.tsx`
- Added `stripeProductId` to Plan interface
- Updated component to handle new plan structure

### 3. `src/components/WorkerSignup.tsx`
- Updated plans array with corrected pricing, features, and Stripe product IDs
- Updated plan names and descriptions

### 4. `src/components/StripeCheckout.tsx`
- Updated `PLAN_MAPPING` to match new plan names

### 5. `src/components/worker/UpgradeSubscription.tsx`
- Updated subscription plans with corrected pricing and features
- Updated token amounts and descriptions

### 6. `prisma/schema.prisma`
- Updated `SubscriptionPlan` enum to include `ELITE` instead of `PREMIUM`
- Applied database migration

### 7. `src/app/api/webhooks/stripe/route.ts`
- Updated webhook to handle new plan structure
- Updated token amounts for each plan
- Fixed plan mapping for BASIC, PRO, ELITE

## Testing Instructions

### 1. Create Stripe Products and Prices
Run the corrected script to create the updated plans in Stripe:

```bash
cd joblist
node scripts/create-corrected-plans.js
```

### 2. Update Environment Variables
Add the new price IDs to your `.env` file:

```env
STRIPE_BASIC_PLAN_PRICE_ID="price_xxxxx"
STRIPE_PREMIUM_PLAN_PRICE_ID="price_yyyyy"
STRIPE_PROFESSIONAL_PLAN_PRICE_ID="price_zzzzz"
```

### 3. Test the Plans
1. Navigate to the worker signup page
2. Complete the personal details form
3. Select a plan from the updated options
4. Test the Stripe checkout flow
5. Verify that tokens are correctly allocated based on the selected plan

### 4. Verify Webhook Integration
1. Make a test subscription purchase
2. Check that the webhook correctly processes the payment
3. Verify that the correct number of tokens is added to the user's account
4. Confirm that the subscription is properly recorded in the database

## Key Changes Summary

- **Pricing**: Updated to 30€, 50€, 80€ for better competitiveness
- **Tokens**: Updated to 50, 80, 120 tokens for better value proposition
- **Features**: Enhanced features with more detailed descriptions
- **Stripe Integration**: Added product IDs for testing and production use
- **Database**: Updated schema to support new plan structure
- **Webhooks**: Updated to handle new plan types and token amounts

## Next Steps

1. Test the complete subscription flow
2. Verify webhook processing
3. Test token allocation and usage
4. Monitor subscription renewals
5. Update any additional components that reference the old plan structure 