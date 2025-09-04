// src/app/components/ActsCircularFormModal.js
"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function ActsCircularFormModal({
  isOpen,
  setIsOpen,
  currentCircular = null, // Prop for editing existing circular
  circularType, // New prop: "SBTE Norms" or "DSTTE Norms"
  onSuccess, // Callback for successful add/edit
}) {
  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [attachment, setAttachment] = useState(""); // Stores the URL of the attachment
  const [file, setFile] = useState(null); // Stores the actual file object for upload
  const [type, setType] = useState(circularType); // Initialize type from prop
  const [uploading, setUploading] = useState(false); // For file upload progress
  const [loading, setLoading] = useState(false); // For form submission (add/update)
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");

  // Effect to manage initial state when modal opens or currentCircular/circularType changes
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
    }
    if (isOpen) {
      if (currentCircular) {
        // Populate form for editing
        setId(currentCircular.id);
        setTitle(currentCircular.title);
        setAttachment(currentCircular.attachment);
        setType(currentCircular.type); // Set type from currentCircular
        setFile(null); // Clear file input when editing, as attachment URL is already set
      } else {
        // Reset form for adding new item
        setId(null);
        setTitle("");
        setAttachment("");
        setFile(null);
        setType(circularType); // Set type from the prop for new additions
      }
      // IMPORTANT: Clear both messages when the modal is opened
      setError(null);
      setSuccessMessage("");
    }
  }, [isOpen, currentCircular, circularType]);

  // Update type state if circularType prop changes (important if modal reused for different types)
  useEffect(() => {
    setType(circularType);
  }, [circularType]);

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null); // Clear file if nothing selected
      setAttachment(""); // Clear attachment URL as well
      return;
    }

    setFile(selectedFile);
    setUploading(true);
    setError(null); // Clear any previous errors before starting upload
    setSuccessMessage(null); // Clear any previous success messages

    try {
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(",")[1];
        const response = await axios.post(
          `/api/presign/upload`,
          {
            base64: base64Data,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status && response.data.path) {
          setAttachment(response.data.path); // Set the URL from the successful upload
          setSuccessMessage("File uploaded successfully!");
          setTimeout(() => setSuccessMessage(""), 3000); // Clear file upload success message after delay
        } else {
          // API responded, but with status: false (e.g., backend validation error)
          setError(response.data.message || "Failed to upload file.");
        }
      };
      reader.readAsDataURL(selectedFile); // Read file as base64
    } catch (err) {
      // This path is for actual network errors (e.g., 4xx, 5xx HTTP codes, no internet)
      console.error("Upload failed:", err);
      if (err.response) {
        setError(
          err.response.data.message ||
            `Server error during upload: ${err.response.status}`
        );
      } else if (err.request) {
        setError(
          "No response from server during upload. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred during file upload.");
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission (Add/Update Circular)
  const handleSubmit = async () => {
    if (!title || !attachment || !type) {
      setError("Title, Type, and Attachment are required.");
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors before submission
    setSuccessMessage(null); // Clear any previous success messages

    try {
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const payload = { title, type, attachment };
      let response;

      if (id) {
        // Update existing circular
        response = await axios.put(
          `/api/admin/act_circular`,
          { id, ...payload },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Add new circular
        response = await axios.post(`/api/admin/act_circular`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // Check the API response status explicitly
      if (response.data.status) {
        setSuccessMessage(
          id ? "Item updated successfully!" : "Item added successfully!"
        );
        onSuccess(); // Callback to parent for data refresh

        // Close modal and clear messages after a short delay
        setTimeout(() => {
          setIsOpen(false);
          setSuccessMessage(""); // Ensure success message is cleared upon modal close
          setError(""); // Ensure error message is cleared upon modal close
        }, 1500); // Adjust delay as needed
      } else {
        // API responded, but with status: false (e.g., validation error from backend)
        setError(
          response.data.message || `Failed to ${id ? "update" : "add"} item.`
        );
        // Ensure success message is not shown if form submission failed
        setSuccessMessage(null);
      }
    } catch (err) {
      // This catch block is for actual network errors (e.g., 4xx, 5xx HTTP codes)
      console.error(`Item ${id ? "update" : "add"} failed:`, err);
      if (err.response) {
        setError(
          err.response.data.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred.");
      }
      // Important: Ensure success message is not shown if an error occurs
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => !loading && !uploading && setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              {id ? `Edit ${type}` : `Add ${type}`}
            </Dialog.Title>
            <button
              onClick={() => !loading && !uploading && setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading || uploading}
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Display Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          {/* Display Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded mb-4">
              <AiOutlineCheckCircle size={20} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div className="flex-1">
              <label className="block text-sm mb-1 font-medium">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading || uploading}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-1 font-medium">Type</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={type}
                readOnly // Type should not be editable in this modal context
                disabled={true}
              />
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium">
                  Upload PDF/IMAGE
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*" // Allow both PDF and images
                  onChange={handleFileChange}
                  disabled={loading || uploading}
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                )}
                {attachment && !uploading && (
                  <p className="text-sm text-gray-600 mt-1">
                    Current file:{" "}
                    <a
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {attachment.split("/").pop()}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || uploading}
              >
                {loading ? "Saving..." : id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
