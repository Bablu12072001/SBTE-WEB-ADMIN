import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function EditPlacementDataModal({
  isOpen,
  setIsOpen,
  placementData,
  refreshData,
}) {
  const [token, setToken] = useState("");
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    session: "",
    placement_rate: "",
    company_visited: "",
    NSP: "",
    female: "",
    male: "",
  });

  // Load token
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch (err) {
        console.warn("jwtDecode failed (token may be invalid).", err);
      }
    }
  }, []);

  // Fetch available sessions
  useEffect(() => {
    if (!token) return;
    const fetchSessions = async () => {
      try {
        const res = await axios.get("/api/admin/session", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data?.sessions) {
          setSessions(res.data.sessions);
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };
    fetchSessions();
  }, [token]);

  // Populate form with placement data
  useEffect(() => {
    if (!placementData) return;
    setFormData({
      id: placementData.id ?? "",
      session: placementData.session ?? "",
      placement_rate: placementData.placement_rate ?? "",
      company_visited: placementData.company_visited ?? "",
      NSP: placementData.NSP ?? "",
      female: placementData.female ?? "",
      male: placementData.male ?? "",
    });
  }, [placementData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = { ...formData };
    try {
      const res = await axios.put("/api/admin/placement_data", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data && res.data.status) {
        if (typeof refreshData === "function") refreshData();
        setIsOpen(false);
      } else {
        console.error("PUT /api/admin/placement_data returned:", res.data);
        alert("Failed to update placement data. See console for details.");
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message || err);
      alert("An error occurred while updating placement data.");
    }
  };

  if (!isOpen || !placementData) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-900">
            Edit Placement Data
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* ID */}
          <div>
            <label className="block text-sm font-medium">ID</label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm font-medium">Session</label>
            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select session</option>
              {sessions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Placement Rate */}
          <div>
            <label className="block text-sm font-medium">Placement Rate</label>
            <input
              type="text"
              name="placement_rate"
              value={formData.placement_rate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Company Visited */}
          <div>
            <label className="block text-sm font-medium">Company Visited</label>
            <input
              type="text"
              name="company_visited"
              value={formData.company_visited}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* NSP */}
          <div>
            <label className="block text-sm font-medium">NSP</label>
            <input
              type="text"
              name="NSP"
              value={formData.NSP}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Female */}
          <div>
            <label className="block text-sm font-medium">Female</label>
            <input
              type="text"
              name="female"
              value={formData.female}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Male */}
          <div>
            <label className="block text-sm font-medium">Male</label>
            <input
              type="text"
              name="male"
              value={formData.male}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Save */}
          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
