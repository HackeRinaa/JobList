# Credit/Token System Documentation

## Overview

The credit system automatically allocates tokens to users when they subscribe to a plan. These tokens are used for job applications and other premium features.

## How It Works

### 1. **Automatic Credit Allocation**
When a customer subscribes to a plan, credits are automatically added to their profile:

- **Basic Plan (30€)**: 50 tokens/month
- **Pro Plan (50€)**: 80 tokens/month  
- **Elite Plan (80€)**: 120 tokens/month

### 2. **Credit Allocation Process**

#### **New Subscription**
1. User completes Stripe checkout
2. Stripe webhook `checkout.session.completed` is triggered
3. System identifies the plan from price ID
4. Credits are automatically added to user's profile
5. Subscription is recorded in database

#### **Subscription Renewal**
1. Monthly payment is processed by Stripe
2. Webhook `invoice.payment_succeeded` is triggered
3. Credits are automatically added to user's profile
4. Subscription dates are updated

### 3. **Credit Usage**

#### **Job Applications**
- Each job application costs 1 token (configurable per job)
- System checks if user has sufficient tokens before allowing application
- Tokens are deducted when application is submitted
- Users cannot apply to the same job twice

#### **Token Balance Checking**
- API endpoint: `GET /api/worker/tokens`
- Returns current token balance for authenticated user

#### **Token Deduction**
- API endpoint: `POST /api/worker/tokens`
- Deducts tokens for job applications
- Validates sufficient balance before deduction

## Implementation Details

### **Files Involved**

1. **`src/lib/token-management.ts`**
   - Core token management functions
   - Plan allocation definitions
   - Token balance checking and deduction

2. **`src/app/api/webhooks/stripe/route.ts`**
   - Handles Stripe webhooks
   - Automatically allocates credits on subscription/renewal
   - Updates subscription status

3. **`src/app/api/worker/tokens/route.ts`**
   - API endpoints for token management
   - Get user's token balance
   - Deduct tokens for job applications

### **Database Schema**

```sql
-- User table includes token balance
model User {
  id               String        @id @default(cuid())
  email            String        @unique
  tokens           Int           @default(0)  -- Token balance
  // ... other fields
}

-- Subscription tracking
model Subscription {
  id                  String            @id @default(cuid())
  userId              String            @unique
  stripeSubscriptionId String
  status              SubscriptionStatus
  plan                SubscriptionPlan  -- BASIC, PRO, ELITE
  startDate           DateTime          @default(now())
  endDate             DateTime?
  // ... other fields
}
```

### **Token Allocation Logic**

```typescript
// Plan definitions
export const PLAN_TOKEN_ALLOCATION = {
  BASIC: { plan: 'BASIC', tokens: 50, price: 30.00 },
  PRO: { plan: 'PRO', tokens: 80, price: 50.00 },
  ELITE: { plan: 'ELITE', tokens: 120, price: 80.00 }
};

// Automatic allocation on subscription
const newBalance = await allocateTokensToUser(userId, plan);
```

## API Endpoints

### **Get Token Balance**
```http
GET /api/worker/tokens
Authorization: Bearer <token>

Response:
{
  "success": true,
  "tokens": 50,
  "userId": "user_id"
}
```

### **Deduct Tokens for Job Application**
```http
POST /api/worker/tokens
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job_id",
  "amount": 1
}

Response:
{
  "success": true,
  "tokensDeducted": 1,
  "newBalance": 49,
  "message": "Successfully applied to job. 1 token(s) deducted."
}
```

## Error Handling

### **Insufficient Tokens**
```json
{
  "error": "Insufficient tokens",
  "currentBalance": 0,
  "requiredAmount": 1
}
```

### **Already Applied**
```json
{
  "error": "You have already applied to this job"
}
```

## Monitoring and Logging

### **Webhook Logs**
- ✅ Subscription created/renewed with token allocation
- ❌ Subscription cancelled
- 💰 Plan details and token amounts

### **Token Operations**
- ✅ Tokens allocated to user
- ✅ Tokens deducted from user
- ❌ Insufficient tokens for operation

## Future Enhancements

### **Potential Features**
1. **Token Purchase**: Allow users to buy additional tokens
2. **Token Expiry**: Set expiration dates for unused tokens
3. **Token Bonuses**: Reward users with bonus tokens for referrals
4. **Token Transfer**: Allow users to transfer tokens to other users
5. **Token Analytics**: Track token usage patterns

### **Configuration Options**
1. **Variable Token Costs**: Different jobs could cost different amounts
2. **Plan Upgrades**: Prorated token allocation for plan changes
3. **Token Refunds**: Handle token refunds for cancelled applications

## Testing

### **Test Scenarios**
1. **New Subscription**: Verify tokens are added correctly
2. **Subscription Renewal**: Verify tokens are added monthly
3. **Job Application**: Verify tokens are deducted
4. **Insufficient Tokens**: Verify proper error handling
5. **Duplicate Applications**: Verify prevention of duplicate applications

### **Test Commands**
```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test token balance
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/worker/tokens

# Test token deduction
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"jobId":"test_job","amount":1}' \
  http://localhost:3000/api/worker/tokens
```

## Security Considerations

1. **Authentication**: All token operations require valid user session
2. **Authorization**: Users can only access their own token balance
3. **Validation**: Check for sufficient tokens before any deduction
4. **Audit Trail**: Log all token operations for monitoring
5. **Rate Limiting**: Prevent abuse of token endpoints

This credit system ensures that users get value from their subscriptions while providing a sustainable revenue model for the platform. 