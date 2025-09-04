"use client";
import React from "react";
import { IoClose } from "react-icons/io5";

export default function SampleDownloadModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          <IoClose />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Download Sample Files
        </h2>

        {/* Download buttons */}
        <div className="space-y-4">
          <a
            href="/sample/SbteSyllabusSessionAndDetail.json"
            download
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Curriculum (JSON)
          </a>
          <a
            href="/sample/questionbank.xlsx"
            download
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            PYQ (Excel)
          </a>
        </div>
      </div>
    </div>
  );
}
