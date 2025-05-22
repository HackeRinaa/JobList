# JobList Deployment Instructions

## Method 1: Deploy using Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" -> "Project"
4. Import your GitHub repository
5. Configure the following:
   - Framework Preset: Next.js
   - Root Directory: `joblist`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. In the Environment Variables section, add:
   ```
   NEXTAUTH_SECRET=your_secret_key
   NEXT_DISABLE_ESLINT=1
   SKIP_TYPE_CHECK=1
   TWILIO_ACCOUNT_SID=AC000000000000000000000000000000000
   TWILIO_AUTH_TOKEN=0000000000000000000000000000000000
   TWILIO_PHONE_NUMBER=+10000000000
   ```
7. Click "Deploy"

## Method 2: Deploy using Command Line

### Direct Manual Build

If you're having issues with Vercel's automatic builds, you can build locally and deploy the static output:

1. Navigate to the joblist directory:
   ```bash
   cd joblist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy with Vercel CLI:
   ```bash
   vercel --prod
   ```

### Use our Deployment Helper

We've included a helper script:

```bash
cd joblist
node deploy.js
```

## Troubleshooting

If you encounter build errors:

1. **Static generation errors**: We've set up the project to avoid static generation issues by using:
   - `output: 'standalone'` in next.config.ts
   - Custom build script that sets proper environment variables

2. **Suspense boundary errors**: We've wrapped all components using `useSearchParams()` with Suspense boundaries.

3. **Twilio errors**: We've added placeholder Twilio credentials in the environment variables.

If you continue having issues, try deploying from the Vercel dashboard and setting the root directory to `joblist`. 