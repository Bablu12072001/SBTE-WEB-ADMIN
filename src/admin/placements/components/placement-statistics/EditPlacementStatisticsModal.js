import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function EditPlacementStatisticsModal({
  isOpen,
  setIsOpen,
  statistics,
  refreshData,
}) {
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    placement_rate: [],
    company_visited: [],
  });

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

  useEffect(() => {
    if (!statistics) return;

    setFormData({
      id: statistics.id ?? "",
      placement_rate: statistics.placement_rate ?? [],
      company_visited: statistics.company_visited ?? [],
    });
  }, [statistics]);

  const handlePlacementRateChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.placement_rate];
      updated[index][field] = value;
      return { ...prev, placement_rate: updated };
    });
  };

  const handleCompanyVisitedChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.company_visited];
      updated[index][field] = value;
      return { ...prev, company_visited: updated };
    });
  };

  const handleSubmit = async () => {
    const payload = {
      id: formData.id,
      placement_rate: formData.placement_rate,
      company_visited: formData.company_visited,
    };

    try {
      const res = await axios.put("/api/admin/placement_statistics", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data && res.data.status) {
        if (typeof refreshData === "function") refreshData();
        setIsOpen(false);
      } else {
        console.error(
          "PUT /api/admin/placement_statistics returned:",
          res.data
        );
        alert(
          "Failed to update placement statistics. See console for details."
        );
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message || err);
      alert("An error occurred while updating. Check console for details.");
    }
  };

  if (!isOpen || !statistics) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-900">
            Edit Placement Statistics
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-6">
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

          {/* Placement Rate Section */}
          <div>
            <h3 className="font-semibold mb-2">Placement Rate</h3>
            {formData.placement_rate.map((rate, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-2 border p-3 rounded mb-2"
              >
                <input
                  type="number"
                  value={rate.TNS}
                  onChange={(e) =>
                    handlePlacementRateChange(index, "TNS", e.target.value)
                  }
                  placeholder="TNS"
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={rate.TSP}
                  onChange={(e) =>
                    handlePlacementRateChange(index, "TSP", e.target.value)
                  }
                  placeholder="TSP"
                  className="border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={rate.Branch}
                  onChange={(e) =>
                    handlePlacementRateChange(index, "Branch", e.target.value)
                  }
                  placeholder="Branch"
                  className="border rounded px-2 py-1"
                />
              </div>
            ))}
          </div>

          {/* Company Visited Section */}
          <div>
            <h3 className="font-semibold mb-2">Company Visited</h3>
            {formData.company_visited.map((company, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-2 border p-3 rounded mb-2"
              >
                <input
                  type="text"
                  value={company["Company Name"]}
                  onChange={(e) =>
                    handleCompanyVisitedChange(
                      index,
                      "Company Name",
                      e.target.value
                    )
                  }
                  placeholder="Company Name"
                  className="border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={company["Lowest Package"]}
                  onChange={(e) =>
                    handleCompanyVisitedChange(
                      index,
                      "Lowest Package",
                      e.target.value
                    )
                  }
                  placeholder="Lowest Package"
                  className="border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={company["Highest Package"]}
                  onChange={(e) =>
                    handleCompanyVisitedChange(
                      index,
                      "Highest Package",
                      e.target.value
                    )
                  }
                  placeholder="Highest Package"
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={company["Total Student Hire"]}
                  onChange={(e) =>
                    handleCompanyVisitedChange(
                      index,
                      "Total Student Hire",
                      e.target.value
                    )
                  }
                  placeholder="Total Hired"
                  className="border rounded px-2 py-1"
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
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
