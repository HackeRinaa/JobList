"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CreatePassword from '@/components/auth/CreatePassword';

export default function SetPasswordPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [tempCode, setTempCode] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get params from URL
    const emailParam = searchParams.get('email');
    const codeParam = searchParams.get('code');
    
    if (!emailParam || !codeParam) {
      setError("Λείπουν απαραίτητες πληροφορίες για την αλλαγή κωδικού.");
      setIsLoading(false);
      return;
    }
    
    setEmail(emailParam);
    setTempCode(codeParam);
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Φόρτωση...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Σφάλμα</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-[#E56A00] transition-all"
            >
              Επιστροφή στην αρχική
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow flex justify-center items-center">
        {email && tempCode ? (
          <CreatePassword email={email} tempCode={tempCode} />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <p className="text-gray-600">Σφάλμα φόρτωσης της φόρμας.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 