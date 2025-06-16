"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobCategory } from "@/types/prisma";
import CategorySelection from "@/components/customer/CategorySelection";
import JobDetailsForm from "@/components/customer/JobDetailsForm";
import AddressForm from "@/components/customer/AddressForm";
import DateSelection from "@/components/customer/DateSelection";
import Stepper from "@/components/Stepper";
import FloatingNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter, useSearchParams } from "next/navigation";

interface FormData {
  category: JobCategory | "";
  jobType: string;
  location: "home" | "business";
  specialTools: boolean;
  jobDescription: string;
  address: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
    additionalInfo: string;
  };
  timing: {
    asap: boolean;
    scheduledDate: string | null;
    scheduledTime: string | null;
  };
}

function CustomerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    category: "",
    jobType: "",
    location: "home",
    specialTools: false,
    jobDescription: "",
    address: {
      street: "",
      number: "",
      city: "",
      postalCode: "",
      additionalInfo: "",
    },
    timing: {
      asap: true,
      scheduledDate: null,
      scheduledTime: null,
    },
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // If there's a category in the URL, set it
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFormData(prev => ({
        ...prev,
        category: categoryParam as JobCategory
      }));
    }
  }, [searchParams]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    // If the user is logged in, redirect to the dashboard
    if (isLoggedIn) {
      // In a real app, this would also make an API call to save the listing
      // Mock saving the listing to localStorage for demo purposes
      const listings = JSON.parse(localStorage.getItem('activeListings') || '[]');
      const newListing = {
        id: `listing_${Date.now()}`,
        title: formData.jobType || `Εργασία ${formData.category}`,
        category: formData.category,
        location: `${formData.address.city}, ${formData.address.postalCode}`,
        description: formData.jobDescription,
        postedDate: new Date().toISOString().split('T')[0],
        budget: "Αναμένεται προσφορά",
        status: "pending",
        applications: [],
      };
      
      listings.push(newListing);
      localStorage.setItem('activeListings', JSON.stringify(listings));
      
      // Redirect to customer dashboard with active listings tab
      router.push('/customer/profile?tab=active');
    } else {
      // If not logged in, redirect to signup page
      router.push("/signup/customer/");
    }
  };

  const steps = [
    { label: "Τύπος Εργασίας" },
    { label: "Λεπτομέρειες Εργασίας" },
    { label: "Λεπτομέρειες Διεύθυνσης" },
    { label: "Επιλογή Ημέρας και Ώρας" },
  ];

  const StepWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FloatingNavbar />
      <div className="mt-16 sm:mt-20 container mx-auto max-w-3xl px-4 py-6 sm:py-12 flex-grow">
        <h1 className="mb-6 sm:mb-8 text-center text-2xl sm:text-3xl font-bold text-gray-800">
          Δημιουργία νέας Εργασίας
        </h1>

        <Stepper step={step} steps={steps} />

        <div className="mt-6 sm:mt-8 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepWrapper key="step1">
                <CategorySelection
                  selectedCategory={formData.category}
                  onSelect={(category) => updateFormData({ category })}
                  onNext={nextStep}
                />
              </StepWrapper>
            )}

            {step === 2 && (
              <StepWrapper key="step2">
                <JobDetailsForm
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              </StepWrapper>
            )}

            {step === 3 && (
              <StepWrapper key="step3">
                <AddressForm
                  address={formData.address}
                  updateAddress={(address) => updateFormData({ address })}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              </StepWrapper>
            )}

            {step === 4 && (
              <StepWrapper key="step4">
                <DateSelection
                  timing={formData.timing}
                  updateTiming={(timing) => updateFormData({ timing })}
                  onSubmit={handleSubmit}
                  onBack={prevStep}
                />
              </StepWrapper>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function CustomerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerForm />
    </Suspense>
  );
} 