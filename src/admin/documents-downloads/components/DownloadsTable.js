"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
// import { getAuthToken } from "@/app/utility/auth";

// Reusable Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-blue-900 mb-4">
            Confirm Deletion
          </Dialog.Title>
          <p className="mb-6">Are you sure you want to delete this download?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// Added refreshTrigger and onSuccessWithMessage props for consistency
export default function DownloadsTable({
  onEdit,
  refreshTrigger,
  onSuccessWithMessage,
}) {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [downloadToDelete, setDownloadToDelete] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
    }
  }, []);

  // Manual date formatter (no external packages) - unchanged, as it's already correct
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Ensures date is treated in local timezone for consistent DD-MM-YYYY display
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  // Function to fetch downloads from the API
  const fetchDownloads = async () => {
    setLoading(true);
    try {
      // const authToken = getAuthToken(); // Assuming getAuthToken() returns the token

      const response = await axios.get(`/api/web/downloads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        setDownloads(response.data.body || []); // Ensure it's an array
      } else {
        onSuccessWithMessage?.(
          response.data.message || "Failed to fetch downloads."
        );
      }
    } catch (err) {
      console.error("Error fetching downloads:", err);
      if (err.response) {
        onSuccessWithMessage?.(
          err.response.data.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        onSuccessWithMessage?.(
          "No response from server. Please check your internet connection."
        );
      } else {
        onSuccessWithMessage?.(
          "An unexpected error occurred while fetching downloads."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when component mounts or when refreshTrigger is updated
  useEffect(() => {
    fetchDownloads();
  }, [refreshTrigger, token]); // Added token as dependency

  // Handler for clicking the delete icon
  const handleDeleteClick = (download) => {
    setDownloadToDelete(download);
    setShowDeleteConfirm(true);
  };

  // Confirms and executes the delete operation
  const confirmDelete = async () => {
    if (!downloadToDelete) return;

    setShowDeleteConfirm(false); // Close the confirmation modal
    setLoading(true); // Show loading during delete operation

    try {
      // const authToken = getAuthToken();
      if (!token) {
        onSuccessWithMessage?.(
          "Authentication token not found. Please log in."
        );
        setLoading(false);
        return;
      }

      const response = await axios.delete(`/api/admin/downloads`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: downloadToDelete.id }, // Send id in data for DELETE request
      });

      if (response.data.status) {
        onSuccessWithMessage?.("Download deleted successfully!"); // Use global success message
        fetchDownloads(); // Re-fetch data to update table
      } else {
        onSuccessWithMessage?.(
          response.data.message || "Failed to delete download."
        );
      }
    } catch (err) {
      console.error("Error deleting download:", err); // Log the specific error
      if (err.response) {
        onSuccessWithMessage?.(
          err.response.data.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        onSuccessWithMessage?.(
          "No response from server. Please check your internet connection."
        );
      } else {
        onSuccessWithMessage?.(
          "An unexpected error occurred while deleting the download."
        );
      }
    } finally {
      setDownloadToDelete(null); // Clear download to delete
      setLoading(false);
    }
  };

  // Handler for clicking the edit icon
  const handleEditClick = (download) => {
    if (typeof onEdit === "function") {
      onEdit(download); // Call the onEdit function passed from parent (page.js)
    } else {
      console.error("onEdit prop is not a function.");
      onSuccessWithMessage?.("Edit functionality is not properly configured.");
    }
  };

  // Conditional rendering for loading, error, and no data states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <p className="text-gray-600">Loading downloads...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-4 h-[85vh]">
      <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
        {/* Fixed Header */}
        <div className="shrink-0">
          <table className="min-w-full table-fixed">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-3 py-2 border w-10">SL NO</th>
                <th className="px-3 py-2 border w-32">TITLE</th>
                <th className="px-3 py-2 border w-16">ATTACHMENT</th>
                <th className="px-3 py-2 border w-16">CREATED AT</th>
                <th className="px-3 py-2 border w-16">ACTION</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body that fills remaining height */}
        <div className="overflow-y-auto grow">
          <table className="min-w-full table-fixed">
            <tbody>
              {downloads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No downloads found.
                  </td>
                </tr>
              ) : (
                downloads.map((item, index) => (
                  <tr key={item.id} className="even:bg-blue-50">
                    <td className="px-3 py-2 border w-10">{index + 1}.</td>
                    <td className="px-3 py-2 border w-32">{item.title}</td>
                    <td className="px-3 py-2 border w-16">
                      <a
                        href={item.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block"
                        title={
                          item.attachment
                            ? item.attachment.split("/").pop()
                            : ""
                        }
                      >
                        {item.attachment
                          ? item.attachment.split("/").pop()
                          : "N/A"}
                      </a>
                    </td>
                    {/* Applying the formatDate function here */}
                    <td className="px-3 py-2 border w-16">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-3 py-2 border w-16">
                      <div className="flex gap-2">
                        <button
                          className="bg-yellow-400 text-white px-2 py-1 rounded" // Consistent styling
                          onClick={() => handleEditClick(item)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(item)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
