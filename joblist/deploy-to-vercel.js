#!/usr/bin/env node

/**
 * This script deploys the application to Vercel
 */
const { execSync } = require('child_process');

// Print header
console.log('🚀 Deploying to Vercel...');

try {
  // Run the deployment command
  console.log('Running deployment...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 