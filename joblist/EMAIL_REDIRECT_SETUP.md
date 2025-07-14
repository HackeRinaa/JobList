# Email Redirect Configuration

## Problem
When users click the email confirmation link, they get redirected to `localhost:3000` instead of your actual domain.

## Solution
Set the `NEXT_PUBLIC_SITE_URL` environment variable to your actual domain.

### For Development
In your `.env.local` file:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### For Production
In your production environment variables:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## What This Fixes
- Email confirmation links will redirect to the correct domain
- Users will land on your login page after confirming their email
- The onboarding flow will work properly

## Supabase Configuration
You may also need to configure your Supabase project:
1. Go to your Supabase Dashboard
2. Navigate to Authentication > URL Configuration
3. Set the Site URL to your domain
4. Add your domain to the Redirect URLs list

## Testing
1. Sign up with a new email
2. Check the confirmation email
3. Click the confirmation link
4. Verify you're redirected to your domain (not localhost) 