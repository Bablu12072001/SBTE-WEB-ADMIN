"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
// import { getAuthToken } from "@/app/utility/auth";

export default function OfficialLettersFormModal({
  isOpen,
  setIsOpen, // This prop controls the modal's open/close state
  editData,
  onSuccess, // Renamed from refreshData for consistency
  onSuccessWithMessage,
}) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    attachment: "",
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // State to prevent multiple submissions
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Reset form and states when modal closes (or initially not open)
      setForm({
        title: "",
        date: "",
        description: "",
        attachment: "",
      });
      setUploading(false); // Reset uploading state
      setSubmitting(false); // Reset submitting state
      return;
    }

    if (editData) {
      setForm({
        title: editData.title || "",
        date: editData.date ? editData.date.split("T")[0] : "", // Format date for input type="date"
        description: editData.description || "",
        attachment: editData.attachment || "",
      });
    } else {
      // Ensure clean state for "Add New" when modal opens without editData
      setForm({
        title: "",
        date: "",
        description: "",
        attachment: "",
      });
    }
  }, [isOpen, editData]); // Depend on isOpen and editData

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true); // Start uploading
    try {
      // const token = getAuthToken();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];
        const res = await axios.post(
          "/api/presign/upload",
          {
            base64,
            fileName: file.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.status) {
          setForm((prev) => ({ ...prev, attachment: res.data.path }));
          onSuccessWithMessage?.("File uploaded successfully!");
        } else {
          console.error("Upload failed:", res.data.message);
          onSuccessWithMessage?.("File upload failed!");
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      onSuccessWithMessage?.("File upload failed due to network error.");
    } finally {
      setUploading(false); // End uploading
      // Important: Do NOT reset form here, only on successful submission or modal close.
    }
  };
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.attachment) {
      onSuccessWithMessage?.("Please fill in Title, Date and upload a file.");
      return;
    }

    setSubmitting(true); // Disable button during submission

    const payload = {
      title: form.title,
      date: formatDate(form.date), // ✅ Convert from yyyy-mm-dd to dd-mm-yyyy
      description: form.description,
      attachment: form.attachment,
      created_by: "admin_user", // Adjust as needed
    };

    try {
      let res;
      let message = "";

      if (editData) {
        res = await axios.put(
          "/api/admin/official_letter",
          { id: editData.id, ...payload },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message = "Official Letter updated successfully!";
      } else {
        res = await axios.post("/api/admin/official_letter", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        message = "Official Letter added successfully!";
      }

      if (res.data.status) {
        onSuccessWithMessage?.(message);
        onSuccess?.();
      } else {
        console.error("Server responded with an error:", res.data.message);
        onSuccessWithMessage?.(`Operation failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      onSuccessWithMessage?.("Submission failed due to a network error.");
    } finally {
      setSubmitting(false); // Re-enable button
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
              {editData ? "Edit" : "Add"} Official Letter
            </Dialog.Title>
            {/* Cross cancel button */}
            <button
              onClick={() => setIsOpen(false)} // This explicitly closes the modal
              className="text-gray-500 hover:text-gray-700"
              disabled={uploading || submitting} // Disable if an operation is in progress
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border px-3 py-2 rounded"
              disabled={uploading || submitting}
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              disabled={uploading || submitting}
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded"
              rows={4}
              disabled={uploading || submitting}
            />
            <div>
              <label className="block mb-1 font-medium">
                Upload PDF or Image
              </label>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                disabled={uploading || submitting}
                className="w-full border px-3 py-2 rounded"
              />
              {uploading && <p className="text-blue-600 mt-1">Uploading...</p>}
              {form.attachment && (
                <p className="text-sm mt-1">
                  Current File:{" "}
                  <a
                    href={form.attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit} // This is the button for Add/Update
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
                disabled={uploading || submitting} // Disable button if uploading or submitting
              >
                {editData ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
