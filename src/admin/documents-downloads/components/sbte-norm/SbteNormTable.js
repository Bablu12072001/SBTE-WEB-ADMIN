"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import EditSbteNormModal from "./EditSbteFormModal";
import DeleteSbteNormModal from "./DeleteSbteNormModal";

export default function SbteNormsTable() {
  const [normsData, setNormsData] = useState([]);
  const [token, setToken] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNorm, setSelectedNorm] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
        fetchNorms(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchNorms = async (token) => {
    try {
      const response = await axios.get("/api/web/norms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status && Array.isArray(response.data.body)) {
        setNormsData(response.data.body);
      } else {
        console.error("Unexpected response format", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch norms", error);
    }
  };

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {normsData.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-300 shadow-md rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-blue-900">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600">Type: {item.type}</p>
                <p className="text-sm text-gray-600">
                  Created: {new Date(item.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">By: {item.created_by}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setSelectedNorm(item);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit size={20} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    setDeleteTarget(item);
                    setIsDeleteOpen(true);
                  }}
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>

            {item.type === "Semester System" && item.attachement && (
              <div>
                <a
                  href={item.attachement}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline block truncate"
                >
                  {item.attachement.split("/").pop() || "View Attachment"}
                </a>
              </div>
            )}

            {item.type === "Non-Semester System" &&
              item.norms?.norm?.length > 0 && (
                <div className="space-y-1">
                  {item.norms.norm.map((normText, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm border-b py-1"
                    >
                      <span className="font-medium text-gray-800">
                        {normText}
                      </span>
                      <a
                        href={item.norms.link[idx]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline truncate max-w-[60%]"
                      >
                        {item.norms.link[idx]?.split("/").pop() || "View"}
                      </a>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      <EditSbteNormModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isEdit={!!selectedNorm}
        editData={selectedNorm}
        onSave={() => fetchNorms(token)}
      />

      <DeleteSbteNormModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        item={deleteTarget}
        token={token}
        onDeleteSuccess={(deletedId) => {
          setNormsData((prev) => prev.filter((faq) => faq.id !== deletedId));
        }}
      />
    </div>
  );
}
