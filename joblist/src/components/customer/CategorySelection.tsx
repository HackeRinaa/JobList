import React from "react";
import { FiHome, FiTool, FiWifi, FiDroplet, FiSun, FiTruck, FiGrid, FiLayers } from "react-icons/fi";

interface CategorySelectionProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
  onNext: () => void;
}

export default function CategorySelection({
  selectedCategory,
  onSelect,
  onNext,
}: CategorySelectionProps) {
  const categories = [
    { id: "plumbing", name: "Υδραυλικά", icon: <FiDroplet size={24} /> },
    { id: "electrical", name: "Ηλεκτρολογικά", icon: <FiWifi size={24} /> },
    { id: "carpentry", name: "Ξυλουργικές εργασίες", icon: <FiTool size={24} /> },
    { id: "painting", name: "Βαψίματα & Σοβάδες", icon: <FiSun size={24} /> },
    { id: "moving", name: "Κατεδαφίσεις & Μεταφορές", icon: <FiTruck size={24} /> },
    { id: "cleaning", name: "Καθαρισμός εργοταξίων", icon: <FiHome size={24} /> },
    { id: "masonry", name: "Οικοδομικές εργασίες", icon: <FiLayers size={24} /> },
    { id: "roofing", name: "Σκεπές & Μονώσεις", icon: <FiHome size={24} /> },
    { id: "flooring", name: "Δάπεδα & Πλακάκια", icon: <FiGrid size={24} /> },
    { id: "other", name: "Άλλες εργασίες", icon: <FiTool size={24} /> },
  ];
  

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Τι είδους εργασία χρειάζεστε?
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
              selectedCategory === category.id
                ? "border-[#FB7600] bg-orange-50"
                : "border-gray-200 hover:border-[#FB7600]"
            }`}
            onClick={() => onSelect(category.id)}
          >
            <div
              className={`mb-2 rounded-full p-3 ${
                selectedCategory === category.id
                  ? "bg-[#FB7600] text-white"
                  : "bg-gray-100 text-[#FB7600]"
              }`}
            >
              {category.icon}
            </div>
            <span className="text-sm font-medium text-gray-800">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedCategory}
          className="rounded-lg bg-[#FB7600] px-6 py-2 font-medium text-white transition-colors hover:hover:bg-[#E56A00]  disabled:bg-gray-300"
        >
          Συνέχεια
        </button>
      </div>
    </div>
  );
} 