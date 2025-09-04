"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function AddExternalLinkModal({ isOpen, setIsOpen }) {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);

  const [title, setTitle] = useState("");
  const [attachment, setAttachment] = useState("");

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
    if (!title || !attachment) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      title,
      attachment,
      created_by: decodedToken?.email || "",
    };

    try {
      const response = await axios.post("/api/admin/external", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Link created:", response.data);
      setIsOpen(false);
      setTitle("");
      setAttachment("");
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
      alert("Failed to submit document.");
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
              Add External Link
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
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Attachment URL
              </label>
              <input
                type="url"
                className="w-full border rounded px-3 py-2"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
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
