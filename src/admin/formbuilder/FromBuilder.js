"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function FormBuilderModal({
  isOpen,
  onClose,
  jobId,
  companyName,
}) {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [token, setToken] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdFormId, setCreatedFormId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTitle(`${companyName} Application Form`);
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch {
        console.error("Invalid token");
      }
    }
  }, [companyName]);

  const addField = (type) => {
    setFields((prev) => [
      ...prev,
      {
        id: uuid(),
        type,
        label: `New ${type} field`,
        placeholder: "",
        options: [],
      },
    ]);
  };

  const editLabel = (id, value) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, label: value } : f))
    );
  };

  const editPlaceholder = (id, value) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, placeholder: value } : f))
    );
  };

  const editOptions = (id, opts) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, options: opts } : f))
    );
  };

  const handleSave = async () => {
    const payload = {
      id: jobId,
      company_name: companyName,
      form: fields.map((f) => ({
        label: f.label,
        placeholder: f.placeholder || "",
        field: f.type === "select" ? "dropdown" : "input",
        list: f.type === "select" ? f.options : [],
      })),
      created_by: "Admin",
    };

    try {
      const res = await axios.post("/api/admin/form", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status) {
        setCreatedFormId(res.data.id);
        setShowSuccessDialog(true);
      } else {
        alert("❌ Failed to create form");
      }
    } catch (error) {
      console.error("Error creating form:", error);
      alert("❌ Error creating form");
    }
  };

  return (
    <>
      {/* Main Form Dialog */}
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="bg-white p-6 rounded-lg max-w-3xl w-full space-y-4">
            <Dialog.Title className="text-lg font-semibold text-blue-900">
              Create Form for {companyName}
            </Dialog.Title>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Form title"
            />

            {/* Fields */}
            {fields.map((field) => (
              <div key={field.id} className="border p-3 rounded mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  className="w-full border px-3 py-1 rounded mb-2"
                  value={field.label}
                  onChange={(e) => editLabel(field.id, e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  className="w-full border px-3 py-1 rounded mb-2"
                  placeholder="Placeholder"
                  value={field.placeholder}
                  onChange={(e) => editPlaceholder(field.id, e.target.value)}
                />

                {field.type === "select" && (
                  <SelectOptionEditor
                    field={field}
                    onChange={(opts) => editOptions(field.id, opts)}
                  />
                )}
                <span className="text-xs text-gray-500">
                  Field Type: <strong>{field.type}</strong>
                </span>
              </div>
            ))}

            {/* Toolbox */}
            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-100 text-blue-700 px-4 py-1 rounded"
                onClick={() => addField("text")}
              >
                + Text
              </button>
              <button
                className="bg-blue-100 text-blue-700 px-4 py-1 rounded"
                onClick={() => addField("select")}
              >
                + Dropdown
              </button>
            </div>

            {/* Save Button */}
            <div className="text-right pt-4">
              <button
                className="bg-blue-800 text-white px-6 py-2 rounded disabled:opacity-50"
                onClick={handleSave}
                disabled={!title || !fields.length}
              >
                Save & Create
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* ✅ Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          onClose();
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg max-w-lg w-full space-y-4 text-center">
            <Dialog.Title className="text-lg font-semibold text-green-700">
              🎉 Form created successfully. Copy and paste this ID into the{" "}
              <strong>Apply Link</strong> field of the job edit form.
              <br />
              <span className="text-red-600">
                This ID will appear only once and cannot be created again for
                this job!
              </span>
            </Dialog.Title>
            <p className="text-sm text-gray-700">
              Form ID:{" "}
              <span className="font-mono text-blue-800 break-all">
                {createdFormId}
              </span>
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdFormId);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
              }}
              className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800"
            >
              📋 Copy Link ID
            </button>
            <div>
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  onClose();
                }}
                className="text-sm text-gray-600 mt-4 hover:underline"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

function SelectOptionEditor({ field, onChange }) {
  const opts = field.options ?? [];
  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Options
      </label>
      {opts.map((opt, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={opt}
            onChange={(e) => {
              const copy = [...opts];
              copy[i] = e.target.value;
              onChange(copy);
            }}
          />
          <button
            className="text-red-500"
            onClick={() => onChange(opts.filter((_, j) => j !== i))}
          >
            ❌
          </button>
        </div>
      ))}
      <button
        className="text-blue-700 text-sm"
        onClick={() => onChange([...opts, ""])}
      >
        + Option
      </button>
    </>
  );
}
