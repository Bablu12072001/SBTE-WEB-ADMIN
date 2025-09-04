import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getEOAs, deleteEOA } from "../utils/api";
import EOALOAFormModal from "./EOALOAFormModal";
import { Dialog } from "@headlessui/react";

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => (
  <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
        <Dialog.Title className="text-lg font-semibold text-blue-900 mb-4">
          Confirm Deletion
        </Dialog.Title>
        <p className="mb-6">Are you sure you want to delete this item?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
);

export default function EOALOATable({ refreshTrigger, onSuccessWithMessage }) {
  const [eoaData, setEoaData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  useEffect(() => {
    fetchEOAData();
  }, [refreshTrigger]);

  const fetchEOAData = async () => {
    try {
      const response = await getEOAs();
      setEoaData(response.body);
    } catch (error) {
      console.error("Error fetching EOA data", error);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!itemToDeleteId) return;
    try {
      const response = await deleteEOA(itemToDeleteId);
      if (response.status) {
        setEoaData((prev) => prev.filter((item) => item.id !== itemToDeleteId));
        onSuccessWithMessage?.("EOA/LOA deleted successfully!");
        fetchEOAData();
      } else {
        console.error("Failed to delete:", response.message);
      }
    } catch (error) {
      console.error("Error deleting EOA:", error);
    } finally {
      setItemToDeleteId(null);
    }
  };

  const handleEdit = (data) => {
    setSelectedData(data);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-x-auto px-4 h-[85vh]">
      <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
        <div className="shrink-0">
          <table className="min-w-full table-fixed">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-3 py-2 border w-10">SL NO</th>
                <th className="px-3 py-2 border w-28">INSTITUTE</th>
                <th className="px-3 py-2 border w-28">INSTITUTE TYPE</th>
                <th className="px-3 py-2 border w-20">SESSION</th>
                <th className="px-3 py-2 border w-32">EOA/LOA</th>
                <th className="px-3 py-2 border w-24">ACTION</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="overflow-y-auto grow">
          <table className="min-w-full table-fixed">
            <tbody>
              {eoaData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No EOA/LOA data available
                  </td>
                </tr>
              ) : (
                eoaData.map((item, index) => (
                  <tr key={item.id} className="even:bg-blue-50">
                    <td className="px-3 py-2 border w-10">{index + 1}.</td>
                    <td className="px-3 py-2 border w-28">{item.institute}</td>
                    <td className="px-3 py-2 border w-28">
                      {item.institute_type}
                    </td>
                    <td className="px-3 py-2 border w-20">{item.session}</td>
                    <td className="px-3 py-2 border w-32">
                      <a
                        href={item.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td className="px-3 py-2 border w-24">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-400 text-white px-2 py-1 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EOALOAFormModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        data={selectedData}
        isEdit={isEditMode}
        onSuccess={fetchEOAData}
        onSuccessWithMessage={onSuccessWithMessage}
      />

      <DeleteConfirmationModal
        isOpen={!!itemToDeleteId}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDeleteId(null)}
      />
    </div>
  );
}
