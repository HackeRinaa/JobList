// pages/WorkerSignup.tsx
"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import CustomStepper from "@/components/Stepper";
import PersonalDetails from "@/components/PersonalDetails";
import ChoosePlan from "@/components/ChoosePlan";
import PaymentSection from "@/components/PaymentSection";

const expertiseFields = [
  "Υδραυλικός",
  "Ηλεκτρολόγος",
  "Ελαιοχρωματιστής",
  "Ξυλουργός",
  "Κηπουρός",
  "Καθαριστής",
  "Μετακομίσεις",
  "Κλιματισμός",
  "Πλακάς",
  "Αλουμινάς",
  "Σιδεράς",
  "Τζαμάς",
];

const regions = [
  {
    name: "Αθήνα",
    subRegions: ["Κέντρο", "Νότια Προάστια", "Βόρεια Προάστια", "Πειραιάς", "Δυτικά Προάστια"],
  },
  {
    name: "Θεσσαλονίκη",
    subRegions: ["Κέντρο", "Νέα Παραλία", "Καλαμαριά", "Ευόσμος", "Σταυρούπολη"],
  },
  {
    name: "Πάτρα",
    subRegions: ["Κέντρο", "Πανεπιστημιούπολη", "Αγία Σοφία", "Μποζαΐτικα"],
  },
  // Add more regions with sub-regions as needed
];

const plans = [
  {
    name: "Βασικό",
    price: "29.99",
    period: "μήνα",
    credits: 50,
    features: [
      "50 credits για ξεκλείδωμα αγγελιών",
      "Βασικό προφίλ",
      "Email υποστήριξη",
    ],
    recommended: false,
  },
  {
    name: "Επαγγελματικό",
    price: "59.99",
    period: "μήνα",
    credits: 120,
    features: [
      "120 credits για ξεκλείδωμα αγγελιών",
      "Προτεραιότητα στις αναζητήσεις",
      "Προφίλ με badge επαλήθευσης",
      "Τηλεφωνική υποστήριξη",
    ],
    recommended: true,
  },
  {
    name: "Premium",
    price: "99.99",
    period: "μήνα",
    credits: 250,
    features: [
      "250 credits για ξεκλείδωμα αγγελιών",
      "Κορυφαία θέση στις αναζητήσεις",
      "Προφίλ με badge premium",
      "Προτεραιότητα στην υποστήριξη 24/7",
      "Στατιστικά προβολών προφίλ",
    ],
    recommended: false,
  },
];

export default function WorkerSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    expertise: string[];
    regions: string[];
    photo: File | null;
    selectedPlan: string | null;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    expertise: [],
    regions: [],
    photo: null,
    selectedPlan: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (item: string, category: "expertise" | "regions") => {
    setFormData((prev) => {
      const currentItems = [...prev[category]];
      if (currentItems.includes(item)) {
        return { ...prev, [category]: currentItems.filter((i) => i !== item) };
      } else {
        return { ...prev, [category]: [...currentItems, item] };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handlePlanSelect = (planName: string) => {
    setFormData({ ...formData, selectedPlan: planName });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    router.push("/worker/dashboard");
  };

  const steps = [
    { label: "Προσωπικά Στοιχεία" },
    { label: "Επιλογή Πλάνου" },
    { label: "Ολοκλήρωση" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Εγγραφή ως <span className="text-[#FB7600]">Μάστορας</span>
        </h1>

        <CustomStepper step={step} steps={steps} />

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 max-w-3xl mx-auto">
          {step === 1 && (
            <PersonalDetails
              formData={formData}
              handleInputChange={handleInputChange}
              handleMultiSelect={handleMultiSelect}
              handleFileChange={handleFileChange}
              nextStep={nextStep}
              expertiseFields={expertiseFields}
              regions={regions}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            />
          )}

          {step === 2 && (
            <ChoosePlan
              plans={plans}
              selectedPlan={formData.selectedPlan}
              handlePlanSelect={handlePlanSelect}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {step === 3 && (
            <PaymentSection
              formData={formData}
              plans={plans}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}