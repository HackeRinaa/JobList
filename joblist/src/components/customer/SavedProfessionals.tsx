"use client";
import React, { useState, useEffect } from "react";
import { FiMapPin, FiStar, FiPhone, FiMail, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface Professional {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  completedJobs: number;
  phone?: string;
  email?: string;
  bio?: string;
}

export default function SavedProfessionals() {
  const [savedProfessionals, setSavedProfessionals] = useState<Professional[]>([]);
  const [expandedProfessional, setExpandedProfessional] = useState<string | null>(null);
  const [showContactInfo, setShowContactInfo] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load saved professionals from localStorage on component mount
  useEffect(() => {
    const loadSavedProfessionals = () => {
      const savedProfessionalsString = localStorage.getItem('savedProfessionals');
      if (savedProfessionalsString) {
        try {
          const professionals = JSON.parse(savedProfessionalsString) as Professional[];
          setSavedProfessionals(professionals);
        } catch (error) {
          console.error('Error parsing saved professionals:', error);
          // If there's an error parsing, set default demo data
          setSavedProfessionals(getDefaultProfessionals());
        }
      } else {
        // If no saved professionals, provide demo data for first-time users
        setSavedProfessionals(getDefaultProfessionals());
      }
      setIsLoading(false);
    };

    loadSavedProfessionals();
  }, []);

  // Get default professionals for demo purposes
  const getDefaultProfessionals = (): Professional[] => {
    return [
      {
        id: "1",
        name: "Γιώργος Παπαδόπουλος",
        profession: "Υδραυλικός",
        location: "Αθήνα, Κολωνάκι",
        rating: 4.8,
        completedJobs: 127,
        phone: "6912345678",
        email: "giorgos@example.com",
        bio: "Επαγγελματίας υδραυλικός με 15 χρόνια εμπειρίας. Εξειδίκευση σε επισκευές και εγκαταστάσεις σε κατοικίες και επαγγελματικούς χώρους.",
      },
      {
        id: "2",
        name: "Νίκος Αντωνίου",
        profession: "Ηλεκτρολόγος",
        location: "Αθήνα, Γλυφάδα",
        rating: 4.6,
        completedJobs: 98,
        phone: "6923456789",
        email: "nikos@example.com",
        bio: "Πιστοποιημένος ηλεκτρολόγος με εμπειρία σε οικιακές και βιομηχανικές εγκαταστάσεις. Άμεση εξυπηρέτηση και ποιοτική δουλειά.",
      },
      {
        id: "3",
        name: "Μαρία Κωνσταντίνου",
        profession: "Καθαρισμοί",
        location: "Αθήνα, Χαλάνδρι",
        rating: 4.9,
        completedJobs: 215,
        phone: "6934567890",
        email: "maria@example.com",
        bio: "Επαγγελματικοί καθαρισμοί σπιτιών και γραφείων με οικολογικά προϊόντα. Εγγυημένο αποτέλεσμα και άψογη εξυπηρέτηση.",
      },
    ];
  };

  const handleRemoveProfessional = (id: string) => {
    // Filter out the professional to remove
    const updatedProfessionals = savedProfessionals.filter(pro => pro.id !== id);
    setSavedProfessionals(updatedProfessionals);
    
    // Update localStorage with the new list
    localStorage.setItem('savedProfessionals', JSON.stringify(updatedProfessionals));
  };

  const toggleContactInfo = (id: string) => {
    setShowContactInfo({
      ...showContactInfo,
      [id]: !showContactInfo[id]
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(5).fill(0).map((_, i) => (
          <FiStar 
            key={i} 
            className={`${
              i < fullStars 
                ? "text-yellow-400 fill-yellow-400" 
                : i === fullStars && hasHalfStar 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300"
            }`} 
          />
        ))}
        <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600]"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Αποθηκευμένοι Επαγγελματίες</h2>

      {savedProfessionals.length > 0 ? (
        <div className="space-y-4">
          {savedProfessionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl mr-3">
                      {professional.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{professional.name}</h3>
                      <p className="text-gray-600">{professional.profession}</p>
                      <div className="mt-1 flex items-center gap-4 text-sm">
                        <span className="flex items-center text-gray-500">
                          <FiMapPin className="mr-1" /> {professional.location}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4">
                        {renderStars(professional.rating)}
                        <span className="text-sm text-gray-500">
                          {professional.completedJobs} ολοκληρωμένες εργασίες
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => handleRemoveProfessional(professional.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Αφαίρεση από αποθηκευμένους"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedProfessional(
                          expandedProfessional === professional.id ? null : professional.id
                        )
                      }
                      className="mt-2 text-[#FB7600] hover:underline text-sm"
                    >
                      {expandedProfessional === professional.id ? "Λιγότερα" : "Περισσότερα"}
                    </button>
                  </div>
                </div>

                {expandedProfessional === professional.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {professional.bio && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-700 mb-1">Σχετικά</h4>
                        <p className="text-gray-600 text-sm">{professional.bio}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <button
                        onClick={() => toggleContactInfo(professional.id)}
                        className="px-3 py-1 border border-[#FB7600] text-[#FB7600] rounded-lg hover:bg-orange-50 text-sm"
                      >
                        {showContactInfo[professional.id] ? "Απόκρυψη επικοινωνίας" : "Προβολή επικοινωνίας"}
                      </button>
                      
                      <Link
                        href={`/customer/create-listing?professional=${professional.id}`}
                        className="px-3 py-1 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700 text-sm"
                      >
                        Δημιουργία Αγγελίας
                      </Link>
                    </div>
                    
                    {showContactInfo[professional.id] && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Στοιχεία Επικοινωνίας</h4>
                        {professional.phone && (
                          <p className="flex items-center text-gray-600 text-sm mb-1">
                            <FiPhone className="mr-2" /> {professional.phone}
                          </p>
                        )}
                        {professional.email && (
                          <p className="flex items-center text-gray-600 text-sm">
                            <FiMail className="mr-2" /> {professional.email}
                          </p>
                        )}
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
          <p className="text-gray-500">Δεν έχετε αποθηκεύσει επαγγελματίες.</p>
          <Link
            href="/search"
            className="mt-4 inline-block px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
          >
            Αναζήτηση Επαγγελματιών
          </Link>
        </div>
      )}
    </div>
  );
} 