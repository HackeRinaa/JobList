"use client";
import React, { useState, useEffect, createContext } from "react";
import { useRouter } from "next/navigation";
import FloatingNavbar from "@/components/Navbar";
import WorkerSidebar from "@/components/worker/WorkerSidebar";
import WorkerProfile from "@/components/worker/WorkerProfile";
import TokensPanel from "@/components/worker/TokensPanel";
import JobListings from "@/components/worker/JobListings";
import CompletedJobs from "@/components/worker/CompletedJobs";
import UpgradeSubscription from "@/components/worker/UpgradeSubscription";
import WorkerChat from "@/components/worker/WorkerChat";
import { UserData } from "@/types/user";

// Create the context
export const UserContext = createContext<UserData | null>(null);

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Check if we have a session token
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        
        if (!token || !userEmail) {
          // If no token or email, redirect to login
          router.replace('/login');
          return;
        }

        // Fetch user data with the token
        const response = await fetch(`/api/worker/profile?email=${encodeURIComponent(userEmail)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          // If unauthorized, clear storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          router.replace('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-[#FB7600] hover:underline"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!userData) {
      return null;
    }

    switch (activeTab) {
      case "profile":
        return <WorkerProfile userData={userData} />;
      case "credits":
        return <TokensPanel />;
      case "listings":
        return <JobListings />;
      case "completed":
        return <CompletedJobs />;
      case "upgrade":
        return <UpgradeSubscription />;
      case "chat":
        return <WorkerChat />;
      default:
        return <WorkerProfile userData={userData} />;
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <UserContext.Provider value={userData}>
      <div className="min-h-screen bg-gray-50">
        <FloatingNavbar />
        <div className="container mx-auto pt-20 sm:pt-24 px-3 sm:px-4 pb-10">
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex justify-between items-center mb-4 bg-white rounded-lg shadow-sm p-3">
            <h1 className="text-lg font-semibold text-gray-800">
              {activeTab === "profile" && "Προφίλ"}
              {activeTab === "credits" && "Credits"}
              {activeTab === "listings" && "Διαθέσιμες Αγγελίες"}
              {activeTab === "completed" && "Ολοκληρωμένες Εργασίες"}
              {activeTab === "upgrade" && "Αναβάθμιση"}
              {activeTab === "chat" && "Συνομιλίες"}
            </h1>
            <button
              onClick={toggleMobileMenu}
              className="bg-[#FB7600] text-white px-3 py-1 rounded-md"
            >
              {mobileMenuOpen ? "Κλείσιμο" : "Μενού"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            {/* Sidebar - Desktop always visible, mobile conditional */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
              <WorkerSidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-3 sm:p-6 overflow-x-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
} 