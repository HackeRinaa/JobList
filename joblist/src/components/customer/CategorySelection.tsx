"use client";
import React from "react";
import { JobCategory } from "@/types/prisma";
import { categoryTranslations, categoryIcons } from "@/utils/categories";

interface CategorySelectionProps {
  selectedCategory: JobCategory | "";
  onSelect: (category: JobCategory) => void;
  onNext: () => void;
}

export default function CategorySelection({
  selectedCategory,
  onSelect,
  onNext,
}: CategorySelectionProps) {
  const categories = Object.values(JobCategory).map(category => ({
    id: category,
    name: categoryTranslations[category],
    Icon: categoryIcons[category]
  }));

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Τι είδους εργασία χρειάζεστε;
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(({ id, name, Icon }) => (
          <button
            key={id}
            className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
              selectedCategory === id
                ? "border-[#FB7600] bg-orange-50"
                : "border-gray-200 hover:border-[#FB7600]"
            }`}
            onClick={() => onSelect(id)}
          >
            <div
              className={`mb-2 rounded-full p-3 ${
                selectedCategory === id
                  ? "bg-[#FB7600] text-white"
                  : "bg-gray-100 text-[#FB7600]"
              }`}
            >
              <Icon size={24} />
            </div>
            <span className="text-sm font-medium text-gray-800 text-center">{name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedCategory}
          className="rounded-lg bg-[#FB7600] px-6 py-2 font-medium text-white transition-colors hover:hover:bg-[#e66a00] disabled:bg-gray-300"
        >
          Συνέχεια
        </button>
      </div>
    </div>
  );
} 