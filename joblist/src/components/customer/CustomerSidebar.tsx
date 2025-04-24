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
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800">Πίνακας Ελέγχου</h2>
      </div>
      <nav>
        <ul className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-0 md:space-y-2 pb-2 md:pb-0">
          {menuItems.map((item) => (
            <li key={item.id} className="flex-shrink-0 md:w-full">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center whitespace-nowrap md:whitespace-normal p-2 md:p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-[#FB7600] text-white"
                    : "text-gray-600 hover:bg-orange-50 hover:text-[#FB7600]"
                }`}
              >
                <span className="mr-2 md:mr-3">{item.icon}</span>
                <span className="text-sm md:text-base">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 