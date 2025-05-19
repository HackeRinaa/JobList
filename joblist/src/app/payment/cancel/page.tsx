"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PaymentCancel() {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push('/worker'); // Go back to worker signup
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="rounded-full bg-yellow-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Η πληρωμή ακυρώθηκε</h2>
          <p className="text-gray-600 mb-6">
            Η συναλλαγή σας έχει ακυρωθεί και δεν έγινε καμία χρέωση.
            Μπορείτε να προσπαθήσετε ξανά ή να επιστρέψετε αργότερα.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleTryAgain}
              className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-[#E56A00] transition-all"
            >
              Προσπαθήστε ξανά
            </button>
            <button
              onClick={() => router.push('/')}
              className="border border-[#FB7600] text-[#FB7600] px-6 py-2 rounded-lg hover:bg-[#FB7600] hover:text-white transition-all"
            >
              Επιστροφή στην αρχική
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 