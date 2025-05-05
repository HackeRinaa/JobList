import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';
import { ApplicationStatus, JobStatus } from '@prisma/client';

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

    // Get application data from request
    const { jobId, message, estimatedPrice } = await request.json();
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if job exists and is still pending
    const job = await prisma.jobListing.findUnique({
      where: { id: jobId },
      select: { 
        id: true, 
        status: true, 
        premium: true, 
        tokenCost: true 
      }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== JobStatus.PENDING) {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Check if worker has already applied to this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        workerId: dbUser.id
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Check if premium job and deduct tokens if needed
    if (job.premium) {
      if (dbUser.tokens < job.tokenCost) {
        return NextResponse.json(
          { error: 'Not enough tokens to apply for this premium job' },
          { status: 403 }
        );
      }

      // Deduct tokens
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { tokens: { decrement: job.tokenCost } }
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        workerId: dbUser.id,
        message,
        estimatedPrice,
        status: ApplicationStatus.PENDING
      }
    });

    // TODO: Send notification to client (via Supabase Edge Function)

    return NextResponse.json({
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        status: application.status,
        createdAt: application.createdAt
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 