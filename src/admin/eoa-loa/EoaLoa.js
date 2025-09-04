import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import useScreenSize from "../useScreenSize";
import EOALOATable from "./components/EOALOATable";
import EOALOAFormModal from "./components/EOALOAFormModal";
import BulkUploadDialog from "./components/BulkUpload/BulkUploadDialog";
import SampleDownloadModal from "./components/sampleFile/SampleDownload";

const EoaLoaPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);

  const isSmallScreen = useScreenSize();

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
  };

  const handleSuccessWithMessage = (message) => {
    setSuccessMessage(message);
    handleSuccess();
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

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

        {/* Page Heading & Add Button */}
        <div className="flex flex-col md:flex-row justify-between mb-1 px-4 mt-4">
          <p className="text-xl font-semibold text-gray-600">EOA/LOA</p>
          <div className="flex gap-3">
            <button
              className="bg-blue-900 text-white px-4 py-1 rounded-lg mt-2 md:mt-0"
              onClick={() => setShowModal(true)}
            >
              Add New
            </button>
            <button
              onClick={() => setIsSampleOpen(true)}
              className="bg-blue-50 hover:bg-blue-200 text-blue-600 font-medium px-4 py-2 rounded border border-blue-600 transition-colors"
            >
              Sample Download
            </button>

            <button
              onClick={() => setIsBulkOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg mt-2 md:mt-0"
            >
              Bulk Upload
            </button>
          </div>
        </div>

        {/* Global Success Message */}
        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded mb-4 text-center mx-4">
            {successMessage}
          </div>
        )}

        {/* Table Section */}
        <EOALOATable
          refreshTrigger={refreshKey}
          onSuccessWithMessage={handleSuccessWithMessage}
        />
      </div>

      {/* Modal for Add/Edit */}
      <EOALOAFormModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        data={null}
        isEdit={false}
        onSuccess={handleSuccess}
        onSuccessWithMessage={handleSuccessWithMessage}
      />

      <BulkUploadDialog isOpen={isBulkOpen} setIsOpen={setIsBulkOpen} />
      {isSampleOpen && (
        <SampleDownloadModal onClose={() => setIsSampleOpen(false)} />
      )}
    </div>
  );
};

export default EoaLoaPage;
