"use client";
import React, { useState } from "react";
import FloatingNavbar from "@/components/Navbar";
import WorkerSidebar from "@/components/worker/WorkerSidebar";
import WorkerProfile from "@/components/worker/WorkerProfile";
import TokensPanel from "@/components/worker/TokensPanel";
import JobListings from "@/components/worker/JobListings";
import CompletedJobs from "@/components/worker/CompletedJobs";
import UpgradeSubscription from "@/components/worker/UpgradeSubscription";

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <WorkerProfile />;
      case "tokens":
        return <TokensPanel />;
      case "listings":
        return <JobListings />;
      case "completed":
        return <CompletedJobs />;
      case "upgrade":
        return <UpgradeSubscription />;
      default:
        return <WorkerProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FloatingNavbar />
      <div className="container mx-auto pt-24 px-4 pb-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <WorkerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 