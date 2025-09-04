"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditPreviousYearQPModal from "./EditPreviousYeasQPModal";
import DeletePreviousYearQPModal from "./DeletePreviousYearQPModal";
import PreviousYearFormModal from "./PreviousYearFormModal";

export default function PreviousYearQPTable() {
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [examYear, setExamYear] = useState("2023");
  const [branch, setBranch] = useState("11 - Agricultural Engg");
  const [semester, setSemester] = useState("5");
  const [paperType, setPaperType] = useState("regular");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableBranches, setAvailableBranches] = useState([]);

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      fetchPapers(token, examYear, branch, semester, paperType);

      axios
        .get("/api/web/available_courses", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((res) => {
          if (res.data.status) {
            setAvailableBranches(res.data.body.map((b) => b.branch).sort());
          } else {
            console.error("Failed to fetch available branches.");
          }
        })
        .catch((err) => {
          console.error("Error fetching branches:", err);
        });
    }
  }, []);

  const fetchPapers = async (authToken, year, br, sem, type) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/web/previous_year_question", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          exam_year: year,
          branch: br,
          semester: sem,
          type: type,
        },
      });

      if (response.data.status && Array.isArray(response.data.body)) {
        setData(response.data.body);
      } else {
        setData([]);
        console.error("Unexpected response format:", response.data);
      }
    } catch (err) {
      console.error("Failed to fetch papers:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    if (token) {
      fetchPapers(token, examYear, branch, semester, paperType);
    }
  };

  const handleEdit = (item) => {
    setSelectedData(item);
    setIsOpen(true);
  };

  const refetchData = () => {
    fetchPapers(token, examYear, branch, semester, paperType);
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
        Previous Year Question Papers
      </h1>

      <div className="flex gap-4 mb-6 flex-wrap items-center">
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

        <select
          value={paperType}
          onChange={(e) => setPaperType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="regular">Regular</option>
          <option value="supplement">Supplement</option>
        </select>

        <button
          className="bg-blue-900 text-white px-4 py-2 rounded"
          onClick={handleFilterChange}
        >
          Load Papers
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Add New
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600">
          No question papers found for the selected criteria.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 relative"
            >
              {/* Edit/Delete Icons */}
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

      <EditPreviousYearQPModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={selectedData}
        isEdit={true}
        onSave={refetchData}
      />

      <DeletePreviousYearQPModal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        item={selectedItem}
        token={token}
        onDeleteSuccess={handleDeleteSuccess}
      />

      <PreviousYearFormModal
        isOpen={showAddModal}
        setIsOpen={setShowAddModal}
        onSuccess={() => {
          setShowAddModal(false);
          refetchData();
        }}
      />
    </div>
  );
}
