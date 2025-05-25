"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe - required for future client-side implementations
// Currently using server-side redirect to Stripe Checkout
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

interface StripeCheckoutProps {
  planName: string | null;
  selectedPlan: Plan | undefined;
  formData: FormData;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Define plan mapping
const PLAN_MAPPING = {
  'Βασικό': 'BASIC',
  'Επαγγελματικό': 'PREMIUM',
  'Premium': 'PROFESSIONAL'
} as const;

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  planName, 
  selectedPlan,
  formData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // Map the plan name to the plan ID used in the API
      const planId = PLAN_MAPPING[planName as keyof typeof PLAN_MAPPING];

      if (!planId) {
        throw new Error('Invalid plan selected');
      }

      // Create checkout session
      const response = await fetch('/api/worker/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          planId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Store the tempCustomerId in localStorage if available
      if (data.tempCustomerId) {
        localStorage.setItem('stripeTemp_customerId', data.tempCustomerId);
        // Store form data temporarily to use after successful payment
        localStorage.setItem('workerRegistration', JSON.stringify({
          ...formData,
          stripeCustomerId: data.tempCustomerId
        }));
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        if (onSuccess) onSuccess();
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: unknown) {
      console.error('Error during checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPlan) {
    return <div className="text-red-500">Please select a plan first</div>;
  }

  return (
    <div className="w-full">
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full bg-[#FB7600] text-white px-6 py-3 rounded-lg hover:bg-[#E56A00] transition-all ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Επεξεργασία...' : 'Πληρωμή με Stripe'}
      </button>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Ασφαλής πληρωμή μέσω Stripe
      </p>
    </div>
  );
};

export default StripeCheckout; 