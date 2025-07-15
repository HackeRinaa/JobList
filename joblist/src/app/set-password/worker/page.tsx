"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WorkerSetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      setError("Email parameter is required");
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Call the backend API to handle password setup
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set password');
      }

      setSuccess(true);
      
      // Redirect to worker dashboard after a short delay
      setTimeout(() => {
        router.push("/worker");
      }, 2000);

    } catch (error) {
      console.error("Password setup error:", error);
      setError(error instanceof Error ? error.message : "Failed to set password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Σφάλμα</h1>
              <p className="text-red-600">Email parameter is required</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          {success ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Επιτυχία!</h1>
              <p className="text-green-600 mb-4">Ο κωδικός πρόσβασης ενημερώθηκε επιτυχώς.</p>
              <p className="text-gray-600">Ανακατευθύνεστε στην πλατφόρμα...</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Ορισμός Κωδικού Πρόσβασης
              </h1>
              
              <p className="text-gray-600 mb-6 text-center">
                Καλώς ήρθατε! Παρακαλώ ορίστε τον κωδικό πρόσβασής σας για να ολοκληρώσετε την εγγραφή.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Κωδικός Πρόσβασης</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-gray-800 w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                    placeholder="Εισάγετε τον κωδικό πρόσβασης"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Επιβεβαίωση Κωδικού</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-gray-800 w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                    placeholder="Επαναλάβετε τον κωδικό πρόσβασης"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#FB7600] text-white py-3 px-4 rounded-lg hover:bg-[#e66a00] transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Ενημέρωση...' : 'Ορισμός Κωδικού'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 6 χαρακτήρες
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 