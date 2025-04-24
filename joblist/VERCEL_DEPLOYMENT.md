# Deploying JobList to Vercel

This guide provides instructions for deploying the JobList application to Vercel.

## Prerequisites

- A Vercel account
- A PostgreSQL database (Vercel Postgres, Supabase, or any other PostgreSQL provider)
- Stripe account for payments
- Supabase account for storage
- Twilio account for SMS notifications

## Step 1: Set Up Your Environment Variables

When deploying to Vercel, you need to configure the following environment variables in the Vercel dashboard:

```
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone
```

## Step 2: Prepare Your Database

Make sure your PostgreSQL database is accessible from Vercel's servers. If using Supabase or Vercel Postgres, ensure the proper access permissions are set.

## Step 3: Deploy to Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Log in to your Vercel account
3. Click "Add New" > "Project"
4. Import your repository
5. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
6. Add all environment variables from Step 1
7. Click "Deploy"

## Step 4: Set Up Prisma Migrations

After deployment, you'll need to run your Prisma migrations on your production database. You have two options:

### Option 1: Vercel CLI Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run a one-off command to execute migrations
vercel run npx prisma migrate deploy
```

### Option 2: Use a Deployment Webhook
Configure a deployment webhook in Vercel that runs the Prisma migrations after each deployment.

## Step 5: Configure Stripe Webhooks

Update your Stripe webhook endpoint to point to your Vercel deployment URL:
`https://your-vercel-domain.vercel.app/api/webhooks/stripe`

## Step 6: Test Your Deployment

After deployment, verify all functionality is working correctly:
- User registration and login
- Job listing creation
- Application submission
- Payment processing
- Notification systems

## Troubleshooting

- **Database Connection Issues**: Ensure your DATABASE_URL has the correct format and credentials
- **Stripe Webhook Failures**: Verify your webhook secret is correctly set
- **Supabase Connection Issues**: Check that your Supabase project allows connections from Vercel's IP range
- **Build Failures**: Check the Vercel build logs for detailed error information 