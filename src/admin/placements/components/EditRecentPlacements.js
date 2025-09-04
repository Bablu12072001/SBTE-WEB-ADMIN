import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function EditRecentPlacementModal({
  isOpen,
  setIsOpen,
  placement,
  refreshData,
}) {
  const [token, setToken] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    id: "",
    company_name: "",
    company_photo: "",
    placed_date: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken); // Just to validate
      } catch {
        console.warn("Invalid token format.");
      }
    }
  }, []);

  useEffect(() => {
    if (placement) {
      setFormData({
        id: placement.id ?? "",
        company_name: placement.company_name ?? "",
        company_photo: placement.company_photo ?? "",
        placed_date: placement.placed_date
          ? placement.placed_date.split("T")[0]
          : "",
      });
    }
  }, [placement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = String(reader.result).split(",")[1];
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
              if (progressEvent.total) {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percent);
              }
            },
          }
        );

        const { status, path } = response.data || {};
        if (status && path) {
          setFormData((prev) => ({ ...prev, company_photo: path }));
        } else {
          alert("Failed to upload image.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Image upload failed.");
      } finally {
        setUploading(false);
        setTimeout(() => setUploadProgress(0), 600);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (uploading) {
      alert("Please wait for the upload to finish.");
      return;
    }

    try {
      const payload = {
        id: formData.id,
        company_name: formData.company_name,
        company_photo: formData.company_photo,
        placed_date: formData.placed_date,
      };

      const response = await axios.put("/api/admin/recent_placement", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.status) {
        if (typeof refreshData === "function") refreshData();
        setIsOpen(false);
      } else {
        alert("Failed to update placement.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating.");
    }
  };

  if (!isOpen || !placement) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-900">
            Edit Recent Placement
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* ID Field (read-only) */}
          <div>
            <label className="block text-sm font-medium">ID</label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Company Photo */}
          <div>
            <label className="block text-sm font-medium">Company Photo</label>
            {formData.company_photo && (
              <p className="text-blue-700 underline mb-1">
                <a
                  href={formData.company_photo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {String(formData.company_photo).split("/").pop()}
                </a>
              </p>
            )}
            <input type="file" accept="image/*" onChange={handleFileUpload} />
          </div>

          {/* Placed Date */}
          <div>
            <label className="block text-sm font-medium">Placed Date</label>
            <input
              type="date"
              name="placed_date"
              value={formData.placed_date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-2">
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

          {/* Save Button */}
          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              disabled={uploading}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
