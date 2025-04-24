"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategorySelection from "@/components/customer/CategorySelection";
import JobDetailsForm from "@/components/customer/JobDetailsForm";
import AddressForm from "@/components/customer/AddressForm";
import DateSelection from "@/components/customer/DateSelection";
import Stepper from "@/components/Stepper";
import FloatingNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { NextPage } from 'next';

interface FormData {
  category: string;
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

const CreateListingPage: NextPage = () => {
  const [step, setStep] = useState(1);
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

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const router = useRouter();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    router.push("/signup/customer/");
  };

  const steps = [
    { label: "Τύπος Εργασίας" },
    { label: "Λεπτομέρειες Εργασίας" },
    { label: "Λεπτομέρειες Διεύθυνσης" },
    { label: "Επιλογή Ημέρας και Ώρας" },
  ];

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
};

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

export default CreateListingPage; 