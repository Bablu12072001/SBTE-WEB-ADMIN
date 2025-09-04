"use client";

// import { getAuthToken } from "@/app/utility/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import OfficialLettersFormModal from "./OfficialLettersFormModal";
import { Dialog } from "@headlessui/react";
// Reusable Delete Confirmation Modal (can be a separate component if used frequently)
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-blue-900 mb-4">
            Confirm Deletion
          </Dialog.Title>
          <p className="mb-6">
            Are you sure you want to delete this Official Letter?
          </p>
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

export default function OfficialLettersTable({
  refreshTrigger,
  onSuccessWithMessage,
  onEdit,
}) {
  // Added onEdit prop
  const [token, setToken] = useState("");
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
    }
  }, []);

  const fetchOfficialLetters = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/web/official_letter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setLetters(response.data.body);
      }
    } catch (error) {
      console.error("Failed to fetch official letters:", error);
      // Optionally, show an error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficialLetters();
  }, [refreshTrigger]); // Depend on refreshTrigger to refetch

  const handleDeleteClick = (id) => {
    setItemToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDeleteId) return;

    setShowDeleteConfirm(false); // Close the confirmation modal
    setLoading(true); // Show loading during delete operation

    try {
      const response = await axios.delete("/api/admin/official_letter", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: itemToDeleteId },
      });
      if (response.data.status) {
        onSuccessWithMessage?.("Official Letter deleted successfully!"); // Show success message
        fetchOfficialLetters(); // Re-fetch data to update table
      } else {
        console.error("Delete failed:", response.data.message);
        // You might want to show an error message here
      }
    } catch (error) {
      console.error("Failed to delete letter:", error);
      // You might want to show an error message here
    } finally {
      setItemToDeleteId(null); // Clear item to delete
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="overflow-x-auto px-4 h-[85vh]">
      <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
        <div className="shrink-0">
          <table className="min-w-full table-fixed">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-3 py-2 border w-10">SL NO</th>
                <th className="px-3 py-2 border w-16">PUBLISH DATE</th>
                <th className="px-3 py-2 border w-16">TITLE</th>
                <th className="px-3 py-2 border w-32">DESCRIPTION</th>
                <th className="px-3 py-2 border w-16">ATTACHMENT</th>
                <th className="px-3 py-2 border w-16">ACTION</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="overflow-y-auto grow">
          <table className="min-w-full table-fixed">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : letters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No official letters found
                  </td>
                </tr>
              ) : (
                letters.map((item, index) => (
                  <tr key={item.id} className="even:bg-blue-50">
                    <td className="px-3 py-2 border w-10">{index + 1}.</td>
                    {/* <td className="px-3 py-2 border w-16">{item.date}</td> */}
                    {/* <td className="px-3 py-2 border w-16">
                      {item.date ? item.date.split("T")[0] : "N/A"}
                    </td> */}
                    <td className="px-3 py-2 border w-16">{item.date}</td>

                    <td className="px-3 py-2 border w-16">{item.title}</td>
                    <td className="px-3 py-2 border w-32">
                      {item.description}
                    </td>
                    <td className="px-3 py-2 border w-16">
                      <a
                        href={item.attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View File
                      </a>
                    </td>
                    <td className="px-3 py-2 border w-16">
                      <div className="flex gap-2">
                        <button
                          // className="bg-yellow-400 text-white px-2 py-1 rounded" // Apply styling for edit button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => onEdit(item)} // Use the onEdit prop directly
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(item.id)} // Use handleDeleteClick
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
