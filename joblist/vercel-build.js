#!/usr/bin/env node

// Simple build script for Vercel
const { execSync } = require('child_process');

console.log('Starting Vercel build process...');

// Generate Prisma client
console.log('Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

// Set environment variables to skip problematic pages during build
process.env.NEXT_PUBLIC_SKIP_PRERENDER_ROUTES = '/worker';
process.env.NEXT_SKIP_CHECKS = '1';

// Build Next.js application
console.log('Building Next.js application...');
execSync('next build', { stdio: 'inherit' });

console.log('Build completed successfully!'); 