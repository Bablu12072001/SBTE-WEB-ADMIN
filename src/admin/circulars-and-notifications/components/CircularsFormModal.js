import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function CircularsFormModal({ isOpen, setIsOpen, onSuccess }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachment, setAttachment] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token: ", decodedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploading(true);
      setUploadProgress(0);

      try {
        const response = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: selectedFile.name,
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

        const { status, path } = response.data;
        if (status && path) {
          setAttachment(path);
          setFileUrl(path);
          setFile(selectedFile);
        } else {
          alert("Failed to upload file.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed. Check console for details.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      alert("Please wait for the file to finish uploading.");
      return;
    }

    const payload = {
      title,
      description,
      type,
      attachment: fileUrl,
      created_by: "admin",
      date: new Date(date).toISOString().split("T")[0],
    };

    try {
      const response = await axios.post("/api/admin/circular", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      console.error(
        "[CATCH] Error adding circular:",
        error.response?.data || error.message
      );
      alert("Error submitting circular. Check console for details.");
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
              Add a New Circular or Notification
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium">Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium">Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium">Type</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="circular">Circular</option>
                  <option value="notification">Notification</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm mb-1 font-medium">
                  Upload PDF
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {uploading && (
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
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Description
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className={`px-6 py-2 rounded text-white ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-800"
                }`}
              >
                {uploading ? "Uploading..." : "Create"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
