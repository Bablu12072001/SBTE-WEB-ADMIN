import { useEffect, useState } from "react";
import axios from "axios";
import { AiFillDelete, AiOutlineCheckCircle } from "react-icons/ai";
import CarouselModal from "./CarouselModal";

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

const CarouselPage = () => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      fetchCarouselImages(storedToken);
    }
  }, []);

  const fetchCarouselImages = async (authToken = token) => {
    try {
      const response = await axios.get("/api/admin/scroll", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.status) {
        setImages(response.data.body);
      }
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    }
  };

  const handleDeleteClick = (img) => {
    setImageToDelete(img);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete("/api/admin/scroll", {
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
        fetchCarouselImages();
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Carousel Images</h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={openModal}
        >
          Add / Edit Carousel
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded mb-4">
          <AiOutlineCheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Carousel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative border rounded shadow-sm overflow-hidden group"
          >
            <img
              src={img.image}
              alt={`Carousel ${img.id}`}
              className="w-full h-48 object-cover"
            />

            <button
              onClick={() => handleDeleteClick(img)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
              title="Delete image"
            >
              <AiFillDelete size={20} />
            </button>
            <p className="p-2">{img.label}</p>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {imageToDelete && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={() => setImageToDelete(null)}
        />
      )}

      {/* Carousel Modal */}
      <CarouselModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        imageList={images}
        refreshImages={fetchCarouselImages}
      />
    </div>
  );
};

export default CarouselPage;
