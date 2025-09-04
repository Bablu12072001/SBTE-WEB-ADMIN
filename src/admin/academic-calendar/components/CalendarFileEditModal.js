import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function CalendarFileEditModal({
  isOpen,
  setIsOpen,
  data,
  onSave,
}) {
  const [token, setToken] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    attachment: "",
    description: "",
    created_by: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }

    if (data) {
      setFormData({
        id: data.id ?? "",
        title: data.title ?? "",
        attachment: data.attachment ?? "",
        description: data.description ?? "",
        created_by: data.created_by ?? "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (uploading) {
      alert("Please wait for the file to finish uploading.");
      return;
    }

    try {
      const response = await axios.put(
        "/api/admin/academic_calander",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        onSave(response.data.body);
        setIsOpen(false);
      } else {
        alert("Failed to update calendar. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating. Check console for details.");
    }
  };

  const handleFileUpload = async (e) => {
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
          setFormData((prev) => ({
            ...prev,
            attachment: path,
          }));
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

  if (!data) return null;

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
              Edit Academic Calendar
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
              <label className="block text-sm font-medium">ID</label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Created By</label>
              <input
                type="text"
                value={formData.created_by}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Attachment</label>
              {formData.attachment && (
                <p className="text-blue-700 underline mb-1">
                  <a
                    href={formData.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.attachment.split("/").pop()}
                  </a>
                </p>
              )}

              <input
                type="file"
                accept=".pdf,.csv,image/*"
                onChange={handleFileUpload}
              />

              {uploading && (
                <div className="mt-2">
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

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                disabled={uploading}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
