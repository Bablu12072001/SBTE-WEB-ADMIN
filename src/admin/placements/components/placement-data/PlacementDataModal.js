import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function PlacementDataModal({ isOpen, setIsOpen, onSuccess }) {
  const [session, setSession] = useState("");
  const [sessions, setSessions] = useState([]);

  const [placementRate, setPlacementRate] = useState("");
  const [companyVisited, setCompanyVisited] = useState("");
  const [NSP, setNSP] = useState("");
  const [female, setFemale] = useState("");
  const [male, setMale] = useState("");

  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("/api/web/placement_session");
      if (res.data?.status) {
        setSessions(res.data.body || []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      session,
      placement_rate: placementRate,
      company_visited: companyVisited,
      NSP,
      female,
      male,
    };

    try {
      await axios.post("/api/admin/placement_data", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsOpen(false);
      setSession("");
      setPlacementRate("");
      setCompanyVisited("");
      setNSP("");
      setFemale("");
      setMale("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(
        "Error adding placement data:",
        error.response?.data || error.message
      );
      alert("Error submitting placement data. Check console for details.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              Add Placement Data
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Session Dropdown */}
            {/* Session Dropdown */}
            <div>
              <label className="block text-sm mb-1 font-medium">Session</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                <option value="">Select Session</option>
                {sessions.map((s, idx) => (
                  <option key={idx} value={s.session}>
                    {s.session}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Placement Rate
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={placementRate}
                onChange={(e) => setPlacementRate(e.target.value)}
                placeholder="e.g. 85%"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Company Visited
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={companyVisited}
                onChange={(e) => setCompanyVisited(e.target.value)}
                placeholder="e.g. 35"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">NSP</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={NSP}
                onChange={(e) => setNSP(e.target.value)}
                placeholder="e.g. 20"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">Female</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={female}
                onChange={(e) => setFemale(e.target.value)}
                placeholder="e.g. 150"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">Male</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={male}
                onChange={(e) => setMale(e.target.value)}
                placeholder="e.g. 200"
              />
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded text-white bg-blue-900 hover:bg-blue-800"
              >
                Create
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
