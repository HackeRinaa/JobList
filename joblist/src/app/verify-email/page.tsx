"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check for error parameters first
        const errorCode = searchParams?.get('error_code');
        const errorDesc = searchParams?.get('error_description');
        
        if (errorCode === 'otp_expired') {
          setError("Ο σύνδεσμος επιβεβαίωσης έχει λήξει. Παρακαλώ εισάγετε το email σας για να λάβετε νέο σύνδεσμο.");
          setLoading(false);
          return;
        }

        // Get the token and type from the URL
        const token = searchParams?.get('token_hash');
        const type = searchParams?.get('type');
        
        if (!token || type !== 'email') {
          if (errorDesc) {
            setError(decodeURIComponent(errorDesc).replace(/\+/g, ' '));
          } else {
            setError("Μη έγκυρος σύνδεσμος επιβεβαίωσης");
          }
          setLoading(false);
          return;
        }

        // Verify the email with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        });

        if (error) {
          throw error;
        }

        setMessage("✅ Email επιβεβαιώθηκε με επιτυχία! Μπορείτε τώρα να συνδεθείτε.");
        // Wait 2 seconds before redirecting
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        console.error('Verification error:', err);
        setError(err instanceof Error ? err.message : "Αποτυχία επιβεβαίωσης email");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) throw error;

      setMessage("✅ Νέος σύνδεσμος επιβεβαίωσης στάλθηκε στο email σας!");
      setEmail(""); // Clear the email input
    } catch (err) {
      console.error('Error resending verification:', err);
      setError(err instanceof Error ? err.message : "Αποτυχία αποστολής νέου συνδέσμου");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FloatingNavbar />
      <div className="flex-grow flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img src="/JobListing.png" alt="JobList Logo" className="mx-auto mb-4 w-20 h-20" />
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
            Επιβεβαίωση Email
          </h2>
          <div className="bg-white py-6 sm:py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {loading ? (
              <div className="text-center text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FB7600] mx-auto mb-4"></div>
                Επιβεβαίωση του email σας...
              </div>
            ) : (
              <>
                {message && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded mb-4">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {(error && error.includes("λήξει")) && (
                  <form onSubmit={handleResendVerification} className="mt-4">
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FB7600] focus:border-[#FB7600]"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={resending}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FB7600] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB7600] ${
                        resending ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {resending ? 'Αποστολή...' : 'Αποστολή νέου συνδέσμου'}
                    </button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={() => router.push("/login")}
                    className="text-sm text-[#FB7600] hover:text-orange-700"
                  >
                    Επιστροφή στη Σύνδεση
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 