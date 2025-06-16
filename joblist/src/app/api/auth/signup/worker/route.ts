import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { Prisma } from "@prisma/client";

const workerSchema = z.object({
  email: z.string().email(),
  tempCode: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional(),
  expertise: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  phone: z.string().optional(),
  stripeCustomerId: z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received registration data:", body);
    
    // Validate input
    const result = workerSchema.safeParse(body);
    if (!result.success) {
      console.log("Validation errors:", result.error.issues);
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid input", details: result.error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = result.data;
    console.log("Validated data:", data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        profile: true
      }
    });
    console.log("Existing user check:", existingUser);

    // If user exists but doesn't have a profile, delete the user and allow re-registration
    if (existingUser) {
      if (!existingUser.profile) {
        await prisma.user.delete({
          where: { id: existingUser.id }
        });
        console.log("Deleted existing user without profile");
      } else {
        return new NextResponse(
          JSON.stringify({ success: false, error: "User with this email already exists" }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Start transaction
    const { user } = await prisma.$transaction(async (tx) => {
      console.log("Starting user creation with data:", {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: UserRole.WORKER,
        tempCode: data.tempCode,
        stripeCustomerId: data.stripeCustomerId,
      });

      // Create user
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          role: UserRole.WORKER,
          tempCode: data.tempCode,
          stripeCustomerId: data.stripeCustomerId,
          isVerified: false,
          tokens: 0
        },
      });
      console.log("Created new user:", newUser);

      // Create profile
      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          bio: data.bio || '',
          phone: data.phone || '',
          preferences: [...(data.regions || []), ...(data.expertise || [])],
        },
      });
      console.log("Created profile:", newProfile);

      return { user: newUser, profile: newProfile };
    });

    const response = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
    console.log("Sending success response:", response);
    
    return new NextResponse(
      JSON.stringify(response),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Worker registration error:", error);
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma error message:", error.message);
      
      if (error.code === 'P2002') {
        return new NextResponse(
          JSON.stringify({ success: false, error: "A user with this email already exists" }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new NextResponse(
        JSON.stringify({ success: false, error: `Database error: ${error.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle all other errors
    const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
    return new NextResponse(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 