"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FloatingNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Attempting login with Supabase...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          setError('Παρακαλώ επιβεβαιώστε το email σας πριν συνδεθείτε. Ελέγξτε το inbox σας.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Λάθος email ή κωδικός. Παρακαλώ δοκιμάστε ξανά.');
        } else {
          setError(`Σφάλμα σύνδεσης: ${error.message}`);
        }
        return;
      }

      console.log('Login successful:', data);

      if (data.user) {
        // Store the session token
        localStorage.setItem('token', data.session?.access_token || '');
        localStorage.setItem('userEmail', email);

        // Get user role from metadata or database
        const userRole = data.user.user_metadata?.role || 'CUSTOMER';
        
        console.log('User role:', userRole);

        // Redirect to the appropriate dashboard based on user role
        if (userRole === 'WORKER') {
          router.replace('/worker/profile');
        } else {
          router.replace('/customer/profile');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Προέκυψε σφάλμα κατά τη σύνδεση. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FloatingNavbar />
      <div className="container mx-auto pt-20 sm:pt-24 px-4 pb-10">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 mt-12 mb-7">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Σύνδεση</h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-gray-800 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Κωδικός
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-gray-800 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#FB7600] hover:bg-orange-700'
              }`}
            >
              {isLoading ? 'Σύνδεση...' : 'Σύνδεση'}
            </button>
          </form>

          <div className="mt-4 text-center flex justify-center flex-col gap-2">
            <p className="text-gray-600">
              Δεν έχετε λογαριασμό;{' '}
            </p>
            <div className="flex justify-center gap-2">
              <a href="/worker" className="text-[#FB7600] hover:underline">
                  Εγγραφείτε ως Εργάτης
                </a>
                <a href="/customer" className="text-[#FB7600] hover:underline">
                  Εγγραφείτε ως Ιδιώτης
                </a>
              </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 