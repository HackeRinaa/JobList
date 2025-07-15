import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin client not available" },
        { status: 500 }
      );
    }

    // Check if there's already a Supabase auth user for this email
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return NextResponse.json(
        { error: "Failed to check existing user" },
        { status: 500 }
      );
    }

    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      // Update existing user's password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: password }
      );

      if (updateError) {
        console.error('Error updating user password:', updateError);
        return NextResponse.json(
          { error: `Failed to update password: ${updateError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Password updated successfully"
      });
    } else {
      // Create new user with the password
      const { error: signUpError } = await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'WORKER'
          }
        }
      });

      if (signUpError) {
        console.error('Error creating user:', signUpError);
        return NextResponse.json(
          { error: `Failed to create user: ${signUpError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "User created successfully"
      });
    }

  } catch (error) {
    console.error("Password setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 