"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

export default function SOPSManualFormModal({
  isOpen,
  onClose,
  editData,
  refreshData,
  onSuccessWithMessage, // New prop
}) {
  const [form, setForm] = useState({
    name: "",
    publish_date: "",
    version: "",
    description: "",
    attachment: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Not used, can be removed if not needed
  const [token, setToken] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        publish_date: editData.publish_date,
        version: editData.version,
        description: editData.description,
        attachment: editData.attachment,
      });
    } else {
      setForm({
        name: "",
        publish_date: "",
        version: "",
        description: "",
        attachment: "",
      });
    }
  }, [editData]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];

      setUploading(true);
      try {
        const res = await axios.post(
          "/api/presign/upload",
          {
            base64,
            fileName: file.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.status) {
          setForm((prev) => ({ ...prev, attachment: res.data.path }));
        } else {
          alert("Upload failed"); // Consider using a more user-friendly error display
        }
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      created_by: "admin_user", // Assuming this is hardcoded or comes from user context
    };

    try {
      let response;
      if (editData) {
        response = await axios.put(
          "/api/admin/usermanual",
          {
            id: editData.id,
            ...payload,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.status) {
          onSuccessWithMessage?.("User Manual updated successfully!");
        }
      } else {
        response = await axios.post("/api/admin/usermanual", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.status) {
          onSuccessWithMessage?.("User Manual added successfully!");
        }
      }

      if (typeof refreshData === "function") {
        refreshData(); // Refresh the table
      }
      onClose(); // Close the modal
    } catch (err) {
      console.error("Submit error:", err);
      // You might want to show an error message here
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              {editData ? "Edit" : "Add"} SOPs & User Manual
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2"
              placeholder="Name"
            />
            <input
              type="date"
              name="publish_date"
              value={form.publish_date}
              onChange={handleChange}
              className="w-full border px-3 py-2"
            />
            <input
              type="text"
              name="version"
              value={form.version}
              onChange={handleChange}
              className="w-full border px-3 py-2"
              placeholder="Version"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2"
              placeholder="Description"
            />

            <div>
              <label className="block mb-1">Upload File (PDF/Image)</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border px-3 py-2"
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-1">Uploading...</p>
              )}
              {form.attachment && (
                <a
                  href={form.attachment}
                  target="_blank"
                  className="text-blue-600 text-sm underline mt-2 block"
                >
                  View Uploaded File
                </a>
              )}
            </div>
          </div>

          <div className="text-right mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
            >
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
