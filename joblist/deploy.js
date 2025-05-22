// Deploy script for Vercel
const { execSync } = require('child_process');

console.log('🚀 Starting deployment to Vercel...');

try {
  // First run the build
  console.log('📦 Building the application...');
  require('./build.js');
  
  // Then deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('✅ Deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 