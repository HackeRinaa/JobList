"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomStepper from "@/components/Stepper";
import ChoosePlan from "@/components/ChoosePlan";
import PaymentSection from "@/components/PaymentSection";

// Dynamically import components that might use browser-only APIs
const PersonalDetails = dynamic(() => import("@/components/PersonalDetails"), { 
  ssr: false, // Disable server-side rendering
  loading: () => <div className="p-8 text-center">Loading personal details form...</div> 
});

interface ExpertiseField {
  id: string;
  name: string;
}

const expertiseFields: ExpertiseField[] = [
  // Βασικές Κατασκευαστικές Εργασίες
  { id: "electrician", name: "Ηλεκτρολόγοι" },
  { id: "plumber", name: "Υδραυλικοί" },
  { id: "painter", name: "Ελαιοχρωματιστές" },
  { id: "carpenter", name: "Μαραγκοί" },
  { id: "woodworker", name: "Ξυλουργοί" },
  { id: "gardener", name: "Κηπουροί" },
  { id: "pool", name: "Πισινάδες" },
  { id: "builder", name: "Χτίστες" },
  { id: "formworker", name: "Καλουπατζήδες" },
  
  // Επαγγελματίες Σχεδιασμού
  { id: "architect", name: "Αρχιτέκτονες" },
  { id: "engineer", name: "Μηχανικοί" },
  { id: "designer", name: "Σχεδιαστές εσωτερικών εξωτερικών χώρων" },
  
  // Ειδικές Εργασίες
  { id: "flooring", name: "Πατωματζήδες" },
  { id: "marble", name: "Μαρμαράδες" },
  { id: "tiler", name: "Πλακάδες" },
  { id: "polisher", name: "Λουστραδόροι" },
  { id: "ac", name: "Ψυκτικοί" },
  { id: "metalworker", name: "Σιδεράδες" },
  { id: "aluminum", name: "Αλουμινάδες" },
  { id: "glazier", name: "Τζαμάδες" },
  { id: "awning", name: "Τεντάδες" },
  { id: "plasterer", name: "Γυψαδόροι" },
  { id: "mover", name: "Μεταφορείς" },
  { id: "drywall", name: "Γυψοσανιδάδες" },
  { id: "industrial_floor", name: "Βιομηχανικά πατώματα" },
  { id: "demolition", name: "Κατεδαφίσεις" },
  { id: "stonework", name: "Πετράδες" },
  { id: "security", name: "Συστήματα ασφαλείας" },
  { id: "pest_control", name: "Απεντομώσεις" },
  { id: "elevator", name: "Τεχνικοί ανελκυστήρων" }
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
    name: "Βασικό Πλάνο – \"Πρόγραμμα Εκκίνησης\"",
    price: "30.00",
    period: "μήνα",
    tokens: 50,
    features: [
      "Πρόσβαση σε βασικές αγγελίες (μικρές επισκευές)",
      "10 δωρεάν τόκενς/μήνα (από εργασιάκια)",
      "Στοιχεία επικοινωνίας πελάτη μετά από προσφορά",
      "Υποστήριξη μέσω email",
    ],
    recommended: false,
    stripeProductId: "prod_Sg2Yu30Qtu5PKP",
  },
  {
    name: "Pro Πλάνο – \"Επαγγελματίας\"",
    price: "50.00",
    period: "μήνα",
    tokens: 80,
    features: [
      "Πρόσβαση σε premium αγγελίες (επείγουσες επισκευές)",
      "20 δωρεάν τόκενς/μήνα (από εργασιάκια)",
      "Άμεση επικοινωνία με πελάτες",
      "Προτεραιότητα στις αγγελίες",
      "Υποστήριξη τηλέφωνο + email",
    ],
    recommended: true,
    stripeProductId: "prod_Sg2Zvazz2oksnD",
  },
  {
    name: "Elite Πλάνο – \"Αρχιτεχνίτης\"",
    price: "80.00",
    period: "μήνα",
    tokens: 120,
    features: [
      "Απεριόριστες αγγελίες (υψηλής αξίας)",
      "50 δωρεάν τόκενς/μήνα",
      "Απευθείας διαπραγμάτευση με πελάτες",
      "Τοποθέτηση στην κορυφή αναζητήσεων",
      "Αποκλειστικός account manager + 24/7 υποστήριξη",
    ],
    recommended: false,
    stripeProductId: "prod_Sg2afptzMEEp3N",
  },
];

// Define form data type to match PersonalDetails component expectations
interface WorkerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  expertise: string[]; // This will store the IDs of selected expertise
  regions: string[];
  photo: File | null;
  selectedPlan: string | null;
}

// Create a client-side only component
export default function WorkerSignup() {
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WorkerFormData>({
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
  
  // Only render browser-specific code after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

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
      const name = e.target.name || "photo";
      setFormData({ ...formData, [name]: e.target.files[0] });
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

  const steps = [
    { label: "Προσωπικά Στοιχεία" },
    { label: "Επιλογή Πλάνου" },
    { label: "Ολοκλήρωση" },
  ];

  // Display loading state until client-side code is ready
  if (!isClient) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600] mx-auto"></div>
            <p className="mt-4 text-gray-600">Φόρτωση φόρμας εγγραφής...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              fileInputRef={fileInputRef}
              setFormData={setFormData}
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
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 