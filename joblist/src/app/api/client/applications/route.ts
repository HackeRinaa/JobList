import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';

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

    // Get query params
    const url = new URL(request.url);
    const jobId = url.searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Verify the job belongs to this client
    const job = await prisma.jobListing.findUnique({
      where: {
        id: jobId,
        customerId: dbUser.id
      },
      select: { id: true }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or access denied' },
        { status: 404 }
      );
    }

    // Get all applications for this job
    const applications = await prisma.application.findMany({
      where: {
        jobId
      },
      select: {
        id: true,
        status: true,
        message: true,
        estimatedPrice: true,
        createdAt: true,
        worker: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                profession: true,
                location: true,
                rating: true,
                completedJobs: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ applications });
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
} 