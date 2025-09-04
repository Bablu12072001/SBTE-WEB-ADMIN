import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function UpcomingPlacementsModal({
  isOpen,
  setIsOpen,
  onSuccess,
}) {
  const [companyName, setCompanyName] = useState("");
  const [companyPhoto, setCompanyPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState("");

  // reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCompanyName("");
      setCompanyPhoto("");
      setUploading(false);
      setUploadProgress(0);
    }
  }, [isOpen]);

  // load token once
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken") || "";
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch (err) {
        // token may be invalid — still set it so server will return 401 if needed
        console.warn("jwtDecode failed:", err);
      }
    }
  }, []);

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = String(reader.result).split(",")[1];
      setUploading(true);
      setUploadProgress(0);

      try {
        const res = await axios.post(
          "/api/presign/upload",
          { base64: base64Data, fileName: selectedFile.name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percent);
              }
            },
          }
        );

        const { status, path } = res.data || {};
        if (status && path) {
          setCompanyPhoto(path);
        } else {
          alert("Failed to upload image. Server returned unexpected response.");
          console.error("Presign upload response:", res.data);
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed. Check console for details.");
      } finally {
        setUploading(false);
        // briefly show final progress then reset
        setTimeout(() => setUploadProgress(0), 600);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const canSubmit = () => {
    return !!(companyName && companyPhoto);
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      alert("Please provide company name and company photo.");
      return;
    }

    const payload = {
      company_name: companyName,
      company_photo: companyPhoto,
    };

    try {
      const res = await axios.post("/api/admin/upcoming_placement", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data && res.data.status) {
        setIsOpen(false);
        if (typeof onSuccess === "function") onSuccess();
      } else {
        console.error("API returned failure:", res.data);
        alert("Failed to create upcoming placement. See console for details.");
      }
    } catch (err) {
      console.error(
        "Error creating upcoming placement:",
        err.response?.data || err.message || err
      );
      alert("Error submitting. Check console for details.");
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
              Add Upcoming Placement
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
                Company Name *
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
                Company Photo *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {companyPhoto && (
                <div className="mt-2">
                  <p className="text-blue-700 underline mb-1">
                    <a
                      href={companyPhoto}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {String(companyPhoto).split("/").pop()}
                    </a>
                  </p>
                  <img
                    src={companyPhoto}
                    alt="Company"
                    className="h-20 rounded object-contain border bg-white"
                  />
                </div>
              )}
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
                disabled={uploading || !canSubmit()}
                className={`px-6 py-2 rounded text-white ${
                  uploading || !canSubmit()
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
