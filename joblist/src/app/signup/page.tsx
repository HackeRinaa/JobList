"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiBriefcase, FiPhone } from "react-icons/fi";
import Image from "next/image";
import FloatingNavbar from "@/components/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [userType, setUserType] = useState<"customer" | "worker">("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }
    
    if (!agreeTerms) {
      setError("Πρέπει να αποδεχτείτε τους όρους χρήσης.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // In a real app, you would call your registration API here
      // For demo purposes, we'll just simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect based on user type
      if (userType === "customer") {
        router.push("/customer/dashboard");
      } else {
        router.push("/worker/dashboard");
      }
    } catch {
      setError("Παρουσιάστηκε σφάλμα κατά την εγγραφή. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <FloatingNavbar />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <div className="relative w-32 h-32">
              <Image 
                src="/logo.png" 
                alt="JobList Logo" 
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Δημιουργία λογαριασμού
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ή{" "}
          <Link href="/login" className="font-medium text-[#FB7600] hover:text-orange-700">
            συνδεθείτε στον λογαριασμό σας
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Ονοματεπώνυμο
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FB7600] focus:border-[#FB7600] sm:text-sm"
                  placeholder="Όνομα Επώνυμο"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FB7600] focus:border-[#FB7600] sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Τηλέφωνο
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FB7600] focus:border-[#FB7600] sm:text-sm"
                  placeholder="6912345678"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FB7600] focus:border-[#FB7600] sm:text-sm"
                  minLength={8}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Τουλάχιστον 8 χαρακτήρες
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Επιβεβαίωση Κωδικού
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FB7600] focus:border-[#FB7600] sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 text-[#FB7600] focus:ring-[#FB7600] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Συμφωνώ με τους{" "}
                <Link href="/terms" className="text-[#FB7600] hover:text-orange-700">
                  όρους χρήσης
                </Link>{" "}
                και την{" "}
                <Link href="/privacy" className="text-[#FB7600] hover:text-orange-700">
                  πολιτική απορρήτου
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FB7600] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB7600]"
              >
                {isLoading ? "Εγγραφή..." : "Εγγραφή"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 