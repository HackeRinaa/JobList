"use client";

// components/ChoosePlan.tsx
import React from "react";

interface Plan {
  name: string;
  price: string;
  period: string;
  tokens: number;
  features: string[];
  recommended: boolean;
}

interface ChoosePlanProps {
  plans: Plan[];
  selectedPlan: string | null;
  handlePlanSelect: (planName: string) => void;
  prevStep: () => void;
  nextStep: () => void;
}

const ChoosePlan: React.FC<ChoosePlanProps> = ({
  plans,
  selectedPlan,
  handlePlanSelect,
  prevStep,
  nextStep,
}) => {
  return (
    <div className="plan-selection">
      <h2 className="text-3xl font-semibold mb-6 text-gray-600">Επιλογή Πλάνου</h2>
      <p className="text-lg text-gray-600 mb-6">
        Επίλεξε το πλάνο που ταιριάζει καλύτερα στις ανάγκες σου.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`border border-[2px] rounded-lg p-6 cursor-pointer transition-all ${
              selectedPlan === plan.name
                ? "border-[#FB7600] shadow-lg border-[3px] scale-105"
                : "border-gray-200 hover:border-[#FB7600] hover:shadow"
            } ${plan.recommended ? "relative" : ""}`}
            onClick={() => handlePlanSelect(plan.name)}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-[#FB7600] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                Προτεινόμενο
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-600">{plan.name}</h3>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold text-[#FB7600]">{plan.price}€</span>
              <span className="text-gray-500 font-medium">/{plan.period}</span>
            </div>
            <div className="mb-4">
              <span className="inline-block bg-[#FB7600] bg-opacity-20 text-[#FB7600] px-3 py-1 rounded-full text-sm font-medium">
                {plan.tokens} tokens
              </span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-[#FB7600] mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className="border border-[#FB7600] text-[#FB7600] px-6 py-2 rounded-lg hover:bg-gray-50 transition-all"
        >
          Πίσω
        </button>
        <button
          onClick={nextStep}
          disabled={!selectedPlan}
          className={`bg-[#FB7600] text-white px-6 py-2 rounded-lg transition-all ${
            !selectedPlan ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"
          }`}
        >
          Επόμενο
        </button>
      </div>
    </div>
  );
};

export default ChoosePlan;
