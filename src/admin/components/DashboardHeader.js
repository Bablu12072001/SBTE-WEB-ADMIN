import React, { useEffect, useState } from "react";
import Avatar from "../../components/assets/adminImages/avatar.png";
import SbteLogo from "../../components/assets/adminImages/sbte.png";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import useScreenSize from "../useScreenSize";
import { ClipboardList } from "lucide-react";

export default function DashboardHeader() {
  const [adminToken, setAdminToken] = useState("");
  const [adminUser, setAdminUser] = useState({});
  const isSmallScreen = useScreenSize();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setAdminToken(token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdminUser(decoded);
      } catch (err) {
        console.error("Invalid admin token:", err);
      }
    }
  }, []);

  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-300 px-4">
      {/* Left Section containing the llogo */}
      <div className="flex items-center gap-2">
        <img src={SbteLogo} alt="SBTE Logo" className="w-16 h-16" />
        <div className="flex flex-col md:block hidden">
          <p className="text-xl text-blue-900 font-semibold">
            State Board of Technical Education
          </p>
          <p className="text-gray-500">Bihar, IN</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/logs"
          className="p-2 rounded-full bg-blue-100 border border-gray-300  hover:border-blue-700 hover:bg-blue-200 transition text-white"
          title="Activity Log"
        >
          <ClipboardList className="w-5 h-5 text-blue-800" />
        </Link>

        {!isSmallScreen && (
          <img src={Avatar} alt="Admin" className="w-8 h-8 rounded-full" />
        )}
        <div>
          <p className="text-xs md:text-sm font-semibold flex flex-wrap">
            {adminUser?.name?.toUpperCase()}
            {!isSmallScreen && (
              <span className="ml-1 text-gray-500">({adminUser?.email})</span>
            )}
          </p>
          <p className="text-[8px] md:text-xs text-gray-500">
            {localStorage.getItem("adminRole")?.toUpperCase() ||
              adminUser?.role?.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
