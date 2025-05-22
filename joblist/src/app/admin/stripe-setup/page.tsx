"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface StripeConfig {
  [key: string]: string;
}

interface StripePlan {
  name: string;
  price: string;
  tokens: number;
  price_id: string;
}

interface PriceVerification {
  success: boolean;
  price_id: string;
  details: string;
}

interface StripeData {
  config: StripeConfig;
  plans: {
    [key: string]: StripePlan;
  };
  price_verification: {
    [key: string]: PriceVerification;
  };
}

export default function StripeSetupPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stripeData, setStripeData] = useState<StripeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkStripeConfig() {
      try {
        const response = await fetch('/api/stripe/test');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to check Stripe configuration');
        }
        
        setStripeData(data);
      } catch (err) {
        console.error('Error checking Stripe config:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkStripeConfig();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 sm:pt-32 flex-grow">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Stripe <span className="text-[#FB7600]">Setup Guide</span>
        </h1>
        
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600] mx-auto mb-4"></div>
            <p className="text-gray-500">Checking Stripe configuration...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Environment Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stripeData && Object.entries(stripeData.config).map(([key, value]: [string, string]) => (
                  <div key={key} className={`p-4 rounded-lg ${value === 'Configured' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="font-medium">{key.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className={value === 'Configured' ? 'text-green-700' : 'text-red-700'}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscription Plans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stripeData && Object.entries(stripeData.plans).map(([key, plan]: [string, StripePlan]) => (
                  <div key={key} className="p-4 rounded-lg border">
                    <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-1">{plan.price}€ / month</p>
                    <p className="text-gray-600 mb-3">{plan.tokens} tokens</p>
                    <div className="text-xs text-gray-500 truncate">
                      <span className="font-semibold">Price ID:</span> {plan.price_id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Price Verification</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stripeData && Object.entries(stripeData.price_verification).map(([key, data]: [string, PriceVerification]) => (
                  <div 
                    key={key} 
                    className={`p-4 rounded-lg ${data.success ? 'bg-green-100' : 'bg-red-100'}`}
                  >
                    <h3 className="font-bold text-lg mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                    <p className={`${data.success ? 'text-green-700' : 'text-red-700'} mb-2`}>
                      {data.success ? '✅ Valid' : '❌ Invalid'}
                    </p>
                    <div className="text-xs">
                      <p className="font-semibold">{data.price_id}</p>
                      <p>{data.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Setup Instructions</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">1. Create Products and Prices in Stripe</h3>
                  <p className="mb-2">Make sure you have created the following plans in Stripe:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Βασικό (Basic) - 29.99€/month - 50 tokens</li>
                    <li>Επαγγελματικό (Premium) - 59.99€/month - 120 tokens</li>
                    <li>Premium (Professional) - 99.99€/month - 250 tokens</li>
                  </ul>
                  <p>You can create them manually in the Stripe dashboard or run our helper script.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">2. Update Environment Variables</h3>
                  <p className="mb-2">Update your .env file with the correct price IDs:</p>
                  <pre className="bg-gray-800 text-white p-3 rounded-lg text-sm overflow-x-auto">
                    STRIPE_BASIC_PLAN_PRICE_ID=&quot;price_xxxx&quot;<br/>
                    STRIPE_PREMIUM_PLAN_PRICE_ID=&quot;price_yyyy&quot;<br/>
                    STRIPE_PROFESSIONAL_PLAN_PRICE_ID=&quot;price_zzzz&quot;
                  </pre>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">3. Set Up Webhook</h3>
                  <p className="mb-2">Configure a webhook in your Stripe dashboard to:</p>
                  <pre className="bg-gray-800 text-white p-3 rounded-lg text-sm overflow-x-auto">
                    {`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/stripe`}
                  </pre>
                  <p className="mt-2">Listen to the following events:</p>
                  <ul className="list-disc pl-5">
                    <li>checkout.session.completed</li>
                    <li>customer.subscription.deleted</li>
                    <li>invoice.payment_succeeded</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 