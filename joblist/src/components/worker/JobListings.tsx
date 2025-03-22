"use client";
import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import JobListingCard from "./JobListingCard";

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

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [jobListings, setJobListings] = useState<JobListing[]>([
    {
      id: "1",
      title: "Εγκατάσταση ηλεκτρικού πίνακα",
      category: "Ηλεκτρολογικά",
      location: "Αθήνα, Κολωνάκι",
      description: "Χρειάζομαι έναν ηλεκτρολόγο για την εγκατάσταση νέου ηλεκτρικού πίνακα σε διαμέρισμα 85τ.μ.",
      postedDate: "2024-05-18",
      budget: "150-200€",
      applied: false,
      premium: true,
      tokenCost: 3,
    },
    {
      id: "2",
      title: "Επισκευή διαρροής νερού",
      category: "Υδραυλικά",
      location: "Θεσσαλονίκη, Καλαμαριά",
      description: "Έχω διαρροή νερού στο μπάνιο, χρειάζομαι άμεσα υδραυλικό.",
      postedDate: "2024-05-17",
      budget: "50-80€",
      applied: false,
      premium: false,
      tokenCost: 1,
    },
    {
      id: "3",
      title: "Βάψιμο εσωτερικών χώρων",
      category: "Βαφές",
      location: "Αθήνα, Γλυφάδα",
      description: "Αναζητώ επαγγελματία για βάψιμο σαλονιού και δύο υπνοδωματίων.",
      postedDate: "2024-05-16",
      budget: "300-400€",
      applied: true,
      premium: false,
      tokenCost: 1,
    },
    {
      id: "4",
      title: "Εγκατάσταση κλιματιστικού",
      category: "Ψύξη/Θέρμανση",
      location: "Πάτρα, Κέντρο",
      description: "Χρειάζομαι τεχνικό για εγκατάσταση κλιματιστικού 12άρι inverter.",
      postedDate: "2024-05-15",
      budget: "80-120€",
      applied: false,
      premium: true,
      tokenCost: 2,
    },
    {
      id: "5",
      title: "Επισκευή πλυντηρίου",
      category: "Επισκευές Συσκευών",
      location: "Ηράκλειο, Κρήτη",
      description: "Το πλυντήριο ρούχων δεν λειτουργεί σωστά, χρειάζεται επισκευή.",
      postedDate: "2024-05-14",
      budget: "60-100€",
      applied: false,
      premium: false,
      tokenCost: 1,
    },
  ]);

  const categories = [
    "Όλες οι κατηγορίες",
    "Ηλεκτρολογικά",
    "Υδραυλικά",
    "Βαφές",
    "Ψύξη/Θέρμανση",
    "Επισκευές Συσκευών",
    "Ξυλουργικά",
    "Καθαρισμοί",
  ];

  const [successMessage, setSuccessMessage] = useState("");

  const handleApply = (jobId: string, message: string = "", estimatedPrice: string = "") => {
    setJobListings(
      jobListings.map((job) =>
        job.id === jobId ? { ...job, applied: true } : job
      )
    );

    console.log(`Applied to job ${jobId} with message: ${message} and estimated price: ${estimatedPrice}`);

    setSuccessMessage("Η αίτησή σας υποβλήθηκε με επιτυχία!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "" || 
      selectedCategory === "Όλες οι κατηγορίες" || 
      job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Αναζήτηση Εργασιών</h2>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Αναζήτηση εργασιών..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <FiFilter className="mr-2" /> Φίλτρα
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-gray-700 mb-2">Κατηγορία</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobListingCard 
              key={job.id} 
              job={job} 
              onApply={handleApply} 
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Δεν βρέθηκαν εργασίες με τα συγκεκριμένα κριτήρια.</p>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
    </div>
  );
} 