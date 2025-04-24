"use client";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

interface TokenTransaction {
  id: string;
  date: string;
  type: "purchase" | "use";
  amount: number;
  description: string;
}

export default function TokensPanel() {
  const [tokens, setTokens] = useState(15);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([
    {
      id: "1",
      date: "2024-05-10",
      type: "purchase",
      amount: 20,
      description: "Αγορά tokens - Πακέτο Standard",
    },
    {
      id: "2",
      date: "2024-05-12",
      type: "use",
      amount: -1,
      description: "Αίτηση για εργασία: Επισκευή ηλεκτρικής εγκατάστασης",
    },
    {
      id: "3",
      date: "2024-05-15",
      type: "use",
      amount: -1,
      description: "Αίτηση για εργασία: Εγκατάσταση φωτιστικών",
    },
    {
      id: "4",
      date: "2024-05-18",
      type: "use",
      amount: -3,
      description: "Αίτηση για εργασία: Ανακαίνιση ηλεκτρολογικών",
    },
  ]);

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState(10);

  const handleBuyTokens = () => {
    // In a real app, this would integrate with a payment system
    const newTransaction: TokenTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      type: "purchase",
      amount: buyAmount,
      description: `Αγορά ${buyAmount} tokens`,
    };

    setTokens(tokens + buyAmount);
    setTransactions([newTransaction, ...transactions]);
    setShowBuyModal(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Τα Credits μου</h2>

      <div className="bg-gradient-to-r from-orange-500 to-[#FB7600] rounded-lg p-6 text-white mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm opacity-80">Διαθέσιμα Credits</p>
            <p className="text-3xl font-bold">{tokens}</p>
            <p className="text-sm mt-2">
              Χρησιμοποίησε credits για να κάνεις αίτηση σε εργασίες
            </p>
          </div>
          <button
            onClick={() => setShowBuyModal(true)}
            className="w-full sm:w-auto bg-white text-[#FB7600] px-4 py-2 rounded-lg flex items-center justify-center hover:bg-orange-50"
          >
            <FiPlus className="mr-1" /> Αγορά Credits
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Ιστορικό Συναλλαγών</h3>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ημερομηνία
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Περιγραφή
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credits
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString("el-GR")}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 max-w-xs break-words">
                  {transaction.description}
                </td>
                <td
                  className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === "purchase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "purchase" ? "+" : ""}
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buy Tokens Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Αγορά Credits</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Επίλεξε ποσότητα</label>
              <div className="flex flex-wrap gap-2">
                {[10, 20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBuyAmount(amount)}
                    className={`px-4 py-2 rounded-lg ${
                      buyAmount === amount
                        ? "bg-[#FB7600] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Κόστος: <span className="font-bold">{buyAmount * 0.5}€</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                (0.50€ ανά credit)
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleBuyTokens}
                className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
              >
                Αγορά
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 