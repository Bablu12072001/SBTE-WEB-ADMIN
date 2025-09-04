"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import useScreenSize from "../useScreenSize";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import CalendarFileTable from "./components/CalendarFileTable";
import CalendarTableTable from "./components/CalendarTableTable";

export default function AcademicCalendar() {
  const [activeTab, setActiveTab] = useState("files");
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
          <p className="text-xl font-semibold text-gray-600">
            Academic Calendar
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b lg:px-4 px-2">
          <button
            className={`py-2 ${
              activeTab === "files"
                ? "border-b-4 border-blue-500 text-slate-600 font-medium"
                : "text-gray-500 hover:font-medium"
            }`}
            onClick={() => setActiveTab("files")}
          >
            Files
          </button>
          <button
            className={`py-2 mx-2 ${
              activeTab === "table"
                ? "border-b-4 border-blue-500 text-slate-600 font-medium"
                : "text-gray-500 hover:font-medium"
            }`}
            onClick={() => setActiveTab("table")}
          >
            Table
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:px-4 px-2 py-4">
          <div className="lg:px-4 px-2 py-4">
            {activeTab === "files" && <CalendarFileTable />}
            {activeTab === "table" && <CalendarTableTable />}
          </div>
        </div>
      </div>
    </div>
  );
}
