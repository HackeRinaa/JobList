import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define a PortfolioItem interface
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
}

// Helper function to extract portfolio items from preferences
function extractPortfolioItems(preferences: string[]): PortfolioItem[] {
  return preferences
    .filter(item => item.startsWith('portfolio:'))
    .map(item => {
      try {
        const jsonStr = item.replace('portfolio:', '');
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error('Error parsing portfolio item:', e);
        return null;
      }
    })
    .filter(Boolean) as PortfolioItem[];
}

// GET worker's portfolio items
export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters or use authenticated user
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Public route - get portfolio for a specific worker
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (user.role !== 'WORKER') {
        return NextResponse.json({ error: 'User is not a worker' }, { status: 403 });
      }

      // Extract portfolio items from preferences array
      const portfolioItems = user.profile?.preferences 
        ? extractPortfolioItems(user.profile.preferences) 
        : [];

      return NextResponse.json({ portfolioItems });
    } else {
      // Private route - get current user's portfolio
      // Get session to authenticate request
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Find user by Supabase auth ID
      const user = await prisma.user.findUnique({
        where: { authId: session.user.id },
        include: { profile: true }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (user.role !== 'WORKER') {
        return NextResponse.json({ error: 'User is not a worker' }, { status: 403 });
      }

      // Extract portfolio items from preferences array
      const portfolioItems = user.profile?.preferences 
        ? extractPortfolioItems(user.profile.preferences) 
        : [];

      return NextResponse.json({ portfolioItems });
    }
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 });
  }
}

// POST - Add a new portfolio item
export async function POST(request: NextRequest) {
  try {
    const { title, description, imageUrl } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Get session to authenticate request
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findUnique({
      where: { authId: session.user.id },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'WORKER') {
      return NextResponse.json({ error: 'User is not a worker' }, { status: 403 });
    }

    if (!user.profile) {
      return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 });
    }

    // Create a new portfolio item
    const portfolioItem: PortfolioItem = {
      id: `portfolio_${Date.now()}`,
      title,
      description: description || '',
      imageUrl: imageUrl || '',
      createdAt: new Date().toISOString()
    };

    // Add the portfolio item to the user's preferences
    const portfolioItemStr = `portfolio:${JSON.stringify(portfolioItem)}`;
    const updatedPreferences = [...(user.profile.preferences || []), portfolioItemStr];

    // Update the user's profile
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: { preferences: updatedPreferences }
    });

    return NextResponse.json(portfolioItem);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 });
  }
}

// DELETE - Remove a portfolio item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json({ error: 'Portfolio item ID is required' }, { status: 400 });
    }

    // Get session to authenticate request
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findUnique({
      where: { authId: session.user.id },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.profile) {
      return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 });
    }

    // Filter out the portfolio item to delete
    const updatedPreferences = (user.profile.preferences || []).filter(item => {
      if (!item.startsWith('portfolio:')) return true;
      
      try {
        const portfolioItem = JSON.parse(item.replace('portfolio:', ''));
        return portfolioItem.id !== itemId;
      } catch {
        // If parsing fails, keep the original item
        return true;
      }
    });

    if (updatedPreferences.length === user.profile.preferences.length) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    // Update the user's profile
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: { preferences: updatedPreferences }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 });
  }
}

// PATCH - Update a portfolio item
export async function PATCH(request: NextRequest) {
  try {
    const { id, title, description, imageUrl } = await request.json();

    if (!id || !title) {
      return NextResponse.json({ error: 'Portfolio item ID and title are required' }, { status: 400 });
    }

    // Get session to authenticate request
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findUnique({
      where: { authId: session.user.id },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.profile) {
      return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 });
    }

    // Find and update the portfolio item
    let updatedItem: PortfolioItem | null = null;
    const updatedPreferences = (user.profile.preferences || []).map(item => {
      if (!item.startsWith('portfolio:')) return item;
      
      try {
        const portfolioItem = JSON.parse(item.replace('portfolio:', ''));
        if (portfolioItem.id === id) {
          // Update the portfolio item
          updatedItem = {
            ...portfolioItem,
            title,
            description: description || portfolioItem.description,
            imageUrl: imageUrl || portfolioItem.imageUrl,
            updatedAt: new Date().toISOString()
          };
          return `portfolio:${JSON.stringify(updatedItem)}`;
        }
      } catch {
        // If parsing fails, keep the original item
      }
      return item;
    });

    if (!updatedItem) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    // Update the user's profile
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: { preferences: updatedPreferences }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 });
  }
} 