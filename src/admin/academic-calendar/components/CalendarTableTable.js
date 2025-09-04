"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import CalendarTableAddModal from "./CalendarTableAddModal";
import CalendarTableEditModal from "./CalendarTableEditModal";
import CalendarTableDeleteModal from "./CalendarTableDeleteModal";

export default function CalendarTableTable() {
  const [calendarData, setCalendarData] = useState([]);
  const [token, setToken] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      fetchCalendarData(storedToken);
    }
  }, []);

  const fetchCalendarData = async (token) => {
    try {
      const response = await axios.get("/api/web/academic", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.status) {
        setCalendarData(response.data.data);
      } else {
        console.error("Invalid response", response.data);
      }
    } catch (error) {
      console.error("Error fetching academic data: ", error);
    }
  };

  const formatDate = (value) => {
    if (!value || typeof value !== "string") return "-";

    // If already in format like "Aug 2022" or contains slash (e.g., "08/2022")
    if (value.includes("/") || /^[A-Za-z]+\s\d{4}$/.test(value.trim())) {
      return value;
    }

    // If value is like "undefined Aug 2022", return only "Aug 2022"
    if (value.toLowerCase().startsWith("undefined")) {
      const parts = value.split(" ");
      if (parts.length > 1) return parts.slice(1).join(" ");
      return "-";
    }

    // If value is in yyyy-mm or yyyy-mm-dd format
    const [year, month] = value.split("-");
    if (!year || !month) return "-";

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = parseInt(month, 10) - 1;

    if (monthIndex < 0 || monthIndex > 11) return "-";

    return `${monthNames[monthIndex]} ${year}`;
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleSave = async (updatedItem) => {
    fetchCalendarData(token);
    setIsEditOpen(false);
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
      <div className="w-full overflow-x-auto h-[70vh] mt-2">
        <div className="flex gap-4 w-max md:w-full md:flex-col">
          {calendarData.map((item) => (
            <div
              key={item.id}
              className="min-w-[320px] md:min-w-full border rounded-xl shadow-sm bg-white overflow-hidden flex-shrink-0"
            >
              {/* Header */}
              <div>
                <div className="bg-blue-900 text-white px-4 py-2 text-sm font-semibold">
                  <h3>{item.title}</h3>
                  <p className="text-md font-normal">
                    {item.session} • {item.institution_type}
                  </p>
                </div>
                <div className="flex gap-2 justify-end p-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(item)}
                  >
                    <FaEdit size={24} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setDeleteTarget(item);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <FaTrash size={24} />
                  </button>
                </div>
              </div>

              {/* Table Content */}
              <div className="p-3 max-h-[300px] overflow-y-auto">
                <table className="w-full text-md text-left border border-gray-200">
                  <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="border px-2 py-1 text-center">Event</th>
                      <th className="border px-2 py-1 text-center">Sem 1</th>
                      <th className="border px-2 py-1 text-center">Sem 2</th>
                      <th className="border px-2 py-1 text-center">Sem 3</th>
                      <th className="border px-2 py-1 text-center">Sem 4</th>
                      <th className="border px-2 py-1 text-center">Sem 5</th>
                      <th className="border px-2 py-1 text-center">Sem 6</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.events.map((eventItem, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 text-center">
                        <td className="border px-2 py-1 font-medium text-left">
                          {eventItem.event}
                        </td>
                        {["1", "2", "3", "4", "5", "6"].map((sem) => {
                          const semData = eventItem.semesters[sem];
                          const value =
                            typeof semData === "object"
                              ? semData?.value || "-"
                              : semData || "-";
                          const date =
                            typeof semData === "object"
                              ? semData?.date || ""
                              : "";

                          return (
                            <td key={sem} className="border px-2 py-1">
                              <div>{value}</div>
                              {date && (
                                <div className="text-sm text-blue-500 mt-1">
                                  {date}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 text-md text-gray-600 px-3 py-2 border-t">
                Created by:{" "}
                <span className="font-medium">{item.created_by}</span> •{" "}
                {new Date(item.created_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <CalendarTableAddModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        onSave={() => fetchCalendarData(token)}
      />
      <CalendarTableEditModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        data={selectedItem}
        onSave={handleSave}
      />
      <CalendarTableDeleteModal
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
  );
}
