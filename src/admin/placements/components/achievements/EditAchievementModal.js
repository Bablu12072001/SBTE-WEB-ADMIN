import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function EditAchievementModal({
  isOpen,
  setIsOpen,
  achievement,
  refreshData,
}) {
  const [token, setToken] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    id: "",
    text: "",
    attachment: "",
    date: "",
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
    if (!achievement) return;

    setFormData({
      id: achievement.id ?? "",
      text: achievement.text ?? "",
      attachment: achievement.attachment ?? "",
      date: achievement.date ? achievement.date.split("T")[0] : "",
    });
  }, [achievement]);

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
          setFormData((prev) => ({ ...prev, attachment: path }));
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
      text: formData.text,
      attachment: formData.attachment,
      date: formData.date,
    };

    try {
      const res = await axios.put("/api/admin/achievement", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data && res.data.status) {
        if (typeof refreshData === "function") refreshData();
        setIsOpen(false);
      } else {
        console.error("PUT /api/admin/achievement returned:", res.data);
        alert("Failed to update achievement. See console for details.");
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message || err);
      alert("An error occurred while updating. Check console for details.");
    }
  };

  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-900">
            Edit Achievement
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
            <label className="block text-sm font-medium">Text</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Attachment</label>
            {formData.attachment && (
              <p className="text-blue-700 underline mb-1">
                <a
                  href={formData.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {String(formData.attachment).split("/").pop()}
                </a>
              </p>
            )}

            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
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
