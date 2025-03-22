import React from "react";
import { FiUser, FiList, FiCheckCircle, FiHeart, FiMessageCircle } from "react-icons/fi";

interface CustomerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CustomerSidebar({ activeTab, setActiveTab }: CustomerSidebarProps) {
  const menuItems = [
    { id: "profile", label: "Προφίλ", icon: <FiUser /> },
    { id: "active", label: "Ενεργές Αγγελίες", icon: <FiList /> },
    { id: "completed", label: "Ολοκληρωμένες Εργασίες", icon: <FiCheckCircle /> },
    { id: "saved", label: "Αποθηκευμένοι Επαγγελματίες", icon: <FiHeart /> },
    { id: "chat", label: "Συνομιλίες", icon: <FiMessageCircle /> },
  ];

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Πίνακας Ελέγχου</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-[#FB7600] text-white"
                    : "text-gray-600 hover:bg-orange-50 hover:text-[#FB7600]"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 