"use client";
import React, { useState } from "react";
import FloatingNavbar from "@/components/Navbar";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import CustomerProfile from "@/components/customer/CustomerProfile";
import ActiveListings from "@/components/customer/ActiveListings";
import CompletedListings from "@/components/customer/CompletedListings";
import SavedProfessionals from "@/components/customer/SavedProfessionals";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <CustomerProfile />;
      case "active":
        return <ActiveListings />;
      case "completed":
        return <CompletedListings />;
      case "saved":
        return <SavedProfessionals />;
      default:
        return <CustomerProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FloatingNavbar />
      <div className="container mx-auto pt-24 px-4 pb-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <CustomerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 