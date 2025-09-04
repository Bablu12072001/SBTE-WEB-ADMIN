"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function AvailableCourseFormModal({
  isOpen,
  setIsOpen,
  onSuccess,
}) {
  const [branch, setBranch] = useState("");
  const [branchShortName, setBranchShortName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        console.log("Decoded token:", decoded);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleSubmit = async () => {
    const payload = {
      branch,
      branch_short_name: branchShortName,
      branch_code: branchCode,
      created_by: "admin",
    };

    try {
      const response = await axios.post(
        "/api/admin/available_courses",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Course created:", response.data);
      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
      alert(error.response?.data?.body || "Something went wrong.");
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
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-xl w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              Add New Course
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch Code
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Branch Short Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={branchShortName}
                onChange={(e) => setBranchShortName(e.target.value)}
              />
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                Create
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
