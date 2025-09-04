import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function EditJobCarouselModal({
  isOpen,
  setIsOpen,
  carousel,
  refreshData,
}) {
  const [token, setToken] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    id: "",
    image: "",
    label: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch (err) {
        console.warn("jwtDecode failed (token may be invalid).", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!carousel) return;
    setFormData({
      id: carousel.id ?? "",
      image: carousel.image ?? "",
      label: carousel.label ?? "",
    });
  }, [carousel]);

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
          setFormData((prev) => ({ ...prev, image: path }));
        } else {
          alert("Failed to upload file. Server returned unexpected response.");
          console.error("Presign response:", res.data);
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed. Check console for details.");
      } finally {
        setUploading(false);
        setTimeout(() => setUploadProgress(0), 600);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (uploading) {
      alert("Please wait for the file to finish uploading.");
      return;
    }

    const payload = {
      id: formData.id,
      image: formData.image,
      label: formData.label,
    };

    try {
      const res = await axios.put("/api/admin/job_carousel", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data && res.data.status) {
        if (typeof refreshData === "function") refreshData();
        setIsOpen(false);
      } else {
        console.error("PUT /api/admin/job_carousel returned:", res.data);
        alert("Failed to update job carousel. See console for details.");
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message || err);
      alert("An error occurred while updating. Check console for details.");
    }
  };

  if (!isOpen || !carousel) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-900">
            Edit Job Carousel
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">ID</label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Label</label>
            <input
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            {formData.image && (
              <p className="text-blue-700 underline mb-1 break-words max-w-full">
                <a
                  href={formData.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words block"
                >
                  {String(formData.image).split("/").pop()}
                </a>
              </p>
            )}

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileUpload}
              className="mt-1"
            />
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
          </div>

          <div className="text-right">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
