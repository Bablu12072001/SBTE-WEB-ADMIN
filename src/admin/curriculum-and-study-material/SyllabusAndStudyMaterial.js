"use client";

import { useState } from "react";

import useScreenSize from "../useScreenSize";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import SyllabusTable from "./components/SyllabusTable";
import StudyMaterialTable from "./components/StudyMaterialTable";
import AvailableCoursesTable from "./components/AvailableCoursesTable";
import PreviousYearQPTable from "./components/PreviousYearQP/PreviousYearQPTable";
import QAKeyTable from "./components/QAKey/QAKeyTable";
import BulkUploadDialog from "./components/BulkUpload/BulkUploadDialog";
import SampleDownloadModal from "./components/SamplePDF/SampleDownloadModal";
import Feedback from "./components/feedback/Feedback";

export default function SyllabusAndStudyMaterial() {
  const [activeTab, setActiveTab] = useState("curriculum");
  const [expanded, setExpanded] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);

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
        <div className="flex flex-col md:flex-row justify-between mb-1 lg:px-4 px-2 items-center">
          <p className="text-xl font-semibold text-gray-600">
            Curriculum, E-content & Virtual Labs
          </p>
          <div className="flex gap-x-2 mt-2 md:mt-2">
            <button
              onClick={() => setIsSampleOpen(true)}
              className="bg-blue-50 hover:bg-blue-200 text-blue-600 font-medium px-4 py-2 rounded border border-blue-600 transition-colors"
            >
              Sample Download
            </button>
            <button
              onClick={() => setIsBulkOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
            >
              Bulk Upload
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b lg:px-4 px-2">
          <button
            className={`py-2 ${
              activeTab === "curriculum"
                ? "border-b-4 border-blue-500 text-blue-900 font-medium"
                : "text-gray-500 hover:text-blue-800"
            }`}
            onClick={() => setActiveTab("curriculum")}
          >
            Curriculum
          </button>
          <button
            className={`py-2 mx-2 ${
              activeTab === "study-material"
                ? "border-b-4 border-blue-500 text-blue-900 font-medium"
                : "text-gray-500 hover:text-blue-800"
            }`}
            onClick={() => setActiveTab("study-material")}
          >
            E-content & Virtual Labs
          </button>
          <button
            className={`py-2 mx-2 ${
              activeTab === "available-courses"
                ? "border-b-4 border-blue-500 text-blue-900 font-medium"
                : "text-gray-500 hover:text-blue-800"
            }`}
            onClick={() => setActiveTab("available-courses")}
          >
            Available Courses
          </button>
          <button
            className={`py-2 mx-2 ${
              activeTab === "previous-year-qp"
                ? "border-b-4 border-blue-500 text-blue-900 font-medium"
                : "text-gray-500 hover:text-blue-800"
            }`}
            onClick={() => setActiveTab("previous-year-qp")}
          >
            Previous Year QP
          </button>
          <button
            className={`py-2 mx-2 ${
              activeTab === "qa-key"
                ? "border-b-4 border-blue-500 text-blue-900 font-medium"
                : "text-gray-500 hover:text-blue-800"
            }`}
            onClick={() => setActiveTab("qa-key")}
          >
            Q&#47;A Key
          </button>
          <button
            className={`py-2 mx-2 ${
              activeTab === "feedbacks"
                ? "border-b-4 border-blue-500 text-blue-900 font-medium"
                : "text-gray-500 hover:text-blue-800"
            }`}
            onClick={() => setActiveTab("feedbacks")}
          >
            Feedbacks
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:px-4 px-2 py-4">
          <div className="lg:px-4 px-2 py-4">
            {activeTab === "curriculum" && <SyllabusTable />}
            {activeTab === "study-material" && <StudyMaterialTable />}
            {activeTab === "available-courses" && <AvailableCoursesTable />}
            {activeTab === "previous-year-qp" && <PreviousYearQPTable />}
            {activeTab === "qa-key" && <QAKeyTable />}
            {activeTab === "feedbacks" && <Feedback />}
          </div>
        </div>
      </div>
      <BulkUploadDialog isOpen={isBulkOpen} setIsOpen={setIsBulkOpen} />
      {isSampleOpen && (
        <SampleDownloadModal onClose={() => setIsSampleOpen(false)} />
      )}
    </div>
  );
}
