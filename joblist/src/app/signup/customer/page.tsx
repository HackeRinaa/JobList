"use client";
import { useState, useEffect } from 'react';
import {supabase} from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import FloatingNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

export default function CustomerSignup() {
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    notifications: {
      email: true,
      sms: true
    }
  });

  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasPendingJob, setHasPendingJob] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Check if there's pending job data
    const pendingJobData = localStorage.getItem('pendingJobData');
    if (pendingJobData) {
      setHasPendingJob(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      console.log('Starting signup process...');
      
      // 1. Create auth user in Supabase
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'CUSTOMER',
            name: formData.name,
            phone: formData.phone
          },
          emailRedirectTo: `${siteUrl}/login`
        }
      });
  
      if (authError) {
        console.error('Supabase auth error:', authError);
        throw authError;
      }

      console.log('Supabase auth successful:', authData);

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        // Email confirmation required
        setEmailSent(true);
        setError('Please check your email and click the confirmation link before signing in.');
        setLoading(false);
        return;
      }

      // 2. Create user in database
      const userResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          role: 'CUSTOMER',
          phone: formData.phone,
          location: formData.location,
          password: formData.password
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || 'Failed to create user profile');
      }

      console.log('User created in database successfully');

      // 3. Sign in the user to establish session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      console.log('User signed in successfully:', signInData);

      // 4. Store the session token
      if (signInData.session) {
        localStorage.setItem('token', signInData.session.access_token);
        console.log('Session token stored');
      }

      // 5. If there's pending job data, create the job listing
      const pendingJobData = localStorage.getItem('pendingJobData');
      if (pendingJobData) {
        try {
          console.log('Creating pending job...');
          const jobData = JSON.parse(pendingJobData);
          const jobResponse = await fetch('/api/client/job-creation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...jobData,
              isLoggedIn: true
            }),
          });

          if (jobResponse.ok) {
            console.log('Pending job created successfully');
            // Clear pending job data
            localStorage.removeItem('pendingJobData');
            setHasPendingJob(false);
          } else {
            console.error('Failed to create pending job');
          }
        } catch (jobError) {
          console.error('Error creating pending job:', jobError);
          // Don't fail the signup if job creation fails
        }
      }

      // 6. Redirect to customer profile
      console.log('Redirecting to customer profile...');
      router.push('/customer/profile?tab=active');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });
      
      if (error) {
        setError('Failed to resend confirmation email. Please try again.');
      } else {
        setError('Confirmation email sent! Please check your inbox.');
      }
    } catch {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <FloatingNavbar />
        <div className="flex-grow flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <img src="/JobListing.png" alt="JobList Logo" className="mx-auto mb-4 w-20 h-20 animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Ελέγξτε το Email σας
            </h2>
            <p className="text-gray-700 mb-2">
              Μόλις στείλαμε ένα email επιβεβαίωσης στο <span className="font-semibold">{formData.email}</span>.
            </p>
            <p className="text-gray-500 mb-2">
              Παρακαλώ κάντε κλικ στον σύνδεσμο στο inbox σας για να επιβεβαιώσετε τον λογαριασμό σας.
            </p>
            <p className="text-gray-400 text-xs mb-4">
              Δεν λάβατε το email; Ελέγξτε το spam ή junk folder.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-orange-700">
              <span className="font-semibold">Δεν μπορείτε να συνεχίσετε μέχρι να επιβεβαιώσετε το email σας.</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-6 sm:py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                {hasPendingJob && (
                  <p className="text-sm text-gray-500 mb-4">
                    Μετά την επιβεβαίωση του email σας, μπορείτε να ολοκληρώσετε την αίτηση εργασίας σας.
                  </p>
                )}
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FB7600] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {loading ? 'Αποστολή...' : 'Επαναποστολή Email Επιβεβαίωσης'}
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Μετάβαση στη Σύνδεση
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FloatingNavbar />
      <div className="flex-grow flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create your customer account
          </h2>
          {hasPendingJob && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Complete your registration to submit your job request
            </p>
          )}
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-6 sm:py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-[#FB7600] border-gray-300 rounded"
                    checked={formData.notifications.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: {...formData.notifications, email: e.target.checked}
                    })}
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                    Receive email notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="sms-notifications"
                    name="sms-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-[#FB7600] border-gray-300 rounded"
                    checked={formData.notifications.sms}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: {...formData.notifications, sms: e.target.checked}
                    })}
                  />
                  <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                    Receive SMS notifications
                  </label>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FB7600] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : (hasPendingJob ? 'Create account & submit job' : 'Create account')}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 