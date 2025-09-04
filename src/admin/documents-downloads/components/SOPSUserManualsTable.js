"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import SOPSManualFormModal from "./SOPSManualFormModal";
import { Dialog } from "@headlessui/react"; // Import Dialog for the confirmation modal

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
          <p className="mb-6">Are you sure you want to delete this item?</p>
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

export default function SOPSUserManualsTable({
  refreshTrigger,
  onSuccessWithMessage,
}) {
  // Added props
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation modal
  const [itemToDeleteId, setItemToDeleteId] = useState(null); // Store ID of item to delete

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
    }
  }, []);

  const fetchManuals = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/web/usermanual");
      if (res.data.status) {
        setData(res.data.body);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuals();
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
      const res = await axios.delete("/api/admin/usermanual", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: itemToDeleteId },
      });

      if (res.data.status) {
        onSuccessWithMessage?.("User Manual deleted successfully!"); // Show success message
        fetchManuals(); // Re-fetch data to update table
      } else {
        console.error("Delete failed:", res.data.message);
        // You might want to show an error message here
      }
    } catch (err) {
      console.error("Delete failed:", err);
      // You might want to show an error message here
    } finally {
      setItemToDeleteId(null); // Clear item to delete
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
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
                <th className="px-3 py-2 border w-24">PUBLISH DATE</th>
                <th className="px-3 py-2 border w-24">NAME</th>
                <th className="px-3 py-2 border w-32">DESCRIPTION</th>
                <th className="px-3 py-2 border w-16">VERSION</th>
                <th className="px-3 py-2 border w-32">ATTACHMENT</th>
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
                  <td colSpan={7} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No SOPs & User Manual found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="even:bg-blue-50">
                    <td className="px-3 py-2 border w-10">{index + 1}.</td>
                    {/* <td className="px-3 py-2 border w-24">
                      {item.publish_date}
                    </td> */}
                    <td className="px-3 py-2 border w-24">
                      {formatDate(item.publish_date)}
                    </td>
                    <td className="px-3 py-2 border w-24">{item.name}</td>
                    <td className="px-3 py-2 border w-32">
                      {item.description}
                    </td>
                    <td className="px-3 py-2 border w-16">{item.version}</td>
                    <td className="px-3 py-2 border w-32 truncate">
                      <a
                        href={item.attachment}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        View File
                      </a>
                    </td>
                    <td className="px-3 py-2 border w-16">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditData(item);
                            setModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)} // Use handleDeleteClick
                          className="text-red-600 hover:text-red-800"
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

      {/* Add/Edit Modal */}
      <SOPSManualFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        refreshData={fetchManuals} // This will trigger table refresh
        editData={editData}
        onSuccessWithMessage={onSuccessWithMessage} // Pass success message callback
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
