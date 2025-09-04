"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function AddOnFormModal({ isOpen, setIsOpen }) {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);

  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!courseName || !description || !link) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      course_name: courseName,
      description,
      link,
      created_by: decodedToken?.email || "admin@university.edu",
    };

    try {
      const response = await axios.post("/api/admin/add_on_courses", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Course created:", response.data);
      setIsOpen(false);
      setCourseName("");
      setDescription("");
      setLink("");
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
      alert("Failed to submit course.");
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
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl">
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

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Course Name
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[100px] resize-y"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Course Link
              </label>
              <input
                type="url"
                className="w-full border rounded px-3 py-2"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div className="text-right">
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
