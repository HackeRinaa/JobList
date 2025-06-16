import React, { useState } from "react";
import { FiMapPin, FiClock, FiTag, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { JobCategory } from "@/types/prisma";
import { categoryTranslations, categoryIcons } from "@/utils/categories";

interface JobListing {
  id: string;
  title: string;
  category: JobCategory;
  location: string;
  description: string;
  postedDate: string;
  budget: string;
  applied: boolean;
  premium: boolean;
  tokenCost: number;
}

interface JobListingCardProps {
  job: JobListing;
  onApply: (jobId: string, message?: string, estimatedPrice?: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('el-GR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function JobListingCard({ job, onApply }: JobListingCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [message, setMessage] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(job.id, message, estimatedPrice);
    setMessage("");
    setEstimatedPrice("");
    setShowDetails(false);
  };

  const CategoryIcon = categoryIcons[job.category];

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${job.premium ? 'border-[#FB7600]' : 'border-gray-200'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <CategoryIcon className="mr-2 text-[#FB7600]" />
              <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
              {job.premium && (
                <span className="ml-2 px-2 py-1 bg-orange-100 text-[#FB7600] text-xs rounded-full">
                  Premium
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <FiMapPin className="mr-1" /> {job.location}
              </span>
              <span className="flex items-center">
                <FiClock className="mr-1" /> {formatDate(job.postedDate)}
              </span>
              <span className="flex items-center">
                <FiTag className="mr-1" /> {job.budget}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {categoryTranslations[job.category]}
            </div>
          </div>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-[#FB7600]"
          >
            {showDetails ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        {showDetails && (
          <div className="mt-4">
            <p className="text-gray-600 mb-4">{job.description}</p>
            {!job.applied ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Μήνυμα προς τον πελάτη
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                    rows={3}
                    placeholder="Περιγράψτε την εμπειρία σας και πώς μπορείτε να βοηθήσετε..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Εκτιμώμενο κόστος
                  </label>
                  <input
                    type="text"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                    placeholder="π.χ. 100-150€"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FB7600] text-white py-2 px-4 rounded-lg hover:bg-[#e66a00] transition-colors"
                >
                  Υποβολή αίτησης
                </button>
              </form>
            ) : (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
                Έχετε ήδη υποβάλει αίτηση για αυτή την εργασία.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 