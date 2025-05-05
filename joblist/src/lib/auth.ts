import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

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