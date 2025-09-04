import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import axios from "axios";

export default function AddFaqTypeModal({
  isOpen,
  setIsOpen,
  token,
  onSuccess,
}) {
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!type.trim()) return alert("Please enter a FAQ type.");

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/admin/faq_type",
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        alert("FAQ type added successfully.");
        setIsOpen(false);
        setType("");
        onSuccess?.();
      } else {
        alert("Failed to add FAQ type.");
      }
    } catch (err) {
      console.error("Add FAQ type error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-blue-900">
              Add FAQ Type
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
              <label className="block text-sm font-medium mb-1">Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., user, admission"
              />
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
