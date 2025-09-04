"use client";

import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function EditAvailableCourseModal({
  isOpen,
  setIsOpen,
  editData,
  isEdit,
  onSave,
}) {
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    branch: "",
    branch_short_name: "",
    branch_code: "",
    created_by: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setFormData((prev) => ({
          ...prev,
          created_by: decoded?.userId || "admin",
        }));
      } catch (err) {
        console.error("Invalid token");
      }
    }

    if (isEdit && editData) {
      setFormData({
        id: editData.id || "",
        branch: editData.branch || "",
        branch_short_name: editData.branch_short_name || "",
        branch_code: editData.branch_code || "",
        created_by: editData.created_by || "",
      });
    }
  }, [editData, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const url = "/api/admin/available_courses";
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (isEdit) {
        await axios.put(url, formData, { headers });
      } else {
        await axios.post(url, formData, { headers });
      }

      onSave(); // Refresh parent data
      setIsOpen(false); // Close modal
    } catch (err) {
      console.error("Save failed", err);
      alert("An error occurred while saving.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-blue-900">
              {isEdit ? "Edit Course" : "Add Course"}
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {["branch", "branch_short_name", "branch_code"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize mb-1">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
