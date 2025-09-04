"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

export default function DownloadsFormModal({
  isOpen,
  setIsOpen,
  currentDownload = null,
  onSuccess,
  onSuccessWithMessage,
}) {
  const [form, setForm] = useState({
    id: null,
    title: "",
    attachment: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
    }

    if (!isOpen) {
      // Reset form and states when modal closes
      setForm({
        id: null,
        title: "",
        attachment: "",
      });
      setUploading(false); // Reset uploading state
      setSubmitting(false); // Reset submitting state
      return;
    }

    if (currentDownload) {
      setForm({
        id: currentDownload.id || null,
        title: currentDownload.title || "",
        attachment: currentDownload.attachment || "",
      });
    } else {
      // Ensure clean state for "Add New" when modal opens without editData
      setForm({
        id: null,
        title: "",
        attachment: "",
      });
    }
  }, [isOpen, currentDownload]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setForm((prev) => ({ ...prev, attachment: "" }));
      return;
    }

    setUploading(true);
    onSuccessWithMessage?.("Uploading file...");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];
        const response = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: file.name,
            fileType: file.type,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status && response.data.path) {
          setForm((prev) => ({ ...prev, attachment: response.data.path }));
          onSuccessWithMessage?.("File uploaded successfully!");
        } else {
          onSuccessWithMessage?.(
            response.data.message || "Failed to upload file."
          );
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload failed:", err);
      if (err.response) {
        onSuccessWithMessage?.(
          err.response.data.message ||
            `Server error during upload: ${err.response.status}`
        );
      } else if (err.request) {
        onSuccessWithMessage?.(
          "No response from server during upload. Please check your internet connection."
        );
      } else {
        onSuccessWithMessage?.(
          "An unexpected error occurred during file upload."
        );
      }
    } finally {
      setUploading(false); // End uploading
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.attachment) {
      onSuccessWithMessage?.("Title and attachment are required.");
      return;
    }

    setSubmitting(true); // Disable button during submission

    try {
      const payload = { title: form.title, attachment: form.attachment };
      let response;
      let message;

      if (form.id) {
        response = await axios.put(
          "/api/admin/downloads",
          { id: form.id, ...payload },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message = "Download updated successfully!";
      } else {
        response = await axios.post("/api/admin/downloads", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        message = "Download added successfully!";
      }

      if (response.data.status) {
        onSuccessWithMessage?.(message);
        onSuccess?.(); // Trigger table refresh and close modal via page.js
      } else {
        onSuccessWithMessage?.(
          response.data.message ||
            `Failed to ${form.id ? "update" : "add"} download.`
        );
      }
    } catch (err) {
      console.error(`Download ${form.id ? "update" : "add"} failed:`, err);
      if (err.response) {
        onSuccessWithMessage?.(
          err.response.data.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        onSuccessWithMessage?.(
          "No response from server. Please check your internet connection."
        );
      } else {
        onSuccessWithMessage?.("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false); // Re-enable button
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)} // Always allow closing unless submitting/uploading
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              {form.id ? "Edit Download Details" : "Add Downloads Details"}
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)} // This explicitly closes the modal
              className="text-gray-500 hover:text-gray-700"
              disabled={submitting || uploading} // Disable if an operation is in progress
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex-1">
              <label className="block text-sm mb-1 font-medium">Title</label>
              <input
                type="text"
                name="title" // Added name attribute for consistency
                className="w-full border rounded px-3 py-2"
                value={form.title}
                onChange={handleChange}
                disabled={submitting || uploading}
              />
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium">
                  Upload PDF/IMAGE
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  disabled={submitting || uploading}
                />

                {form.attachment && !uploading && (
                  <p className="text-sm text-gray-600 mt-1">
                    Current file:{" "}
                    <a
                      href={form.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {form.attachment.split("/").pop()}
                    </a>
                  </p>
                )}
              </div>
            </div>
            {uploading && (
              <p className="text-sm text-blue-600 mt-1">Uploading...</p>
            )}

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || uploading}
              >
                {submitting ? "Saving..." : form.id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
