import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import DeleteSuccessStory from "./DeleteSuccessStory";
import EditSuccessStoryModal from "./EditSuccessStoryModal";

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchStories();
    const storedToken = localStorage.getItem("adminToken") || "";
    setToken(storedToken);
  }, []);

  const fetchStories = () => {
    setLoading(true);
    axios
      .get("/api/web/success_stories")
      .then((res) => {
        if (res.data && res.data.status) {
          setStories(res.data.body || []);
        } else {
          setStories([]);
        }
      })
      .catch((err) => {
        console.error("Fetch success stories error:", err);
        setStories([]);
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
      .delete("/api/admin/stories", {
        data: { id: deleteId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchStories();
      })
      .catch((err) => {
        console.error(
          "Delete error:",
          err.response?.data || err.message || err
        );
        alert("Failed to delete story. See console for details.");
      })
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleEditClick = (story) => {
    setSelectedStory(story);
    setIsEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditOpen(false);
    setSelectedStory(null);
    fetchStories();
  };

  const togglePostStatus = async (story) => {
    if (!token) {
      alert("You are not authenticated to perform this action.");
      return;
    }

    try {
      await axios.put(
        "/api/admin/success_stories",
        {
          id: story.id,
          isPost: !story.isPost, // flip current value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchStories();
    } catch (err) {
      console.error("Toggle isPost error:", err.response?.data || err.message);
      alert("Failed to update post status.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!stories.length)
    return <div className="p-4">No success stories found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="border rounded p-4 flex flex-col gap-4 bg-white relative"
          >
            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2 items-center">
              {/* Toggle Switch */}
              <p>Post</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(story.isPost)}
                  onChange={() => togglePostStatus(story)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>

              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEditClick(story)}
              />
              <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => openConfirm(story.id)}
              />
            </div>

            <DeleteSuccessStory
              open={confirmOpen}
              storyId={deleteId}
              onCancel={() => setConfirmOpen(false)}
              onSuccess={fetchStories}
            />

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">
                {story.name || "No Name"}
              </div>
              <div className="text-sm text-gray-700">
                {story.collage_name} • {story.branch}
              </div>
              <div className="text-sm text-gray-700">
                Company: {story.company_name} ({story.LPA} LPA)
              </div>

              {story.text && (
                <div className="text-gray-800 italic">"{story.text}"</div>
              )}

              {story.attachment && (
                <a
                  href={story.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  View Attachment
                </a>
              )}

              {story.date && (
                <div className="text-sm text-gray-600">
                  Date: {new Date(story.date).toLocaleDateString()}
                </div>
              )}

              <div className="text-xs text-gray-500">
                {story.timestamp
                  ? new Date(story.timestamp).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditOpen && selectedStory && (
        <EditSuccessStoryModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          story={selectedStory}
          refreshData={fetchStories}
        />
      )}
    </>
  );
}
