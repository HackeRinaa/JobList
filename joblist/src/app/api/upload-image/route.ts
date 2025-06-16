import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Here you would typically:
    // 1. Upload the image to a storage service (e.g., Supabase Storage, AWS S3)
    // 2. Get the URL of the uploaded image
    // For this example, we'll use a mock URL
    const imageUrl = `https://your-storage-service.com/images/${Date.now()}-${image.name}`;

    // Update the user's profile with the new image URL
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { profile: true, workerProfile: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the appropriate profile based on user role
    if (dbUser.role === 'WORKER' && dbUser.workerProfile) {
      await prisma.workerProfile.update({
        where: { id: dbUser.workerProfile.id },
        data: { imageUrl }
      });
    } else if (dbUser.profile) {
      await prisma.profile.update({
        where: { id: dbUser.profile.id },
        data: { imageUrl }
      });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error handling image upload:', error);
    return NextResponse.json(
      { error: 'Failed to process image upload' },
      { status: 500 }
    );
  }
} 