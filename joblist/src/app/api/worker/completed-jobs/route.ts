import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Role Key');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// GET endpoint - fetch completed jobs for workers
export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract the Supabase access token
    const accessToken = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get worker's profile
    const workerProfile = await prisma.user.findUnique({
      where: { email: user.email },
      include: { profile: true }
    });

    if (!workerProfile) {
      return NextResponse.json(
        { message: 'Worker profile not found' },
        { status: 404 }
      );
    }

    // Get completed jobs assigned to this worker
    const completedJobs = await prisma.jobListing.findMany({
      where: {
        assignedWorkerId: workerProfile.id,
        status: 'COMPLETED'
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Get reviews for these jobs
    const reviews = await prisma.review.findMany({
      where: {
        reviewedId: workerProfile.id,
        jobId: {
          in: completedJobs.map(job => job.id)
        }
      },
      include: {
        reviewer: {
          select: {
            name: true
          }
        }
      }
    });

    // Transform the data for frontend
    const transformedJobs = completedJobs.map(job => {
      const review = reviews.find(r => r.jobId === job.id);
      return {
        id: job.id,
        title: job.title,
        category: job.category,
        location: job.location,
        completedDate: job.updatedAt.toISOString().split('T')[0],
        earnings: job.budget, // Assuming budget is the earnings
        customerName: job.customer.name,
        customerRating: review?.rating || 0,
        customerReview: review?.comment || undefined
      };
    });

    return NextResponse.json({
      completedJobs: transformedJobs
    });

  } catch (error) {
    console.error('Error fetching completed jobs:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching completed jobs' },
      { status: 500 }
    );
  }
} 