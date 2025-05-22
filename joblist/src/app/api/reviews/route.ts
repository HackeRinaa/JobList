import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';
import { JobStatus } from '@prisma/client';

// Get reviews for a user
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

    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get reviews for this user (as the reviewed party)
    const reviews = await prisma.review.findMany({
      where: {
        reviewedId: userId
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        reviewer: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      reviews,
      meta: {
        count: reviews.length,
        averageRating: averageRating.toFixed(1)
      }
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Create a new review
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

    // Get review data from request
    const { jobId, rating, comment } = await request.json();
    
    if (!jobId || !rating) {
      return NextResponse.json(
        { error: 'Job ID and rating are required' },
        { status: 400 }
      );
    }

    // Check if the rating is valid (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get the job to verify ownership and completion status
    const job = await prisma.jobListing.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        status: true,
        customerId: true,
        assignedWorkerId: true
      }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if the job is completed
    if (job.status !== JobStatus.COMPLETED) {
      return NextResponse.json(
        { error: 'Cannot review a job that is not completed' },
        { status: 400 }
      );
    }

    // Check if the user is involved in this job
    const isClient = job.customerId === dbUser.id;
    const isWorker = job.assignedWorkerId === dbUser.id;

    if (!isClient && !isWorker) {
      return NextResponse.json(
        { error: 'Access denied. You are not involved in this job' },
        { status: 403 }
      );
    }

    // Determine who is being reviewed
    const reviewerId = dbUser.id;
    const reviewedId = isClient ? job.assignedWorkerId : job.customerId;

    // Check if this user has already left a review for this job
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId,
        jobId
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this job' },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        reviewerId,
        reviewedId,
        jobId
      }
    });

    // Update the user's profile rating
    const userReviews = await prisma.review.findMany({
      where: {
        reviewedId
      },
      select: {
        rating: true
      }
    });

    // Calculate new average rating
    const newRating = userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length;

    // Update the user's profile
    await prisma.profile.update({
      where: { userId: reviewedId },
      data: {
        rating: newRating
      }
    });

    // If it's the client marking job completion, update the worker's completed jobs count
    if (isClient) {
      await prisma.profile.update({
        where: { userId: job.assignedWorkerId },
        data: {
          completedJobs: { increment: 1 }
        }
      });
    }

    return NextResponse.json({
      message: 'Review submitted successfully',
      review: {
        id: review.id,
        rating: review.rating,
        createdAt: review.createdAt
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
} 