import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before every request
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For /worker route specifically, add a dynamic flag to query params
  if (pathname === '/worker') {
    const url = request.nextUrl.clone();
    url.searchParams.set('dynamic', 'true');
    
    // Use rewrite instead of redirect to maintain the URL but serve different content
    return NextResponse.rewrite(url);
  }
  
  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: ['/worker'],
}; 