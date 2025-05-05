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

    // Get application ID from request
    const { applicationId } = await request.json();
    
    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get the application with job and verify client ownership
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: {
            id: true,
            customerId: true,
            status: true
          }
        }
      }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Verify client owns the job
    if (application.job.customerId !== dbUser.id) {
      return NextResponse.json(
        { error: 'Access denied. You are not the owner of this job' },
        { status: 403 }
      );
    }

    // Check if job is still pending
    if (application.job.status !== JobStatus.PENDING) {
      return NextResponse.json(
        { error: 'This job already has an assigned worker' },
        { status: 400 }
      );
    }

    // Check if application is still pending
    if (application.status !== ApplicationStatus.PENDING) {
      return NextResponse.json(
        { error: 'This application has already been processed' },
        { status: 400 }
      );
    }

    // Begin a transaction to update application and job
    await prisma.$transaction(async (prisma) => {
      // Update the application status to ACCEPTED
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.ACCEPTED }
      });
      
      // Update the job status to ASSIGNED and set the worker ID
      await prisma.jobListing.update({
        where: { id: application.job.id },
        data: {
          status: JobStatus.ASSIGNED,
          assignedWorkerId: application.workerId
        }
      });
      
      // Reject all other applications for this job
      await prisma.application.updateMany({
        where: {
          jobId: application.job.id,
          id: { not: applicationId },
          status: ApplicationStatus.PENDING
        },
        data: { status: ApplicationStatus.REJECTED }
      });
    });

    // TODO: Send notification to worker about accepted application (via Supabase Edge Function)

    return NextResponse.json({
      message: 'Application accepted successfully',
      applicationId
    });
    
  } catch (error) {
    console.error('Error accepting application:', error);
    return NextResponse.json(
      { error: 'Failed to accept application' },
      { status: 500 }
    );
  }
} 