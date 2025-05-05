import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/customer/profile?userId=
export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch user profile from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user is a customer
    if (user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'User is not a customer' }, { status: 403 });
    }

    // Return the profile data
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer profile' },
      { status: 500 }
    );
  }
}

// PUT /api/customer/profile
export async function PUT(request: NextRequest) {
  try {
    const { id, name, email, profile } = await request.json();

    // Authenticate request using Supabase
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database to verify ownership
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify that the authenticated user is updating their own profile
    if (existingUser.authId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this profile' }, { status: 403 });
    }

    // Update user and profile
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        profile: {
          update: {
            phone: profile.phone,
            location: profile.location,
            city: profile.city,
            postalCode: profile.postalCode,
            bio: profile.bio,
            preferences: profile.preferences
          }
        }
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
} 