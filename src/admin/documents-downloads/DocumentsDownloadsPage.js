"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import useScreenSize from "../useScreenSize";
import OfficialLettersTable from "./components/OfficialLettersTable";
import OfficialLettersFormModal from "./components/OfficialLettersFormModal";
import DownloadsTable from "./components/DownloadsTable"; // Import the updated table
import DownloadsFormModal from "./components/DownloadsFormModal"; // Import the updated modal
import SOPSUserManualsTable from "./components/SOPSUserManualsTable";
import SOPSManualFormModal from "./components/SOPSManualFormModal";
import ActsCircularTable from "./components/ActsCircularTable";
import ActsCircularFormModal from "./components/ActsCircularFormModal";
import AddSbteNormModal from "./components/sbte-norm/AddSbteNormModal";
import SbteNormsTable from "./components/sbte-norm/SbteNormTable";

export default function DocumentsDownloadsPage() {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("Official Letters");
  const [globalSuccessMessage, setGlobalSuccessMessage] = useState("");

  // --- Downloads State ---
  const [showDownloadsModal, setShowDownloadsModal] = useState(false);
  const [currentDownloadForEdit, setCurrentDownloadForEdit] = useState(null);
  const [refreshDownloadsTable, setRefreshDownloadsTable] = useState(0); // Renamed from onDataChange for clarity and consistency

  // --- Acts & Circular State ---
  const [showActsCircularModal, setShowActsCircularModal] = useState(false);
  const [currentCircularForEdit, setCurrentCircularForEdit] = useState(null);
  const [activeCircularType, setActiveCircularType] = useState("");
  const [refreshActsCircularTable, setRefreshActsCircularTable] = useState(0);

  // --- SOPs & User Manuals State ---
  const [showSOPSManualModal, setShowSOPSManualModal] = useState(false);
  const [currentSOPManualForEdit, setCurrentSOPManualForEdit] = useState(null);
  const [refreshSOPSManualTable, setRefreshSOPSManualTable] = useState(0);

  const [showSbteNormModal, setShowSbteNormModal] = useState(false);
  const [currentSbteNormForEdit, setCurrentSbteNormForEdit] = useState(null);
  const [refreshSbteNormTable, setRefreshSbteNormTable] = useState(0);

  // --- Official Letters State ---
  const [showOfficialLettersModal, setShowOfficialLettersModal] =
    useState(false);
  const [currentOfficialLetterForEdit, setCurrentOfficialLetterForEdit] =
    useState(null);
  const [refreshOfficialLettersTable, setRefreshOfficialLettersTable] =
    useState(0);

  const isSmallScreen = useScreenSize();

  const tabs = [
    "Official Letters",
    "SOPs & User Manuals",
    "Downloads",
    "SBTE-Norms",
    "DSTTE-Norms",
  ];

  // Global success message handler
  const handleGlobalSuccessWithMessage = (message) => {
    setGlobalSuccessMessage(message);
    setTimeout(() => {
      setGlobalSuccessMessage("");
    }, 3000);
  };

  // --- Handlers for Downloads ---
  const handleAddDownloadClick = () => {
    setCurrentDownloadForEdit(null); // Ensure no edit data for new entry
    setShowDownloadsModal(true);
  };

  const handleEditDownload = (download) => {
    setCurrentDownloadForEdit(download);
    setShowDownloadsModal(true);
  };

  const handleDownloadDataChange = () => {
    setRefreshDownloadsTable((prev) => prev + 1); // Increment to trigger refetch
    setShowDownloadsModal(false); // Close modal on success
    setCurrentDownloadForEdit(null); // Clear edit data after successful operation
  };

  // --- Handlers for Acts & Circular (SBTE Norms / DSTTE Norms) ---
  const handleAddActsCircularClick = (type) => {
    setCurrentCircularForEdit(null);
    setActiveCircularType(type);
    setShowActsCircularModal(true);
  };

  const handleAddSbteNormClick = (type) => {
    setCurrentSbteNormForEdit(null);
    setShowSbteNormModal(true);
  };

  const handleEditActsCircular = (circular) => {
    setCurrentCircularForEdit(circular);
    setActiveCircularType(circular.type);
    setShowActsCircularModal(true);
  };

  const handleActsCircularDataChange = () => {
    setRefreshActsCircularTable((prev) => prev + 1);
    setShowActsCircularModal(false); // Close modal on success
  };

  // --- Handlers for SOPs & User Manuals ---
  const handleAddSOPSManualClick = () => {
    setCurrentSOPManualForEdit(null);
    setShowSOPSManualModal(true);
  };

  const handleEditSOPSManual = (manual) => {
    setCurrentSOPManualForEdit(manual);
    setShowSOPSManualModal(true);
  };

  const handleSOPSManualDataChange = () => {
    setRefreshSOPSManualTable((prev) => prev + 1);
    setShowSOPSManualModal(false); // Close modal
  };

  // --- Handlers for Official Letters ---
  const handleAddOfficialLetterClick = () => {
    setCurrentOfficialLetterForEdit(null);
    setShowOfficialLettersModal(true);
  };

  const handleEditOfficialLetter = (letter) => {
    setCurrentOfficialLetterForEdit(letter);
    setShowOfficialLettersModal(true);
  };

  const handleOfficialLetterDataChange = () => {
    setRefreshOfficialLettersTable((prev) => prev + 1);
    setShowOfficialLettersModal(false); // Close modal
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto gap-4 bg-[#F4EEFF] transition-all duration-300 ${
          expanded && !isSmallScreen ? "ml-56" : "ml-12 lg:ml-16"
        } ${isSmallScreen && expanded ? "ml-0" : ""}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#F4EEFF]">
          <DashboardHeader />
        </div>

        {/* Global Success Message Display */}
        {globalSuccessMessage && (
          <div className="bg-green-500 text-white p-3 rounded mb-4 text-center mx-4">
            {globalSuccessMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 mx-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content with Add Button for Each Tab */}
        <div className="px-4">
          <div className="flex justify-between mb-4">
            <p className="text-xl font-semibold text-gray-600">{activeTab}</p>

            {activeTab === "Official Letters" && (
              <button
                className="bg-blue-900 text-white px-4 py-1 rounded-lg"
                onClick={handleAddOfficialLetterClick}
              >
                Add Official Letter
              </button>
            )}

            {activeTab === "SOPs & User Manuals" && (
              <button
                className="bg-blue-900 text-white px-4 py-1 rounded-lg"
                onClick={handleAddSOPSManualClick}
              >
                Add SOPs & User Manuals
              </button>
            )}
            {activeTab === "Downloads" && (
              <button
                className="bg-blue-900 text-white px-4 py-1 rounded-lg"
                onClick={handleAddDownloadClick}
              >
                Add Download
              </button>
            )}
            {activeTab === "SBTE-Norms" && (
              <button
                className="bg-blue-900 text-white px-4 py-1 rounded-lg"
                onClick={() => {
                  handleAddSbteNormClick(); // This sets setShowSbteNormModal(true)
                }}
              >
                Add SBTE Norm
              </button>
            )}

            {activeTab === "DSTTE-Norms" && (
              <button
                className="bg-blue-900 text-white px-4 py-1 rounded-lg"
                onClick={() => handleAddActsCircularClick("DSTTE Norm")}
              >
                Add DSTTE Norm
              </button>
            )}
          </div>

          {/* Conditional rendering of tables based on activeTab */}
          {activeTab === "Official Letters" && (
            <OfficialLettersTable
              refreshTrigger={refreshOfficialLettersTable}
              onEdit={handleEditOfficialLetter}
              onSuccessWithMessage={handleGlobalSuccessWithMessage}
            />
          )}
          {activeTab === "SOPs & User Manuals" && (
            <SOPSUserManualsTable
              refreshTrigger={refreshSOPSManualTable}
              onSuccessWithMessage={handleGlobalSuccessWithMessage}
            />
          )}
          {activeTab === "Downloads" && (
            <DownloadsTable
              onEdit={handleEditDownload}
              refreshTrigger={refreshDownloadsTable} // Changed to refreshTrigger
              onSuccessWithMessage={handleGlobalSuccessWithMessage}
            />
          )}
          {activeTab === "SBTE-Norms" && <SbteNormsTable />}
          {activeTab === "DSTTE-Norms" && (
            <ActsCircularTable
              type="DSTTE Norms"
              onEdit={handleEditActsCircular}
              onDataChange={handleActsCircularDataChange} // onDataChange here is correct if ActsCircularTable uses it
              onSuccessWithMessage={handleGlobalSuccessWithMessage}
            />
          )}
        </div>
      </div>
      {/* --- Modals --- */}
      {/* Downloads Form Modal */}
      <DownloadsFormModal
        isOpen={showDownloadsModal}
        setIsOpen={setShowDownloadsModal}
        currentDownload={currentDownloadForEdit}
        onSuccess={handleDownloadDataChange} // This will trigger refreshDownloadsTable and close modal
        onSuccessWithMessage={handleGlobalSuccessWithMessage} // Pass global message handler
      />
      {/* Acts & Circular Form Modal (for SBTE Norms / DSTTE Norms) */}
      <ActsCircularFormModal
        isOpen={showActsCircularModal}
        setIsOpen={setShowActsCircularModal}
        currentCircular={currentCircularForEdit}
        circularType={activeCircularType}
        onSuccess={handleActsCircularDataChange}
        onSuccessWithMessage={handleGlobalSuccessWithMessage}
      />
      {/* Official Letters Modal */}
      <OfficialLettersFormModal
        isOpen={showOfficialLettersModal}
        setIsOpen={setShowOfficialLettersModal}
        editData={currentOfficialLetterForEdit}
        onSuccess={handleOfficialLetterDataChange}
        onSuccessWithMessage={handleGlobalSuccessWithMessage}
      />
      {/* SOPs & User Manuals Form Modal */}
      <SOPSManualFormModal
        isOpen={showSOPSManualModal}
        onClose={() => {
          setShowSOPSManualModal(false);
          setCurrentSOPManualForEdit(null);
        }}
        editData={currentSOPManualForEdit}
        refreshData={handleSOPSManualDataChange}
        onSuccessWithMessage={handleGlobalSuccessWithMessage}
      />
      <AddSbteNormModal
        isOpen={showSbteNormModal}
        setIsOpen={setShowSbteNormModal}
        currentNorm={currentSbteNormForEdit}
        onSuccess={() => {
          setRefreshSbteNormTable((prev) => prev + 1);
          setShowSbteNormModal(false);
          setCurrentSbteNormForEdit(null);
        }}
      />
    </div>
  );
}
