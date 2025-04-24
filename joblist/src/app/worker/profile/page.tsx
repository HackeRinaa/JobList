"use client";
import React, { useState } from "react";
import FloatingNavbar from "@/components/Navbar";
import WorkerSidebar from "@/components/worker/WorkerSidebar";
import WorkerProfile from "@/components/worker/WorkerProfile";
import TokensPanel from "@/components/worker/TokensPanel";
import JobListings from "@/components/worker/JobListings";
import CompletedJobs from "@/components/worker/CompletedJobs";
import UpgradeSubscription from "@/components/worker/UpgradeSubscription";
import WorkerChat from "@/components/worker/WorkerChat";

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <WorkerProfile />;
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
        return <WorkerProfile />;
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
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
  );
} 