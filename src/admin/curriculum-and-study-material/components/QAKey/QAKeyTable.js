"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditQAModal from "./EditQAModal";
import DeleteQAModal from "./DeleteQAModal";
import QAFormModal from "./QAFormModal";

export default function QAKeyTable() {
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [examYear, setExamYear] = useState("2024");
  const [branch, setBranch] = useState("11 - Agricultural Engg");
  const [semester, setSemester] = useState("2");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddQAModal, setShowAddQAModal] = useState(false);
  const [availableBranches, setAvailableBranches] = useState([]);

  const branches = ["11 - Agricultural Engg", "cse", "ece", "me", "ce"];
  const semesters = ["1", "2", "3", "4", "5", "6"];
  const years = [
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      fetchQAKeys(storedToken, examYear, branch, semester);

      axios
        .get("/api/web/available_courses", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((res) => {
          if (res.data.status) {
            setAvailableBranches(
              res.data.body
                .map((b) => b.branch)
                .sort((a, b) => a.localeCompare(b))
            );
          } else {
            console.error("Failed to fetch available branches");
          }
        })
        .catch((err) => {
          console.error("Error fetching available branches:", err);
        });
    }
  }, []);

  const fetchQAKeys = async (authToken, year, br, sem) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/web/question_answer", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          exam_year: year,
          branch: br,
          semester: sem,
        },
      });

      if (response.data.status && Array.isArray(response.data.body)) {
        setData(response.data.body);
      } else {
        setData([]);
        console.error("Unexpected response format:", response.data);
      }
    } catch (err) {
      console.error("Failed to fetch QA keys:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    if (token) {
      fetchQAKeys(token, examYear, branch, semester);
    }
  };

  const handleEdit = (item) => {
    setSelectedData(item);
    setIsOpen(true);
  };

  const refetchData = () => {
    fetchQAKeys(token, examYear, branch, semester);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    refetchData();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 text-blue-900">
        Question Answer Keys
      </h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={examYear}
          onChange={(e) => setExamYear(e.target.value)}
          className="border rounded p-2"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="border rounded p-2"
        >
          {availableBranches.length === 0 ? (
            <option value="">Loading branches...</option>
          ) : (
            availableBranches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))
          )}
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border rounded p-2"
        >
          {semesters.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-900 text-white px-4 py-2 rounded"
          onClick={handleFilterChange}
        >
          Load Q&A
        </button>

        <button
          onClick={() => setShowAddQAModal(true)}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Add New Q&A
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600">
          No Q&A keys found for the selected criteria.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 relative"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>

              <h2 className="text-lg font-semibold text-blue-800">
                {item.subject_name} ({item.subject_code})
              </h2>
              <p className="text-sm text-gray-600">
                Exam Year: {item.exam_year}
              </p>
              <p className="text-sm text-gray-600">Branch: {item.branch}</p>
              <p className="text-sm text-gray-600">Semester: {item.semester}</p>
              <p className="text-sm text-gray-600">
                Uploaded By: {item.created_by}
              </p>
              <p className="text-sm text-gray-600">
                Uploaded On: {new Date(item.created_at).toLocaleDateString()}
              </p>
              <a
                href={item.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-700 hover:underline"
              >
                View / Download
              </a>
            </div>
          ))}
        </div>
      )}

      <EditQAModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={selectedData}
        isEdit={true}
        onSave={refetchData}
      />

      <DeleteQAModal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        item={selectedItem}
        token={token}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <QAFormModal
        isOpen={showAddQAModal}
        setIsOpen={setShowAddQAModal}
        onSuccess={refetchData}
      />
    </div>
  );
}
