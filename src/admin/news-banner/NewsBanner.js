import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillDelete, AiOutlineCheckCircle } from "react-icons/ai";
import NewsBannerModal from "./components/NewsBannerModal";
import useScreenSize from "../useScreenSize";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";

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

const NewsBanner = () => {
  const [expanded, setExpanded] = useState(false);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const isSmallScreen = useScreenSize();

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      fetchNewsBannerImages(storedToken);
    }
  }, []);

  const fetchNewsBannerImages = async (authToken) => {
    try {
      const response = await axios.get("/api/web/ads", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.status) {
        setImages(response.data.body);
      }
    } catch (error) {
      console.error("Error fetching news banner images:", error);
    }
  };

  const handleDeleteClick = (img) => {
    setImageToDelete(img);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete("/api/admin/ads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: imageToDelete.id,
          image: imageToDelete.image,
        },
      });

      if (response.data.status) {
        setSuccessMessage("Image deleted successfully!");
        fetchNewsBannerImages(token);
        setImageToDelete(null);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      <div
        className={`flex-1 overflow-auto gap-4 bg-slate-100 transition-all duration-300 ${
          expanded && !isSmallScreen ? "ml-56" : "ml-16 lg:ml-20"
        } ${isSmallScreen && expanded ? "ml-0" : ""}`}
      >
        <div className="sticky top-0 bg-slate-100">
          <DashboardHeader />
        </div>

        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-xl font-bold text-gray-700">
            News Banner Images
          </h2>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded"
            onClick={openModal}
          >
            Add / Edit News Banner
          </button>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded mb-4 mx-4">
            <AiOutlineCheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 pb-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative border rounded shadow-sm overflow-hidden group w-full h-[250px] bg-white"
            >
              <img
                src={img.image}
                alt={`News Banner ${img.id}`}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setFullscreenImage(img.image)}
              />
              <button
                onClick={() => handleDeleteClick(img)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                title="Delete image"
              >
                <AiFillDelete size={20} />
              </button>
            </div>
          ))}
        </div>

        {fullscreenImage && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
            onClick={() => setFullscreenImage(null)}
          >
            <img
              src={fullscreenImage}
              alt="Full Screen"
              className="max-w-full max-h-full rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-3 py-1"
              onClick={() => setFullscreenImage(null)}
              title="Close"
            >
              &times;
            </button>
          </div>
        )}

        {imageToDelete && (
          <DeleteConfirmModal
            onConfirm={confirmDelete}
            onCancel={() => setImageToDelete(null)}
          />
        )}

        <NewsBannerModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          imageList={images}
          refreshImages={() => fetchNewsBannerImages(token)}
        />
      </div>
    </div>
  );
};

export default NewsBanner;
