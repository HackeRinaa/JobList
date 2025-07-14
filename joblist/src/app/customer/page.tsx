"use client";
import React, { useState, useEffect, Suspense, useCallback, useMemo } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Initialize component only once
  useEffect(() => {
    if (isInitialized) return;
    
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
    
    setIsInitialized(true);
  }, [isInitialized, searchParams]);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);

  const handleSubmit = async (e?: React.FormEvent) => {
    // Prevent default form submission
    if (e) {
      e.preventDefault();
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log('Submitting job with data:', formData);
      
      const response = await fetch('/api/client/job-creation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isLoggedIn
        }),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (response.ok) {
        if (data.requiresAuth) {
          // Save job data to localStorage for after login/signup
          localStorage.setItem('pendingJobData', JSON.stringify(data.jobData));
          router.push("/signup/customer/");
        } else {
          // Job created successfully, redirect to dashboard
          router.push('/customer/profile?tab=active');
        }
      } else {
        console.error('Error creating job:', data.error);
        alert(`Error creating job: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      alert('Error submitting job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = useMemo(() => [
    { label: "Τύπος Εργασίας" },
    { label: "Λεπτομέρειες Εργασίας" },
    { label: "Λεπτομέρειες Διεύθυνσης" },
    { label: "Επιλογή Ημέρας και Ώρας" },
  ], []);

  const StepWrapper = useCallback(({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  ), []);

  // Memoize form components to prevent re-creation
  const categorySelectionComponent = useMemo(() => (
    <CategorySelection
      selectedCategory={formData.category}
      onSelect={(category) => updateFormData({ category })}
      onNext={nextStep}
    />
  ), [formData.category, updateFormData, nextStep]);

  const jobDetailsFormComponent = useMemo(() => (
    <JobDetailsForm
      formData={formData}
      updateFormData={updateFormData}
      onNext={nextStep}
      onBack={prevStep}
    />
  ), [formData, updateFormData, nextStep, prevStep]);

  const addressFormComponent = useMemo(() => (
    <AddressForm
      address={formData.address}
      updateAddress={(address) => updateFormData({ address })}
      onNext={nextStep}
      onBack={prevStep}
    />
  ), [formData.address, updateFormData, nextStep, prevStep]);

  const dateSelectionComponent = useMemo(() => (
    <DateSelection
      timing={formData.timing}
      updateTiming={(timing) => updateFormData({ timing })}
      onSubmit={handleSubmit}
      onBack={prevStep}
      isSubmitting={isSubmitting}
    />
  ), [formData.timing, updateFormData, handleSubmit, prevStep, isSubmitting]);

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
                {categorySelectionComponent}
              </StepWrapper>
            )}

            {step === 2 && (
              <StepWrapper key="step2">
                {jobDetailsFormComponent}
              </StepWrapper>
            )}

            {step === 3 && (
              <StepWrapper key="step3">
                {addressFormComponent}
              </StepWrapper>
            )}

            {step === 4 && (
              <StepWrapper key="step4">
                {dateSelectionComponent}
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