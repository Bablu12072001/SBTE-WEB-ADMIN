import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  Newspaper,
  Images,
  Dock,
  FileStack,
  BookOpenText,
  Rss,
  BellRing,
  Building2,
  School,
  FileSignature,
  LayoutDashboard,
  BadgeCheck,
  HelpCircle,
  LandPlot,
  Link,
  Calendar1,
  Trophy,
  ImagePlay,
  Workflow,
  HandshakeIcon,
  BriefcaseBusiness,
} from "lucide-react";

const menuTopItems = [
  {
    name: "Dashboard",
    shortName: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    name: "News Banner",
    shortName: "News",
    icon: ImagePlay,
    path: "/admin/news",
  },
  {
    name: "News & Announcements",
    shortName: "News/Ann",
    icon: Rss,
    path: "/admin/news-and-announcements",
  },
  {
    name: "Circulars & Notification",
    shortName: "Circu/Notif",
    icon: BellRing,
    path: "/admin/circulars-and-notifications",
  },

  {
    name: "Gallery",
    shortName: "Gallery",
    icon: Images,
    path: "/admin/gallery",
  },
  {
    name: "EOA/LOA",
    shortName: "EOA/LOA",
    icon: Dock,
    path: "/admin/eoa-loa",
  },
  {
    name: "Documents & Downloads",
    icon: FileStack,
    path: "/admin/documents-downloads",
  },
  {
    name: "Curriculum, E-content & Virtual Labs",
    shortName: "Curriculum/Study",
    icon: BookOpenText,
    path: "/admin/curriculum-and-study-material",
  },
  {
    name: "Academic Calendar",
    shortName: "Calendar",
    icon: Calendar1,
    path: "/admin/academic-calendar",
  },
  {
    name: "Awards",
    shortName: "Awards",
    icon: Trophy,
    path: "/admin/awards",
  },
  {
    name: "Jobs & Internships",
    shortName: "Jobs/Internships",
    icon: Workflow,
    path: "/admin/jobs-and-internships",
  },
  {
    name: "Placements",
    shortName: "Placements",
    icon: BriefcaseBusiness,
    path: "/admin/placements",
  },
  {
    name: "Approvals",
    shortName: "Approvals",
    icon: BadgeCheck,
    path: "/admin/approvals",
  },
  {
    name: "Collaborations",
    shortName: "Collabs",
    icon: HandshakeIcon,
    path: "/admin/collaboration",
  },
  {
    name: "FAQs",
    shortName: "FAQs",
    icon: HelpCircle,
    path: "/admin/faqs",
  },
  {
    name: "Add-Ons",
    shortName: "Add-Ons",
    icon: LandPlot,
    path: "/admin/add-ons",
  },
  {
    name: "External Links",
    shortName: "External Links",
    icon: Link,
    path: "/admin/external-links",
  },
  {
    name: "About US",
    shortName: "About Us",
    icon: Building2,
    path: "/admin/about-us",
  },
];

const Sidebar = ({ expanded, setExpanded }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    navigate("/");
  };

  return (
    <div
      className={`h-screen bg-blue-900 shadow-md text-gray-500 lg:p-3 p-2 flex flex-col transition-all duration-300 fixed left-0 top-0 z-[10] ${
        expanded ? "lg:w-56" : "w-16 lg:w-20"
      }`}
    >
      {/* Expand/Collapse Header */}
      <div
        className={`flex items-center transition-all duration-300 ${
          expanded ? "justify-between gap-2" : "justify-center"
        }`}
      >
        {expanded && (
          <span className="text-lg font-semibold text-white">
            SBTE Web Ctrl
          </span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-lg font-bold text-white"
        >
          {expanded ? "✖" : "☰"}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col flex-1 mt-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <div className="flex flex-col gap-3">
            {menuTopItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.path}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-blue-100 text-blue-900"
                      : "hover:bg-gray-200 text-gray-300 hover:text-blue-800"
                  }`}
                  onClick={() => navigate(item.path)}
                  title={item.name}
                >
                  <item.icon
                    size={24}
                    color={isActive ? "#3b82f6" : "#9ca3af"}
                  />
                  {expanded && <span className="text-sm">{item.name}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="flex flex-col gap-3 mt-4 mb-6">
          <div
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-300 bg-red-100 hover:bg-red-200 text-red-600"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut size={20} color="#ef4444" />
            {expanded && <span className="text-sm">Logout</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
