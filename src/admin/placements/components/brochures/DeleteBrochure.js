import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";

export default function DeleteBrochure({
  open,
  brochureId,
  onCancel,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!brochureId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete("/api/admin/placement_broacher", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: brochureId },
      });

      if (res.data && res.data.status) {
        if (typeof onDeleted === "function") onDeleted();
      } else {
        console.error(
          "DELETE /api/admin/placement_broacher returned:",
          res.data
        );
        alert("Failed to delete brochure. See console for details.");
      }
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message || err);
      alert("An error occurred while deleting. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
          <Dialog.Title className="text-lg font-semibold">
            Confirm Delete
          </Dialog.Title>
          <p className="mt-2">Are you sure you want to delete this brochure?</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
