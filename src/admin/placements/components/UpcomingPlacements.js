import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "./DeleteRecentPlacements";
import EditUpcomingPlacementModal from "./EditUpcomingPlacements";

export default function UpcomingPlacements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchPlacements();
    const storedToken = localStorage.getItem("adminToken") || "";
    setToken(storedToken);
  }, []);

  const fetchPlacements = () => {
    setLoading(true);
    axios
      .get("/api/web/upcoming_placement")
      .then((res) => {
        if (res.data && res.data.status) {
          setPlacements(res.data.body || []);
        } else {
          setPlacements([]);
        }
      })
      .catch((err) => {
        console.error("Fetch upcoming placements error:", err);
        setPlacements([]);
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
      .delete(`/api/admin/upcoming_placement`, {
        data: {
          id: deleteId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        fetchPlacements();
      })
      .catch((err) => {
        console.error(
          "Delete error:",
          err.response?.data || err.message || err
        );
        alert("Failed to delete placement. See console for details.");
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
    fetchPlacements();
  };

  if (loading) return <div>Loading...</div>;
  if (!placements.length)
    return <div className="p-4">No upcoming placements found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {placements.map((placement) => (
          <div
            key={placement.id}
            className="border rounded p-4 flex flex-col gap-4 bg-white relative"
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEditClick(placement)}
              />
              <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => openConfirm(placement.id)}
              />
            </div>

            <ConfirmDialog
              open={confirmOpen}
              message="Are you sure you want to delete this upcoming placement?"
              onCancel={() => setConfirmOpen(false)}
              onConfirm={handleDeleteConfirmed}
            />

            <div className="flex gap-2 items-center">
              <img
                src={placement.company_photo}
                alt={placement.company_name}
                className="h-24 w-24 rounded object-contain border bg-white"
              />
              <div className="flex flex-col">
                <div className="font-semibold text-lg">
                  {placement.company_name}
                </div>
                <div className="text-xs text-gray-500">
                  {placement.timestamp
                    ? new Date(placement.timestamp).toLocaleString()
                    : ""}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditOpen && selectedPlacement && (
        <EditUpcomingPlacementModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          placement={selectedPlacement}
          refreshData={fetchPlacements}
        />
      )}
    </>
  );
}
