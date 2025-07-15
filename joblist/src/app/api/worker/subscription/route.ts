import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Role Key');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// GET endpoint - fetch worker subscription
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

    // Get worker's subscription
    const workerProfile = await prisma.user.findUnique({
      where: { email: user.email },
      include: { 
        subscription: true,
        profile: true
      }
    });

    if (!workerProfile) {
      return NextResponse.json(
        { message: 'Worker profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subscription: workerProfile.subscription,
      tokens: workerProfile.tokens,
      profile: workerProfile.profile
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching subscription' },
      { status: 500 }
    );
  }
}

// POST endpoint - cancel subscription
export async function POST(req: NextRequest) {
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

    const { action } = await req.json();

    if (action === 'cancel') {
      // Cancel the subscription
      await prisma.subscription.updateMany({
        where: {
          userId: user.email
        },
        data: {
          status: 'CANCELLED',
          endDate: new Date()
        }
      });

      return NextResponse.json({
        message: 'Subscription cancelled successfully',
        success: true
      });
    }

    return NextResponse.json(
      { message: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { message: 'An error occurred while managing subscription' },
      { status: 500 }
    );
  }
} 