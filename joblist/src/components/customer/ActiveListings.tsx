"use client";
import React, { useState, useEffect } from "react";
import { FiMapPin, FiCalendar, FiTag, FiMessageSquare, FiStar, FiX, FiPhone, FiMail, FiBookmark, FiPlus } from "react-icons/fi";
import { useChatContext } from "@/contexts/ChatContext";
import { useRouter } from "next/navigation";

interface Application {
  id: string;
  workerId: string;
  workerName: string;
  message?: string;
  date: string;
  estimatedPrice?: string;
  rating?: number;
  completedJobs?: number;
  profession?: string;
  bio?: string;
  phone?: string;
  email?: string;
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

// Modal component for displaying worker profile
const WorkerProfileModal = ({ 
  worker, 
  onClose, 
  onSave,
  renderStars 
}: { 
  worker: Application, 
  onClose: () => void, 
  onSave: (worker: Application) => void,
  renderStars: (rating: number) => React.ReactNode
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl mr-3">
                {worker.workerName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{worker.workerName}</h3>
                {worker.profession && (
                  <p className="text-gray-600">{worker.profession}</p>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="mb-4">
            {worker.rating && (
              <div className="mb-2">
                {renderStars(worker.rating)}
              </div>
            )}
            {worker.completedJobs && (
              <p className="text-sm text-gray-600 mb-3">
                {worker.completedJobs} ολοκληρωμένες εργασίες
              </p>
            )}
            {worker.bio && (
              <div className="mb-4 border-t border-gray-100 pt-3">
                <h4 className="font-medium text-gray-700 mb-2">Περιγραφή</h4>
                <p className="text-gray-600">{worker.bio}</p>
              </div>
            )}
          </div>
          
          <div className="mb-4 border-t border-gray-100 pt-3">
            <h4 className="font-medium text-gray-700 mb-2">Στοιχεία Επικοινωνίας</h4>
            {worker.phone && (
              <p className="flex items-center text-gray-600 text-sm mb-2">
                <FiPhone className="mr-2" /> {worker.phone || "Μη διαθέσιμο"}
              </p>
            )}
            {worker.email && (
              <p className="flex items-center text-gray-600 text-sm">
                <FiMail className="mr-2" /> {worker.email || "Μη διαθέσιμο"}
              </p>
            )}
            {!worker.phone && !worker.email && (
              <p className="text-gray-500 text-sm italic">
                Τα στοιχεία επικοινωνίας θα είναι διαθέσιμα μετά την ανάθεση της εργασίας.
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Κλείσιμο
            </button>
            <button
              onClick={() => onSave(worker)}
              className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700 flex items-center"
            >
              <FiBookmark className="mr-2" /> Αποθήκευση
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ActiveListings() {
  const { startConversation } = useChatContext();
  const router = useRouter();

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
          estimatedPrice: "65€",
          rating: 4.8,
          completedJobs: 127,
          profession: "Υδραυλικός",
          bio: "Επαγγελματίας υδραυλικός με 15 χρόνια εμπειρίας. Εξειδίκευση σε επισκευές και εγκαταστάσεις σε κατοικίες και επαγγελματικούς χώρους.",
          phone: "6912345678",
          email: "giorgos@example.com"
        },
        {
          id: "a2",
          workerId: "w2",
          workerName: "Νίκος Αντωνίου",
          message: "Μπορώ να έρθω σήμερα το απόγευμα για να δω το πρόβλημα.",
          date: "2024-05-19",
          estimatedPrice: "70€",
          rating: 4.6,
          completedJobs: 98,
          profession: "Υδραυλικός",
          bio: "Πιστοποιημένος υδραυλικός με εμπειρία σε οικιακές και βιομηχανικές εγκαταστάσεις. Άμεση εξυπηρέτηση και ποιοτική δουλειά.",
          phone: "6923456789",
          email: "nikos@example.com"
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
          estimatedPrice: "100€",
          rating: 4.9,
          completedJobs: 156,
          profession: "Τεχνικός Ψύξης/Θέρμανσης",
          bio: "Εξειδικευμένος τεχνικός με πιστοποιήσεις σε όλες τις μεγάλες μάρκες κλιματιστικών. Παρέχω εγγύηση καλής λειτουργίας για όλες τις εργασίες.",
          phone: "6934567890",
          email: "kostas@example.com"
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
          profession: "Ελαιοχρωματιστής",
          completedJobs: 89,
          rating: 4.7,
          bio: "Επαγγελματίας ελαιοχρωματιστής με πολυετή εμπειρία. Εξειδίκευση σε οικιακές και επαγγελματικές βαφές.",
          phone: "6945678901",
          email: "mixalis@example.com"
        },
      ],
      assignedWorkerId: "w4",
    },
  ]);

  // Load listings from localStorage on component mount
  useEffect(() => {
    try {
      const storedListings = localStorage.getItem('activeListings');
      if (storedListings) {
        // Parse the stored listings
        const parsedListings = JSON.parse(storedListings);
        
        // If there are new listings, add them to the existing mock data
        if (parsedListings && parsedListings.length > 0) {
          // Create a map of existing listing IDs to avoid duplicates
          const existingListingIds = new Set(activeListings.map(listing => listing.id));
          
          // Filter out any listings that already exist in our mock data
          const newListings = parsedListings.filter(
            (listing: Partial<Listing>) => !existingListingIds.has(listing.id || '')
          );
          
          // If there are new listings, add them to the state
          if (newListings.length > 0) {
            setActiveListings(prevListings => [
              ...newListings.map((listing: Partial<Listing>) => ({
                id: listing.id || `new_${Date.now()}`,
                title: listing.title || 'Νέα Αγγελία',
                category: listing.category || 'Γενικά',
                location: listing.location || 'Δεν καθορίστηκε',
                description: listing.description || '',
                postedDate: listing.postedDate || new Date().toISOString().split('T')[0],
                budget: listing.budget || 'Αναμένεται προσφορά',
                status: listing.status || 'pending',
                applications: listing.applications || [],
                assignedWorkerId: listing.assignedWorkerId
              })),
              ...prevListings,
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading listings from localStorage:', error);
    }
  }, []);

  // Update localStorage when listings change
  useEffect(() => {
    try {
      localStorage.setItem('activeListings', JSON.stringify(activeListings));
    } catch (error) {
      console.error('Error saving listings to localStorage:', error);
    }
  }, [activeListings]);

  const [expandedListing, setExpandedListing] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Application | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalWorker, setModalWorker] = useState<Application | null>(null);
  const [savedWorkers, setSavedWorkers] = useState<string[]>([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState<string | null>(null);

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array(5).fill(0).map((_, i) => (
          <FiStar 
            key={i} 
            className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
        <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Function to handle messaging an assigned worker
  const handleMessageWorker = (listing: Listing) => {
    if (!listing.assignedWorkerId) return;
    
    // Find the assigned worker's details
    const assignedWorker = listing.applications.find(app => app.workerId === listing.assignedWorkerId);
    if (!assignedWorker) return;

    // Start or get existing conversation
    const conversationId = startConversation({
      workerId: assignedWorker.workerId,
      customerId: "customer1", // Mock ID - in a real app, this would come from auth context
      workerName: assignedWorker.workerName,
      customerName: "Current Customer", // Mock name - in a real app, this would come from auth context
      jobId: listing.id
    });

    // Navigate to the chat tab
    // In a real app with Next.js app router, we'd use router.push
    // But since we're using a tab-based UI within the same page:
    if (typeof window !== 'undefined') {
      // Store the active conversation ID for the chat component to use
      localStorage.setItem('activeConversationId', conversationId);
      
      // Find the parent component's setActiveTab function
      const event = new CustomEvent('navigateToChat', { detail: { conversationId } });
      window.dispatchEvent(event);
      
      // Navigate to customer chat page
      router.push('/customer/profile?tab=chat');
    }
  };

  // Handle opening worker profile modal
  const handleOpenProfileModal = (worker: Application) => {
    setModalWorker(worker);
    setShowProfileModal(true);
  };

  // Handle saving worker to favorites
  const handleSaveWorker = (worker: Application) => {
    // In a real app, this would make an API call to save the worker to the user's favorites
    // For now, we'll just store the worker IDs in state
    if (!savedWorkers.includes(worker.workerId)) {
      setSavedWorkers([...savedWorkers, worker.workerId]);
      
      // Save to localStorage to persist between page refreshes (and make it available to SavedProfessionals.tsx)
      const savedProfessionalsString = localStorage.getItem('savedProfessionals');
      const savedProfessionals = savedProfessionalsString ? JSON.parse(savedProfessionalsString) : [];
      
      // Format the worker data to match the Professional interface in SavedProfessionals.tsx
      const professionalToSave: Professional = {
        id: worker.workerId,
        name: worker.workerName,
        profession: worker.profession || "Επαγγελματίας",
        location: "Αθήνα", // Default location since we don't have this in the Application interface
        rating: worker.rating || 0,
        completedJobs: worker.completedJobs || 0,
        phone: worker.phone,
        email: worker.email,
        bio: worker.bio
      };
      
      // Add to saved professionals if not already exists
      if (!savedProfessionals.some((p: Professional) => p.id === worker.workerId)) {
        savedProfessionals.push(professionalToSave);
        localStorage.setItem('savedProfessionals', JSON.stringify(savedProfessionals));
      }
      
      // Show success message
      setShowSaveSuccess(worker.workerId);
      setTimeout(() => setShowSaveSuccess(null), 3000);
    }
    
    // Close the modal
    setShowProfileModal(false);
  };

  // Function to handle creating a new listing
  const handleCreateNewListing = () => {
    // Navigate to the customer create listing page
    // We'll add a query parameter to indicate that the user is already logged in
    router.push('/customer?isLoggedIn=true');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ενεργές Αγγελίες</h2>
        <button 
          onClick={handleCreateNewListing}
          className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-[#77400f] flex items-center"
        >
          <FiPlus className="mr-1" /> Νέα Αγγελία
        </button>
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
                  <div className="flex items-center gap-2">
                    {(listing.status === "assigned" || listing.status === "in_progress") && listing.assignedWorkerId && (
                      <button
                        onClick={() => handleMessageWorker(listing)}
                        className="flex items-center px-3 py-1 bg-[#FB7600] text-white text-sm rounded-lg hover:bg-[#77400f]"
                      >
                        <FiMessageSquare className="mr-1" /> Μήνυμα στον επαγγελματία
                      </button>
                    )}
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
                              <div 
                                className="flex items-center relative"
                                onMouseEnter={() => setSelectedWorker(application)}
                                onMouseLeave={() => setSelectedWorker(null)}
                              >
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3 cursor-pointer">
                                  {application.workerName.charAt(0)}
                                </div>
                                <div>
                                  <p 
                                    className="font-medium cursor-pointer text-gray-700 hover:text-[#FB7600]" 
                                    onClick={() => handleOpenProfileModal(application)}
                                  >
                                    {application.workerName}
                                    {showSaveSuccess === application.workerId && (
                                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        Αποθηκεύτηκε ✓
                                      </span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">
                                      {formatDate(application.date)}
                                    </p>
                                    {application.estimatedPrice && (
                                      <p className="text-sm font-medium text-[#FB7600]">
                                        Εκτίμηση: {application.estimatedPrice}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {selectedWorker?.id === application.id && (
                                  <div className="absolute top-0 left-0 mt-12 z-10 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-semibold">{application.workerName}</h5>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedWorker(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <FiX />
                                      </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{application.profession}</p>
                                    {application.rating && (
                                      <div className="mb-2">
                                        {renderStars(application.rating)}
                                      </div>
                                    )}
                                    {application.completedJobs && (
                                      <p className="text-sm text-gray-600 mb-2">
                                        {application.completedJobs} ολοκληρωμένες εργασίες
                                      </p>
                                    )}
                                    {application.bio && (
                                      <p className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">
                                        {application.bio}
                                      </p>
                                    )}
                                    <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenProfileModal(application);
                                        }}
                                        className="text-sm text-blue-600 hover:underline"
                                      >
                                        Προβολή προφίλ
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSaveWorker(application);
                                        }}
                                        className="text-sm flex items-center text-[#FB7600] hover:underline"
                                        disabled={savedWorkers.includes(application.workerId)}
                                      >
                                        <FiBookmark className="mr-1" />
                                        {savedWorkers.includes(application.workerId) ? "Αποθηκευμένο" : "Αποθήκευση"}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
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
                                {listing.assignedWorkerId === application.workerId && (
                                  <button
                                    onClick={() => handleMessageWorker(listing)}
                                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                  >
                                    <FiMessageSquare className="mr-1" /> Μήνυμα
                                  </button>
                                )}
                              </div>
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
          <button
            onClick={handleCreateNewListing}
            className="mt-4 inline-flex items-center px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-[#77400f]"
          >
            <FiPlus className="mr-1" /> Δημιουργία Αγγελίας
          </button>
        </div>
      )}

      {/* Worker Profile Modal */}
      {showProfileModal && modalWorker && (
        <WorkerProfileModal 
          worker={modalWorker} 
          onClose={() => setShowProfileModal(false)}
          onSave={handleSaveWorker}
          renderStars={renderStars}
        />
      )}
    </div>
  );
} 