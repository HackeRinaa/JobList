import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { notifyNewMessage } from '@/lib/notifications';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET messages for a specific application
export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Get session to authenticate request
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const user = await prisma.user.findUnique({
      where: { authId: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get application to verify access permission
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check if user is authorized to view these messages (either worker or customer)
    if (application.workerId !== user.id && application.job.customerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to view these messages' }, { status: 403 });
    }

    // Get messages for this application
    const messages = await prisma.message.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST a new message
export async function POST(request: NextRequest) {
  try {
    const { applicationId, content } = await request.json();

    if (!applicationId || !content) {
      return NextResponse.json({ error: 'Application ID and message content are required' }, { status: 400 });
    }

    // Get session to authenticate request
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by Supabase auth ID
    const sender = await prisma.user.findUnique({
      where: { authId: session.user.id }
    });

    if (!sender) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get application to verify access permission and retrieve recipient
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true, worker: true }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check if user is authorized to send messages for this application
    if (application.workerId !== sender.id && application.job.customerId !== sender.id) {
      return NextResponse.json({ error: 'Unauthorized to send messages for this application' }, { status: 403 });
    }

    // Determine recipient ID (the other party in the conversation)
    let recipientId: string;
    if (sender.id === application.workerId) {
      // Sender is worker, recipient is customer
      recipientId = application.job.customerId;
    } else {
      // Sender is customer, recipient is worker
      recipientId = application.workerId;
    }

    // Create new message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: sender.id,
        applicationId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Send notification to recipient
    await notifyNewMessage(recipientId, applicationId, sender.name || 'A user');

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
} 