import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Η σελίδα δεν βρέθηκε</h2>
        <p className="text-gray-600 mb-8">Η σελίδα που ζητήσατε δεν υπάρχει ή έχει μετακινηθεί.</p>
        <Link href="/" className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Επιστροφή στην αρχική
        </Link>
      </div>
    </div>
  );
} 