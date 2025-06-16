"use client";
import React, { useState } from "react";
import { FiStar, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";
import { JobCategory } from "@/types/prisma";
import { categoryTranslations } from "@/utils/categories";

interface CompletedJob {
  id: string;
  title: string;
  category: JobCategory;
  location: string;
  completedDate: string;
  earnings: string;
  customerName: string;
  customerRating: number;
  customerReview?: string;
}

export default function CompletedJobs() {
  const [filter, setFilter] = useState("all");

  const [completedJobs] = useState<CompletedJob[]>([
    {
      id: "1",
      title: "Επισκευή πλυντηρίου",
      category: JobCategory.APPLIANCE_REPAIR,
      location: "Αθήνα, Κολωνάκι",
      completedDate: "2024-05-10",
      earnings: "80€",
      customerName: "Μαρία Παπαδοπούλου",
      customerRating: 5,
      customerReview: "Εξαιρετική δουλειά, συνεπής και επαγγελματίας!"
    },
    {
      id: "2",
      title: "Εγκατάσταση φωτιστικών",
      category: JobCategory.ELECTRICIAN,
      location: "Αθήνα, Γλυφάδα",
      completedDate: "2024-05-08",
      earnings: "150€",
      customerName: "Γιώργος Αντωνίου",
      customerRating: 4,
      customerReview: "Καλή δουλειά, μικρή καθυστέρηση στην ώρα προσέλευσης"
    },
    {
      id: "3",
      title: "Καθαρισμός σπιτιού",
      category: JobCategory.CLEANING_SERVICE,
      location: "Αθήνα, Χαλάνδρι",
      completedDate: "2024-05-05",
      earnings: "100€",
      customerName: "Ελένη Δημητρίου",
      customerRating: 5,
      customerReview: "Άψογη δουλειά, θα την ξαναπροτιμήσω!"
    }
  ]);

  const filteredJobs = completedJobs.filter(job => {
    if (filter === 'rated') return job.customerRating > 0;
    if (filter === 'unrated') return job.customerRating === 0;
    return true;
  });

  const calculateAverageRating = () => {
    const ratedJobs = completedJobs.filter(job => job.customerRating > 0);
    if (ratedJobs.length === 0) return 0;
    const sum = ratedJobs.reduce((acc, job) => acc + job.customerRating, 0);
    return (sum / ratedJobs.length).toFixed(1);
  };

  const totalEarnings = completedJobs
    .reduce((sum, job) => sum + parseFloat(job.earnings.replace('€', '')), 0)
    .toFixed(2);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ολοκληρωμένες Εργασίες</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 mb-2">Συνολικές Εργασίες</div>
          <div className="text-2xl font-bold text-[#FB7600]">{completedJobs.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 mb-2">Μέση Αξιολόγηση</div>
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2 text-[#FB7600]">{calculateAverageRating()}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Number(calculateAverageRating())
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 mb-2">Συνολικά Έσοδα</div>
          <div className="text-2xl font-bold text-[#FB7600]">{totalEarnings}€</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-[#FB7600] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Όλες
          </button>
          <button
            onClick={() => setFilter('rated')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'rated'
                ? 'bg-[#FB7600] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Με Αξιολόγηση
          </button>
          <button
            onClick={() => setFilter('unrated')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unrated'
                ? 'bg-[#FB7600] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Χωρίς Αξιολόγηση
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                <div className="mt-1 text-sm text-gray-600">
                  {categoryTranslations[job.category]}
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FiMapPin className="mr-1" /> {job.location}
                  </span>
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" /> {job.completedDate}
                  </span>
                  <span className="flex items-center">
                    <FiDollarSign className="mr-1" /> {job.earnings}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span className="text-green-700 font-medium">{job.customerRating}/5</span>
                </div>
              </div>
            </div>
            {job.customerReview && (
              <div className="mt-3 text-sm text-gray-600 italic">
                &quot;{job.customerReview}&quot;
                <div className="mt-1 text-sm text-gray-500 not-italic">
                  - {job.customerName}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Δεν βρέθηκαν ολοκληρωμένες εργασίες με τα επιλεγμένα φίλτρα.</p>
          </div>
        )}
      </div>
    </div>
  );
} 