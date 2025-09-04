import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function AddMemberFormModal({
  isOpen,
  setIsOpen,
  token,
  onSuccess,
}) {
  const [decodedToken, setDecodedToken] = useState({});
  const [uploadProgress, setUploadProgress] = useState(undefined);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    message: "",
    image: "",
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, [token]);

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
          setFormData((prev) => ({
            ...prev,
            image: response.data.path,
          }));
        } else {
          alert("Failed to upload image.");
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
    const payload = {
      ...formData,
      created_by: decodedToken?.name || "Admin",
    };

    try {
      const response = await axios.post("/api/admin/member", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        onSuccess();
        setIsOpen(false);
      } else {
        alert("Failed to add member.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting form.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-blue-900">
              Add New Member
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {["name", "position", "designation"].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleImageUpload(file);
                }}
              />
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

            <div className="text-right pt-4">
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
