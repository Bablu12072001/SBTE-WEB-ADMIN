import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function FaqFormModal({ isOpen, setIsOpen, faqTypes = [] }) {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(undefined);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [type, setType] = useState("admission");
  const [attachment, setAttachment] = useState("");
  const [uploadMethod, setUploadMethod] = useState("upload");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploadProgress(0);

      try {
        const response = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: file.name,
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

        if (response.data.status && response.data.path) {
          setAttachment(response.data.path);
        } else {
          alert("Failed to upload attachment.");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        alert("Image upload failed.");
      } finally {
        setUploadProgress(undefined);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!question || !answer || !type) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      question,
      answer,
      type,
      attachment,
      created_by:
        decodedToken?.name || decodedToken?.email || "Created by unknown",
    };

    try {
      const response = await axios.post("/api/admin/FAQ", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("FAQ created:", response.data);
      setIsOpen(false);
      setQuestion("");
      setAnswer("");
      setType("admission");
      setAttachment("");
      setUploadMethod("upload");
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
      alert("Failed to submit FAQ.");
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
              Add New FAQ
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
              <label className="block text-sm font-medium mb-1">Question</label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[100px] resize-y"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[100px] resize-y"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">-- Select FAQ Type --</option>
                {faqTypes.map((t) => (
                  <option key={t.id} value={t.type}>
                    {t.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Attachment Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Attachment
              </label>
              <div className="flex gap-4 text-sm mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="upload"
                    checked={uploadMethod === "upload"}
                    onChange={() => setUploadMethod("upload")}
                  />
                  Upload File
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="url"
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              ) : (
                <input
                  type="text"
                  placeholder="https://example.com/resource.pdf"
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              )}

              {uploadProgress >= 0 && (
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

            <div className="text-right pt-2">
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
