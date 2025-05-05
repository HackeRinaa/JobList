"use client";
import React, { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  tokenBonus: number;
  mostPopular?: boolean;
}

export default function UpgradeSubscription() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState(0);
  
  const plans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Βασικό",
      price: "0€",
      description: "Δωρεάν πλάνο με βασικές λειτουργίες",
      features: [
        { text: "Αναζήτηση εργασιών", included: true },
        { text: "Βασικό προφίλ", included: true },
        { text: "Αίτηση για έως 5 εργασίες/μήνα", included: true },
        { text: "Προτεραιότητα στις αιτήσεις", included: false },
        { text: "Προβολή προφίλ σε προτεινόμενους επαγγελματίες", included: false },
        { text: "Αφαίρεση διαφημίσεων", included: false },
      ],
      tokenBonus: 0,
    },
    {
      id: "pro",
      name: "Επαγγελματικό",
      price: "14.99€/μήνα",
      description: "Για επαγγελματίες με αυξημένη δραστηριότητα",
      features: [
        { text: "Αναζήτηση εργασιών", included: true },
        { text: "Προχωρημένο προφίλ με χαρτοφυλάκιο", included: true },
        { text: "Απεριόριστες αιτήσεις για εργασίες", included: true },
        { text: "Προτεραιότητα στις αιτήσεις", included: true },
        { text: "Προβολή προφίλ σε προτεινόμενους επαγγελματίες", included: true },
        { text: "Αφαίρεση διαφημίσεων", included: false },
      ],
      tokenBonus: 10,
      mostPopular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "29.99€/μήνα",
      description: "Πλήρης πρόσβαση σε όλες τις λειτουργίες",
      features: [
        { text: "Αναζήτηση εργασιών", included: true },
        { text: "Premium προφίλ με χαρτοφυλάκιο", included: true },
        { text: "Απεριόριστες αιτήσεις για εργασίες", included: true },
        { text: "Υψηλή προτεραιότητα στις αιτήσεις", included: true },
        { text: "Κορυφαία θέση στους προτεινόμενους επαγγελματίες", included: true },
        { text: "Αφαίρεση διαφημίσεων", included: true },
      ],
      tokenBonus: 25,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setPaymentStep(1);
  };

  const handlePayment = () => {
    // In a real app, this would integrate with a payment processor
    setPaymentStep(2);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Αναβάθμιση Συνδρομής</h2>
      <p className="text-gray-600 mb-6">Επίλεξε το κατάλληλο πακέτο για την επιχείρησή σου</p>

      {paymentStep === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white p-6 rounded-lg shadow-md border relative ${
                plan.mostPopular ? "border-[#FB7600]" : "border-gray-200"
              }`}
            >
              {plan.mostPopular && (
                <div className="absolute top-0 right-0 bg-[#FB7600] text-white text-xs px-2 py-1 rounded-tl-none rounded-tr-lg rounded-bl-none rounded-br-none">
                  Δημοφιλές
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
              <p className="text-2xl font-bold mt-2 text-[#FB7600]">{plan.price}</p>
              <p className="text-gray-600 mt-1 mb-4">{plan.description}</p>
              
              {plan.tokenBonus > 0 && (
                <div className="bg-orange-100 text-[#FB7600] px-3 py-2 rounded-lg mb-4">
                  Bonus: +{plan.tokenBonus} tokens
                </div>
              )}
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <FiCheck className="text-green-500 mt-1 mr-2" />
                    ) : (
                      <FiX className="text-red-500 mt-1 mr-2" />
                    )}
                    <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-2 rounded-lg ${
                  plan.id === "basic"
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#FB7600] text-white hover:bg-orange-700"
                }`}
              >
                {plan.id === "basic" ? "Τρέχον Πλάνο" : "Επιλογή Πλάνου"}
              </button>
            </div>
          ))}
        </div>
      )}

      {paymentStep === 1 && selectedPlan && (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Στοιχεία Πληρωμής</h3>
            <p className="mb-4 text-gray-500">
              Επιλέξατε το πακέτο:{" "}
              <span className="font-semibold text-[#FB7600]">
                {plans.find(p => p.id === selectedPlan)?.name}
              </span>
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Ονοματεπώνυμο</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Αριθμός Κάρτας</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Ημερομηνία Λήξης</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
                    placeholder="XXX"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setPaymentStep(0)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Πίσω
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
              >
                Ολοκλήρωση Αγοράς
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentStep === 2 && (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-green-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Επιτυχής Αναβάθμιση!</h3>
            <p className="text-gray-600 mb-6">
              Η συνδρομή σας αναβαθμίστηκε επιτυχώς στο πακέτο{" "}
              <span className="font-semibold">
                {plans.find(p => p.id === selectedPlan)?.name}
              </span>
            </p>
            <button
              onClick={() => {
                setPaymentStep(0);
                setSelectedPlan(null);
              }}
              className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
            >
              Επιστροφή
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 