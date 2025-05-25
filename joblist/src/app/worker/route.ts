import { NextRequest, NextResponse } from 'next/server';

// This forces dynamic rendering of the worker page
export async function GET(request: NextRequest) {
  // Get the URL from the request
  const url = new URL(request.url);
  
  // Extract the pathname
  const pathname = url.pathname;
  
  // If this is the worker page root, redirect to the page component
  if (pathname === '/worker') {
    // Server-side render the page
    return NextResponse.next();
  }
  
  // Handle other cases
  return new NextResponse(null, { status: 404 });
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0; 