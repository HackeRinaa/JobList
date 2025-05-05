import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // Parse JSON safely with error handling
  let body;
  try {
    body = await request.json();
    console.log('Received signup request:', JSON.stringify(body));
  } catch (error) {
    console.error('Error parsing request JSON:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  const { 
    email, 
    name, 
    role,
    password, 
    phone,  
    location, 
    bio, 
    profession,
    preferences
  } = body;

  // Ensure preferences is an array even if it's null/undefined
  const safePreferences = Array.isArray(preferences) ? preferences : [];

  // Validate input
  if (!email || !role) {
    return NextResponse.json(
      { error: 'Email and role are required' },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // If the user already exists, update their profile
      try {
        console.log(`Updating existing user: ${email}`);
        
        // Use only the fields known to be in the schema
        const updatedUser = await prisma.user.update({
          where: { email },
          data: {
            name,
            role,
            // Store hashed password in a real app
            // For this demo, we're just storing a simple string in the meta field
            stripeCustomerId: password ? `password:${password}` : undefined, // Use stripeCustomerId to store password
            profile: {
              upsert: {
                create: {
                  bio,
                  profession,
                  location,
                  phone,
                  preferences: safePreferences
                },
                update: {
                  bio,
                  profession,
                  location,
                  phone,
                  preferences: safePreferences
                }
              }
            }
          },
          include: {
            profile: true
          }
        });

        console.log(`User updated: ${updatedUser.id}`);

        return NextResponse.json({ 
          message: 'User profile updated successfully',
          user: updatedUser,
          redirectToProfile: true
        }, { status: 200 });
      } catch (updateError) {
        console.error('Error updating user:', updateError instanceof Error ? updateError.message : String(updateError));
        return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
      }
    }

    // Create new user in database with Prisma
    try {
      console.log(`Creating new user: ${email}`);
      
      // Use only the fields known to be in the schema
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          role,
          // Store hashed password in a real app
          // For this demo, we're just storing a simple string in the meta field
          stripeCustomerId: password ? `password:${password}` : undefined, // Use stripeCustomerId to store password
          profile: {
            create: {
              bio,
              profession,
              location,
              phone,
              preferences: safePreferences
            }
          }
        },
        include: {
          profile: true
        }
      });

      console.log(`New user created: ${newUser.id}`);

      return NextResponse.json({ 
        message: 'User created successfully',
        user: newUser,
        redirectToProfile: true
      }, { status: 201 });
    } catch (createError) {
      console.error('Error creating user:', createError instanceof Error ? createError.message : String(createError));
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  } catch (error) {
    console.error('Signup error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 