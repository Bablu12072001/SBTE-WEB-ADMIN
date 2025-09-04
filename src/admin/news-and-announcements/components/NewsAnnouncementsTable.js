import { FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import EditNewsModal from "./EditNewsModal";
import DeleteNewsModal from "./DeleteNewsModal";

export default function NewsAnnouncementsTable() {
  const [newsData, setNewsData] = useState([]);
  const [token, setToken] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token: ", decodedToken);
        fetchNews(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, [refresh]);

  const fetchNews = async (token) => {
    try {
      const response = await axios.get("/api/web/news", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status && Array.isArray(response.data.body)) {
        setNewsData(response.data.body);
      } else {
        console.error("Invalid response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleEditClick = (item) => {
    setSelectedNews(item);
    setIsEditOpen(true);
  };

  const handleSave = () => {
    setIsEditOpen(false);
    setRefresh((prev) => !prev);
  };

  return (
    <div className="overflow-x-auto px-4 h-[80vh]">
      {/* <MdOutlineRefresh size={30} onClick={() => setRefresh(!refresh)} /> */}
      <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
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

        <div className="overflow-y-auto grow">
          <table className="min-w-full table-fixed">
            <tbody>
              {newsData.map((item, index) => (
                <tr key={item.id} className="even:bg-blue-50">
                  <td className="px-3 py-2 border w-16">{index + 1}.</td>
                  <td className="px-3 py-2 border w-28">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-3 py-2 border w-64 break-words">
                    {item.title}
                  </td>
                  <td className="px-3 py-2 border w-80">{item.description}</td>
                  <td className="px-3 py-2 border w-32 capitalize">
                    {item.type}
                  </td>
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
              {newsData.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No news or announcements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EditNewsModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        data={selectedNews}
        onSave={handleSave}
      />
      <DeleteNewsModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        item={deleteTarget}
        token={token}
        onDeleteSuccess={(deletedId) => {
          setNewsData((prev) => prev.filter((news) => news.id !== deletedId));
        }}
      />
    </div>
  );
}
