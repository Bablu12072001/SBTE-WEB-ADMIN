"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import useScreenSize from "../useScreenSize";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import CompaniesTable from "./components/CompaniesTable";
import JobsTable from "./components/JobsTable";

export default function Approvals() {
  const [activeTab, setActiveTab] = useState("companies");
  const [expanded, setExpanded] = useState(false);
  // const router = useRouter();

  const isSmallScreen = useScreenSize();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto gap-4 bg-slate-100 transition-all duration-300 ${
          expanded && !isSmallScreen ? "ml-56" : "ml-16 lg:ml-20"
        } ${isSmallScreen && expanded ? "ml-0" : ""}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-100">
          <DashboardHeader />
        </div>

        {/* Tabs */}
        <div className="flex flex-col md:flex-row justify-between mb-1 lg:px-4 px-2">
          <p className="text-xl font-semibold text-gray-600">Approvals</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b lg:px-4 px-2">
          <button
            className={`py-2 ${
              activeTab === "companies"
                ? "border-b-4 border-blue-500 text-slate-600 font-medium"
                : "text-gray-500 hover:font-medium"
            }`}
            onClick={() => setActiveTab("companies")}
          >
            Companies
          </button>
          <button
            className={`py-2 mx-2 ${
              activeTab === "jobs"
                ? "border-b-4 border-blue-500 text-slate-600 font-medium"
                : "text-gray-500 hover:font-medium"
            }`}
            onClick={() => setActiveTab("jobs")}
          >
            Jobs
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:px-4 px-2 py-4">
          <div className="lg:px-4 px-2 py-4">
            {activeTab === "companies" && <CompaniesTable />}
            {activeTab === "jobs" && <JobsTable />}
          </div>
        </div>
      </div>
    </div>
  );
}
