"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function PaymentSuccessContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [tempCode, setTempCode] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // If no session ID is present, redirect to home
    if (!sessionId) {
      setError("No session ID found. Payment might not have been completed.");
      setIsLoading(false);
      return;
    }

    const completeRegistration = async () => {
      try {
        // Check if we have stored worker registration data
        const storedData = localStorage.getItem('workerRegistration');
        const tempCustomerId = localStorage.getItem('stripeTemp_customerId');
        
        if (storedData && tempCustomerId) {
          const formData = JSON.parse(storedData);
          
          // Generate a temporary code for password creation - mix of numbers and letters
          const generatedTempCode = Math.random().toString(36).substring(2, 10) + 
                                  Math.random().toString(36).substring(2, 10);
          
          // Register the worker using the stored data
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              tempCode: generatedTempCode, // Store temporary code for password creation
              firstName: formData.firstName,
              lastName: formData.lastName,
              bio: formData.bio,
              expertise: formData.expertise,
              regions: formData.regions,
              phone: formData.phone,
              stripeCustomerId: tempCustomerId,
            }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to complete registration');
          }
          
          // Store email and temp code for password creation
          setEmail(formData.email);
          setTempCode(generatedTempCode);
          
          // Registration successful, clean up local storage
          localStorage.removeItem('workerRegistration');
          localStorage.removeItem('stripeTemp_customerId');
          
          setRegistrationComplete(true);
          setIsLoading(false);
        } else {
          // If no stored data, the user might be already registered
          // Just show success message
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error completing registration:', err);
        const errMessage = err instanceof Error ? err.message : 'An error occurred during registration';
        setError(errMessage);
        setIsLoading(false);
      }
    };

    // Wait a bit to simulate processing and then try to complete registration
    const timer = setTimeout(() => {
      completeRegistration();
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId, router]);

  const handleGoToProfile = () => {
    router.push('/worker/profile');
  };
  
  const handleCreatePassword = () => {
    if (email && tempCode) {
      router.push(`/set-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(tempCode)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Επεξεργασία πληρωμής...</h2>
            <p className="text-gray-500 mt-2">Παρακαλώ περιμένετε καθώς επιβεβαιώνουμε την πληρωμή σας.</p>
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
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Η πληρωμή ολοκληρώθηκε!</h2>
          
          {registrationComplete ? (
            <>
              <p className="text-gray-600 mb-6">
                Η εγγραφή σας ως Μάστορας ολοκληρώθηκε επιτυχώς. Τα tokens έχουν προστεθεί στο λογαριασμό σας.
                Τώρα χρειάζεται να δημιουργήσετε έναν κωδικό πρόσβασης για τον λογαριασμό σας.
              </p>
              <button
                onClick={handleCreatePassword}
                className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-[#E56A00] transition-all"
              >
                Δημιουργία Κωδικού
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Η πληρωμή σας ολοκληρώθηκε επιτυχώς. Τα tokens έχουν προστεθεί στο λογαριασμό σας.
              </p>
              <button
                onClick={handleGoToProfile}
                className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-[#E56A00] transition-all"
              >
                Προβολή Προφίλ
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 