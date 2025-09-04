// src/app/components/ActsCircularTable.js
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

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

export default function ActsCircularTable({ type, onEdit, onDataChange }) {
  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
    } else {
      console.error("Authentication token not found.");
      setError("Authentication token not found. Please log in.");
    }
  }, []);

  // Manual date formatter (no external packages)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  // Function to fetch Acts & Circulars from the API
  const fetchActsCirculars = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(`/api/web/act_circular`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("dstte: ", response.data);

      if (response.data.status) {
        setItems(response.data.body);
      } else {
        setError(response.data.message || "Failed to fetch data.");
      }
    } catch (err) {
      console.error("Error fetching Acts & Circulars:", err);
      if (err.response) {
        setError(
          err.response.data.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred while fetching data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when component mounts or when type/onDataChange is triggered
  useEffect(() => {
    fetchActsCirculars();
  }, [type, onDataChange]); // Refetch when the tab changes or parent signals data change

  // Handler for clicking the delete icon
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // Confirms and executes the delete operation
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setShowDeleteConfirm(false);
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.delete(`/api/admin/act_circular`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: itemToDelete.id },
      });

      if (response.data.status) {
        setSuccessMessage("Item deleted successfully!");
        onDataChange();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.data.message || "Failed to delete item.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      if (err.response) {
        setError(
          err.response.data.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred while deleting the item.");
      }
    } finally {
      setItemToDelete(null); // Clear item to delete
      setLoading(false);
    }
  };

  // Handler for clicking the edit icon
  const handleEditClick = (item) => {
    if (typeof onEdit === "function") {
      onEdit(item); // Call the onEdit function passed from parent (page.js)
    } else {
      console.error("onEdit prop is not a function in ActsCircularTable.");
      setError("Edit functionality is not properly configured.");
    }
  };

  // Conditional rendering for loading, error, and no data states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <p className="text-gray-600">Loading {type}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-4 h-[85vh]">
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}
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
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No {type} found.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="even:bg-blue-50">
                    <td className="px-3 py-2 border w-10">{index + 1}.</td>
                    <td className="px-3 py-2 border w-32">{item.title}</td>
                    <td className="px-3 py-2 border w-16">
                      <a
                        href={item.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block" // Added truncate for long filenames
                        title={
                          item.attachment
                            ? item.attachment.split("/").pop()
                            : ""
                        } // Tooltip for full filename
                      >
                        {item.attachment
                          ? item.attachment.split("/").pop()
                          : "N/A"}
                      </a>
                    </td>
                    <td className="px-3 py-2 border w-16">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-3 py-2 border w-16">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
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
