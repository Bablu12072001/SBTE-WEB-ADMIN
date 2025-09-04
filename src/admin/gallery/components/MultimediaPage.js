import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import MultimediaModal from "./MultiMediaModal";

const MultimediaPage = () => {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    fetchMultimedia();
  }, []);

  const fetchMultimedia = async () => {
    try {
      const response = await axios.get("/api/web/multimedia");
      if (response.data.status) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching multimedia:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/admin/multimedia", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      });
      setItems(items.filter((item) => item.id !== id));
      setSuccessMessage("Multimedia item deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting multimedia:", error);
    }
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      {successMessage && (
        <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md mb-4">
          <AiOutlineCheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Multimedia Gallery
        </h2>
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={openAddModal}
        >
          <FaPlus />
          Add Multimedia
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-md overflow-hidden relative"
          >
            <img
              src={item.thumb_image || "/placeholder-image.png"}
              alt={item.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-bold text-blue-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-4">
                {item.description}
              </p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => window.open(item.yt_link, "_blank")}
                  className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                >
                  Watch Video
                </button>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white p-2 rounded-full"
                    onClick={() => openEditModal(item)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="bg-red-600 text-white p-2 rounded-full"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Component */}
      <MultimediaModal
        key={modalOpen ? (selectedItem?.id || "new") + Date.now() : "closed"}
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        itemData={selectedItem}
        refreshGallery={fetchMultimedia}
      />
    </div>
  );
};

export default MultimediaPage;
