// "use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { useNavigate } from "react-router-dom";
import useScreenSize from "../useScreenSize";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import ExternalLinkTable from "./components/ExternalLinksTable";
import AddExternalLinkModal from "./components/AddExternalLinkModal";

export default function ExternalLinks() {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const router = useRouter();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const isSmallScreen = useScreenSize();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/");
      setIsAuthenticating(false);
    } else {
      setIsAuthenticating(false);
    }
  }, []);

  return isAuthenticating ? (
    <div>
      <p>Loading...</p>
    </div>
  ) : (
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
        <div className="sticky top-0 bg-slate-100 ">
          <DashboardHeader />
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-1 px-4">
          <p className="text-xl font-semibold text-gray-600">External Links</p>
          <button
            className="bg-blue-900 text-white px-4 py-1 rounded-lg"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>
        <ExternalLinkTable />
      </div>
      <AddExternalLinkModal isOpen={showModal} setIsOpen={setShowModal} />
    </div>
  );
}
