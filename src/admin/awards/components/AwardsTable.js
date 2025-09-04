"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditAwardModal from "./EditAwardModal";
import DeleteAwardModal from "./DeleteAwardModal";

export default function AwardsTable() {
  const [awardsData, setAwardsData] = useState([]);
  const [token, setToken] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
        fetchAwards(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchAwards = async (token) => {
    try {
      const response = await axios.get("/api/web/award", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.status) {
        setAwardsData(response.data.body);
      } else {
        console.error("Invalid response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching awards: ", error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedAward(item);
    setIsEditOpen(true);
  };

  const handleSave = async (updatedItem) => {
    try {
      console.log("Updated");
      await fetchAwards(token);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  return (
    <div className="overflow-x-auto h-[70vh]">
      <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
        <div className="overflow-y-auto grow">
          <table className="min-w-full table-fixed">
            <thead className="bg-blue-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 border w-16">SL NO</th>
                <th className="px-3 py-2 border w-32">Year</th>
                <th className="px-3 py-2 border w-32">Type</th>
                <th className="px-3 py-2 border w-64">Attachment</th>
                <th className="px-3 py-2 border w-40">Created By</th>
                <th className="px-3 py-2 border w-48">Created At</th>
                <th className="px-3 py-2 border w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {awardsData.map((item, index) => (
                <tr key={item.id} className="even:bg-blue-50">
                  <td className="px-3 py-2 border">{index + 1}.</td>
                  <td className="px-3 py-2 border">{item.year}</td>
                  <td className="px-3 py-2 border capitalize">{item.type}</td>
                  <td className="px-3 py-2 border break-all">
                    <a
                      href={item.attachment}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.attachment}
                    </a>
                  </td>
                  <td className="px-3 py-2 border">{item.created_by}</td>
                  <td className="px-3 py-2 border">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 border">
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
      <EditAwardModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        data={selectedAward}
        onSave={handleSave}
      />

      <DeleteAwardModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        item={deleteTarget}
        token={token}
        onDeleteSuccess={(deletedId) => {
          setAwardsData((prev) =>
            prev.filter((award) => award.id !== deletedId)
          );
        }}
      />
    </div>
  );
}
