"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function PreviousYearFormModal({
  isOpen,
  setIsOpen,
  onSuccess,
}) {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableBranches, setAvailableBranches] = useState([]);

  const [formData, setFormData] = useState({
    exam_year: "2025",
    held: "Odd",
    attachment: "",
    branch: "",
    branch_code: "",
    semester: "",
    type: "regular",
    subject_code: "",
  });

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch (err) {
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
            setAvailableBranches(res.data.body); // full branch data
          } else {
            console.error("Failed to fetch branches.");
          }
        })
        .catch((err) => {
          console.error("Error fetching branches:", err);
        });
    }
  }, []);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploadProgress(0);

      try {
        const response = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: file.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            },
          }
        );

        if (response.data.status && response.data.path) {
          setFormData((prev) => ({
            ...prev,
            attachment: response.data.path,
          }));
        } else {
          alert("Failed to upload file.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed. Check console for details.");
      } finally {
        setUploadProgress(undefined);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const payload = {
      exam_year: formData.exam_year,
      held: formData.held,
      attachment: formData.attachment,
      branch: formData.branch,
      branch_code: formData.branch_code,
      semester: formData.semester,
      type: formData.type,
      subject_code: formData.subject_code,
      created_by: decodedToken?.name || "admin",
    };

    try {
      const response = await axios.post(
        "/api/admin/previous_year_question",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        onSuccess();
        setIsOpen(false);
      } else {
        alert("Failed to submit form.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting form.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              Upload Previous Year Question Paper
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Exam Year Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Exam Year
              </label>
              <select
                value={formData.exam_year}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    exam_year: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Branch</label>
              <select
                value={formData.branch || ""}
                onChange={(e) => {
                  const selected = availableBranches.find(
                    (b) => b.branch === e.target.value
                  );
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      branch: selected.branch,
                      branch_code: selected.branch_code,
                    }));
                  }
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Branch</option>
                {availableBranches.map((b) => (
                  <option key={b.branch_code} value={b.branch}>
                    {b.branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Code (readonly) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch Code
              </label>
              <input
                type="text"
                value={formData.branch_code}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
              />
            </div>

            {/* Subject Code */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Subject Code
              </label>
              <input
                type="text"
                value={formData.subject_code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subject_code: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Semester Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    semester: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Semester</option>
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Paper Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Paper Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="regular">Regular</option>
                <option value="supplement">Supplement</option>
              </select>
            </div>

            {/* Held Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Held</label>
              <select
                value={formData.held}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    held: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="Odd">Odd</option>
                <option value="Even">Even</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileUpload(file);
                }}
              />
              {uploadProgress >= 0 && (
                <div className="mt-1">
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

            {/* Submit Button */}
            <div className="text-right pt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
