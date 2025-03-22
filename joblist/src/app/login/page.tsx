"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiBriefcase } from "react-icons/fi";
import FloatingNavbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState<"customer" | "worker">("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In a real app, you would call your authentication API here
      // For demo purposes, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect based on user type
      if (userType === "customer") {
        router.push("/customer/profile");
      } else {
        router.push("/worker/profile");
      }
    } catch {
      setError("Λάθος email ή κωδικός πρόσβασης. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <FloatingNavbar />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-2 text-center text-3xl font-medium text-gray-900">
          Σύνδεση στο λογαριασμό σας
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ή{" "}
          <Link href={userType === "customer" ? "/customer" : "/worker"} className="font-medium text-[#FB7600] hover:text-orange-700">
            δημιουργήστε νέο λογαριασμό
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex border border-gray-300 rounded-md">
              <button
                type="button"
                className={`w-1/2 py-2 px-4 rounded-l-md flex justify-center items-center ${
                  userType === "customer"
                    ? "bg-[#FB7600] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setUserType("customer")}
              >
                <FiUser className="mr-2" />
                Πελάτης
              </button>
              <button
                type="button"
                className={`w-1/2 py-2 px-4 rounded-r-md flex justify-center items-center ${
                  userType === "worker"
                    ? "bg-[#FB7600] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setUserType("worker")}
              >
                <FiBriefcase className="mr-2" />
                Επαγγελματίας
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FB7600] focus:border-[#FB7600] sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Κωδικός
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FB7600] focus:border-[#FB7600] sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#FB7600] focus:ring-[#FB7600] border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                  Να με θυμάσαι
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#FB7600] hover:text-orange-700">
                  Ξεχάσατε τον κωδικό σας;
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FB7600] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB7600]"
              >
                {isLoading ? "Σύνδεση..." : "Σύνδεση"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 