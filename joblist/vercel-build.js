#!/usr/bin/env node

// Simple build script for Vercel
const { spawnSync } = require('child_process');

console.log('Starting Vercel build process...');

// Generate Prisma client
console.log('Generating Prisma client...');
const prismaResult = spawnSync('npx', ['prisma', 'generate'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_DISABLE_ESLINT: '1',
    SKIP_TYPE_CHECK: '1'
  }
});

if (prismaResult.error || (prismaResult.status !== 0)) {
  console.error('Error generating Prisma client');
  process.exit(1);
}

// Build Next.js app
console.log('Building Next.js application...');
const nextResult = spawnSync('npx', ['next', 'build'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_DISABLE_ESLINT: '1',
    SKIP_TYPE_CHECK: '1'
  }
});

if (nextResult.error || (nextResult.status !== 0)) {
  console.error('Error building Next.js application');
  process.exit(1);
}

console.log('Build completed successfully!'); 