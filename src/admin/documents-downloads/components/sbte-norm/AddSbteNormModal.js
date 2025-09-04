// "use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

export default function AddSbteNormModal({
  isOpen,
  setIsOpen,
  currentNorm,
  onSuccess,
}) {
  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Semester System"); // ✅ Default to Semester
  const [attachment, setAttachment] = useState("");
  const [file, setFile] = useState(null);
  const [norms, setNorms] = useState({ norm: [""], link: [""] });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setToken(token);

    if (isOpen) {
      if (currentNorm) {
        setId(currentNorm.id || null);
        setTitle(currentNorm.title || "");
        setType(currentNorm.type || "Semester System");
        setAttachment(currentNorm.attachement || "");
        setNorms(currentNorm.norms || { norm: [""], link: [""] });
        setFile(null);
      } else {
        setId(null);
        setTitle("");
        setAttachment("");
        setFile(null);
        setType("Semester System");
        setNorms({ norm: [""], link: [""] });
      }
      setError(null);
      setSuccessMessage("");
    }
  }, [isOpen, currentNorm]);

  const handleFileUpload = async (selectedFile, callback) => {
    if (!selectedFile) return callback("");
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(",")[1];
        const res = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        callback(res.data.path || "");
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
      callback("");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !type || (type === "Semester System" && !attachment)) {
      setError("Please fill all required fields.");
      return;
    }

    const payload = {
      title,
      type,
      attachement: attachment,
      norms: type === "Non-Semester System" ? norms : {},
      created_by: "admin",
    };

    try {
      setLoading(true);
      const res = id
        ? await axios.put(
            "/api/admin/norms",
            { id, ...payload },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : await axios.post("/api/admin/norms", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (res.data.status) {
        setSuccessMessage(id ? "Updated successfully" : "Created successfully");
        onSuccess();
        setTimeout(() => {
          setIsOpen(false);
          setSuccessMessage("");
        }, 1500);
      } else {
        setError(res.data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => !loading && setIsOpen(false)}
      className="z-50 fixed inset-0 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl transform transition-all">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              {id ? "Edit Norm" : "Add Norm"}
            </Dialog.Title>
            <button onClick={() => setIsOpen(false)}>
              <IoClose size={24} />
            </button>
          </div>

          {error && <div className="text-red-600 mb-2">{error}</div>}
          {successMessage && (
            <div className="text-green-600 mb-2">{successMessage}</div>
          )}

          <div className="space-y-4">
            <div>
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Semester System">Semester System</option>
                <option value="Non-Semester System">Non-Semester System</option>
              </select>
            </div>

            {/* Show when Semester System is selected */}
            {type === "Semester System" && (
              <div>
                <label>Upload Attachment</label>
                <br />
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileUpload(e.target.files[0], setAttachment)
                  }
                />
                {attachment && (
                  <p className="text-sm text-green-700 mt-1">
                    Uploaded: {attachment.split("/").pop()}
                  </p>
                )}
              </div>
            )}

            {/* Show when Non-Semester System is selected */}
            {type === "Non-Semester System" && (
              <div className="space-y-4">
                {/* Norms Input */}
                <div className="space-y-2">
                  {norms.norm.map((n, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Norm"
                        value={norms.norm[idx]}
                        onChange={(e) => {
                          const updated = [...norms.norm];
                          updated[idx] = e.target.value;
                          setNorms({ ...norms, norm: updated });
                        }}
                        className="flex-1 border px-3 py-1 rounded"
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileUpload(e.target.files[0], (url) => {
                            const updatedLinks = [...norms.link];
                            updatedLinks[idx] = url;
                            setNorms({ ...norms, link: updatedLinks });
                          })
                        }
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setNorms({
                        norm: [...norms.norm, ""],
                        link: [...norms.link, ""],
                      })
                    }
                    className="text-sm text-blue-700"
                  >
                    + Add Norm
                  </button>
                </div>

                {/* Extra Attachment Upload Field */}
                <div>
                  <label>Upload Attachment</label>
                  <br />
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(e.target.files[0], setAttachment)
                    }
                  />
                  {attachment && (
                    <p className="text-sm text-green-700 mt-1">
                      Uploaded: {attachment.split("/").pop()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="text-right">
              <button
                onClick={handleSubmit}
                disabled={loading || uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Saving..." : id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
