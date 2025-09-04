import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaEdit, FaTrash } from "react-icons/fa";
import useScreenSize from "../useScreenSize";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import EditFaqsModal from "./components/EditFaqModal";
import DeleteFaqModal from "./components/DeleteFaqModal";
import FaqFormModal from "./components/FaqFormModal";
import AddFaqTypeModal from "./components/AddFaqTypeModal";

export default function FAQs() {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [faqsData, setFaqsData] = useState([]);
  const [token, setToken] = useState("");
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isFaqTypeModalOpen, setIsFaqTypeModalOpen] = useState(false);
  const [faqTypes, setFaqTypes] = useState([]);
  const [type, setType] = useState("");
  const [refresh, setRefresh] = useState(false);
  const handleSuccess = () => setRefresh((prev) => !prev);

  const isSmallScreen = useScreenSize();

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        console.log("Decoded Token:", decoded);
        fetchFAQs(storedToken);
        fetchFaqTypes(storedToken);
      } catch {
        console.error("Invalid token");
      }
    }
  }, [refresh]);

  const fetchFaqTypes = async (authToken) => {
    try {
      const response = await axios.get("/api/admin/faq_type", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data?.status) {
        setFaqTypes(response.data.body);
      } else {
        setFaqTypes([]);
      }
    } catch (err) {
      console.error("Error fetching FAQ types:", err);
      setFaqTypes([]);
    }
  };

  const handleDeleteFaqType = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ type?"
    );
    if (!confirmed) return;

    try {
      const response = await axios.delete("/api/admin/faq_type", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id },
      });

      if (response.data?.status) {
        setFaqTypes((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert("Failed to delete FAQ type.");
      }
    } catch (error) {
      console.error("Error deleting FAQ type:", error);
      alert("An error occurred while deleting FAQ type.");
    }
  };

  const fetchFAQs = async (authToken) => {
    try {
      const response = await axios.get("/api/web/FAQ", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data?.status) {
        setFaqsData(response.data.body);
      } else {
        console.error("Invalid response format", response.data);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  };

  const handleEditClick = (faq) => {
    setSelectedFaq(faq);
    setIsEditOpen(true);
  };

  const handleSave = (updatedItem) => {
    console.log("Saved FAQ (future implementation):", updatedItem);
  };

  return (
    <div className="flex h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      <div
        className={`flex-1 overflow-auto gap-4 bg-slate-100 transition-all duration-300 ${
          expanded && !isSmallScreen ? "ml-56" : "ml-16 lg:ml-20"
        } ${isSmallScreen && expanded ? "ml-0" : ""}`}
      >
        <div className="sticky top-0 bg-slate-100">
          <DashboardHeader />
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-1 lg:px-4 px-2">
          <p className="text-xl font-semibold text-gray-600">FAQs</p>
        </div>

        <div className="lg:px-4 px-2 py-4">
          <div className="flex gap-4">
            <button
              className="bg-blue-900 text-white px-4 py-1 rounded mb-4"
              onClick={() => setShowModal(true)}
            >
              Add FAQ
            </button>
            <button
              className="bg-blue-900 text-white px-4 py-1 rounded mb-4"
              onClick={() => setIsFaqTypeModalOpen(true)}
            >
              Add FAQ Type
            </button>
          </div>

          <div className="my-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              FAQ Types
            </h2>
            {faqTypes.length === 0 ? (
              <p className="text-gray-500 italic">No FAQ types</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {faqTypes.map((type) => (
                  <div
                    key={type.id}
                    className="bg-blue-100 border border-blue-300 px-4 py-2 rounded-lg flex items-center justify-between gap-3"
                  >
                    <span className="font-medium text-blue-800">
                      {type.type.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleDeleteFaqType(type.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Delete Type"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-x-auto h-[70vh]">
            <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
              <div className="overflow-y-auto grow">
                <table className="min-w-full table-fixed">
                  <thead className="bg-blue-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 border w-16">SL NO</th>
                      <th className="px-3 py-2 border w-40">Date</th>
                      <th className="px-3 py-2 border w-32">Question</th>
                      <th className="px-3 py-2 border w-48">Answer</th>
                      <th className="px-3 py-2 border w-48">Type</th>
                      <th className="px-3 py-2 border w-32">Created By</th>
                      <th className="px-3 py-2 border w-32">Attachment</th>
                      <th className="px-3 py-2 border w-32">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...faqsData]
                      .sort(
                        (a, b) => (a.approved ? 1 : 0) - (b.approved ? 1 : 0)
                      )
                      .map((item, index) => (
                        <tr key={item.id} className="even:bg-blue-50">
                          <td className="px-3 py-2 border">{index + 1}.</td>
                          <td className="px-3 py-2 border">
                            {item.created_at?.split("T")[0]}
                          </td>
                          <td className="px-3 py-2 border">{item.question}</td>
                          <td className="px-3 py-2 border break-all">
                            {item.answer}
                          </td>
                          <td className="px-3 py-2 border">{item.type}</td>
                          <td className="px-3 py-2 border">
                            {item.created_by}
                          </td>
                          <td className="px-3 py-2 border text-center text-blue-700">
                            {item.attachment ? (
                              <a
                                href={item.attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-gray-400 italic">
                                No Attachment
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 border">
                            <div className="flex gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditClick(item)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => {
                                  setDeleteTarget(item);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditFaqsModal
        isOpen={isEditOpen}
        setIsOpen={(val) => {
          setIsEditOpen(val);
          if (!val) setSelectedFaq(null);
        }}
        editData={selectedFaq}
        isEdit={isEditOpen}
        onSave={handleSuccess}
      />

      <DeleteFaqModal
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        item={deleteTarget}
        token={token}
        onDeleteSuccess={(deletedId) => {
          setFaqsData((prev) => prev.filter((faq) => faq.id !== deletedId));
        }}
      />

      <FaqFormModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        faqTypes={faqTypes}
      />

      <AddFaqTypeModal
        isOpen={isFaqTypeModalOpen}
        setIsOpen={setIsFaqTypeModalOpen}
        token={token}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
