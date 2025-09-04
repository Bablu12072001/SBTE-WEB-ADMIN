import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import DeleteJobCarousel from "./DeleteJobCarousel";
import EditJobCarouselModal from "./EditJobCarouselModal";

export default function JobCarousel() {
  const [carousels, setCarousels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetchCarousels();
    const storedToken = localStorage.getItem("adminToken") || "";
    setToken(storedToken);
  }, []);

  const fetchCarousels = () => {
    setLoading(true);
    axios
      .get("/api/web/placement_carousel")
      .then((res) => {
        if (res.data && res.data.status) {
          setCarousels(res.data.body || []);
        } else {
          setCarousels([]);
        }
      })
      .catch((err) => {
        console.error("Fetch job carousels error:", err);
        setCarousels([]);
      })
      .finally(() => setLoading(false));
  };

  const openConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!deleteId) return;

    if (!token) {
      console.warn("No admin token available for delete request.");
      alert("You are not authenticated to perform this action.");
      setConfirmOpen(false);
      setDeleteId(null);
      return;
    }

    axios
      .delete(`/api/admin/job_carousel`, {
        data: { id: deleteId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchCarousels();
      })
      .catch((err) => {
        console.error(
          "Delete error:",
          err.response?.data || err.message || err
        );
        alert("Failed to delete job carousel. See console for details.");
      })
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleEditClick = (carousel) => {
    setSelectedCarousel(carousel);
    setIsEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditOpen(false);
    setSelectedCarousel(null);
    fetchCarousels();
  };

  if (loading) return <div>Loading...</div>;
  if (!carousels.length)
    return <div className="p-4">No job carousel items found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {carousels.map((carousel) => (
          <div
            key={carousel.id}
            className="border rounded p-4 flex flex-col gap-4 bg-white relative"
          >
            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEditClick(carousel)}
              />
              <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => openConfirm(carousel.id)}
              />
            </div>

            <DeleteJobCarousel
              open={confirmOpen}
              id={deleteId}
              onCancel={() => setConfirmOpen(false)}
              onSuccess={fetchCarousels}
            />

            {/* Content */}
            <div className="flex flex-col gap-2 mt-4">
              {carousel.image && (
                <img
                  src={carousel.image}
                  alt={carousel.label || "Job Carousel Image"}
                  className="rounded max-h-72 object-cover"
                />
              )}

              <div className="font-semibold text-lg">
                {carousel.label || "No label"}
              </div>

              <div className="text-xs text-gray-500">
                {carousel.timestamp
                  ? new Date(carousel.timestamp).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditOpen && selectedCarousel && (
        <EditJobCarouselModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          carousel={selectedCarousel}
          refreshData={fetchCarousels}
        />
      )}
    </>
  );
}
