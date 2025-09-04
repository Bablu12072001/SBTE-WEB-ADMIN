import { useState } from "react";
import useScreenSize from "../useScreenSize";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import JobFormModal from "./components/JobFormModal";
import JobsTable from "./components/JobsTable";

export default function JobsAndInternships() {
  const [activeTab, setActiveTab] = useState("companies");
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const isSmallScreen = useScreenSize();

  const refreshJobs = () => setRefreshFlag(!refreshFlag);

  return (
    <div className="flex h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`flex-1 overflow-auto gap-4 bg-slate-100 transition-all duration-300 ${
          expanded && !isSmallScreen ? "ml-56" : "ml-16 lg:ml-20"
        } ${isSmallScreen && expanded ? "ml-0" : ""}`}
      >
        <div className="sticky top-0 bg-slate-100">
          <DashboardHeader />
        </div>

        <div className="flex flex-col md:flex-row justify-between lg:px-4 px-2 mt-2">
          <p className="text-xl font-semibold text-gray-600">Jobs</p>
          <div className="flex gap-2">
            <button
              className="bg-blue-900 text-white px-4 py-1 rounded-lg"
              onClick={() => setShowModal(true)}
            >
              Post New
            </button>
          </div>
        </div>

        <div className="lg:px-4 px-2 py-4">
          <JobsTable refreshFlag={refreshFlag} />
        </div>
      </div>
      <JobFormModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        refreshJobs={refreshJobs}
      />
    </div>
  );
}
