"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  city?: string;
  postalCode?: string;
  imageUrl?: string;
}

export interface CustomerJobListing {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  postedDate: string;
  budget: string;
  status: "pending" | "assigned" | "in_progress" | "completed";
  applications: CustomerApplication[];
  assignedWorkerId?: string;
}

export interface CustomerApplication {
  id: string;
  workerName: string;
  workerId: string;
  message?: string;
  estimatedPrice?: string;
  status: "pending" | "accepted" | "rejected";
  profession?: string;
  rating?: number;
  completedJobs?: number;
  bio?: string;
  phone?: string;
  email?: string;
}

export interface CustomerCompletedListing {
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

export interface CustomerSavedProfessional {
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

interface CustomerContextType {
  customerData: CustomerData | null;
  customerListings: CustomerJobListing[];
  completedListings: CustomerCompletedListing[];
  savedProfessionals: CustomerSavedProfessional[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateCustomerData: (data: Partial<CustomerData>) => Promise<void>;
  addSavedProfessional: (professional: CustomerSavedProfessional) => void;
  removeSavedProfessional: (id: string) => void;
  updateListingStatus: (listingId: string, status: string) => void;
  addCompletedListing: (listing: CustomerCompletedListing) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomerContext must be used within a CustomerProvider");
  }
  return context;
};

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [customerListings, setCustomerListings] = useState<CustomerJobListing[]>([]);
  const [completedListings, setCompletedListings] = useState<CustomerCompletedListing[]>([]);
  const [savedProfessionals, setSavedProfessionals] = useState<CustomerSavedProfessional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customer data from localStorage and API
  const loadCustomerData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user email from localStorage
      const userEmail = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');

      if (!userEmail || !token) {
        // If no user data, load demo data
        loadDemoData();
        return;
      }

      // Fetch customer data from API
      const response = await fetch(`/api/customer/profile?email=${encodeURIComponent(userEmail)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerData(data.customer);
        setCustomerListings(data.listings || []);
        setCompletedListings(data.completedListings || []);
        setSavedProfessionals(data.savedProfessionals || []);
      } else {
        // If API fails, load demo data
        loadDemoData();
      }
    } catch (err) {
      console.error('Error loading customer data:', err);
      loadDemoData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoData = () => {
    // Load demo data for demonstration purposes
    setCustomerData({
      id: "customer1",
      name: "Ελένη Παπαδοπούλου",
      email: "eleni@example.com",
      phone: "6912345678",
      location: "Αθήνα, Κολωνάκι",
      city: "Αθήνα",
      postalCode: "10673"
    });

    // Load demo listings from localStorage or use defaults
    const storedListings = localStorage.getItem('activeListings');
    if (storedListings) {
      try {
        const parsedListings = JSON.parse(storedListings);
        setCustomerListings(parsedListings);
      } catch (error) {
        console.error('Error parsing stored listings:', error);
        setCustomerListings([]);
      }
    }

    // Load demo completed listings
    setCompletedListings([
      {
        id: "1",
        title: "Επισκευή πλυντηρίου",
        category: "APPLIANCE_REPAIR",
        location: "Αθήνα, Κολωνάκι",
        description: "Επισκευή πλυντηρίου Samsung",
        completionDate: "2024-05-10",
        budget: "80€",
        workerName: "Γιώργος Παπαδόπουλος",
        workerId: "worker1",
        rating: 5,
        feedback: "Άριστη δουλειά, επαγγελματική συμπεριφορά"
      },
      {
        id: "2",
        title: "Εγκατάσταση φωτιστικών",
        category: "ELECTRICIAN",
        location: "Αθήνα, Γλυφάδα",
        description: "Εγκατάσταση 5 φωτιστικών οροφής",
        completionDate: "2024-05-08",
        budget: "150€",
        workerName: "Νίκος Αντωνίου",
        workerId: "worker2",
        rating: 4,
        feedback: "Καλή δουλειά, μικρή καθυστέρηση"
      }
    ]);

    // Load demo saved professionals
    const storedProfessionals = localStorage.getItem('savedProfessionals');
    if (storedProfessionals) {
      try {
        const parsedProfessionals = JSON.parse(storedProfessionals);
        setSavedProfessionals(parsedProfessionals);
      } catch (error) {
        console.error('Error parsing stored professionals:', error);
        setSavedProfessionals([]);
      }
    }
  };

  const refreshData = async () => {
    await loadCustomerData();
  };

  const updateCustomerData = async (data: Partial<CustomerData>) => {
    if (customerData) {
      const updatedData = { ...customerData, ...data };
      setCustomerData(updatedData);
      
      // In a real app, this would make an API call to update the database
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        if (token && userEmail) {
          await fetch('/api/customer/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ...data,
              email: userEmail
            })
          });
        }
      } catch (error) {
        console.error('Error updating customer data:', error);
      }
    }
  };

  const addSavedProfessional = (professional: CustomerSavedProfessional) => {
    setSavedProfessionals(prev => {
      const updated = [...prev, professional];
      localStorage.setItem('savedProfessionals', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSavedProfessional = (id: string) => {
    setSavedProfessionals(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('savedProfessionals', JSON.stringify(updated));
      return updated;
    });
  };

  const updateListingStatus = (listingId: string, status: string) => {
    setCustomerListings(prev => {
      const updated = prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: status as "pending" | "assigned" | "in_progress" | "completed" }
          : listing
      );
      localStorage.setItem('activeListings', JSON.stringify(updated));
      return updated;
    });
  };

  const addCompletedListing = (listing: CustomerCompletedListing) => {
    setCompletedListings(prev => [...prev, listing]);
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customerData,
        customerListings,
        completedListings,
        savedProfessionals,
        isLoading,
        error,
        refreshData,
        updateCustomerData,
        addSavedProfessional,
        removeSavedProfessional,
        updateListingStatus,
        addCompletedListing,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}; 