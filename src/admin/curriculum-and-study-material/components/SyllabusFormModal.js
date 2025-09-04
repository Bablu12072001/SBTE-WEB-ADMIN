"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function SyllabusFormModal({ isOpen, setIsOpen, onSuccess }) {
  const [session, setSession] = useState("");
  const [lastModifyDate, setLastModifyDate] = useState("");
  const [branches, setBranches] = useState([
    {
      branch: "",
      branch_code: "",
      Semester: [],
      link: [],
    },
  ]);

  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const [uploadProgressMap, setUploadProgressMap] = useState({});
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setDecodedToken(decoded);

        axios
          .get("/api/web/available_courses", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
          .then((res) => {
            if (res.data.status) {
              setCourseOptions(res.data.body);
            } else {
              console.error("Failed to fetch available courses");
            }
          })
          .catch((err) => console.error("Error fetching courses:", err));
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const addBranch = () => {
    setBranches([
      ...branches,
      { branch: "", branch_code: "", Semester: [], link: [] },
    ]);
  };

  const addSemester = (branchIndex) => {
    const updated = [...branches];
    const semCount = updated[branchIndex].Semester.length;
    updated[branchIndex].Semester.push(`${semCount + 1} Semester`);
    updated[branchIndex].link.push("");
    setBranches(updated);
  };

  const removeSemester = (branchIndex, semIndex) => {
    const updated = [...branches];
    updated[branchIndex].Semester.splice(semIndex, 1);
    updated[branchIndex].link.splice(semIndex, 1);
    setBranches(updated);
  };

  const handleSyllabusUpload = async (
    file,
    branchIndex,
    semIndex,
    semLabel
  ) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      const key = `${branchIndex}-${semIndex}`;
      setUploadProgressMap((prev) => ({
        ...prev,
        [key]: 0,
      }));

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
              setUploadProgressMap((prev) => ({
                ...prev,
                [key]: percent,
              }));
            },
          }
        );

        const { status, path } = response.data;
        if (status && path) {
          const updatedBranches = [...branches];
          updatedBranches[branchIndex].Semester[semIndex] = semLabel;
          updatedBranches[branchIndex].link[semIndex] = path;
          setBranches(updatedBranches);
        } else {
          alert("Failed to upload file.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed. Check console for details.");
      } finally {
        setUploadProgressMap((prev) => ({
          ...prev,
          [key]: undefined,
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    for (const branch of branches) {
      for (let i = 0; i < branch.Semester.length; i++) {
        if (!branch.link[i]) {
          alert(`Missing file for ${branch.Semester[i]} in ${branch.branch}`);
          return;
        }
      }
    }

    const payload = {
      session,
      lastModifyDate,
      created_by: decodedToken.name,
      branches,
    };

    try {
      const response = await axios.post("/api/admin/syllabus", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Syllabus created:", response.data);
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
      const errorBody =
        error.response?.data?.body || "Something went wrong. Please try again.";
      alert(errorBody);
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
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              Add New Curriculum
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
              <label className="block text-sm font-medium mb-1">Session</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Modified Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={lastModifyDate}
                onChange={(e) => setLastModifyDate(e.target.value)}
              />
            </div>

            {branches.map((b, branchIndex) => (
              <div key={branchIndex} className="border p-4 rounded space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="border px-3 py-2 rounded"
                    value={b.branch}
                    onChange={(e) => {
                      const selectedBranch = e.target.value;
                      const selectedCourse = courseOptions.find(
                        (c) => c.branch === selectedBranch
                      );

                      const updated = [...branches];
                      updated[branchIndex].branch = selectedBranch;
                      updated[branchIndex].branch_code =
                        selectedCourse?.branch_code || "";
                      setBranches(updated);
                    }}
                  >
                    <option value="">Select Branch</option>
                    {courseOptions.map((course) => (
                      <option key={course.id} value={course.branch}>
                        {course.branch}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Branch Code"
                    className="border px-3 py-2 rounded bg-gray-100"
                    value={b.branch_code}
                    readOnly
                  />
                </div>

                {b.Semester.map((semLabel, semIndex) => {
                  const key = `${branchIndex}-${semIndex}`;
                  const progress = uploadProgressMap[key];

                  return (
                    <div key={semIndex} className="mt-3">
                      <label className="block text-sm font-medium mb-1">
                        {semLabel} PDF
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          handleSyllabusUpload(
                            file,
                            branchIndex,
                            semIndex,
                            semLabel
                          );
                        }}
                      />
                      {progress >= 0 && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded h-2">
                            <div
                              className="bg-blue-600 h-2 rounded"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-700 mt-1">
                            Uploading... {progress}%
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        className="text-red-500 text-sm mt-1"
                        onClick={() => removeSemester(branchIndex, semIndex)}
                      >
                        Remove Semester
                      </button>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => addSemester(branchIndex)}
                  className="text-blue-600 text-sm mt-2 underline"
                >
                  + Add Semester
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addBranch}
              className="text-blue-700 font-semibold mt-2 underline"
            >
              + Add Another Branch
            </button>

            <div className="text-right mt-4">
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
