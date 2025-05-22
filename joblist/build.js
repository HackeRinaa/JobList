// Custom build script for deployment
const { execSync } = require('child_process');

// Set environment variables
process.env.NEXT_DISABLE_ESLINT = '1';
process.env.SKIP_TYPE_CHECK = '1';

// Print environment info
console.log('Building with:');
console.log(`- Node version: ${process.version}`);
console.log(`- Next.js: version from package.json`);
console.log('- ESLint disabled: Yes');
console.log('- TypeScript checking disabled: Yes');
console.log();

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Run the Next.js build
  console.log('Building Next.js application...');
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_DISABLE_ESLINT: '1',
      SKIP_TYPE_CHECK: '1'
    }
  });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 