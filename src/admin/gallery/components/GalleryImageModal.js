"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { AiOutlineCheckCircle } from "react-icons/ai";
import LoadingBar from "react-top-loading-bar";
import { jwtDecode } from "jwt-decode";

const GalleryImageModel = ({
  isOpen,
  closeModal,
  imageData,
  refreshGallery,
}) => {
  const [folderName, setFolderName] = useState("");
  const [eventName, setEventName] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingPreviews, setExistingPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const [thumbImage, setThumbImage] = useState("");
  const [token, setToken] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [folderOptions, setFolderOptions] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }

    if (imageData) {
      // Editing existing
      setFolderName(imageData.folder_name || "");
      setEventName(imageData.event_name || "");
      setImageUrls(imageData.images || []);
      setExistingPreviews(imageData.images || []);
      setThumbImage(imageData.thumb_image || "");
    } else {
      // Adding new gallery: reset and fetch folders
      setFolderName("");
      setEventName("");
      setImageUrls([]);
      setExistingPreviews([]);
      setThumbImage("");

      // Fetch folder list
      axios
        .get("/api/web/event_gallery")
        .then((res) => {
          if (res.data.status) {
            setFolderOptions(res.data.body || []);
          }
        })
        .catch((err) => {
          console.error("Failed to load folders:", err);
        });
    }
  }, [imageData]);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    setUploading(true);
    const newUploadProgress = {};
    const newImageUrls = [];
    const newPreviews = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Data = reader.result.split(",")[1];
        try {
          const response = await axios.post(
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
                newUploadProgress[file.name] = percent;
                setUploadProgress({ ...newUploadProgress });
              },
            }
          );

          const { status, path } = response.data;
          if (status && path) {
            newImageUrls.push(path);
            newPreviews.push(URL.createObjectURL(file));
            if (!thumbImage) setThumbImage(path); // Set first uploaded as thumbnail
          } else {
            alert("Failed to upload " + file.name);
          }
        } catch (err) {
          console.error("Upload error:", err);
        }

        if (i === selectedFiles.length - 1) {
          setImageUrls((prev) => [...prev, ...newImageUrls]);
          setPreviews((prev) => [...prev, ...newPreviews]);
          setUploading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allImages = [...imageUrls];

    if (!eventName || !folderName || !thumbImage || allImages.length === 0) {
      alert("Please fill all fields and upload at least one image.");
      return;
    }

    setLoading(true);
    setProgress(30);

    const payload = {
      id: imageData?.id || imageData?._id,
      folder_name: folderName,
      event_name: eventName,
      thumb_image: thumbImage,
      images: allImages,
    };

    const apiMethod = imageData ? "put" : "post";

    try {
      await axios[apiMethod]("/api/admin/gallery", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setProgress(100);
      setSuccessMessage(
        imageData
          ? "Gallery updated successfully."
          : "Gallery added successfully."
      );

      if (!imageData) resetForm();

      setTimeout(() => {
        setSuccessMessage("");
        resetForm();
        closeModal();
        refreshGallery();
      }, 500);
    } catch (error) {
      console.error("Error submitting gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFolderName("");
    setEventName("");
    setFiles([]);
    setPreviews([]);
    setExistingPreviews([]);
    setImageUrls([]);
    setThumbImage("");
    setUploadProgress({});
    setProgress(0);
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
            {imageData ? "Edit Gallery" : "Add New Gallery"}
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
            <label className="block text-sm mb-1 font-medium">Folder</label>

            {imageData ? (
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            ) : (
              <select
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="" disabled>
                  Select folder
                </option>
                {folderOptions
                  .filter(
                    (folder) =>
                      folder.folder_name !== "Latest Images" &&
                      folder.folder_name !== "latestImages"
                  )
                  .map((folder) => (
                    <option key={folder.id} value={folder.folder_name}>
                      {folder.folder_name}
                    </option>
                  ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Event Name (with year)
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {uploading &&
            Object.entries(uploadProgress).map(([fileName, percent]) => (
              <div key={fileName} className="mt-1">
                <p className="text-xs text-gray-600">
                  {fileName}: {percent}%
                </p>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}

          {(existingPreviews.length > 0 || previews.length > 0) && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[...existingPreviews, ...previews].map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  className="h-20 w-full object-cover rounded border"
                />
              ))}
            </div>
          )}

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
              disabled={loading}
            >
              {imageData ? "Update Gallery" : "Add Gallery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryImageModel;
