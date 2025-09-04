import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import DeleteAchievement from "./DeleteAchievement";
import EditAchievementModal from "./EditAchievementModal";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchAchievements();
    const storedToken = localStorage.getItem("adminToken") || "";
    setToken(storedToken);
  }, []);

  const fetchAchievements = () => {
    setLoading(true);
    axios
      .get("/api/web/achievements")
      .then((res) => {
        if (res.data && res.data.status) {
          setAchievements(res.data.body || []);
        } else {
          setAchievements([]);
        }
      })
      .catch((err) => {
        console.error("Fetch achievements error:", err);
        setAchievements([]);
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
      .delete(`/api/admin/achievement`, {
        data: { id: deleteId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchAchievements();
      })
      .catch((err) => {
        console.error(
          "Delete error:",
          err.response?.data || err.message || err
        );
        alert("Failed to delete achievement. See console for details.");
      })
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleEditClick = (achievement) => {
    setSelectedAchievement(achievement);
    setIsEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditOpen(false);
    setSelectedAchievement(null);
    fetchAchievements();
  };

  if (loading) return <div>Loading...</div>;
  if (!achievements.length)
    return <div className="p-4">No achievements found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="border rounded p-4 flex flex-col gap-4 bg-white relative"
          >
            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEditClick(achievement)}
              />
              <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => openConfirm(achievement.id)}
              />
            </div>

            <DeleteAchievement
              open={confirmOpen}
              message="Are you sure you want to delete this achievement?"
              onCancel={() => setConfirmOpen(false)}
              onConfirm={handleDeleteConfirmed}
            />

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">
                {achievement.text || "No title"}
              </div>

              {achievement.attachment && (
                <a
                  href={achievement.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  View Attachment
                </a>
              )}

              {achievement.date && (
                <div className="text-sm text-gray-600">
                  Date: {new Date(achievement.date).toLocaleDateString()}
                </div>
              )}

              <div className="text-xs text-gray-500">
                {achievement.timestamp
                  ? new Date(achievement.timestamp).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditOpen && selectedAchievement && (
        <EditAchievementModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          achievement={selectedAchievement}
          refreshData={fetchAchievements}
        />
      )}
    </>
  );
}
