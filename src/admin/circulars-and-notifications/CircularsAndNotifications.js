import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import useScreenSize from "../useScreenSize";
import CircularsAndNotificationsTable from "./components/CircularsAndNotificationsTable";
import CircularsFormModal from "./components/CircularsFormModal";

export default function CircularsAndNotifications() {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isSmallScreen = useScreenSize();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

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

        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between mb-1 px-4">
          <p className="text-xl font-semibold text-gray-600">
            Circulars And Notifications
          </p>
          <button
            className="bg-blue-900 text-white px-4 py-1 rounded-lg"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>

        <CircularsAndNotificationsTable key={refreshKey} />
      </div>

      {/* Modal */}
      <CircularsFormModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
          setShowModal(false);
        }}
      />
    </div>
  );
}
