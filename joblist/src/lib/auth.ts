import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  email: string;
  role: string;
  exp: number;
}

/**
 * Check if a user is authenticated
 * @returns An object containing the session and user if authenticated, or null if not
 */
export async function checkAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return { session: null, user: null, error };
    }
    
    const { data: userData } = await supabase.auth.getUser();
    return { 
      session, 
      user: userData?.user || null,
      error: null
    };
  } catch (error) {
    console.error('Error checking auth:', error);
    return { session: null, user: null, error };
  }
}

/**
 * Sign in a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns An object containing the session and user if successful, or an error if not
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { session: null, user: null, error: error };
    }
    
    return { 
      session: data.session, 
      user: data.user,
      error: null
    };
  } catch (error) {
    console.error('Error signing in:', error);
    return { session: null, user: null, error: new Error('An unexpected error occurred') };
  }
}

/**
 * Sign up a new user
 * @param email User's email
 * @param password User's password
 * @param userData Additional user data to store in metadata
 * @returns An object containing the session and user if successful, or an error if not
 */
export async function signUp(email: string, password: string, userData: Record<string, unknown>) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) {
      return { session: null, user: null, error };
    }
    
    return { 
      session: data.session, 
      user: data.user,
      error: null
    };
  } catch (error) {
    console.error('Error signing up:', error);
    return { session: null, user: null, error };
  }
}

/**
 * Sign out the current user
 * @returns True if successful, false if not
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return !error;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

/**
 * Get the user's role from their metadata
 * @param user The user object from Supabase
 * @returns The user's role, or null if not found
 */
export function getUserRole(user: User | null) {
  return user?.user_metadata?.role || null;
}

/**
 * Redirect user to the appropriate page based on their role
 * @param user The user object from Supabase
 * @returns The path to redirect to
 */
export function getRedirectPath(user: User | null) {
  const role = getUserRole(user);
  
  if (role === 'CUSTOMER') {
    return '/customer/profile';
  } else if (role === 'WORKER') {
    return '/worker/profile';
  } else {
    return '/login';
  }
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export function generateToken(email: string, role: string): string {
  return jwt.sign(
    { email, role, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) },
    JWT_SECRET
  );
} 

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export async function refreshToken() {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }

    if (!session) {
      throw new Error('No session found');
    }

    // Store the new access token
    localStorage.setItem('token', session.access_token);
    
    return session.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Clear tokens and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw error;
  }
}

export async function getValidToken() {
  try {
    // Get current token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    
    if (error?.message?.includes('expired') || error?.message?.includes('invalid')) {
      // Token is expired or invalid, try to refresh
      return await refreshToken();
    }

    if (error || !user) {
      throw error || new Error('Invalid token');
    }

    return token;
  } catch (error) {
    console.error('Error getting valid token:', error);
    throw error;
  }
} 