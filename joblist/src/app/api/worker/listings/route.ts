import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';
import { JobStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database with role
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, role: true, tokens: true }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Check if user is a worker
    if (dbUser.role !== 'WORKER') {
      return NextResponse.json(
        { error: 'Access denied. Worker role required' },
        { status: 403 }
      );
    }

    // Get query params for filtering and pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');
    const location = url.searchParams.get('location');
    const showPremium = url.searchParams.get('premium') === 'true';
    
    // Build filter conditions
    const filter = {
      status: JobStatus.PENDING,
      ...(category ? { category } : {}),
      ...(location ? { location } : {}),
      ...(showPremium ? { premium: true } : {})
    };
    
    // Premium jobs require tokens
    if (showPremium && dbUser.tokens < 1) {
      return NextResponse.json(
        { error: 'Not enough tokens to view premium jobs' },
        { status: 403 }
      );
    }

    // Get job listings with pagination
    const skip = (page - 1) * limit;
    const [totalCount, listings] = await Promise.all([
      prisma.jobListing.count({ where: filter }),
      prisma.jobListing.findMany({
        where: filter,
        select: {
          id: true,
          title: true,
          category: true,
          location: true,
          budget: true,
          description: true,
          status: true,
          premium: true,
          tokenCost: true,
          createdAt: true,
          customer: {
            select: {
              id: true,
              name: true,
              profile: {
                select: {
                  rating: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job listings' },
      { status: 500 }
    );
  }
} 