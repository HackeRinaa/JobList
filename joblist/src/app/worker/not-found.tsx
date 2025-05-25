'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerNotFound() {
  const router = useRouter();
  
  // Automatic redirect to client-side rendered version
  useEffect(() => {
    // Add a small delay to ensure we're on client side
    const timeout = setTimeout(() => {
      router.push('/worker?dynamic=true');
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Φόρτωση σελίδας εγγραφής...</h2>
        <p className="mt-2 text-gray-500">Παρακαλώ περιμένετε καθώς ετοιμάζουμε τη φόρμα εγγραφής.</p>
        <Link href="/" className="mt-6 inline-block px-6 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          Επιστροφή στην αρχική
        </Link>
      </div>
    </div>
  );
} 