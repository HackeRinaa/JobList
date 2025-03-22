import React, { useState } from "react";
import { FiMapPin, FiClock, FiTag, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface JobListing {
  id: string;
  title: string;
  category: string;
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
  onApply: (jobId: string, message: string, estimatedPrice: string) => void;
}

export default function JobListingCard({ job, onApply }: JobListingCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR");
  };

  const handleApplyClick = () => {
    setShowApplyModal(true);
  };

  const confirmApply = () => {
    onApply(job.id, applyMessage, estimatedPrice);
    setShowApplyModal(false);
    setApplyMessage("");
    setEstimatedPrice("");
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${job.premium ? "border-[#FB7600] bg-orange-50" : "border-gray-200 bg-white"}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
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
          </div>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-[#FB7600]"
          >
            {showDetails ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        {showDetails && (
          <div className="mt-4 border-t pt-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Περιγραφή</h4>
              <p className="text-gray-600">{job.description}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Κατηγορία</h4>
              <p className="text-gray-600">{job.category}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 mr-2">Κόστος Tokens:</span>
                <span className="bg-orange-100 text-[#FB7600] px-2 py-1 rounded-lg">
                  {job.tokenCost} {job.tokenCost === 1 ? "token" : "tokens"}
                </span>
              </div>
              {job.applied ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                  Έχετε κάνει αίτηση
                </span>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
                >
                  Κάνε Αίτηση
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Αίτηση για την εργασία</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Εκτιμώμενη τιμή (€)</label>
              <input
                type="text"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                placeholder="π.χ. 50€"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Μήνυμα (προαιρετικό)</label>
              <textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                rows={4}
                placeholder="Περιγράψτε την εμπειρία σας ή άλλες λεπτομέρειες..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Ακύρωση
              </button>
              <button
                onClick={confirmApply}
                className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
                disabled={!estimatedPrice.trim()}
              >
                Υποβολή
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 