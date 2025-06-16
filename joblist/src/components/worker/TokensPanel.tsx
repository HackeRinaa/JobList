"use client";
import React, { useContext } from 'react';
import { UserContext } from '@/contexts/WorkerContext';
import { FiCreditCard, FiPlus } from 'react-icons/fi';

export default function TokensPanel() {
  const userData = useContext(UserContext);

  const tokenPackages = [
    {
      tokens: 50,
      price: "29.99",
      savings: "0%",
      recommended: false
    },
    {
      tokens: 120,
      price: "59.99",
      savings: "15%",
      recommended: true
    },
    {
      tokens: 250,
      price: "99.99",
      savings: "25%",
      recommended: false
    }
  ];

  const handlePurchaseTokens = (amount: number, price: string) => {
    // In a real app, this would open a Stripe checkout session
    console.log(`Purchasing ${amount} tokens for €${price}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Credits</h2>
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
          <FiCreditCard className="text-[#FB7600] mr-2" />
          <span className="font-semibold text-gray-800">{userData?.user?.tokens || 0} credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokenPackages.map((pkg, index) => (
          <div 
            key={index}
            className={`relative p-6 rounded-lg border-2 ${
              pkg.recommended 
                ? 'border-[#FB7600] bg-orange-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#FB7600] text-white px-3 py-1 rounded-full text-sm">
                  Προτεινόμενο
                </span>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2 text-gray-600">{pkg.tokens} Credits</h3>
              <p className="text-3xl font-bold text-[#FB7600] mb-2">€{pkg.price}</p>
              {pkg.savings !== "0%" && (
                <p className="text-green-600 text-sm mb-4">
                  Εξοικονόμηση {pkg.savings}
                </p>
              )}
              <button
                onClick={() => handlePurchaseTokens(pkg.tokens, pkg.price)}
                className="w-full bg-[#FB7600] text-white py-2 rounded-lg hover:bg-[#e66a00] transition-colors flex items-center justify-center"
              >
                <FiPlus className="mr-2" />
                Αγορά Credits
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-600">Πώς λειτουργούν τα credits;</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Τα credits χρησιμοποιούνται για να ξεκλειδώσετε τα στοιχεία επικοινωνίας των αγγελιών.
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Κάθε αγγελία έχει διαφορετικό κόστος credits ανάλογα με την κατηγορία και την προτεραιότητά της.
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Τα credits δεν έχουν ημερομηνία λήξης και μπορείτε να τα χρησιμοποιήσετε όποτε θέλετε.
          </li>
        </ul>
      </div>
    </div>
  );
} 