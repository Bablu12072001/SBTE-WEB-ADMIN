import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

export default function AboutUsFormModal({
  isOpen,
  setIsOpen,
  aboutUsData,
  setAboutUsData,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [token, setToken] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) setToken(storedToken);

    if (aboutUsData) {
      setTitle(aboutUsData.title || "");
      setDescription(aboutUsData.description || "");
      setImageUrl(aboutUsData.imageUrl || "");
      setVideoLink(aboutUsData.videoLink || "");
    } else {
      setTitle("");
      setDescription("");
      setImageUrl("");
      setVideoLink("");
    }
  }, [aboutUsData, isOpen]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];

      try {
        setLoading(true);
        const presignRes = await fetch("/api/presign/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            base64: base64Data,
            fileName: file.name,
          }),
        });

        const presignData = await presignRes.json();

        if (presignData?.status && presignData?.path) {
          setImageUrl(presignData.path);
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error("Image upload error:", error);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      descriptions: description,
      image: imageUrl,
      video: videoLink,
    };

    if (aboutUsData?.id) {
      payload.id = aboutUsData.id;
    }

    try {
      setLoading(true);
      const result = await onSave(payload);

      if (result.success) {
        setSuccessMessage("Saved successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          setIsOpen(false);
        }, 1200);
      } else {
        setSuccessMessage("Failed to save.");
      }
    } catch (error) {
      console.error("Error in saving:", error);
    } finally {
      setLoading(false);
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
              {aboutUsData ? "Edit About Us Data" : "Add About Us Data"}
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          {loading && (
            <div className="text-center text-blue-600 mb-2">Processing...</div>
          )}
          {successMessage && (
            <div
              className={`text-center mb-2 ${
                successMessage.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {successMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full border rounded px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">
                Video Link
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
              />
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
                disabled={loading}
              >
                {aboutUsData ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
