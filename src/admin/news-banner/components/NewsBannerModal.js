import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { AiOutlineCheckCircle, AiFillDelete } from "react-icons/ai";

const DeleteConfirmModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
      <p className="mb-4 text-gray-700">
        Are you sure you want to delete this image?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-300 text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const NewsBannerModal = ({ isOpen, closeModal, refreshImages }) => {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setImages([]);
      setNewImage(null);
      setPreviewUrl("");
      setSelectedDate("");
      setSuccessMessage("");
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    if (!newImage) return alert("Please select an image.");
    if (!selectedDate) return alert("Please select a date.");
    uploadImage();
  };

  const uploadImage = async () => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploading(true);
      setUploadProgress(0);

      try {
        const response = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: newImage.name,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (e) =>
              setUploadProgress(Math.round((e.loaded * 100) / e.total)),
          }
        );

        if (response.data.status && response.data.path) {
          const imageObj = {
            id: null,
            image: response.data.path,
            date: selectedDate,
          };
          setImages((prev) => [...prev, imageObj]);
          setSuccessMessage("Image added successfully!");
          setNewImage(null);
          setSelectedDate("");
          setPreviewUrl("");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else alert("Upload failed.");
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload error.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(newImage);
  };

  const confirmDelete = async () => {
    setImages((prev) =>
      prev.filter((img) => img.image !== imageToDelete.image)
    );
    setSuccessMessage("Image removed.");
    setTimeout(() => setSuccessMessage(""), 3000);
    setImageToDelete(null);
  };

  const handleSubmit = async () => {
    if (images.length === 0) return;

    try {
      const postRequests = images.map((img) =>
        axios.post(
          "/api/admin/ads",
          {
            image: img.image,
            date: img.date,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      await Promise.all(postRequests);
      setSuccessMessage("News Banner saved successfully!");
      setTimeout(() => {
        closeModal();
        refreshImages();
      }, 1500);
    } catch (err) {
      console.error("Failed to save news banner:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-md w-full max-w-lg shadow-lg overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add News Banner Images</h3>
          <button onClick={closeModal}>
            <IoClose size={24} />
          </button>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded mb-4">
            <AiOutlineCheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="mb-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <input
            type="date"
            className="mt-2 w-full border rounded px-3 py-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {previewUrl && (
            <div className="flex flex-col items-center mt-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 rounded object-cover"
              />
              <button
                onClick={handleUploadClick}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                disabled={uploading}
              >
                Add Image
              </button>
            </div>
          )}
        </div>

        {uploading && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded h-2">
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

        {images.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold mb-2">Newly Added Images:</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.image}
                    alt={`Uploaded ${idx}`}
                    className="h-24 w-full object-cover rounded"
                  />
                  <p className="text-xs mt-1 text-center text-gray-600">
                    {img.date}
                  </p>
                  <button
                    onClick={() => setImageToDelete(img)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                    title="Remove image"
                  >
                    <AiFillDelete size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-6 py-2 rounded"
            disabled={images.length === 0}
          >
            Save News Images
          </button>
        </div>

        {imageToDelete && (
          <DeleteConfirmModal
            onConfirm={confirmDelete}
            onCancel={() => setImageToDelete(null)}
          />
        )}
      </div>
    </div>
  );
};

export default NewsBannerModal;
