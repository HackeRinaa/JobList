import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';
import { ApplicationStatus } from '@prisma/client';

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
    const statusParam = url.searchParams.get('status');
    
    // Build filter conditions
    const filter: { workerId: string; status?: ApplicationStatus } = {
      workerId: dbUser.id,
    };
    
    // Only add status filter if it's a valid ApplicationStatus
    if (statusParam && Object.values(ApplicationStatus).includes(statusParam as ApplicationStatus)) {
      filter.status = statusParam as ApplicationStatus;
    }

    // Get applications with pagination
    const skip = (page - 1) * limit;
    const [totalCount, applications] = await Promise.all([
      prisma.application.count({ where: filter }),
      prisma.application.findMany({
        where: filter,
        select: {
          id: true,
          status: true,
          message: true,
          estimatedPrice: true,
          createdAt: true,
          job: {
            select: {
              id: true,
              title: true,
              category: true,
              location: true,
              budget: true,
              status: true,
              customer: {
                select: {
                  id: true,
                  name: true
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
      applications,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
} 