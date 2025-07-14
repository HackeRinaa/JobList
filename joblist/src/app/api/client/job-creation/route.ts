import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';
import { JobStatus, JobCategory } from '@prisma/client';

// Handle job creation and onboarding flow
export async function POST(request: NextRequest) {
  try {
    console.log('Job creation API called');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const {
      category,
      jobType,
      location,
      specialTools,
      jobDescription,
      address,
      timing,
      isLoggedIn
    } = body;

    // Validate required fields
    if (!category || !jobType || !jobDescription || !address) {
      console.log('Missing required fields:', { category, jobType, jobDescription, address });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If user is not logged in, return the job data to be saved after login/signup
    if (!isLoggedIn) {
      console.log('User not logged in, returning job data for later processing');
      return NextResponse.json({
        success: true,
        requiresAuth: true,
        jobData: {
          category,
          jobType,
          location,
          specialTools,
          jobDescription,
          address,
          timing
        }
      });
    }

    console.log('User is logged in, proceeding with job creation');

    // Try to authenticate user
    let user;
    try {
      user = await getUser();
      console.log('Authenticated user:', user?.email);
    } catch (authError) {
      console.log('Authentication failed:', authError);
      // If authentication fails, treat as unauthenticated
      return NextResponse.json({
        success: true,
        requiresAuth: true,
        jobData: {
          category,
          jobType,
          location,
          specialTools,
          jobDescription,
          address,
          timing
        }
      });
    }

    if (!user) {
      console.log('No authenticated user found');
      return NextResponse.json({
        success: true,
        requiresAuth: true,
        jobData: {
          category,
          jobType,
          location,
          specialTools,
          jobDescription,
          address,
          timing
        }
      });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, role: true }
    });

    if (!dbUser) {
      console.log('User not found in database:', user.email);
      return NextResponse.json({
        success: true,
        requiresAuth: true,
        jobData: {
          category,
          jobType,
          location,
          specialTools,
          jobDescription,
          address,
          timing
        }
      });
    }

    console.log('Database user found:', { id: dbUser.id, role: dbUser.role });

    // Check if user is a customer
    if (dbUser.role !== 'CUSTOMER') {
      console.log('User is not a customer:', dbUser.role);
      return NextResponse.json(
        { error: 'Access denied. Customer role required' },
        { status: 403 }
      );
    }

    // Create the job listing
    console.log('Creating job listing with data:', {
      title: jobType,
      category,
      location: `${address.city}, ${address.postalCode}`,
      description: jobDescription,
      customerId: dbUser.id
    });

    const listing = await prisma.jobListing.create({
      data: {
        title: jobType,
        category: category as JobCategory,
        location: `${address.city}, ${address.postalCode}`,
        description: jobDescription,
        budget: "Αναμένεται προσφορά",
        status: JobStatus.PENDING,
        customerId: dbUser.id,
        premium: false,
        tokenCost: 1
      }
    });

    console.log('Job listing created successfully:', listing.id);

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        title: listing.title,
        status: listing.status,
        createdAt: listing.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error in job creation flow:', error);
    return NextResponse.json(
      { error: 'Failed to process job creation' },
      { status: 500 }
    );
  }
} 