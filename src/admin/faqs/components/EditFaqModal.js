import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function EditFaqsModal({
  isOpen,
  setIsOpen,
  editData,
  isEdit,
  onSave,
}) {
  const [token, setToken] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMethod, setUploadMethod] = useState("upload");

  const [formData, setFormData] = useState({
    id: 1,
    created_at: "",
    created_by: "",
    question: "",
    answer: "",
    type: "registration",
    attachment: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setFormData((prev) => ({
          ...prev,
          created_by: decoded.userId || decoded.name || "Admin",
        }));
      } catch (err) {
        console.error("Invalid token");
      }
    }

    if (isEdit && editData) {
      setFormData({
        id: editData.id || 1,
        created_at: editData.created_at || "",
        question: editData.question || "",
        answer: editData.answer || "",
        type: editData.type || "registration",
        created_by: editData.created_by || "",
        attachment: editData.attachment || "",
      });

      if (editData.attachment && editData.attachment.startsWith("http")) {
        setUploadMethod("url");
      } else {
        setUploadMethod("upload");
      }
    }
  }, [editData, isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      setUploading(true);
      setUploadProgress(0);

      try {
        const res = await axios.post(
          "/api/presign/upload",
          {
            base64,
            fileName: file.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (e) => {
              const percent = Math.round((e.loaded * 100) / e.total);
              setUploadProgress(percent);
            },
          }
        );

        if (res.data.status && res.data.path) {
          setFormData((prev) => ({
            ...prev,
            attachment: res.data.path,
          }));
        } else {
          alert("Upload failed");
        }
      } catch (err) {
        console.error("File upload failed", err);
        alert("Upload error");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (uploading) {
      alert("Please wait for the file to finish uploading");
      return;
    }

    try {
      await axios.put(`/api/admin/FAQ`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSave();
      setIsOpen(false);
    } catch (err) {
      console.error("Save failed", err);
      alert("An error occurred while saving.");
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
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-blue-900">
              Edit FAQ
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
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                name="created_at"
                value={formData.created_at?.split("T")[0] || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                readOnly
              />
            </div>

            {["question", "answer"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize">
                  {field}
                </label>
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 min-h-[100px] resize-y"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                {[
                  "admission",
                  "registration",
                  "examination",
                  "enrollment",
                  "result",
                  "fees",
                  "correction",
                  "re-evaluation",
                ].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Attachment</label>

              <div className="flex gap-4 text-sm mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="uploadMethod"
                    checked={uploadMethod === "upload"}
                    onChange={() => setUploadMethod("upload")}
                  />
                  Upload File
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="uploadMethod"
                    checked={uploadMethod === "url"}
                    onChange={() => setUploadMethod("url")}
                  />
                  Paste URL
                </label>
              </div>

              {uploadMethod === "upload" ? (
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="w-full border rounded px-3 py-2"
                />
              ) : (
                <input
                  type="text"
                  placeholder="https://example.com/resource.pdf"
                  value={formData.attachment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      attachment: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              )}

              {uploading && (
                <p className="text-sm text-blue-600 mt-1">
                  Uploading: {uploadProgress}%
                </p>
              )}

              {formData.attachment && (
                <p className="text-sm mt-2 break-words text-blue-700">
                  <a
                    href={formData.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    View Current Attachment
                  </a>
                </p>
              )}
            </div>

            <div className="text-right pt-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                disabled={uploading}
              >
                Update
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
