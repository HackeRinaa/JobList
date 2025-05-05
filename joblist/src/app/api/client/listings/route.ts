import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';
import { JobStatus } from '@prisma/client';

// Get client's job listings
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
      select: { id: true, role: true }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Check if user is a client
    if (dbUser.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Access denied. Customer role required' },
        { status: 403 }
      );
    }

    // Get query params for filtering and pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const statusParam = url.searchParams.get('status');
    
    // Build filter conditions
    const filter: { customerId: string; status?: JobStatus } = {
      customerId: dbUser.id,
    };
    
    // Only add status filter if it's a valid JobStatus
    if (statusParam && Object.values(JobStatus).includes(statusParam as JobStatus)) {
      filter.status = statusParam as JobStatus;
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
          createdAt: true,
          _count: {
            select: {
              applications: true
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

// Create a new job listing
export async function POST(request: NextRequest) {
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
      select: { id: true, role: true }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Check if user is a client
    if (dbUser.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Access denied. Customer role required' },
        { status: 403 }
      );
    }

    // Get job data from request
    const { title, category, location, description, budget, premium = false } = await request.json();
    
    // Validate required fields
    if (!title || !category || !location || !description || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create job listing
    const listing = await prisma.jobListing.create({
      data: {
        title,
        category,
        location,
        description,
        budget,
        premium,
        tokenCost: premium ? 2 : 1, // Premium jobs cost more tokens
        status: JobStatus.PENDING,
        customerId: dbUser.id
      }
    });

    return NextResponse.json({
      message: 'Job listing created successfully',
      listing: {
        id: listing.id,
        title: listing.title,
        status: listing.status,
        createdAt: listing.createdAt
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating job listing:', error);
    return NextResponse.json(
      { error: 'Failed to create job listing' },
      { status: 500 }
    );
  }
} 