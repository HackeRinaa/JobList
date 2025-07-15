"use client";
import React, { useState, useEffect } from "react";
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
  const [subscription, setSubscription] = useState<{
    id?: string;
    status?: string;
    plan?: string;
    endDate?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch('/api/worker/subscription', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subscription');
        }

        const data = await response.json();
        setSubscription(data.subscription);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);
  
  const plans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Βασικό Πλάνο – \"Πρόγραμμα Εκκίνησης\"",
      price: "30.00€/μήνα",
      description: "Φθηνότερη είσοδος + περισσότερα τόκενς",
      features: [
        { text: "Πρόσβαση σε βασικές αγγελίες (μικρές επισκευές)", included: true },
        { text: "10 δωρεάν τόκενς/μήνα (από εργασιάκια)", included: true },
        { text: "Στοιχεία επικοινωνίας πελάτη μετά από προσφορά", included: true },
        { text: "Υποστήριξη μέσω email", included: true },
        { text: "Προτεραιότητα στις αγγελίες", included: false },
        { text: "Αποκλειστικός account manager", included: false },
      ],
      tokenBonus: 50,
    },
    {
      id: "pro",
      name: "Pro Πλάνο – \"Επαγγελματίας\"",
      price: "50.00€/μήνα",
      description: "33% περισσότερα τόκενς με λιγότερα χρήματα",
      features: [
        { text: "Πρόσβαση σε premium αγγελίες (επείγουσες επισκευές)", included: true },
        { text: "20 δωρεάν τόκενς/μήνα (από εργασιάκια)", included: true },
        { text: "Άμεση επικοινωνία με πελάτες", included: true },
        { text: "Προτεραιότητα στις αγγελίες", included: true },
        { text: "Υποστήριξη τηλέφωνο + email", included: true },
        { text: "Αποκλειστικός account manager", included: false },
      ],
      tokenBonus: 80,
      mostPopular: true,
    },
    {
      id: "elite",
      name: "Elite Πλάνο – \"Αρχιτεχνίτης\"",
      price: "80.00€/μήνα",
      description: "20€ φθηνότερο + δωρεάν featured αγγελία (αξίας 15€)",
      features: [
        { text: "Απεριόριστες αγγελίες (υψηλής αξίας)", included: true },
        { text: "50 δωρεάν τόκενς/μήνα", included: true },
        { text: "Απευθείας διαπραγμάτευση με πελάτες", included: true },
        { text: "Τοποθέτηση στην κορυφή αναζητήσεων", included: true },
        { text: "Αποκλειστικός account manager + 24/7 υποστήριξη", included: true },
      ],
      tokenBonus: 120,
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

  const handleCancelSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/worker/subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'cancel' })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const data = await response.json();
      if (data.success) {
        setSubscription({ ...subscription, status: 'CANCELLED' });
        alert('Subscription cancelled successfully');
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600] mx-auto mb-4"></div>
        <p className="text-gray-500">Φόρτωση δεδομένων συνδρομής...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#FB7600] text-white px-4 py-2 rounded-lg hover:bg-[#e66a00] transition-colors"
        >
          Δοκιμάστε ξανά
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Αναβάθμιση Συνδρομής</h2>
      <p className="text-gray-600 mb-6">Επίλεξε το κατάλληλο πακέτο για την επιχείρησή σου</p>

      {/* Current Subscription Status */}
      {subscription && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Τρέχουσα Συνδρομή</h3>
          <p className="text-blue-700">
            Πλάνο: {subscription.plan || 'Βασικό'} | 
            Κατάσταση: {subscription.status || 'Ενεργή'}
          </p>
          {subscription.status === 'ACTIVE' && (
            <button
              onClick={handleCancelSubscription}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Ακύρωση Συνδρομής
            </button>
          )}
        </div>
      )}

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