"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe - required for future client-side implementations
// Currently using server-side redirect to Stripe Checkout
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  [key: string]: string;
}

interface StripeCheckoutProps {
  planName: string;
  selectedPlan: string;
  formData: FormData;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Define plan mapping
const PLAN_MAPPING = {
  'Βασικό Πλάνο – "Πρόγραμμα Εκκίνησης"': 'BASIC',
  'Pro Πλάνο – "Επαγγελματίας"': 'PRO',
  'Elite Πλάνο – "Αρχιτεχνίτης"': 'ELITE'
} as const;

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  planName, 
  selectedPlan,
  formData,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
        console.log("Storing temp customer ID:", data.tempCustomerId);
        localStorage.setItem('stripeTemp_customerId', data.tempCustomerId);
        
        const registrationData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio || '',
          expertise: formData.expertise || [],
          regions: formData.regions || [],
          phone: formData.phone || '',
        };
        console.log("Storing registration data:", registrationData);
        
        // Store form data temporarily to use after successful payment
        localStorage.setItem('workerRegistration', JSON.stringify(registrationData));
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        if (onSuccess) onSuccess();
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Checkout error:', errorMessage);
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPlan) {
    return <div className="text-red-500">Please select a plan first</div>;
  }

  return (
    <div className="mt-4">
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full bg-[#FB7600] text-white py-2 px-4 rounded-lg hover:bg-[#e66a00] transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Παρακαλώ περιμένετε...' : 'Συνέχεια στην πληρωμή'}
      </button>
    </div>
  );
};

export default StripeCheckout; 