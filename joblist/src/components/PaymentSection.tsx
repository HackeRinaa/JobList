"use client";
// components/PaymentSection.tsx
import React from "react";
import Image from "next/image";

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
  handleSubmit: (e: React.FormEvent) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  formData,
  plans,
  prevStep,
  handleSubmit,
}) => {
  return (
    <div className="checkout">
      <h2 className="text-2xl font-semibold mb-6 text-gray-600">Ολοκλήρωση Εγγραφής</h2>
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

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-600">Στοιχεία Πληρωμής</h3>
        <div className="p-4 border rounded-lg bg-white border-[#FB7600] border-[2px]">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Αριθμός Κάρτας</label>
            <div className="flex border rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full px-4 py-2 focus:outline-none"
              />
              <div className="flex items-center px-3 bg-gray-50">
                <Image src="/visa-icon.png" alt="Visa" width={24} height={16} className="mr-2" />
                <Image src="/mastercard-icon.png" alt="Mastercard" width={24} height={16} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Ημερομηνία Λήξης</label>
              <input
                type="text"
                placeholder="MM / YY"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Όνομα στην Κάρτα</label>
            <input
              type="text"
              placeholder="JOHN SMITH"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <input type="checkbox" id="terms" className="mr-2" />
        <label htmlFor="terms" className="text-gray-700">
          Αποδέχομαι τους <a href="#" className="text-[#FB7600]">Όρους Χρήσης</a> και την <a href="#" className="text-[#FB7600]">Πολιτική Απορρήτου</a>
        </label>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className="border border-[#FB7600] text-[#FB7600] px-6 py-2 rounded-lg hover:bg-[#FB7600] hover:text-white transition-all"
        >
          Πίσω
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-[#E56A00] transition-all"
        >
          Ολοκλήρωση Εγγραφής
        </button>
      </div>
    </div>
  );
};

export default PaymentSection;