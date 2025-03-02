"use client";
import React, { useState } from "react";
import { FiMapPin, FiCalendar, FiTag, FiStar } from "react-icons/fi";

interface CompletedListing {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  completionDate: string;
  budget: string;
  workerName: string;
  workerId: string;
  rating?: number;
  feedback?: string;
}

export default function CompletedListings() {
  const [completedListings, setCompletedListings] = useState<CompletedListing[]>([
    {
      id: "1",
      title: "Επισκευή πλυντηρίου",
      category: "Επισκευές Συσκευών",
      location: "Αθήνα, Κολωνάκι",
      description: "Το πλυντήριο δεν λειτουργεί σωστά, χρειάζεται επισκευή.",
      completionDate: "2024-05-01",
      budget: "70€",
      workerName: "Γιώργος Παπαδόπουλος",
      workerId: "w1",
      rating: 5,
      feedback: "Εξαιρετική δουλειά, γρήγορος και επαγγελματίας!",
    },
    {
      id: "2",
      title: "Εγκατάσταση φωτιστικών",
      category: "Ηλεκτρολογικά",
      location: "Αθήνα, Γλυφάδα",
      description: "Εγκατάσταση 3 φωτιστικών οροφής στο σαλόνι και την κουζίνα.",
      completionDate: "2024-04-20",
      budget: "120€",
      workerName: "Νίκος Αντωνίου",
      workerId: "w2",
      rating: 4,
      feedback: "Καλή δουλειά, αλλά άργησε λίγο να έρθει.",
    },
    {
      id: "3",
      title: "Καθαρισμός σπιτιού",
      category: "Καθαρισμοί",
      location: "Αθήνα, Χαλάνδρι",
      description: "Γενικός καθαρισμός διαμερίσματος 85τ.μ.",
      completionDate: "2024-04-10",
      budget: "90€",
      workerName: "Μαρία Κωνσταντίνου",
      workerId: "w3",
    },
  ]);

  const [expandedListing, setExpandedListing] = useState<string | null>(null);
  const [ratingForm, setRatingForm] = useState<{
    listingId: string;
    rating: number;
    feedback: string;
  } | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR");
  };

  const handleRateWork = (listingId: string) => {
    const listing = completedListings.find((l) => l.id === listingId);
    if (listing) {
      setRatingForm({
        listingId,
        rating: listing.rating || 0,
        feedback: listing.feedback || "",
      });
    }
  };

  const handleSubmitRating = () => {
    if (ratingForm) {
      setCompletedListings(
        completedListings.map((listing) =>
          listing.id === ratingForm.listingId
            ? {
                ...listing,
                rating: ratingForm.rating,
                feedback: ratingForm.feedback,
              }
            : listing
        )
      );
      setRatingForm(null);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FiStar
          key={i}
          className={`${
            i < (rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={
            interactive
              ? () =>
                  setRatingForm(
                    ratingForm ? { ...ratingForm, rating: i + 1 } : null
                  )
              : undefined
          }
        />
      ));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ολοκληρωμένες Εργασίες</h2>

      {completedListings.length > 0 ? (
        <div className="space-y-4">
          {completedListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiMapPin className="mr-1" /> {listing.location}
                      </span>
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" /> {formatDate(listing.completionDate)}
                      </span>
                      <span className="flex items-center">
                        <FiTag className="mr-1" /> {listing.budget}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedListing(
                        expandedListing === listing.id ? null : listing.id
                      )
                    }
                    className="text-[#FB7600] hover:underline"
                  >
                    {expandedListing === listing.id ? "Λιγότερα" : "Περισσότερα"}
                  </button>
                </div>

                <div className="mt-2 flex items-center">
                  <div className="flex items-center mr-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-2">
                      {listing.workerName.charAt(0)}
                    </div>
                    <span className="text-gray-700">{listing.workerName}</span>
                  </div>
                  
                  {listing.rating ? (
                    <div className="flex items-center ml-auto">
                      <div className="flex text-sm">
                        {renderStars(listing.rating)}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRateWork(listing.id)}
                      className="ml-auto px-3 py-1 bg-[#FB7600] text-white text-sm rounded-lg hover:bg-orange-700"
                    >
                      Αξιολόγηση
                    </button>
                  )}
                </div>

                {expandedListing === listing.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600">{listing.description}</p>
                    
                    {listing.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Η αξιολόγησή σας:</p>
                        <div className="flex text-sm mt-1">
                          {renderStars(listing.rating || 0)}
                        </div>
                        <p className="mt-2 text-gray-600 text-sm">{listing.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Δεν έχετε ολοκληρωμένες εργασίες.</p>
        </div>
      )}

      {ratingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Αξιολογήστε την εργασία</h3>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-2">Βαθμολογία</p>
              <div className="flex text-2xl space-x-2">
                {renderStars(ratingForm.rating, true)}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Σχόλια</label>
              <textarea
                value={ratingForm.feedback}
                onChange={(e) => 
                  setRatingForm({...ratingForm, feedback: e.target.value})
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                rows={4}
                placeholder="Μοιραστείτε την εμπειρία σας..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRatingForm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleSubmitRating}
                className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
                disabled={ratingForm.rating === 0}
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