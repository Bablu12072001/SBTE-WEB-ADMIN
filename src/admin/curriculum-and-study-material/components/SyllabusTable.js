"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import SyllabusFormModal from "./SyllabusFormModal";
import EditSyllabusModal from "./EditSyllabusModal";
import DeleteSyllabusModal from "./DeleteSyllabusModal";

export default function SyllabusTable() {
  const [showModal, setShowModal] = useState(false);
  const [curriculumData, setCurriculumData] = useState([]);
  const [token, setToken] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        fetchCurriculum(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchCurriculum = async (token) => {
    try {
      const response = await axios.get("/api/web/syllabus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status && Array.isArray(response.data.data)) {
        setCurriculumData(response.data.data);
      } else {
        console.error("Invalid response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedCurriculum(item);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    await fetchCurriculum(token);
  };

  return (
    <div>
      <button
        className="bg-blue-900 text-white px-4 py-1 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        Add Curriculum
      </button>

      <div className="space-y-6">
        {curriculumData.map((curriculum) => (
          <div
            key={curriculum.id}
            className="bg-white border border-gray-300 shadow-md rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-semibold text-blue-900">
                  Session: {curriculum.session}
                </h2>
                <p className="text-sm text-gray-600">
                  Last Modified: {curriculum.lastModifyDate}
                </p>
                <p className="text-sm text-gray-600">
                  Updated By: {curriculum.created_by}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEditClick(curriculum)}
                >
                  <FaEdit size={22} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    setDeleteTarget(curriculum);
                    setIsDeleteOpen(true);
                  }}
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>

            {/* Display branches under this session */}
            <div className="space-y-4 mt-2">
              {curriculum.branches.map((branch, bIndex) => {
                const semesters = branch.semester || branch.Semester || [];
                const links =
                  branch.semesters?.map((s) => s.fileUrl) || branch.link || [];

                const semesterWithLinks = semesters.map((sem, index) => {
                  const label = typeof sem === "string" ? sem : sem.label;
                  const link =
                    typeof sem === "object" ? sem.fileUrl : links[index] || "#";
                  return { label, link };
                });

                semesterWithLinks.sort((a, b) => {
                  const getNum = (s) =>
                    parseInt(s.label.match(/\d+/)?.[0]) || 0;
                  return getNum(a) - getNum(b);
                });

                return (
                  <div key={bIndex} className="border-t pt-3">
                    <h3 className="font-semibold text-gray-800">
                      {branch.branch} ({branch.branch_code})
                    </h3>
                    <div className="mt-1 space-y-1">
                      {semesterWithLinks.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">{item.label}</span>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline truncate max-w-[60%]"
                          >
                            {item.link?.split("/").pop() || "View"}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <EditSyllabusModal
        isOpen={isEditOpen}
        setIsOpen={(val) => {
          setIsEditOpen(val);
          if (!val) setSelectedCurriculum(null);
        }}
        editData={selectedCurriculum}
        isEdit={isEditOpen}
        onSave={handleSave}
      />

      <DeleteSyllabusModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        item={deleteTarget}
        token={token}
        onDeleteSuccess={(deletedId) => {
          setCurriculumData((prev) =>
            prev.filter((syllabus) => syllabus.id !== deletedId)
          );
        }}
      />

      <SyllabusFormModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        onSuccess={() => fetchCurriculum(token)}
      />
    </div>
  );
}
