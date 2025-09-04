import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import EditCircularModal from "./EditCircularModal";
import DeleteCircularOrNotificationModal from "./DeleteCircularOrNotificationModal";

const CircularsAndNotificationsTable = () => {
  const [circularsData, setCircularsData] = useState([]);
  const [token, setToken] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token: ", decodedToken);
        fetchCircularsAndNotifications(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchCircularsAndNotifications = async (token) => {
    try {
      const response = await axios.get("/api/web/circular", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status && Array.isArray(response.data.body)) {
        setCircularsData(response.data.body);
      } else {
        console.error("Invalid response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching circulars:", error);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toISOString().split("T")[0];

  const handleEditClick = (item) => {
    setSelectedCircular(item);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    setIsEditOpen(false);
    fetchCircularsAndNotifications(token);
  };

  const handleDelete = () => {
    setIsDeleteOpen(false);
    fetchCircularsAndNotifications(token);
  };

  return (
    <div className="overflow-x-auto px-4 h-[85vh]">
      <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
        {/* Table Header */}
        <div className="shrink-0">
          <table className="min-w-full table-fixed">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-3 py-2 border w-16">SL NO</th>
                <th className="px-3 py-2 border w-28">DATE</th>
                <th className="px-3 py-2 border w-64">TITLE</th>
                <th className="px-3 py-2 border w-80">DESCRIPTION</th>
                <th className="px-3 py-2 border w-32">TYPE</th>
                <th className="px-3 py-2 border w-40">ATTACHMENT</th>
                <th className="px-3 py-2 border w-24">ACTION</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto grow">
          <table className="min-w-full table-fixed">
            <tbody>
              {circularsData.map((item, index) => (
                <tr key={item.id} className="even:bg-blue-50">
                  <td className="px-3 py-2 border w-16">{index + 1}.</td>
                  <td className="px-3 py-2 border w-28">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-3 py-2 border w-64 break-words">
                    {item.title}
                  </td>
                  <td className="px-3 py-2 border w-80">{item.description}</td>
                  <td className="px-3 py-2 border w-32">{item.type}</td>
                  <td className="px-3 py-2 border w-40 truncate text-blue-700 underline">
                    <a
                      href={item.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.attachment?.split("/").pop()}
                    </a>
                  </td>
                  <td className="px-3 py-2 border w-24">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          setDeleteTarget(item);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <EditCircularModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        data={selectedCircular}
        onSave={handleSave}
      />

      {/* Delete Modal */}
      <DeleteCircularOrNotificationModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        item={deleteTarget}
        token={token}
        onDeleteSuccess={handleDelete}
      />
    </div>
  );
};

export default CircularsAndNotificationsTable;
