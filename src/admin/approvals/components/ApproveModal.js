import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

export default function ApproveCompanyModal({
  isOpen,
  setIsOpen,
  item,
  token,
  onApproveSuccess,
}) {
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        "/api/admin/registration",
        {
          id: item?.id,
          approved: true,
          approved_by: "admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        onApproveSuccess(item.id);
        setIsOpen(false);
      } else {
        alert("Failed to approve company.");
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Error approving. Check console for details.");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded max-w-sm w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-green-600">
              Confirm Approval
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={22} />
            </button>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to approve{" "}
            <span className="font-semibold text-black">{item.title}</span>?
            <br />
            <span>
              This can be changed later using the{" "}
              <span className="border px-2 rounded pb-1 text-red-600 border-red-500">
                Reject
              </span>{" "}
              button.
            </span>
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm text-red-500 border rounded hover:bg-gray-100 hover:border-red-500"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-500"
            >
              Approve
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
