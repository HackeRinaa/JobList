import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { UserRole, JobCategory } from "@prisma/client";
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

    // Generate a temporary password for Supabase auth (simpler format)
    const tempPassword = `Temp${Date.now()}${Math.random().toString(36).substring(2, 8)}`;

    // Create Supabase auth user first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: tempPassword,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'WORKER'
        }
      }
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return new NextResponse(
        JSON.stringify({ success: false, error: `Auth error: ${authError.message}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log("Created Supabase auth user:", authData.user?.id);

    // Start transaction for database user creation
    const { user } = await prisma.$transaction(async (tx) => {
      console.log("Starting user creation with data:", {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: UserRole.WORKER,
        stripeCustomerId: data.stripeCustomerId,
        authId: authData.user?.id,
      });

      // Create user in database
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          role: UserRole.WORKER,
          stripeCustomerId: data.stripeCustomerId,
          authId: authData.user?.id,
          tokens: 0
        },
      });
      console.log("Created new user:", newUser);

      // Convert string expertise to JobCategory enum values
      const expertiseCategories = (data.expertise || []).map(exp => {
        // Map string expertise to JobCategory enum values
        const expertiseMap: { [key: string]: JobCategory } = {
          'electrician': JobCategory.ELECTRICIAN,
          'plumber': JobCategory.PLUMBER,
          'painter': JobCategory.PAINTER,
          'carpenter': JobCategory.CARPENTER,
          'hvac_technician': JobCategory.HVAC_TECHNICIAN,
          'appliance_repair': JobCategory.APPLIANCE_REPAIR,
          'general_contractor': JobCategory.GENERAL_CONTRACTOR,
          'architect': JobCategory.ARCHITECT,
          'interior_designer': JobCategory.INTERIOR_DESIGNER,
          'landscaper': JobCategory.LANDSCAPER,
          'mason': JobCategory.MASON,
          'roofer': JobCategory.ROOFER,
          'flooring_specialist': JobCategory.FLOORING_SPECIALIST,
          'security_system_installer': JobCategory.SECURITY_SYSTEM_INSTALLER,
          'home_inspector': JobCategory.HOME_INSPECTOR,
          'cleaning_service': JobCategory.CLEANING_SERVICE,
          'pest_control': JobCategory.PEST_CONTROL,
          'pool_maintenance': JobCategory.POOL_MAINTENANCE,
          'solar_installer': JobCategory.SOLAR_INSTALLER,
          'smart_home_technician': JobCategory.SMART_HOME_TECHNICIAN
        };
        return expertiseMap[exp] || JobCategory.ELECTRICIAN; // Default fallback
      });

      // Create profile
      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          bio: data.bio || '',
          phone: data.phone || '',
          preferences: expertiseCategories,
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
        name: user.name,
        authId: user.authId,
        needsPasswordSetup: true
      },
      tempPassword // <-- include tempPassword in the response
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