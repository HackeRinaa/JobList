import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { 
      email, 
      password,
      tempCode,
      firstName, 
      lastName, 
      bio, 
      expertise,
      regions,
      phone,
      stripeCustomerId
    } = await req.json();

    // Basic validation - either password or tempCode should be provided
    if (!email || (!password && !tempCode)) {
      return NextResponse.json(
        { error: 'Email and either password or tempCode are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Skip Supabase registration for now due to connection issues
    // We'll handle user creation in our database only
    
    try {
      // Create user in database directly
      const newUser = await prisma.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`,
          role: 'WORKER',
          stripeCustomerId,
        },
      });

      // Store the tempCode with raw SQL if provided
      if (tempCode) {
        await prisma.$executeRaw`UPDATE "User" SET "tempCode" = ${tempCode} WHERE id = ${newUser.id}`;
      }

      // Create profile for the user
      await prisma.profile.create({
        data: {
          userId: newUser.id,
          bio: bio || '',
          phone: phone || '',
          preferences: [...(regions || []), ...(expertise || [])],
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      });
    } catch (prismaError) {
      console.error('Prisma Error:', prismaError);
      throw prismaError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 