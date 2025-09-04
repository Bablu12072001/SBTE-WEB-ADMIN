"use client";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function EditJobModal({
  isOpen,
  setIsOpen,
  jobData,
  onEditSuccess,
}) {
  const [token, setToken] = useState("");

  const [formData, setFormData] = useState({
    ...jobData,
    eligible_streams: JSON.parse(jobData.eligible_streams || "[]"),
    skills_required: JSON.parse(jobData.skills_required || "[]"),
    application_start_date: jobData.application_start_date.split("T")[0],
    application_end_date: jobData.application_end_date.split("T")[0],
    interview_date: jobData.interview_date?.split("T")[0] || "",
    approved_by: "admin",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      setUploading(true);

      try {
        const res = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: file.name,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            },
          }
        );
        if (res.data?.path) {
          setFormData({ ...formData, job_description_file: res.data.path });
        }
      } catch (err) {
        alert("Upload failed");
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        min_required_percentage: parseInt(formData.min_required_percentage),
        eligible_streams: Array.isArray(formData.eligible_streams)
          ? formData.eligible_streams
          : formData.eligible_streams.split(","),
        skills_required: Array.isArray(formData.skills_required)
          ? formData.skills_required
          : formData.skills_required.split(","),
      };

      await axios.put("/api/admin/admin_career", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsOpen(false);
      onEditSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Error saving changes");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-3xl w-full space-y-4">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-lg font-semibold">
              Edit Job Posting
            </Dialog.Title>
            <button onClick={() => setIsOpen(false)}>
              <IoClose size={22} />
            </button>
          </div>

          {/* Sample Input */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>ID (Read only)</label>
              <input
                type="text"
                value={formData.id}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>
            <div>
              <label>Company Name</label>
              <input
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Job Title</label>
              <input
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Salary</label>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Apply Link</label>
              <input
                name="apply_link"
                value={formData.apply_link}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Application Start</label>
              <input
                name="application_start_date"
                type="date"
                value={formData.application_start_date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Application End</label>
              <input
                name="application_end_date"
                type="date"
                value={formData.application_end_date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Interview Date</label>
              <input
                name="interview_date"
                type="date"
                value={formData.interview_date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Eligible Streams (comma separated)</label>
              <input
                name="eligible_streams"
                value={formData.eligible_streams}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Skills Required (comma separated)</label>
              <input
                name="skills_required"
                value={formData.skills_required}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label>Upload Job Description</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
              />
              {uploading && (
                <div className="text-xs text-gray-500">
                  Uploading... {uploadProgress}%
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
