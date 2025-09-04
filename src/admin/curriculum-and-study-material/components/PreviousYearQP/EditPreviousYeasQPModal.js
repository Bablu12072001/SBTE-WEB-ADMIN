"use client";

import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function EditPreviousYearQPModal({
  isOpen,
  setIsOpen,
  editData,
  isEdit,
  onSave,
}) {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableBranches, setAvailableBranches] = useState([]);

  const [examYear, setExamYear] = useState("");
  const [branch, setBranch] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [attachment, setAttachment] = useState("");
  const [held, setHeld] = useState("Odd");
  const [type, setType] = useState("regular");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decode = jwtDecode(storedToken);
        setDecodedToken(decode);
      } catch {
        console.error("Invalid token");
      }

      axios
        .get("/api/web/available_courses", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((res) => {
          if (res.data.status) {
            setAvailableBranches(res.data.body);
          }
        })
        .catch((err) => {
          console.error("Error fetching branches:", err);
        });
    }

    if (isEdit && editData) {
      setExamYear(editData.exam_year || "");
      setBranch(editData.branch || "");
      setBranchCode(editData.branch_code || "");
      setSemester(editData.semester || "");
      setSubjectCode(editData.subject_code || "");
      setAttachment(editData.attachment || "");
      setHeld(editData.held || "Odd");
      setType(editData.type || "regular");
    }
  }, [editData, isEdit]);

  const handleFileUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      setUploading(true);
      try {
        const res = await axios.post(
          "/api/presign/upload",
          {
            base64,
            fileName: file.name,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (e) =>
              setUploadProgress(Math.round((e.loaded * 100) / e.total)),
          }
        );

        if (res.data.status && res.data.path) {
          setAttachment(res.data.path);
        } else {
          alert("Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload error");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (uploading) {
      alert("Please wait for the file to finish uploading.");
      return;
    }

    try {
      await axios.put(
        "/api/admin/previous_year_question",
        {
          id: editData.id,
          exam_year: examYear,
          branch,
          branch_code: branchCode,
          semester,
          subject_code: subjectCode,
          held,
          type,
          attachment,
          created_by: decodedToken.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSave();
      setIsOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("An error occurred while saving.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
          <Dialog.Panel>
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-blue-900">
                {isEdit ? "Edit Question Paper" : "Add Question Paper"}
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Exam Year
                </label>
                <input
                  type="text"
                  placeholder="Exam Year"
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => {
                    const selected = availableBranches.find(
                      (b) => b.branch === e.target.value
                    );
                    if (selected) {
                      setBranch(selected.branch);
                      setBranchCode(selected.branch_code);
                    }
                  }}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Branch</option>
                  {availableBranches.map((b) => (
                    <option key={b.branch_code} value={b.branch}>
                      {b.branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Branch Code
                </label>
                <input
                  type="text"
                  value={branchCode}
                  readOnly
                  className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-gray-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Semester
                </label>
                <input
                  type="text"
                  placeholder="Semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Subject Code
                </label>
                <input
                  type="text"
                  placeholder="Subject Code"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Held
                </label>
                <select
                  value={held}
                  onChange={(e) => setHeld(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="Odd">Odd</option>
                  <option value="Even">Even</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Paper Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="regular">Regular</option>
                  <option value="supplement">Supplement</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">
                  File
                </label>

                {attachment && (
                  <div className="mb-1">
                    <a
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 text-sm hover:underline"
                    >
                      View Current Attachment
                    </a>
                  </div>
                )}

                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="w-full text-sm"
                />

                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-700 mt-1">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                disabled={uploading}
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
