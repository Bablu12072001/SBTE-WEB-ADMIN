import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import DeletePlacementStatistic from "./DeletePlacementStatistic";
import EditPlacementStatisticsModal from "./EditPlacementStatisticsModal";

export default function PlacementStatistics() {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStatistic, setSelectedStatistic] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchStatistics();
    const storedToken = localStorage.getItem("adminToken") || "";
    setToken(storedToken);
  }, []);

  const fetchStatistics = () => {
    setLoading(true);
    axios
      .get("/api/web/placement_statistic")
      .then((res) => {
        if (res.data && res.data.status) {
          const body = res.data.body;
          setStatistics(Array.isArray(body) ? body : [body]);
        } else {
          setStatistics([]);
        }
      })
      .catch((err) => {
        console.error("Fetch placement statistics error:", err);
        setStatistics([]);
      })
      .finally(() => setLoading(false));
  };

  const openConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!deleteId) return;

    if (!token) {
      console.warn("No admin token available for delete request.");
      alert("You are not authenticated to perform this action.");
      setConfirmOpen(false);
      setDeleteId(null);
      return;
    }

    axios
      .delete(`/api/admin/placement_statistics`, {
        data: { id: deleteId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchStatistics();
      })
      .catch((err) => {
        console.error(
          "Delete error:",
          err.response?.data || err.message || err
        );
        alert("Failed to delete placement statistic. See console for details.");
      })
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleEditClick = (statistic) => {
    setSelectedStatistic(statistic);
    setIsEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditOpen(false);
    setSelectedStatistic(null);
    fetchStatistics();
  };

  if (loading) return <div>Loading...</div>;
  if (!statistics.length)
    return (
      <div className="p-4">
        <div className="flex gap-4 p-4">
          <a
            href="/sample/sbte_placement.xlsx"
            download
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Placement Rate File Sample
          </a>

          <a
            href="/sample/company_visited.xlsx"
            download
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Company Visited File Sample
          </a>
        </div>
        <p>No placement statistics found.</p>
      </div>
    );

  return (
    <>
      <div className="flex gap-4 p-4">
        <a
          href="/sample/sbte_placement.xlsx"
          download
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Placement Rate File Sample
        </a>

        <a
          href="/sample/company_visited.xlsx"
          download
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Company Visited File Sample
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {statistics.map((stat) => (
          <div
            key={stat.id}
            className="border rounded p-4 flex flex-col gap-4 bg-white relative"
          >
            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => openConfirm(stat.id)}
              />
            </div>

            {/* Session + Timestamp */}
            <div className="mb-2">
              <h2 className="text-xl text-blue-800 font-bold">
                Session: {stat.session}
              </h2>
              <p className="text-sm text-gray-500">
                Last Updated:{" "}
                {new Date(stat.timestamp).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Placement Rate Section */}
            {stat.placement_rate?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Placement Rate</h3>
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">Branch</th>
                      <th className="border px-2 py-1">
                        Total No. of Students
                      </th>
                      <th className="border px-2 py-1">
                        Total Students Placed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stat.placement_rate.map((row, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{row.Branch}</td>
                        <td className="border px-2 py-1">{row.TNS}</td>
                        <td className="border px-2 py-1">{row.TSP}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Company Visited Section */}
            {stat.company_visited?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Companies Visited
                </h3>
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">Company Name</th>
                      <th className="border px-2 py-1">Lowest Package</th>
                      <th className="border px-2 py-1">Highest Package</th>
                      <th className="border px-2 py-1">Total Student Hire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stat.company_visited.map((row, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">
                          {row["Company Name"]}
                        </td>
                        <td className="border px-2 py-1">
                          {row["Lowest Package"]}
                        </td>
                        <td className="border px-2 py-1">
                          {row["Highest Package"]}
                        </td>
                        <td className="border px-2 py-1">
                          {row["Total Student Hire"]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditOpen && selectedStatistic && (
        <EditPlacementStatisticsModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          statistic={selectedStatistic}
          refreshData={fetchStatistics}
        />
      )}

      <DeletePlacementStatistic
        open={confirmOpen}
        id={deleteId}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onSuccess={() => {
          setConfirmOpen(false);
          setDeleteId(null);
          fetchStatistics();
        }}
      />
    </>
  );
}
