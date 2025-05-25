'use client';

import React, { Suspense } from 'react';

// Template component to wrap worker page and ensure proper loading
export default function WorkerTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              Φόρτωση σελίδας εγγραφής...
            </h2>
            <p className="mt-2 text-gray-500">
              Παρακαλώ περιμένετε καθώς ετοιμάζουμε τη φόρμα εγγραφής.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
} 