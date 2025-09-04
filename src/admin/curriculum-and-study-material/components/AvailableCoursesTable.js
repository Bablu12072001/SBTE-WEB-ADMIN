"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AvailableCourseFormModal from "./AvailableCourseFormModal";
import EditAvailableCourseModal from "./EditAvailableCourseModal";
import DeleteAvailableCourseModal from "./DeleteAvailableCourse";

export default function AvailableCoursesTable() {
  const [showModal, setShowModal] = useState(false);
  const [coursesData, setCoursesData] = useState([]);
  const [token, setToken] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
        fetchCourse(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchCourse = async (token) => {
    try {
      const response = await axios.get("/api/web/available_courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status && Array.isArray(response.data.body)) {
        const sortedCourses = [...response.data.body].sort((a, b) => {
          return Number(a.branch_code) - Number(b.branch_code);
        });

        setCoursesData(sortedCourses);
      } else {
        setCoursesData([]);
        console.error("Invalid response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleSave = async (updatedItem) => {
    try {
      console.log("Updated");
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedCourse(item);
    setIsEditOpen(true);
  };

  return (
    <div>
      <button
        className="bg-blue-900 text-white px-4 py-1 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        Add Course
      </button>
      <div className="overflow-x-auto h-[70vh]">
        <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
          {/* Header */}
          <div className="shrink-0">
            <table className="min-w-full table-fixed">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-3 py-2 border w-32">BRANCH CODE</th>
                  <th className="px-3 py-2 border w-64">BRANCH</th>
                  <th className="px-3 py-2 border w-36">SHORT NAME</th>
                  <th className="px-3 py-2 border w-32">CREATED ON</th>
                  <th className="px-3 py-2 border w-24">ACTION</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Body */}
          <div className="overflow-y-auto grow">
            <table className="min-w-full table-fixed">
              <tbody>
                {coursesData.length ? (
                  coursesData.map((item, index) => (
                    <tr key={item.id} className="even:bg-blue-50">
                      <td className="px-3 py-2 border w-32">
                        {item.branch_code}
                      </td>
                      <td className="px-3 py-2 border w-64">{item.branch}</td>
                      <td className="px-3 py-2 border w-36">
                        {item.branch_short_name}
                      </td>
                      <td className="px-3 py-2 border w-32">
                        {formatDate(item.created_at)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No courses available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <EditAvailableCourseModal
        isOpen={isEditOpen}
        setIsOpen={(val) => {
          setShowModal(val);
          setIsEditOpen(val);
          if (!val) setSelectedCourse(null);
        }}
        editData={selectedCourse}
        isEdit={isEditOpen}
        onSave={async (updatedItem) => {
          await handleSave(updatedItem);
          fetchCourse(token);
        }}
      />

      <DeleteAvailableCourseModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        item={deleteTarget}
        token={token}
        onDeleteSuccess={() => fetchCourse(token)}
      />
      <AvailableCourseFormModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        onSuccess={() => fetchCourse(token)}
      />
    </div>
  );
}
