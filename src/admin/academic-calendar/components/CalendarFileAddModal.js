"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function CalendarFileAddModal({ isOpen, setIsOpen, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token: ", decodedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploading(true);
      setUploadProgress(0);

      try {
        const response = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: selectedFile.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            },
          }
        );

        const { status, path } = response.data;
        if (status && path) {
          setFileUrl(path);
          setFile(selectedFile);
        } else {
          alert("Failed to upload file.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed. Check console for details.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!fileUrl || !title || !description) {
      alert("Please fill all fields and wait for upload.");
      return;
    }

    const payload = {
      title,
      description,
      attachment: fileUrl,
      created_by: "admin_user",
    };

    try {
      const response = await axios.post(
        "/api/admin/academic_calander",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Calendar file created:", response.data);
      if (response.data?.status) {
        if (onSuccess) onSuccess();
        setIsOpen(false);
      } else {
        alert("Failed to create calendar.");
      }
    } catch (error) {
      console.error(
        "Error submitting calendar file: ",
        error.response?.data || error.message
      );
      alert("Error submitting calendar file. Check console.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              Upload Academic Calendar
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Description
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Upload File (PDF, Excel, CSV, Image)
              </label>
              <input
                type="file"
                accept=".pdf,.csv,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
              />
              {uploading && (
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-700 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className={`px-6 py-2 rounded text-white ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-800"
                }`}
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
