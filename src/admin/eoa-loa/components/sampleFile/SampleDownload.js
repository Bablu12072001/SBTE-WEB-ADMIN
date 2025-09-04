"use client";
import { IoClose } from "react-icons/io5";

export default function SampleDownloadModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-lg font-semibold text-center mb-4">
          EOA/LOA Sample
        </h2>
        <a
          href="/sample/eoa_loa.xlsx"
          download
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          Download
        </a>
      </div>
    </div>
  );
}
