import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "./DeleteProcedure";
import EditProcedureModal from "./EditProcedureModal";

export default function Procedure() {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchProcedures();
    const storedToken = localStorage.getItem("adminToken") || "";
    setToken(storedToken);
  }, []);

  const fetchProcedures = () => {
    setLoading(true);
    axios
      .get("/api/web/procedure")
      .then((res) => {
        if (res.data && res.data.status) {
          setProcedures(res.data.body || []);
        } else {
          setProcedures([]);
        }
      })
      .catch((err) => {
        console.error("Fetch procedures error:", err);
        setProcedures([]);
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
      .delete(`/api/admin/procedure`, {
        data: { id: deleteId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchProcedures();
      })
      .catch((err) => {
        console.error(
          "Delete error:",
          err.response?.data || err.message || err
        );
        alert("Failed to delete procedure. See console for details.");
      })
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleEditClick = (procedure) => {
    setSelectedProcedure(procedure);
    setIsEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditOpen(false);
    setSelectedProcedure(null);
    fetchProcedures();
  };

  if (loading) return <div>Loading...</div>;
  if (!procedures.length)
    return <div className="p-4">No procedures found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {procedures.map((procedure) => (
          <div
            key={procedure.id}
            className="border rounded p-4 flex flex-col gap-4 bg-white relative"
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEditClick(procedure)}
              />
              <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => openConfirm(procedure.id)}
              />
            </div>

            <ConfirmDialog
              open={confirmOpen}
              message="Are you sure you want to delete this procedure?"
              onCancel={() => setConfirmOpen(false)}
              onConfirm={handleDeleteConfirmed}
            />

            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">
                {procedure.txt || "No title"}
              </div>

              {procedure.attachment && (
                <a
                  href={procedure.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  View Attachment
                </a>
              )}

              <div className="text-xs text-gray-500">
                {procedure.timestamp
                  ? new Date(procedure.timestamp).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditOpen && selectedProcedure && (
        <EditProcedureModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          procedure={selectedProcedure}
          refreshData={fetchProcedures}
        />
      )}
    </>
  );
}
