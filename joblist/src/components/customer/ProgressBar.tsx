import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = [
    "Select Category",
    "Job Details",
    "Address",
    "Schedule",
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index < currentStep ? "text-[#FB7600]" : "text-gray-400"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                index < currentStep
                  ? "bg-[#FB7600] text-white"
                  : index === currentStep - 1
                  ? "border-2 border-[#FB7600] bg-white text-[#FB7600]"
                  : "border-2 border-gray-300 bg-white"
              }`}
            >
              {index < currentStep - 1 ? "✓" : index + 1}
            </div>
            <span className="mt-2 text-xs font-medium">{step}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-4">
        <div className="absolute h-1 w-full bg-gray-200"></div>
        <div
          className="absolute h-1 bg-[#FB7600] transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
} 