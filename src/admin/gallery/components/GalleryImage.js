import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import LoadingBar from "react-top-loading-bar";
import GalleryImageModel from "./GalleryImageModal";
import { IoClose } from "react-icons/io5";
import AddFolderModal from "./AddFolderModal";

const GalleryImage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [token, setToken] = useState("");

  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [activeGalleryImages, setActiveGalleryImages] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
      fetchImages(token);
    }
  }, []);

  const fetchImages = async (token) => {
    setLoading(true);
    setProgress(30);
    try {
      const response = await axios.get("/api/admin/gallery", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setImages(response.data.body);
        setProgress(100);
        setTimeout(() => setLoading(false), 500);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/admin/gallery", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      });

      setImages(images.filter((img) => img.id !== id));
      setSuccessMessage("Image deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSingleImageDelete = async (imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    const gallery = images.find((img) => img.images.includes(imageUrl));
    if (!gallery) {
      alert("Gallery not found for this image.");
      return;
    }

    const updatedImages = gallery.images.filter((url) => url !== imageUrl);

    // Prepare the updated gallery data
    const updatedGallery = {
      id: gallery.id,
      event_name: gallery.event_name,
      folder_name: gallery.folder_name,
      images: updatedImages,
    };

    try {
      await axios.put("/api/admin/gallery", updatedGallery, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Update UI: remove image from modal and refresh gallery list
      setActiveGalleryImages(updatedImages);
      setImages((prev) =>
        prev.map((img) =>
          img.id === gallery.id ? { ...img, images: updatedImages } : img
        )
      );
      setSuccessMessage("Image deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image.");
    }
  };

  const openModal = (image = null) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const openGalleryPreview = (imageList = []) => {
    setActiveGalleryImages(imageList);
    setIsImagesModalOpen(true);
  };

  const closeGalleryPreview = () => {
    setActiveGalleryImages([]);
    setIsImagesModalOpen(false);
  };

  return (
    <div className="p-6">
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

      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold text-gray-600">Gallery Images</p>
        <div className="flex gap-2">
          <button
            className="bg-gray-700 text-white px-4 py-1 rounded-lg"
            onClick={() => setIsFolderModalOpen(true)}
          >
            Add Folder
          </button>
          <button
            className="bg-blue-900 text-white px-4 py-1 rounded-lg"
            onClick={() => openModal(null)}
          >
            Add Gallery
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {loading ? (
          <p>Loading images...</p>
        ) : (
          images.map((image) => (
            <div
              key={image.id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={image.thumb_image}
                alt={image.event_name}
                className="w-full h-40 object-cover cursor-pointer"
                onClick={() => openGalleryPreview(image.images)}
              />
              <div className="p-2 text-center">
                {image.folder_name === "Latest Images" ||
                image.folder_name === "latestImages" ? (
                  <p className="font-semibold">{image.folder_name}</p>
                ) : (
                  <>
                    <p className="font-semibold">{image.event_name}</p>
                    <p className="text-sm text-gray-500">{image.folder_name}</p>
                  </>
                )}
              </div>

              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  className="bg-yellow-500 text-white p-1 rounded-full"
                  onClick={() => openModal(image)}
                >
                  <FaEdit size={16} />
                </button>
                <button
                  className={`p-1 rounded-full ${
                    image.folder_name === "Latest Images" ||
                    image.folder_name === "latestImages"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white"
                  }`}
                  onClick={() =>
                    image.folder_name !== "Latest Images" ||
                    (image.folder_name !== "latestImages" &&
                      handleDelete(image.id))
                  }
                  disabled={
                    image.folder_name === "Latest Images" ||
                    image.folder_name === "latestImages"
                  }
                  title={
                    image.folder_name === "Latest Images" ||
                    image.folder_name === "latestImages"
                      ? "Cannot delete Latest Images folder"
                      : "Delete"
                  }
                >
                  <FaTrashAlt size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add/Edit */}
      <GalleryImageModel
        isOpen={isModalOpen}
        closeModal={closeModal}
        imageData={selectedImage}
        refreshGallery={() => fetchImages(token)}
      />

      <AddFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        token={token}
      />

      {/* Modal for viewing gallery images */}
      {isImagesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-2">
          <div className="bg-white rounded-lg p-2 sm:p-6 w-full max-w-3xl relative overflow-y-auto min-h-[95vh] max-h-[95vh] flex flex-col">
            <button
              onClick={closeGalleryPreview}
              className="absolute top-4 right-4 text-gray-700 hover:text-black"
            >
              <IoClose size={28} />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-4">
              Gallery Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              {activeGalleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group flex justify-center items-center border rounded-md bg-gray-50 p-2"
                >
                  <img
                    src={imgUrl}
                    alt={`Gallery Image ${idx}`}
                    className="w-full max-w-full h-48 sm:h-56 md:h-80 object-contain rounded border bg-white"
                    style={{ maxHeight: "40vh" }}
                  />
                  <button
                    onClick={() => handleSingleImageDelete(imgUrl)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                    title="Delete image"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryImage;
