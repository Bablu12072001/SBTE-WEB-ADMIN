import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { uploadFile, createEOA, updateEOA } from "../utils/api";

// Simulated authenticated user function
const getCurrentUser = () => "admin@university.edu";

export default function EOALOAFormModal({
  isOpen,
  setIsOpen,
  data,
  isEdit,
  onSuccess,
  onSuccessWithMessage,
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [session, setSession] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && data) {
      setTitle(data.institute || "");
      setType(data.institute_type || "");
      setSession(data.session || "");
      setImageUrl(data.attachment || "");
      setFileName(data.attachment?.split("/").pop() || "");
    } else {
      setTitle("");
      setType("");
      setSession("");
      setImageUrl("");
      setFileName("");
    }
  }, [isEdit, data]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploading(true);
    setFileName(selectedFile.name);

    try {
      const base64 = await fileToBase64(selectedFile);
      const response = await uploadFile({
        base64,
        fileName: selectedFile.name,
      });
      setImageUrl(response.path);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      institute: title,
      institute_type: type,
      session,
      attachment: imageUrl,
      created_by: getCurrentUser(),
    };

    try {
      if (isEdit) {
        await updateEOA({ ...payload, id: data.id });
        onSuccessWithMessage?.("EOA/LOA updated successfully!");
      } else {
        await createEOA(payload);
        onSuccessWithMessage?.("EOA/LOA added successfully!");
      }

      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving EOA/LOA", error);
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
              {isEdit ? "Edit EOA/LOA" : "Add New EOA/LOA"}
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Institute Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <input
              type="text"
              placeholder="Session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <select
              className="w-full border rounded px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Private">Private</option>
              <option value="Government">Government</option>
            </select>

            <input
              type="file"
              accept="image/*, application/pdf"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />

            {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
            {fileName && (
              <p className="text-sm text-gray-700">Selected file: {fileName}</p>
            )}

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                {isEdit ? "Update" : "Upload"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
