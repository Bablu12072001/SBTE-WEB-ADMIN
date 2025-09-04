"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import CalendarFileEditModal from "./CalendarFileEditModal";
import CalendarFileDeleteModal from "./CalendarFileDeleteModal";
import CalendarFileAddModal from "./CalendarFileAddModal";

export default function CalendarFileTable() {
  const [calendarData, setCalendarData] = useState([]);
  const [token, setToken] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      fetchCalendar(storedToken);
    }
  }, []);

  const fetchCalendar = async (token) => {
    try {
      const response = await axios.get("/api/web/academic_calander", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.status) {
        setCalendarData(response.data.body);
      } else {
        console.error("Invalid response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching calendar files: ", error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedFile(item);
    setIsEditOpen(true);
  };

  const handleSave = async (updatedItem) => {
    try {
      console.log("Updated");
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-900 text-white px-4 py-1 rounded-lg"
        onClick={() => setShowModal(true)}
      >
        Add New
      </button>

      <div className="overflow-x-auto h-[70vh]">
        <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
          <div className="overflow-y-auto grow">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-3 py-2 border">S.No.</th>
                  <th className="px-3 py-2 border">Title</th>
                  <th className="px-3 py-2 border">Description</th>
                  <th className="px-3 py-2 border">Attachment</th>
                  <th className="px-3 py-2 border">Created By</th>
                  <th className="px-3 py-2 border">Created At</th>
                  <th className="px-3 py-2 border w-16">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {calendarData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{index + 1}</td>
                    <td className="px-3 py-2 border">{item.title}</td>
                    <td className="px-3 py-2 border">{item.description}</td>
                    <td className="px-3 py-2 border">
                      <a
                        href={item.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View File
                      </a>
                    </td>
                    <td className="px-3 py-2 border">{item.created_by}</td>
                    <td className="px-3 py-2 border">
                      {new Date(item.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
        <CalendarFileAddModal
          isOpen={showModal}
          setIsOpen={setShowModal}
          onSuccess={() => {
            fetchCalendar(token);
          }}
        />
        <CalendarFileEditModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          data={selectedFile}
          onSave={handleSave}
        />
        <CalendarFileDeleteModal
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          item={deleteTarget}
          token={token}
          onDeleteSuccess={(deletedId) => {
            setCalendarData((prev) =>
              prev.filter((item) => item.id !== deletedId)
            );
          }}
        />
      </div>
    </div>
  );
}
