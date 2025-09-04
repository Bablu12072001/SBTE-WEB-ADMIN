"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import EditAddOnCourseModal from "./EditAddOnCourseModal";
import DeleteAddOnCourseModal from "./DeleteAddOnCourseModal";

export default function AddOnCoursesTable() {
  const [showModal, setShowModal] = useState(false);
  const [coursesData, setCoursesData] = useState([]);
  const [token, setToken] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAddOnCourse, setSelectedAddOnCourse] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token: ", decodedToken);
        fetchAddOnCourses(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchAddOnCourses = async (token) => {
    try {
      const response = await axios.get("/api/web/add_on_courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Add-On Courses Response:", response.data);

      if (response.data.status && Array.isArray(response.data.body)) {
        setCoursesData(response.data.body);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching add-on courses:", error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedAddOnCourse(item);
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
      <div className="overflow-x-auto h-[70vh]">
        <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
          {/* Fixed Header */}
          <div className="shrink-0">
            <table className="min-w-full table-fixed">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-3 py-2 border w-16">SL NO</th>
                  <th className="px-3 py-2 border w-60">COURSE NAME</th>
                  <th className="px-3 py-2 border w-96">DESCRIPTION</th>
                  <th className="px-3 py-2 border w-60">LINK</th>
                  <th className="px-3 py-2 border w-60">CREATED BY</th>
                  <th className="px-3 py-2 border w-24">ACTION</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto grow">
            <table className="min-w-full table-fixed">
              <tbody>
                {coursesData.map((item, index) => (
                  <tr key={item.id} className="even:bg-blue-50">
                    <td className="px-3 py-2 border">{index + 1}.</td>
                    <td className="px-3 py-2 border">{item.course_name}</td>
                    <td className="px-3 py-2 border">{item.description}</td>
                    <td className="px-3 py-2 border text-blue-700 underline truncate">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.link}
                      </a>
                    </td>
                    <td className="px-3 py-2 border">{item.created_by}</td>
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
      </div>

      <EditAddOnCourseModal
        isOpen={isEditOpen}
        setIsOpen={(val) => {
          setShowModal(val);
          setIsEditOpen(val);
          if (!val) setSelectedAddOnCourse(null);
        }}
        editData={selectedAddOnCourse}
        isEdit={isEditOpen}
        onSave={handleSave}
      />

      <DeleteAddOnCourseModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        item={deleteTarget}
        token={token}
        onDeleteSuccess={(deletedId) => {
          setCoursesData((prev) =>
            prev.filter((syllabus) => syllabus.id !== deletedId)
          );
        }}
      />

      {/* <SyllabusFormModal isOpen={showModal} setIsOpen={setShowModal} /> */}
    </div>
  );
}
