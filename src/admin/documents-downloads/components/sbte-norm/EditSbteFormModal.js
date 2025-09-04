// "use client";

import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function EditSbteNormModal({
  isOpen,
  setIsOpen,
  isEdit,
  editData,
  onSave,
}) {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [attachment, setAttachment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [norms, setNorms] = useState({ norm: [""], link: [""] });

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decode = jwtDecode(storedToken);
        setDecodedToken(decode);
      } catch {
        console.error("Invalid token");
      }
    }

    if (isEdit && editData) {
      setType(editData.type);
      setTitle(editData.title);
      setAttachment(editData.attachement || "");
      setNorms(editData.norms || { norm: [""], link: [""] });
    }
  }, [editData, isEdit]);

  const handleFileUpload = async (file, index = null) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      setUploading(true);
      try {
        const res = await axios.post(
          "/api/presign/upload",
          { base64, fileName: file.name },
          {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (e) =>
              setUploadProgress(Math.round((e.loaded * 100) / e.total)),
          }
        );

        if (res.data.status && res.data.path) {
          if (type === "Semester System") {
            setAttachment(res.data.path);
          } else {
            const updated = { ...norms };
            updated.link[index] = res.data.path;
            setNorms(updated);
          }
        } else {
          alert("Upload failed");
        }
      } catch (err) {
        console.error("Upload error", err);
        alert("Upload error");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (uploading) return alert("Please wait for upload to complete.");

    try {
      await axios.put(
        "/api/admin/norms",
        {
          id: editData.id,
          title,
          type,
          attachement: type === "Semester System" ? attachment : "",
          norms: type === "Non-Semester System" ? norms : {},
          created_by: decodedToken.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSave();
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to update norms", err);
      alert("An error occurred while saving.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-blue-900">
              {isEdit ? "Edit Norm" : "Add Norm"}
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
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full border p-2 text-sm rounded"
              />
            </div>

            {type === "Semester System" ? (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Attachment
                </label>
                <br />
                {attachment && (
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-700 hover:underline my-1"
                  >
                    {attachment.split("/").pop()}
                  </a>
                )}
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
              </div>
            ) : (
              norms.norm.map((_, index) => (
                <div key={index} className="space-y-2 border p-3 rounded mb-2">
                  <input
                    type="text"
                    value={norms.norm[index]}
                    placeholder="Norm description"
                    onChange={(e) => {
                      const updated = { ...norms };
                      updated.norm[index] = e.target.value;
                      setNorms(updated);
                    }}
                    className="w-full border p-2 text-sm rounded"
                  />
                  {norms.link[index] && (
                    <a
                      href={norms.link[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-700 hover:underline text-sm"
                    >
                      {norms.link[index].split("/").pop()}
                    </a>
                  )}
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], index)}
                  />
                </div>
              ))
            )}
          </div>

          {uploading && (
            <div className="my-4">
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-blue-600 h-2 rounded"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-700 mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="text-right mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              disabled={uploading}
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
