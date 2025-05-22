// deploy-vercel.js
const { execSync } = require('child_process');
const fs = require('fs');

// Helper function to run commands and print output
function run(command) {
  console.log(`\n📝 Running: ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (_error) {
    console.error(`❌ Error executing command: ${command}`);
    return false;
  }
}

// Main deployment function
async function deploy() {
  console.log('🚀 Starting deployment to Vercel...');

  // 1. Check if we're in the correct directory
  if (!fs.existsSync('package.json')) {
    console.error('❌ Error: package.json not found. Make sure you run this script from the project root.');
    process.exit(1);
  }

  // 2. Install dependencies
  console.log('📦 Installing dependencies...');
  if (!run('npm install')) {
    process.exit(1);
  }

  // 3. Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  if (!run('npx prisma generate')) {
    process.exit(1);
  }

  // 4. Create a fresh build
  console.log('🏗️ Creating optimized production build...');
  if (!run('NEXT_DISABLE_ESLINT=1 SKIP_TYPE_CHECK=1 next build')) {
    process.exit(1);
  }

  // 5. Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  if (!run('npx vercel --prod')) {
    process.exit(1);
  }

  console.log('\n✅ Deployment complete! Your app should be live on Vercel.');
}

// Run the deployment
deploy().catch(error => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
}); 