# JobList Deployment Guide

This guide will help you deploy your JobList application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. The Vercel CLI installed: `npm install -g vercel`
3. A PostgreSQL database (Vercel PostgreSQL, Supabase, or other provider)
4. Supabase account for authentication
5. Stripe account for payments

## Environment Variables

Before deploying, make sure to have these environment variables ready:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_BASIC_PLAN_PRICE_ID`: Stripe price ID for basic plan
- `STRIPE_PREMIUM_PLAN_PRICE_ID`: Stripe price ID for premium plan
- `STRIPE_PROFESSIONAL_PLAN_PRICE_ID`: Stripe price ID for professional plan
- `NEXTAUTH_SECRET`: A random string for securing NextAuth.js
- `NEXTAUTH_URL`: Your app's URL (will be set automatically by Vercel)

## Deployment Steps

### Option 1: Using the Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account
3. Click "Add New" and select "Project"
4. Import your Git repository
5. Configure the project:
   - Set the Framework Preset to "Next.js"
   - Add all the environment variables listed above
6. Click "Deploy"

### Option 2: Using the Command Line

1. Open a terminal in your project root
2. Make the deployment script executable: `chmod +x deploy.sh`
3. Run the deployment script: `./deploy.sh`
4. Follow the prompts to log in and configure your project

### Option 3: Manual Deployment with Vercel CLI

1. Open a terminal in your project root
2. Log in to Vercel: `vercel login`
3. Run `vercel` to deploy (or `vercel --prod` for production)
4. Follow the prompts to configure your project

## Troubleshooting

### Build Errors

If you encounter build errors related to ESLint:

1. Make sure your `next.config.ts` has the ESLint configuration:
```typescript
const nextConfig: NextConfig = {
  // ...other config
  eslint: {
    ignoreDuringBuilds: true,
  },
};
```

2. Set the environment variable `NEXT_DISABLE_ESLINT=1` in your Vercel project settings

### Database Connection Issues

- Make sure your database is accessible from Vercel's servers
- If using Supabase, ensure your database allows connections from your Vercel deployment

### After Deployment

1. Set up your Stripe webhook endpoint in the Stripe dashboard:
   - Endpoint URL: `https://your-vercel-app.vercel.app/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_succeeded`

2. Test the application to ensure everything is working correctly

## Automated Deployments

Once configured, any push to your main branch will trigger a new deployment on Vercel. 