import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const AddFolderModal = ({ isOpen, onClose, token }) => {
  const [folderName, setFolderName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFolders();
    }
  }, [isOpen]);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/web/event_gallery");
      if (res.data.status) {
        setFolders(res.data.body || []);
      }
    } catch (err) {
      console.error("Failed to fetch folders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName.trim()) return alert("Folder name is required.");

    try {
      await axios.post(
        "/api/admin/event_gallery",
        { folder_name: folderName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage("Folder created successfully.");
      setFolderName("");
      fetchFolders();

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Folder creation failed:", error);
      alert("Folder creation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;

    try {
      await axios.delete("/api/admin/event_gallery", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id },
      });

      setSuccessMessage("Folder deleted successfully.");
      fetchFolders();

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Folder deletion failed:", error);
      alert("Failed to delete folder.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 overflow-y-auto flex-grow">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
          >
            <IoClose size={24} />
          </button>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Add New Folder
          </h2>

          {successMessage && (
            <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md mb-4">
              <AiOutlineCheckCircle size={20} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Folder Name
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. summer-festival-2025"
                required
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-900 text-white px-5 py-2 rounded hover:bg-blue-800"
              >
                Create Folder
              </button>
            </div>
          </form>

          <hr className="my-5" />

          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Existing Folders
          </h3>
          {loading ? (
            <p className="text-sm text-gray-500">Loading folders...</p>
          ) : folders.length === 0 ? (
            <p className="text-sm text-gray-500">No folders available.</p>
          ) : (
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {folders.map((folder) => {
                const normalizedName = folder.folder_name
                  .replace(/\s+/g, "")
                  .toLowerCase();
                const isLatestImages = normalizedName === "latestimages";

                return (
                  <li
                    key={folder.id}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {folder.folder_name}
                    </span>
                    <button
                      onClick={() => handleDelete(folder.id)}
                      className={`text-red-600 hover:text-red-800 ${
                        isLatestImages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title={
                        isLatestImages
                          ? "Cannot delete this folder"
                          : "Delete folder"
                      }
                      disabled={isLatestImages}
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
