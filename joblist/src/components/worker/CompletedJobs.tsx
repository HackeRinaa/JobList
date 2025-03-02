"use client";
import React, { useState } from "react";
import { FiStar, FiCalendar, FiMapPin, FiDollarSign } from "react-icons/fi";

interface CompletedJob {
  id: string;
  title: string;
  clientName: string;
  location: string;
  completionDate: string;
  payment: string;
  rating: number;
  feedback?: string;
}

export default function CompletedJobs() {
  const [filter, setFilter] = useState("all");
  const completedJobs: CompletedJob[] = [
    {
      id: "1",
      title: "Εγκατάσταση ηλεκτρικού πίνακα",
      clientName: "Μαρία Παπαδοπούλου",
      location: "Αθήνα, Κολωνάκι",
      completionDate: "2024-05-10",
      payment: "180€",
      rating: 5,
      feedback: "Εξαιρετική δουλειά, γρήγορος και επαγγελματίας!",
    },
    {
      id: "2",
      title: "Επισκευή διαρροής",
      clientName: "Γιώργος Νικολάου",
      location: "Αθήνα, Γλυφάδα",
      completionDate: "2024-05-03",
      payment: "70€",
      rating: 4,
      feedback: "Καλή δουλειά, λίγο καθυστερημένος.",
    },
    {
      id: "3",
      title: "Εγκατάσταση φωτιστικών",
      clientName: "Ελένη Δημητρίου",
      location: "Αθήνα, Χαλάνδρι",
      completionDate: "2024-04-28",
      payment: "120€",
      rating: 5,
      feedback: "Άψογη εργασία και πολύ καλή επικοινωνία!",
    },
    {
      id: "4",
      title: "Επισκευή κλιματιστικού",
      clientName: "Κώστας Αντωνίου",
      location: "Αθήνα, Κυψέλη",
      completionDate: "2024-04-15",
      payment: "90€",
      rating: 3,
      feedback: "Έκανε τη δουλειά, αλλά άφησε αρκετή ακαταστασία.",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR");
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FiStar
          key={i}
          className={`${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  const filteredJobs = filter === "all" 
    ? completedJobs 
    : completedJobs.filter(job => Math.floor(job.rating) === parseInt(filter));

  const totalEarnings = completedJobs.reduce(
    (total, job) => total + parseFloat(job.payment.replace("€", "")),
    0
  );

  const averageRating =
    completedJobs.reduce((total, job) => total + job.rating, 0) / completedJobs.length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ολοκληρωμένες Εργασίες</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 text-sm">Συνολικές Εργασίες</p>
          <p className="text-2xl font-bold">{completedJobs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 text-sm">Συνολικά Έσοδα</p>
          <p className="text-2xl font-bold">{totalEarnings}€</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 text-sm">Μέση Αξιολόγηση</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">{averageRating.toFixed(1)}</p>
            <div className="flex">
              {renderStars(Math.round(averageRating))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="filter" className="block text-gray-700 mb-2">
          Φιλτράρισμα με βάση την αξιολόγηση
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
        >
          <option value="all">Όλες οι αξιολογήσεις</option>
          <option value="5">⭐⭐⭐⭐⭐ (5 αστέρια)</option>
          <option value="4">⭐⭐⭐⭐ (4 αστέρια)</option>
          <option value="3">⭐⭐⭐ (3 αστέρια)</option>
          <option value="2">⭐⭐ (2 αστέρια)</option>
          <option value="1">⭐ (1 αστέρι)</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex justify-between flex-wrap">
                <h3 className="text-lg font-semibold text-gray-800">
                  {job.title}
                </h3>
                <div className="flex items-center">
                  {renderStars(job.rating)}
                </div>
              </div>
              
              <div className="mt-2 text-gray-600">
                <p>Πελάτης: {job.clientName}</p>
                <div className="flex flex-wrap mt-2 gap-x-4 gap-y-2 text-sm">
                  <span className="flex items-center">
                    <FiMapPin className="mr-1" /> {job.location}
                  </span>
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" /> {formatDate(job.completionDate)}
                  </span>
                  <span className="flex items-center">
                    <FiDollarSign className="mr-1" /> {job.payment}
                  </span>
                </div>
              </div>
              
              {job.feedback && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700">Σχόλια Πελάτη:</h4>
                  <p className="text-gray-600 italic">&quot;{job.feedback}&quot;</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Δεν βρέθηκαν ολοκληρωμένες εργασίες με τα επιλεγμένα κριτήρια.</p>
          </div>
        )}
      </div>
    </div>
  );
} 