import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateJobCategories } from '@/utils/categories';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Role Key');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// GET endpoint - fetch worker profile
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

    // Get user data from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        profile: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
      },
      profile: dbUser.profile,
      rating: dbUser.profile?.rating || 0,
      reviewCount: 0, // TODO: Implement review count
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the profile' },
      { status: 500 }
    );
  }
}

// PUT endpoint - update worker profile
export async function PUT(req: NextRequest) {
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

    // Get request body
    const { name, bio, phone, preferences } = await req.json();

    // Validate and convert preferences to JobCategory[]
    const safePreferences = validateJobCategories(Array.isArray(preferences) ? preferences : []);

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        name,
        profile: {
          upsert: {
            create: {
              bio,
              phone,
              preferences: safePreferences
            },
            update: {
              bio,
              phone,
              preferences: safePreferences
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
      profile: updatedUser.profile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the profile' },
      { status: 500 }
    );
  }
} 