// This is a server component that dynamically imports the client component
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Server-side fallback component
function WorkerPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Φόρτωση σελίδας εγγραφής...</h2>
        <p className="mt-2 text-gray-500">Παρακαλώ περιμένετε καθώς ετοιμάζουμε τη φόρμα εγγραφής.</p>
      </div>
    </div>
  );
}

// Use dynamic import with no SSR to avoid window reference errors
const WorkerSignupClient = dynamic(
  () => import('@/components/WorkerSignup'),
  { 
    ssr: false,
    loading: () => <WorkerPageFallback />
  }
);

// Next.js page config
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function WorkerPage() {
  return (
    <Suspense fallback={<WorkerPageFallback />}>
      <WorkerSignupClient />
    </Suspense>
  );
}