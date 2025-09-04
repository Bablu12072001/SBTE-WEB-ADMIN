import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function PlacementStatisticsModal({
  isOpen,
  setIsOpen,
  onSuccess,
}) {
  const [session, setSession] = useState("");
  const [placementRate, setPlacementRate] = useState("");
  const [companyVisited, setCompanyVisited] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleFileUpload = async (e, field) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploading(true);
      setUploadProgress(0);

      try {
        const res = await axios.post(
          "/api/presign/placement",
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
          if (field === "placementRate") setPlacementRate(path);
          if (field === "companyVisited") setCompanyVisited(path);
        } else {
          alert("Failed to upload file. Unexpected server response.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed. Check console for details.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    const payload = {
      session,
      placement_rate: placementRate,
      company_visited: companyVisited,
    };

    try {
      await axios.post("/api/admin/placement_statistics", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsOpen(false);
      setSession("");
      setPlacementRate("");
      setCompanyVisited("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(
        "Error adding placement statistics:",
        error.response?.data || error.message
      );
      alert("Possible Duplicate Session Entry. Try again!");
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
              Add Placement Statistics
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
              <label className="block text-sm mb-1 font-medium">Session</label>
              <input
                type="text"
                placeholder="e.g., 2022-2025"
                className="w-full border rounded px-3 py-2"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Placement Rate File
              </label>
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => handleFileUpload(e, "placementRate")}
              />
              {placementRate && (
                <p className="mt-2 text-sm text-blue-700 underline break-words">
                  <a
                    href={placementRate}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {placementRate.split("/").pop()}
                  </a>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Company Visited File
              </label>
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => handleFileUpload(e, "companyVisited")}
              />
              {companyVisited && (
                <p className="mt-2 text-sm text-blue-700 underline break-words">
                  <a
                    href={companyVisited}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {companyVisited.split("/").pop()}
                  </a>
                </p>
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
