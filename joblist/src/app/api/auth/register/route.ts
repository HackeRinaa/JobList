import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from "bcrypt";
import { z } from "zod";
import { UserRole } from "@prisma/client";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Start transaction
    const user = await prisma.$transaction(async (tx) => {
      // Hash password
      const hashedPassword = await hash(password, 10);

      // Create user
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          role: UserRole.CUSTOMER,
          ...(hashedPassword ? { authId: hashedPassword } : {}),
        },
      });

      return newUser;
    });

    // Return success response without sensitive information
    const userWithoutSensitiveInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    return NextResponse.json(
      { 
        message: "User registered successfully",
        user: userWithoutSensitiveInfo
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
} 