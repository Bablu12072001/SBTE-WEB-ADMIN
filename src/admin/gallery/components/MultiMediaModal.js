import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { AiOutlineCheckCircle } from "react-icons/ai";
import LoadingBar from "react-top-loading-bar";

const MultimediaModal = ({ isOpen, closeModal, itemData, refreshGallery }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ytLink, setYtLink] = useState("");
  const [thumbImage, setThumbImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (itemData) {
      setTitle(itemData.title || "");
      setDescription(itemData.description || "");
      setYtLink(itemData.yt_link || "");
      setThumbImage(itemData.thumb_image || "");
      setPreviewImage(itemData.thumb_image || "");
      setDate(itemData.created_at ? itemData.created_at.split("T")[0] : "");
    } else {
      setTitle("");
      setDescription("");
      setYtLink("");
      setThumbImage("");
      setPreviewImage("");
      setDate("");
    }

    setSuccessMessage("");
    setProgress(0);
    setUploading(false);
    setUploadProgress(0);
    setLoading(false);
  }, [isOpen]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploading(true);
      setUploadProgress(0);

      try {
        const presignRes = await axios.post(
          "/api/presign/gallery",
          {
            base64: base64Data,
            fileName: file.name,
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

        if (presignRes.data.status && presignRes.data.path) {
          setThumbImage(presignRes.data.path);
          setPreviewImage(presignRes.data.path);
        } else {
          console.error("Image upload failed.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(30);

    try {
      const payload = {
        title,
        description,
        yt_link: ytLink,
        thumb_image: thumbImage,
        date,
        created_by: "admin",
      };

      if (itemData) {
        payload.id = itemData.id;
        await axios.put("/api/admin/multimedia", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSuccessMessage("Multimedia item updated successfully.");
      } else {
        await axios.post("/api/admin/multimedia", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSuccessMessage("Multimedia item added successfully.");
      }

      setProgress(100);
      refreshGallery();
      setTimeout(() => {
        setSuccessMessage("");
        closeModal();
        refreshGallery();
      }, 2000);
    } catch (error) {
      console.error("Error submitting multimedia:", error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <LoadingBar
          color="#3498db"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        {successMessage && (
          <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md mb-4">
            <AiOutlineCheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold text-blue-900">
            {itemData ? "Edit Multimedia" : "Add Multimedia"}
          </p>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              YouTube Link
            </label>
            <input
              type="url"
              value={ytLink}
              onChange={(e) => setYtLink(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded px-3 py-2"
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

            {previewImage && (
              <img
                src={previewImage}
                alt="Thumbnail Preview"
                className="mt-2 h-24 object-cover rounded border"
              />
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
              disabled={loading}
            >
              {itemData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultimediaModal;
