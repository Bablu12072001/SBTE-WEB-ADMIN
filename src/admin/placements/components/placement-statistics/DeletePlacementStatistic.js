import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function DeletePlacementStatistic({
  open,
  id,
  message,
  onCancel,
  onSuccess,
}) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch (err) {
        console.warn("jwtDecode failed (token may be invalid).", err);
      }
    }
  }, []);

  const handleDelete = async () => {
    try {
      const res = await axios.delete("/api/admin/placement_statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id }, // DELETE requests need `data` for body
      });

      if (res.data && res.data.status) {
        if (typeof onSuccess === "function") onSuccess();
      } else {
        console.error(
          "DELETE /api/admin/placement_statistics returned:",
          res.data
        );
        alert("Failed to delete placement statistic. See console for details.");
      }
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message || err);
      alert("An error occurred while deleting. Check console for details.");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
          <Dialog.Title className="text-lg font-semibold">Confirm</Dialog.Title>
          <p className="mt-2">
            {message ||
              "Are you sure you want to delete this placement statistic?"}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
