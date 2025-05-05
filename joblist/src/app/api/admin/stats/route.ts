import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';

export async function GET(_request: NextRequest) {
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

    // Check if user is an admin
    if (dbUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required' },
        { status: 403 }
      );
    }

    // Get dashboard statistics
    const [
      totalUsers,
      totalCustomers,
      totalWorkers,
      totalJobs,
      pendingJobs,
      completedJobs,
      totalApplications,
      totalMessages,
      subscriptionRevenue
    ] = await Promise.all([
      // Count all users
      prisma.user.count(),
      
      // Count customers
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      
      // Count workers
      prisma.user.count({
        where: { role: 'WORKER' }
      }),
      
      // Count all jobs
      prisma.jobListing.count(),
      
      // Count pending jobs
      prisma.jobListing.count({
        where: { status: 'PENDING' }
      }),
      
      // Count completed jobs
      prisma.jobListing.count({
        where: { status: 'COMPLETED' }
      }),
      
      // Count all applications
      prisma.application.count(),
      
      // Count all messages
      prisma.message.count(),
      
      // Calculate subscription revenue
      prisma.subscription.aggregate({
        _sum: {
          // If you had a 'price' field in the subscription model, you'd sum it here
          // For now, let's just return a count of active subscriptions
          // _sum: { price: true }
        },
        where: { status: 'ACTIVE' }
      }).then(() => {
        // This is a placeholder for actual revenue calculation
        // In a real app, you'd calculate this based on subscription prices
        return prisma.subscription.count({
          where: { status: 'ACTIVE' }
        }).then(count => count * 9.99); // Assuming average subscription price of $9.99
      })
    ]);

    // Calculate job success rate (completed/total)
    const jobSuccessRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

    // Get recent subscription purchases (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentSubscriptions = await prisma.subscription.findMany({
      where: {
        createdAt: {
          gte: lastWeek
        }
      },
      select: {
        id: true,
        plan: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      summary: {
        users: {
          total: totalUsers,
          customers: totalCustomers,
          workers: totalWorkers
        },
        jobs: {
          total: totalJobs,
          pending: pendingJobs,
          completed: completedJobs,
          successRate: jobSuccessRate.toFixed(2) + '%'
        },
        activity: {
          applications: totalApplications,
          messages: totalMessages
        },
        revenue: {
          subscriptions: subscriptionRevenue.toFixed(2)
        }
      },
      recentActivity: {
        subscriptions: recentSubscriptions
      }
    });
    
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
} 