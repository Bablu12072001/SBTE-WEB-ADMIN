import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import {
  Newspaper,
  Images,
  Dock,
  FileStack,
  BookOpenText,
  BellRing,
  Building2,
  Calendar1,
  Trophy,
  BadgeCheck,
  HelpCircle,
  LandPlot,
  Link,
  HandshakeIcon,
  ImagePlay,
  Workflow,
  BriefcaseBusiness,
} from "lucide-react";
import useScreenSize from "./useScreenSize";
import DashboardHeader from "./components/DashboardHeader";

const AdminDashboard = () => {
  const [expanded, setExpanded] = useState(false);
  const isSmallScreen = useScreenSize();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminRole = localStorage.getItem("adminRole");

    // Optional: You can validate the role if needed
    if (!adminToken || adminRole !== "admin") {
      navigate("/admin-login");
    } else {
      setIsAuthenticating(false);
    }
  }, [navigate]);

  if (isAuthenticating) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  const shortcutItems = [
    {
      label: "News Banner",
      sublabel: "Manage News Banners",
      icon: ImagePlay,
      route: "/admin/news",
    },
    {
      label: "News & Announcements",
      sublabel: "Manage News & Announcements",
      icon: Newspaper,
      route: "/admin/news-and-announcements",
    },
    {
      label: "Circulars & Notifications",
      sublabel: "Manage Circulars & Notifications",
      icon: BellRing,
      route: "/admin/circulars-and-notifications",
    },
    {
      label: "Gallery",
      sublabel: "Gallery, Carousel, Multimedia",
      icon: Images,
      route: "/admin/gallery",
    },
    {
      label: "EOA / LOA",
      sublabel: "Manage EOA/LOA",
      icon: Dock,
      route: "/admin/eoa-loa",
    },
    {
      label: "Documents & Downloads",
      sublabel:
        "Official Letters, SOPs & User Manuals, Downloads, SBTE-Norms, DSTTE-Norms",
      icon: FileStack,
      route: "/admin/documents-downloads",
    },
    {
      label: "Curriculum, E-content & Virtual Labs",
      sublabel:
        "Curriculum, E-content, Virtual Labs, Available Courses, PYQs, Q/A Keys",
      icon: BookOpenText,
      route: "/admin/curriculum-and-study-material",
    },
    {
      label: "Academic Calendar",
      sublabel: "Manage Academic Calendar",
      icon: Calendar1,
      route: "/admin/academic-calendar",
    },
    {
      label: "Awards",
      sublabel: "Manage Awards",
      icon: Trophy,
      route: "/admin/awards",
    },

    {
      label: "Jobs & Internships",
      sublabel: "Manage Jobs & Internships",
      icon: Workflow,
      route: "/admin/jobs-and-internships",
    },
    {
      label: "Placements",
      sublabel: "Recent & Upcoming Placements",
      icon: BriefcaseBusiness,
      route: "/admin/placements",
    },
    {
      label: "Approvals",
      sublabel: "Manage Companies & Jobs Approvals",
      icon: BadgeCheck,
      route: "/admin/approvals",
    },
    {
      label: "Collaboration",
      sublabel: "Manage Academic & Research Collaborations",
      icon: HandshakeIcon,
      route: "/admin/collaboration",
    },
    {
      label: "FAQs",
      sublabel: "Manage FAQs and FAQ types",
      icon: HelpCircle,
      route: "/admin/faqs",
    },
    {
      label: "Add-On Courses",
      sublabel: "Manage Add-On Courses",
      icon: LandPlot,
      route: "/admin/add-ons",
    },
    {
      label: "External Links",
      sublabel: "Manage External Links",
      icon: Link,
      route: "/admin/external-links",
    },
    {
      label: "About Us",
      sublabel: "Manage About SBTE and Profiles",
      icon: Building2,
      route: "/admin/about-us",
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      <div
        className={`flex-1 overflow-auto gap-4 bg-slate-100 transition-all duration-300 ${
          expanded && !isSmallScreen ? "ml-56" : "ml-16 lg:ml-20"
        } ${isSmallScreen && expanded ? "ml-0" : ""}`}
      >
        <div className="sticky top-0 bg-slate-100 z-10">
          <DashboardHeader />
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-1 px-4">
          <p className="text-xl font-semibold text-gray-600">
            Dashboard: Shortcuts
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 px-4 pb-6">
          {shortcutItems.map(({ label, sublabel, icon: Icon, route }) => (
            <button
              key={route}
              onClick={() => navigate(route)}
              className="bg-white hover:bg-blue-50 hover:border-gray-400 border border-gray-200 rounded-xl p-4 py-8 shadow-sm text-center text-md font-medium text-gray-700 transition flex flex-col items-center gap-3"
            >
              <Icon className="h-8 w-8 text-blue-900" />
              <div className="text-center">
                <div className="font-semibold text-sm md:text-lg">{label}</div>
                <div className="text-xs text-gray-400 mt-1">{sublabel}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
