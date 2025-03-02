"use client";
import React, { useState } from "react";
import { FiMapPin, FiCalendar, FiTag, FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

interface Application {
  id: string;
  workerId: string;
  workerName: string;
  message?: string;
  date: string;
}

interface Listing {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  postedDate: string;
  budget: string;
  status: "pending" | "assigned" | "in_progress";
  applications: Application[];
  assignedWorkerId?: string;
}

export default function ActiveListings() {
  const [activeListings, setActiveListings] = useState<Listing[]>([
    {
      id: "1",
      title: "Επισκευή διαρροής νερού",
      category: "Υδραυλικά",
      location: "Αθήνα, Κολωνάκι",
      description: "Έχω διαρροή νερού στο μπάνιο, χρειάζομαι άμεσα υδραυλικό.",
      postedDate: "2024-05-18",
      budget: "50-80€",
      status: "pending",
      applications: [
        {
          id: "a1",
          workerId: "w1",
          workerName: "Γιώργος Παπαδόπουλος",
          message: "Είμαι διαθέσιμος αύριο το πρωί. Έχω μεγάλη εμπειρία σε επισκευές διαρροών.",
          date: "2024-05-19",
        },
        {
          id: "a2",
          workerId: "w2",
          workerName: "Νίκος Αντωνίου",
          message: "Μπορώ να έρθω σήμερα το απόγευμα για να δω το πρόβλημα.",
          date: "2024-05-19",
        },
      ],
    },
    {
      id: "2",
      title: "Εγκατάσταση κλιματιστικού",
      category: "Ψύξη/Θέρμανση",
      location: "Αθήνα, Γλυφάδα",
      description: "Χρειάζομαι τεχνικό για εγκατάσταση κλιματιστικού 12άρι inverter.",
      postedDate: "2024-05-15",
      budget: "80-120€",
      status: "assigned",
      applications: [
        {
          id: "a3",
          workerId: "w3",
          workerName: "Κώστας Δημητρίου",
          message: "Έχω εγκαταστήσει πάνω από 100 κλιματιστικά. Διαθέσιμος όποτε σας βολεύει.",
          date: "2024-05-16",
        },
      ],
      assignedWorkerId: "w3",
    },
    {
      id: "3",
      title: "Βάψιμο σαλονιού",
      category: "Βαφές",
      location: "Αθήνα, Χαλάνδρι",
      description: "Αναζητώ επαγγελματία για βάψιμο σαλονιού 25τ.μ.",
      postedDate: "2024-05-10",
      budget: "150-200€",
      status: "in_progress",
      applications: [
        {
          id: "a4",
          workerId: "w4",
          workerName: "Μιχάλης Αλεξίου",
          message: "Επαγγελματίας ελαιοχρωματιστής με 15 χρόνια εμπειρία.",
          date: "2024-05-11",
        },
      ],
      assignedWorkerId: "w4",
    },
  ]);

  const [expandedListing, setExpandedListing] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("el-GR");
  };

  const handleAssignWorker = (listingId: string, workerId: string) => {
    setActiveListings(
      activeListings.map((listing) =>
        listing.id === listingId
          ? { ...listing, status: "assigned", assignedWorkerId: workerId }
          : listing
      )
    );
  };

  const handleStartWork = (listingId: string) => {
    setActiveListings(
      activeListings.map((listing) =>
        listing.id === listingId
          ? { ...listing, status: "in_progress" }
          : listing
      )
    );
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Εκκρεμεί";
      case "assigned":
        return "Ανατέθηκε";
      case "in_progress":
        return "Σε εξέλιξη";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ενεργές Αγγελίες</h2>
        <Link 
          href="/customer/create-listing" 
          className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
        >
          Νέα Αγγελία
        </Link>
      </div>

      {activeListings.length > 0 ? (
        <div className="space-y-4">
          {activeListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(listing.status)}`}>
                        {getStatusLabel(listing.status)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiMapPin className="mr-1" /> {listing.location}
                      </span>
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" /> {formatDate(listing.postedDate)}
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
                    {expandedListing === listing.id
                      ? "Λιγότερα"
                      : `${listing.applications.length} Αιτήσεις`}
                  </button>
                </div>

                <p className="mt-2 text-gray-600">{listing.description}</p>

                {expandedListing === listing.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">Αιτήσεις Επαγγελματιών</h4>
                    {listing.applications.length > 0 ? (
                      <div className="space-y-3">
                        {listing.applications.map((application) => (
                          <div
                            key={application.id}
                            className={`p-3 rounded-lg border ${
                              listing.assignedWorkerId === application.workerId
                                ? "border-[#FB7600] bg-orange-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
                                  {application.workerName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">{application.workerName}</p>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(application.date)}
                                  </p>
                                </div>
                              </div>
                              {listing.status === "pending" && (
                                <button
                                  onClick={() =>
                                    handleAssignWorker(listing.id, application.workerId)
                                  }
                                  className="px-3 py-1 bg-[#FB7600] text-white text-sm rounded-lg hover:bg-orange-700"
                                >
                                  Ανάθεση
                                </button>
                              )}
                            </div>
                            {application.message && (
                              <div className="mt-2 pl-13">
                                <p className="text-gray-600 text-sm">
                                  <FiMessageSquare className="inline mr-1" />
                                  {application.message}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Δεν υπάρχουν αιτήσεις ακόμα.</p>
                    )}

                    {listing.status === "assigned" && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleStartWork(listing.id)}
                          className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
                        >
                          Έναρξη Εργασίας
                        </button>
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
          <p className="text-gray-500">Δεν έχετε ενεργές αγγελίες.</p>
          <Link
            href="/customer/create-listing"
            className="mt-4 inline-block px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
          >
            Δημιουργία Αγγελίας
          </Link>
        </div>
      )}
    </div>
  );
} 