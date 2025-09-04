import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import DeletePlacementData from "./DeletePlacementData";
import EditPlacementDataModal from "./EditPlacementDataModal";

export default function PlacementData() {
  const [placementData, setPlacementData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchPlacementData();
    const storedToken = localStorage.getItem("adminToken") || "";
    setToken(storedToken);
  }, []);

  const fetchPlacementData = () => {
    setLoading(true);
    axios
      .get("/api/web/placement_dt")
      .then((res) => {
        if (res.data && res.data.status) {
          setPlacementData(res.data.data || []);
        } else {
          setPlacementData([]);
        }
      })
      .catch((err) => {
        console.error("Fetch placement data error:", err);
        setPlacementData([]);
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
      .delete(`/api/admin/placement_data`, {
        data: { id: deleteId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchPlacementData();
      })
      .catch((err) => {
        console.error(
          "Delete error:",
          err.response?.data || err.message || err
        );
        alert("Failed to delete placement data. See console for details.");
      })
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleEditClick = (placement) => {
    setSelectedPlacement(placement);
    setIsEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditOpen(false);
    setSelectedPlacement(null);
    fetchPlacementData();
  };

  if (loading) return <div>Loading...</div>;
  if (!placementData.length)
    return <div className="p-4">No placement data found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {placementData.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4 flex flex-col gap-4 bg-white relative"
          >
            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEditClick(item)}
              />
              <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => openConfirm(item.id)}
              />
            </div>

            <DeletePlacementData
              open={confirmOpen}
              id={deleteId}
              onCancel={() => setConfirmOpen(false)}
              onSuccess={fetchPlacementData}
            />

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">
                Session: {item.session}
              </div>

              <div className="text-sm text-gray-700">
                Placement Rate: {item.placement_rate}
              </div>

              <div className="text-sm text-gray-700">
                Companies Visited: {item.company_visited}
              </div>

              <div className="text-sm text-gray-700">NSP: {item.NSP}</div>

              <div className="text-sm text-gray-700">Female: {item.female}</div>

              <div className="text-sm text-gray-700">Male: {item.male}</div>

              <div className="text-xs text-gray-500">
                {item.timestamp
                  ? new Date(item.timestamp).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditOpen && selectedPlacement && (
        <EditPlacementDataModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          placementData={selectedPlacement}
          refreshData={fetchPlacementData}
        />
      )}
    </>
  );
}
