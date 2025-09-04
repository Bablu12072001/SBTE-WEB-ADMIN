"use client";

import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function EditSyllabusModal({
  isOpen,
  setIsOpen,
  editData,
  onSave,
}) {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [session, setSession] = useState("");
  const [lastModifyDate, setLastModifyDate] = useState("");
  const [branches, setBranches] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);

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

      axios
        .get("/api/web/available_courses", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => {
          if (res.data.status) {
            setAvailableBranches(res.data.body);
          }
        })
        .catch((err) => console.error("Failed to load branches:", err));
    }

    if (editData) {
      setSession(editData.session);
      setLastModifyDate(editData.lastModifyDate);
      setBranches(
        editData.branches.map((branch) => ({
          ...branch,
          Semester: branch.Semester || branch.semester || [],
          link: [...branch.link],
        }))
      );
    }
  }, [editData]);

  const handleFileUpload = async (file, branchIndex, semesterIndex) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      setUploading(true);
      try {
        const res = await axios.post(
          "/api/presign/upload",
          {
            base64,
            fileName: file.name,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (e) =>
              setUploadProgress(Math.round((e.loaded * 100) / e.total)),
          }
        );

        if (res.data.status && res.data.path) {
          const newBranches = [...branches];
          newBranches[branchIndex].link[semesterIndex] = res.data.path;
          setBranches(newBranches);
        } else {
          alert("Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload error");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSemester = (branchIndex, semIndex) => {
    const updated = [...branches];
    updated[branchIndex].Semester.splice(semIndex, 1);
    updated[branchIndex].link.splice(semIndex, 1);
    setBranches(updated);
  };

  const handleRemoveBranch = (branchIndex) => {
    const updated = [...branches];
    updated.splice(branchIndex, 1);
    setBranches(updated);
  };

  const handleSubmit = async () => {
    if (uploading) {
      alert("Please wait for the file to finish uploading.");
      return;
    }

    for (let b of branches) {
      for (let i = 0; i < b.Semester.length; i++) {
        if (!b.link[i] || b.link[i].trim() === "") {
          alert(
            `Please upload a file for "${b.branch}" - "${b.Semester[i]}" before submitting.`
          );
          return;
        }
      }
    }

    try {
      await axios.put(
        "/api/admin/syllabus",
        {
          id: editData.id,
          session,
          lastModifyDate,
          created_by: decodedToken.name,
          branches,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSave();
      setIsOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("An error occurred while saving.");
    }
  };

  const handleAddBranch = () => {
    setBranches((prev) => [
      ...prev,
      {
        branch: "",
        branch_code: "",
        Semester: [],
        link: [],
      },
    ]);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg max-w-4xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
          <Dialog.Panel>
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-blue-900">
                Edit Curriculum
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Session
                </label>
                <input
                  type="text"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Modify Date
                </label>
                <input
                  type="date"
                  value={lastModifyDate}
                  onChange={(e) => setLastModifyDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1">
              {branches.map((branch, branchIndex) => (
                <div
                  key={branchIndex}
                  className="border rounded-lg p-4 shadow-sm relative"
                >
                  {/* Remove Branch button */}
                  <button
                    onClick={() => handleRemoveBranch(branchIndex)}
                    className="absolute top-2 right-2 text-red-600 text-sm hover:underline"
                  >
                    ✖ Remove Branch
                  </button>

                  <div className="mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Branch Name
                    </label>
                    <select
                      value={branch.branch}
                      onChange={(e) => {
                        const selectedBranch = availableBranches.find(
                          (b) => b.branch === e.target.value
                        );
                        const updated = [...branches];
                        updated[branchIndex].branch =
                          selectedBranch?.branch || "";
                        updated[branchIndex].branch_code =
                          selectedBranch?.branch_code || "";
                        setBranches(updated);
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="">Select Branch</option>
                      {availableBranches.map((b) => (
                        <option key={b.branch_code} value={b.branch}>
                          {b.branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700">
                      Branch Code
                    </label>
                    <input
                      type="text"
                      value={branch.branch_code}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-100"
                    />
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      const semesters = branch.Semester.map((sem, i) => ({
                        sem,
                        link: branch.link[i],
                        index: i,
                      })).sort((a, b) => {
                        const num = (s) =>
                          parseInt(s.sem.match(/\d+/)?.[0]) || 0;
                        return num(a) - num(b);
                      });

                      return semesters.map((item, sortedIndex) => (
                        <div
                          key={sortedIndex}
                          className="space-y-1 border-b pb-2 border-gray-200"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {item.sem}
                            </span>
                            <button
                              className="text-red-600 text-xs hover:underline"
                              onClick={() =>
                                handleRemoveSemester(branchIndex, item.index)
                              }
                            >
                              Remove
                            </button>
                          </div>

                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:underline text-sm"
                            >
                              {item.link.split("/").pop()}
                            </a>
                          ) : (
                            <p className="text-red-500 text-sm">
                              No file uploaded
                            </p>
                          )}

                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) =>
                              handleFileUpload(
                                e.target.files[0],
                                branchIndex,
                                item.index
                              )
                            }
                            className="text-sm"
                          />
                        </div>
                      ));
                    })()}

                    <div className="mt-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Add Semester
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          className="border p-2 text-sm rounded w-32"
                          value={branch.newSemester || ""}
                          onChange={(e) => {
                            const updated = [...branches];
                            updated[branchIndex].newSemester = e.target.value;
                            setBranches(updated);
                          }}
                        >
                          <option value="">Select</option>
                          {[...Array(8)].map((_, i) => {
                            const label = `${i + 1} Semester`;
                            return !branch.Semester.includes(label) ? (
                              <option key={label} value={label}>
                                {label}
                              </option>
                            ) : null;
                          })}
                        </select>
                        <button
                          className="bg-blue-800 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          onClick={() => {
                            const updated = [...branches];
                            const selectedSem =
                              updated[branchIndex].newSemester;
                            if (!selectedSem) return;
                            updated[branchIndex].Semester.push(selectedSem);
                            updated[branchIndex].link.push("");
                            updated[branchIndex].newSemester = "";
                            setBranches(updated);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-left">
              <button
                className="text-blue-800 font-medium hover:underline text-sm"
                onClick={handleAddBranch}
              >
                ➕ Add Branch
              </button>
            </div>

            {uploading && (
              <div className="my-4">
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

            <div className="text-right mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                disabled={uploading}
              >
                Update
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
