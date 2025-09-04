"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { AiOutlineCheckCircle } from "react-icons/ai";
import LoadingBar from "react-top-loading-bar";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

const UpdateGalleryModel = ({
  isOpen,
  closeModal,
  imageData,
  refreshGallery,
}) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");

    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        console.log("Decoded token:", decoded);
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
          "/api-proxy/presign/gallery",
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
          setAttachment(path);
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
    if (!attachment) {
      alert("Please upload the file before submitting.");
      return;
    }

    setLoading(true);

    const payload = {
      title: title,
      url: attachment,
    };

    try {
      const response = await axios.post("/api-proxy/admin/gallery", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Syllabus created:", response.data);
    } catch (error) {
      console.error("Error submitting image:", error);
    } finally {
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
            {imageData ? "Edit Image" : "Add New Image"}
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
              Select Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
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

          {previewUrl && (
            <div className="flex justify-center mt-2">
              <Image
                src={previewUrl}
                alt="Preview"
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
            </div>
          )}

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
            >
              {imageData ? "Update Image" : "Add Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGalleryModel;
