import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import DeleteBrochure from "./DeleteBrochure";
import EditBrochureModal from "./EditBrochureModal";

export default function Brochures() {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBrochure, setSelectedBrochure] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchBrochures();
    const storedToken = localStorage.getItem("adminToken") || "";
    setToken(storedToken);
  }, []);

  const fetchBrochures = () => {
    setLoading(true);
    axios
      .get("/api/web/placement_broacher")
      .then((res) => {
        if (res.data && res.data.status) {
          setBrochures(res.data.body || []);
        } else {
          setBrochures([]);
        }
      })
      .catch((err) => {
        console.error("Fetch brochures error:", err);
        setBrochures([]);
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
      .delete("/api/admin/placement_broacher", {
        data: { id: deleteId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchBrochures();
      })
      .catch((err) => {
        console.error(
          "Delete error:",
          err.response?.data || err.message || err
        );
        alert("Failed to delete brochure. See console for details.");
      })
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleEditClick = (brochure) => {
    setSelectedBrochure(brochure);
    setIsEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditOpen(false);
    setSelectedBrochure(null);
    fetchBrochures();
  };

  if (loading) return <div>Loading...</div>;
  if (!brochures.length) return <div className="p-4">No brochures found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {brochures.map((brochure) => (
          <div
            key={brochure.id}
            className="border rounded p-4 flex flex-col gap-4 bg-white relative"
          >
            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEditClick(brochure)}
              />
              <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => openConfirm(brochure.id)}
              />
            </div>

            <DeleteBrochure
              open={confirmOpen}
              brochureId={deleteId}
              onCancel={() => setConfirmOpen(false)}
              onDeleted={fetchBrochures}
            />

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">
                {brochure.label || "No label"}
              </div>

              {brochure.attachment && (
                <a
                  href={brochure.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  View Brochure
                </a>
              )}

              {brochure.date && (
                <div className="text-sm text-gray-600">
                  Date: {new Date(brochure.date).toLocaleDateString()}
                </div>
              )}

              <div className="text-xs text-gray-500">
                {brochure.timestamp
                  ? new Date(brochure.timestamp).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditOpen && selectedBrochure && (
        <EditBrochureModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          brochure={selectedBrochure}
          refreshData={fetchBrochures}
        />
      )}
    </>
  );
}
