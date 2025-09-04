"use client";

import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function JobFormModal({ isOpen, setIsOpen, refreshJobs }) {
  const [form, setForm] = useState({
    company_name: "",
    company_registration_number: "",
    job_title: "",
    job_role: "",
    location: "",
    salary: "",
    qualification: "",
    service_agreement: "",
    year_of_passing: "",
    application_start_date: "",
    application_end_date: "",
    interview_rounds: "",
    interview_date: "",
    working_shift: "",
    eligible_streams: "",
    gender_preference: "any",
    min_required_percentage: "",
    skills_required: "",
    blocking_period: "",
    other_criterias: "",
    notes: "",
    remarks: "",
    apply_link: "",
  });

  const [file, setFile] = useState(null);
  const [attachment, setAttachment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken); // validation
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
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

        if (response.data?.status && response.data?.path) {
          setAttachment(response.data.path);
          setFile(selectedFile);
        } else {
          alert("Failed to upload file.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed. Check console.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (uploading) return alert("Please wait for file upload to finish.");

    try {
      const payload = {
        ...form,
        eligible_streams: form.eligible_streams.split(",").map((s) => s.trim()),
        skills_required: form.skills_required.split(",").map((s) => s.trim()),
        job_description_file: attachment,
      };

      const res = await axios.post("/api/admin/admin_career", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      refreshJobs();
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Error posting job:",
        error.response?.data || error.message
      );
      alert("Failed to post job.");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              Post New Job
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["company_name", "Company Name"],
              ["company_registration_number", "Registration No."],
              ["job_title", "Job Title"],
              ["job_role", "Job Role"],
              ["location", "Location"],
              ["salary", "Salary"],
              ["qualification", "Qualification"],
              ["service_agreement", "Service Agreement"],
              ["year_of_passing", "Year of Passing"],
              ["application_start_date", "Application Start Date", "date"],
              ["application_end_date", "Application End Date", "date"],
              ["interview_rounds", "Interview Rounds"],
              ["interview_date", "Interview Date", "date"],
              ["working_shift", "Working Shift"],
              ["eligible_streams", "Eligible Streams (comma separated)"],
              ["gender_preference", "Gender Preference"],
              ["min_required_percentage", "Minimum %"],
              ["skills_required", "Skills Required (comma separated)"],
              ["blocking_period", "Blocking Period"],
              ["other_criterias", "Other Criteria"],
              ["notes", "Notes"],
              ["remarks", "Remarks"],
              // ["apply_link", "Apply Link"],
            ].map(([name, label, type = "text"]) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            ))}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Apply Link</label>
            <p className="text-sm text-gray-600 italic">
              Apply link can be updated after the job is created.
            </p>
          </div>

          {/* File upload */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">
              Upload Job Description (PDF)
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

          <div className="text-right pt-4">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className={`px-6 py-2 rounded text-white ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-800"
              }`}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
