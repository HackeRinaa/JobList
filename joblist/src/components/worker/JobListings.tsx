"use client";
import React, { useState, useContext } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import JobListingCard from "./JobListingCard";
import { UserContext } from "@/contexts/WorkerContext";
import { JobCategory } from "@/types/prisma";
import { getAllCategories } from "@/utils/categories";
import { UserData } from '@/types/user';

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

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | "">("");
  const [showFilters, setShowFilters] = useState(false);
  const userData = useContext(UserContext);
  const [jobListings, setJobListings] = useState<JobListing[]>([
    {
      id: "1",
      title: "Εγκατάσταση ηλεκτρικού πίνακα",
      category: JobCategory.ELECTRICIAN,
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
      category: JobCategory.PLUMBER,
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
      category: JobCategory.PAINTER,
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
      category: JobCategory.HVAC_TECHNICIAN,
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
      category: JobCategory.APPLIANCE_REPAIR,
      location: "Ηράκλειο, Κρήτη",
      description: "Το πλυντήριο ρούχων δεν λειτουργεί σωστά, χρειάζεται επισκευή.",
      postedDate: "2024-05-14",
      budget: "60-100€",
      applied: false,
      premium: false,
      tokenCost: 1,
    },
  ]);

  const allCategories = getAllCategories();

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
      job.category === selectedCategory;
    
    // Filter by worker's expertise
    const matchesExpertise = userData?.profile?.preferences?.includes(job.category as JobCategory) || false;
    
    return matchesSearch && matchesCategory && matchesExpertise;
  });

  if (!userData?.profile?.preferences?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Παρακαλώ συμπληρώστε τις ειδικότητές σας στο προφίλ σας για να δείτε σχετικές αγγελίες.</p>
        <button 
          onClick={() => window.location.href = '/worker/profile?tab=profile'}
          className="bg-[#FB7600] text-white px-4 py-2 rounded-lg hover:bg-[#e66a00] transition-colors"
        >
          Μετάβαση στο προφίλ
        </button>
      </div>
    );
  }

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
                onChange={(e) => setSelectedCategory(e.target.value as JobCategory | "")}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
              >
                <option value="">Όλες οι κατηγορίες</option>
                {allCategories.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <JobListingCard
            key={job.id}
            job={job}
            onApply={handleApply}
          />
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Δεν βρέθηκαν εργασίες που να ταιριάζουν με τα κριτήριά σας.
          </div>
        )}
      </div>
    </div>
  );
} 