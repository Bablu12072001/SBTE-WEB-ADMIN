"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function QAFormModal({ isOpen, setIsOpen, onSuccess }) {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableBranches, setAvailableBranches] = useState([]);

  const [formData, setFormData] = useState({
    exam_year: "",
    attachment: "",
    branch: "",
    semester: "",
    subject_code: "",
    subject_name: "",
  });

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
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => {
          if (res.data.status) {
            setAvailableBranches(res.data.body);
          }
        })
        .catch((err) => console.error("Failed to load branches:", err));
    }
  }, []);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploadProgress(1); // Start showing progress

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
        setUploadProgress(0); // Hide progress after upload
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      created_by: decodedToken?.name || "admin_user",
    };

    try {
      const response = await axios.post("/api/admin/question_answer", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
              Upload Question Answer Key
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Exam Year
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.exam_year}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    exam_year: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Branch</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.branch}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, branch: e.target.value }))
                }
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
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.semester}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    semester: e.target.value,
                  }))
                }
              >
                <option value="">Select Semester</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1}`}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject Code
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.subject_code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subject_code: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.subject_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subject_name: e.target.value,
                  }))
                }
              />
            </div>

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
              {uploadProgress > 0 && (
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
