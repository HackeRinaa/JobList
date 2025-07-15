"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Email verified successfully! You can now log in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to verify email");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
          <p className="text-center text-gray-600 mb-6">
            Εισάγετε το email σας για να το επιβεβαιώσετε και να μπορέσετε να συνδεθείτε
          </p>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-6 sm:py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleVerifyEmail} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>

              {message && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded">
                  {message}
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FB7600] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? "Επιβεβαίωση..." : "Επιβεβαίωση Email"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/login")}
                className="text-sm text-[#FB7600] hover:text-orange-700"
              >
                Επιστροφή στη Σύνδεση
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 