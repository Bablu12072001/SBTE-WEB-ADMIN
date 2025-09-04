import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function EditAddOnCourseModal({
  isOpen,
  setIsOpen,
  editData,
  isEdit,
  onSave,
}) {
  const [token, setToken] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: 1,
    created_at: "",
    created_by: "",
    course_name: "",
    link: "",
    description: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setFormData((prev) => ({
          ...prev,
          created_by: decoded.userId || "",
        }));
      } catch (err) {
        console.error("Invalid token");
      }
    }

    if (isEdit && editData) {
      setFormData({
        id: editData.id || 1,
        created_at: editData.created_at || "",
        created_by: editData.created_by || "",
        course_name: editData.course_name || "",
        link: editData.link || "",
        description: editData.description || "",
      });
    }
  }, [editData, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/admin/add_on_courses`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`/api/admin/add_on_courses`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

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
              {isEdit ? "Edit Course" : "Add Course"}
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Date input */}
            <div>
              <label className="block text-sm font-medium capitalize">
                Date
              </label>
              <input
                type="date"
                name="created_at"
                value={formData.created_at?.split("T")[0] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    created_at: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium capitalize">
                Course Name
              </label>
              <input
                type="text"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium capitalize">
                Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium capitalize">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 min-h-[100px] resize-y"
              />
            </div>

            {/* Save/Update Button */}
            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                disabled={uploading}
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
