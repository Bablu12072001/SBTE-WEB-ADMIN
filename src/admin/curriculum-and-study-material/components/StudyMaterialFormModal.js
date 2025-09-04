"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function StudyMaterialFormModal({ isOpen, setIsOpen }) {
  const [link, setLink] = useState("");
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
    if (!link.trim()) {
      alert("Please enter the link before submitting.");
      return;
    }

    const payload = {
      link: link.trim(),
    };

    try {
      const response = await axios.post("/api/admin/study_material", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Syllabus created:", response.data);
      alert(response.data.body);
      setIsOpen(false);
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);

      const errorBody =
        error.response?.data?.body || "Something went wrong. Please try again.";
      alert(errorBody);
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
              Update E-content & Virtual Labs
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Link Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Enter Link
              </label>
              <input
                type="text"
                placeholder="https://example.com"
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
