import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function RecentPlacementsModal({
  isOpen,
  setIsOpen,
  onSuccess,
}) {
  const [companyName, setCompanyName] = useState("");
  const [companyPhoto, setCompanyPhoto] = useState("");
  const [placedDate, setPlacedDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken); // Just to validate token
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleImageUpload = async (e) => {
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
          { base64: base64Data, fileName: selectedFile.name },
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
          setCompanyPhoto(path);
        } else {
          alert("Failed to upload image.");
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
    const payload = {
      company_name: companyName,
      company_photo: companyPhoto,
      placed_date: placedDate,
    };

    try {
      await axios.post("/api/admin/recent_placement", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(
        "Error adding placement:",
        error.response?.data || error.message
      );
      alert("Error submitting placement. Check console for details.");
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
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              Add Recent Placement
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 font-medium">
                Company Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Company Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {companyPhoto && (
                <img
                  src={companyPhoto}
                  alt="Company"
                  className="mt-2 h-16 rounded"
                />
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Placed Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={placedDate}
                onChange={(e) => setPlacedDate(e.target.value)}
              />
            </div>

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
                {uploading ? "Uploading..." : "Create"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
