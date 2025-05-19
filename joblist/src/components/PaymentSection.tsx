"use client";
// components/PaymentSection.tsx
import React, { useState } from "react";
import StripeCheckout from "./StripeCheckout";

interface Plan {
  name: string;
  price: string;
  period: string;
  tokens: number;
  features: string[];
  recommended: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  expertise: string[];
  regions: string[];
  photo: File | null;
  selectedPlan: string | null;
}

interface PaymentSectionProps {
  formData: FormData;
  plans: Plan[];
  prevStep: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  formData,
  plans,
  prevStep,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const selectedPlan = plans.find((p) => p.name === formData.selectedPlan);
  
  const handleSuccess = () => {
    console.log("Payment successful");
    // Payment handling will be done through Stripe webhook
  };
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="checkout">
      <h2 className="text-2xl font-semibold mb-6 text-gray-600">Ολοκλήρωση Εγγραφής</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-gray-600">Σύνοψη Παραγγελίας</h3>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Πλάνο</span>
          <span className="font-semibold text-gray-600">{formData.selectedPlan}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Τιμή</span>
          <span className="font-medium text-[#FB7600]">
            {plans.find((p) => p.name === formData.selectedPlan)?.price}€ / {plans.find((p) => p.name === formData.selectedPlan)?.period}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tokens</span>
          <span className="font-medium text-[#FB7600]">{plans.find((p) => p.name === formData.selectedPlan)?.tokens} tokens</span>
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold border-t-[#FB7600] border-t-[2px]">
          <span className="text-gray-600">Σύνολο</span>
          <span className="text-[#FB7600] font-bold">{plans.find((p) => p.name === formData.selectedPlan)?.price}€</span>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <input 
          type="checkbox" 
          id="terms" 
          className="mr-2"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <label htmlFor="terms" className="text-gray-700">
          Αποδέχομαι τους <a href="#" className="text-[#FB7600]">Όρους Χρήσης</a> και την <a href="#" className="text-[#FB7600]">Πολιτική Απορρήτου</a>
        </label>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={prevStep}
          className="border border-[#FB7600] text-[#FB7600] px-6 py-2 rounded-lg hover:bg-[#FB7600] hover:text-white transition-all"
        >
          Πίσω
        </button>
        
        {termsAccepted ? (
          <StripeCheckout 
            planName={formData.selectedPlan}
            selectedPlan={selectedPlan}
            formData={formData}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        ) : (
          <button
            disabled
            className="bg-gray-300 text-white px-6 py-2 rounded-lg cursor-not-allowed"
          >
            Αποδεχτείτε τους όρους για να συνεχίσετε
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;