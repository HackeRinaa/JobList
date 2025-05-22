// Custom build script for deployment
const { execSync } = require('child_process');

// Set environment variables
process.env.NEXT_DISABLE_ESLINT = '1';
process.env.SKIP_TYPE_CHECK = '1';
process.env.NODE_ENV = 'production';
// Disable static generation
process.env.NEXT_PRIVATE_STANDALONE = 'true';
process.env.NEXT_PRIVATE_NO_EXPORT = 'true';

// Print environment info
console.log('Building with:');
console.log(`- Node version: ${process.version}`);
console.log(`- Next.js: version from package.json`);
console.log(`- Environment: ${process.env.NODE_ENV}`);
console.log('- ESLint disabled: Yes');
console.log('- TypeScript checking disabled: Yes');
console.log('- Static export disabled: Yes');
console.log();

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Run the Next.js build with output: standalone mode
  console.log('Building Next.js application...');
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      // Force these environment variables during build
      NEXT_DISABLE_ESLINT: '1',
      SKIP_TYPE_CHECK: '1',
      NEXT_PRIVATE_STANDALONE: 'true',
      NEXT_PRIVATE_NO_EXPORT: 'true'
    }
  });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 