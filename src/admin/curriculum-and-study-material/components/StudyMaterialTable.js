"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import StudyMaterialFormModal from "./StudyMaterialFormModal";

export default function StudyMaterialTable() {
  const [showModal, setShowModal] = useState(false);
  const [studyMaterial, setStudyMaterial] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token: ", decodedToken);
        fetchStudyMaterial(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchStudyMaterial = async (token) => {
    try {
      const response = await axios.get("/api/web/study_material", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status && response.data.body) {
        setStudyMaterial(response.data.body);
      }
    } catch (error) {
      console.error("Error fetching E-content & Virtual Labs:", error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  return (
    <div className="space-y-4">
      <button
        className="bg-blue-900 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Update E-content & Virtual Labs
      </button>

      {studyMaterial ? (
        <div className="border p-4 rounded bg-white shadow text-sm space-y-2">
          <div>
            <strong>Updated Date:</strong>{" "}
            {formatDate(studyMaterial.updated_at)}
          </div>
          <div>
            <strong>Link:</strong>{" "}
            <a
              href={studyMaterial.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline break-all"
            >
              {studyMaterial.link}
            </a>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No E-content & Virtual Labs available.</p>
      )}

      <StudyMaterialFormModal
        isOpen={showModal}
        setIsOpen={(val) => {
          setShowModal(val);
          if (!val) fetchStudyMaterial(token);
        }}
      />
    </div>
  );
}
