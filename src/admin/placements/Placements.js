import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import useScreenSize from "../useScreenSize";

import RecentPlacementsModal from "./components/RecentPlacementsModal";
import RecentPlacements from "./components/RecentPlacements";
import UpcomingPlacements from "./components/UpcomingPlacements";
import UpcomingPlacementsModal from "./components/UpcomingPlacementsModal";
import Procedure from "./components/procedure/Procedure";
import ProcedureModal from "./components/procedure/ProcedureModal";
import Achievements from "./components/achievements/Achievements";
import AchievementModal from "./components/achievements/AchievementModal";
import SuccessStories from "./components/success-stories/SuccessStories";
import SuccessStoryModal from "./components/success-stories/SuccessStoryModal";
import BrochureModal from "./components/brochures/BrochureModal";
import Brochures from "./components/brochures/Brochures";
import JobCarouselModal from "./components/jobcarousel/JobCarouselModal";
import JobCarousel from "./components/jobcarousel/JobCarousel";
import PlacementStatistics from "./components/placement-statistics/PlacementStatistics";
import PlacementStatisticsModal from "./components/placement-statistics/PlacementStatisticsModal";
import PlacementDataModal from "./components/placement-data/PlacementDataModal";
import PlacementData from "./components/placement-data/PlacementData";

const Placements = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showSuccessStoryModal, setShowSuccessStoryModal] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [showJobCarouselModal, setShowJobCarouselModal] = useState(false);
  const [showPlacementStatisticslModal, setShowPlacementStatisticsModal] =
    useState(false);
  const [showPlacementDatalModal, setShowPlacementDataticsModal] =
    useState(false);

  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const [recentRefreshKey, setRecentRefreshKey] = useState(0);
  const [upcomingRefreshKey, setUpcomingRefreshKey] = useState(0);
  const [procedureRefreshKey, setProcedureRefreshKey] = useState(0);
  const [achievementsRefreshKey, setAchievementsRefreshKey] = useState(0);
  const [successStoriesRefreshKey, setSuccessStoriesRefreshKey] = useState(0);
  const [brochuresRefreshKey, setBrochuresRefreshKey] = useState(0);
  const [jobCarouselRefreshKey, setJobCarouselRefreshKey] = useState(0);
  const [placementStatisticsRefreshKey, setPlacementStatisticsRefreshKey] =
    useState(0);
  const [placementDataRefreshKey, setPlacementDataRefreshKey] = useState(0);

  const isSmallScreen = useScreenSize();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/");
    }
    setIsAuthenticating(false);
  }, [navigate]);

  if (isAuthenticating) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  // All tabs in one array
  const tabs = [
    {
      id: "recent",
      label: "Recent Placements",
      component: <RecentPlacements key={recentRefreshKey} />,
    },
    {
      id: "upcoming",
      label: "Upcoming Placements",
      component: <UpcomingPlacements key={upcomingRefreshKey} />,
    },
    {
      id: "procedure",
      label: "Procedure",
      component: <Procedure key={procedureRefreshKey} />,
    },
    {
      id: "achievements",
      label: "Achievements",
      component: <Achievements key={achievementsRefreshKey} />,
    },
    {
      id: "success",
      label: "Success Stories",
      component: <SuccessStories key={successStoriesRefreshKey} />,
    },
    {
      id: "brochures",
      label: "Placement Brochures",
      component: <Brochures key={brochuresRefreshKey} />,
    },
    {
      id: "carousel",
      label: "Job Carousel",
      component: <JobCarousel key={jobCarouselRefreshKey} />,
    },
    {
      id: "statistics",
      label: "Placement Statistics",
      component: <PlacementStatistics key={placementStatisticsRefreshKey} />,
    },
    {
      id: "data",
      label: "Placement Data",
      component: <PlacementData key={placementDataRefreshKey} />,
    },
  ];

  // Modal open logic
  const openAddModal = () => {
    if (activeTab === "recent") setShowRecentModal(true);
    else if (activeTab === "upcoming") setShowUpcomingModal(true);
    else if (activeTab === "procedure") setShowProcedureModal(true);
    else if (activeTab === "achievements") setShowAchievementModal(true);
    else if (activeTab === "success") setShowSuccessStoryModal(true);
    else if (activeTab === "brochures") setShowBrochureModal(true);
    else if (activeTab === "carousel") setShowJobCarouselModal(true);
    else if (activeTab === "statistics") setShowPlacementStatisticsModal(true);
    else if (activeTab === "data") setShowPlacementDataticsModal(true);
  };

  // Add button label per tab
  const addButtonLabels = {
    recent: "Add Recent Placement",
    upcoming: "Add Upcoming Placement",
    procedure: "Add Procedure",
    achievements: "Add Achievement",
    success: "Add Success Story",
    brochures: "Add Brochure",
    carousel: "Add Carousel Image",
    statistics: "Add Placement Stat",
    data: "Add Placement Data",
  };
  const addButtonLabel = addButtonLabels[activeTab] || "Add";

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

        <div className="px-4 pt-1 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-gray-600">Placements</p>

              <div
                className="mt-3 flex gap-2 flex-wrap"
                role="tablist"
                aria-label="Placement tabs"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-900 text-white"
                        : "bg-white text-gray-700 border"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="bg-blue-900 text-white px-4 py-1 rounded-lg"
                onClick={openAddModal}
              >
                {addButtonLabel}
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-8">
          {tabs.find((t) => t.id === activeTab)?.component}
        </div>
      </div>

      {/* Existing Modals */}
      <RecentPlacementsModal
        isOpen={showRecentModal}
        setIsOpen={setShowRecentModal}
        onSuccess={() => setRecentRefreshKey((k) => k + 1)}
      />
      <UpcomingPlacementsModal
        isOpen={showUpcomingModal}
        setIsOpen={setShowUpcomingModal}
        onSuccess={() => setUpcomingRefreshKey((k) => k + 1)}
      />
      <ProcedureModal
        isOpen={showProcedureModal}
        setIsOpen={setShowProcedureModal}
        onSuccess={() => setProcedureRefreshKey((k) => k + 1)}
      />

      <AchievementModal
        isOpen={showAchievementModal}
        setIsOpen={setShowAchievementModal}
        onSuccess={() => setAchievementsRefreshKey((k) => k + 1)}
      />

      <SuccessStoryModal
        isOpen={showSuccessStoryModal}
        setIsOpen={setShowSuccessStoryModal}
        onSuccess={() => setSuccessStoriesRefreshKey((k) => k + 1)}
      />
      <BrochureModal
        isOpen={showBrochureModal}
        setIsOpen={setShowBrochureModal}
        onSuccess={() => setBrochuresRefreshKey((k) => k + 1)}
      />
      <JobCarouselModal
        isOpen={showJobCarouselModal}
        setIsOpen={setShowJobCarouselModal}
        onSuccess={() => setJobCarouselRefreshKey((k) => k + 1)}
      />
      <PlacementStatisticsModal
        isOpen={showPlacementStatisticslModal}
        setIsOpen={setShowPlacementStatisticsModal}
        onSuccess={() => setPlacementStatisticsRefreshKey((k) => k + 1)}
      />
      <PlacementDataModal
        isOpen={showPlacementDatalModal}
        setIsOpen={setShowPlacementDataticsModal}
        onSuccess={() => setPlacementDataRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default Placements;
