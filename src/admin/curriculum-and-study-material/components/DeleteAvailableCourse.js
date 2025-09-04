import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

export default function DeleteAvailableCourseModal({
  isOpen,
  setIsOpen,
  item,
  token,
  onDeleteSuccess,
}) {
  const handleDelete = async () => {
    try {
      const response = await axios.delete("/api/admin/available_courses", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: item?.id },
      });

      if (response.data.status) {
        onDeleteSuccess(item.id);
        setIsOpen(false);
      } else {
        alert("Failed to delete the course.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting. Check console for details.");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded max-w-sm w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-red-600">
              Confirm Course Deletion
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={22} />
            </button>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to delete the course{" "}
            <span className="font-semibold text-black">{item.branch}</span>?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
