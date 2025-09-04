"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BULK_UPLOAD_API_MAP = {
  "EOA/LOA": "/api/admin/bulk/eoa_loa",
};

export default function BulkUploadDialog({ isOpen, setIsOpen }) {
  const [type, setType] = useState("EOA/LOA");
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
        jwtDecode(storedToken);
      } catch {
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
          "/api/presign/json",
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
          alert("File upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading file.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || !fileUrl || !type) {
      alert("Please select a file and wait for upload.");
      return;
    }

    try {
      const payload = {
        created_by: "admin",
        fileUrl: fileUrl,
      };

      const res = await axios.post(BULK_UPLOAD_API_MAP[type], payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data?.status) {
        alert("Upload successful");
        setIsOpen(false);
        setFile(null);
        setFileUrl("");
      } else {
        alert("Server error while submitting");
      }
    } catch (err) {
      console.error("Error submitting bulk upload:", err);
      alert("Submission failed. Check console.");
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
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              Bulk Upload
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-red-600"
            >
              <IoClose size={22} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Upload Type</label>
              <select
                value={type}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              >
                <option value="EOA/LOA">EOA/LOA</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Upload File (.xls or .xlsx)
              </label>
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="w-full"
              />
              {uploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className={`px-5 py-2 rounded text-white ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
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
