import { useState } from "react";
import Sidebar from "../components/Sidebar";
import useScreenSize from "../useScreenSize";
import DashboardHeader from "../components/DashboardHeader";
import GalleryImage from "./components/GalleryImage";
import CarouselPage from "./components/CarouselPage";
import MultimediaPage from "./components/MultimediaPage";
import GalleryImageModel from "./components/GalleryImageModal";

export default function GalleryPage() {
  const [selectedTab, setSelectedTab] = useState("image");
  const [showModal, setShowModal] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const isSmallScreen = useScreenSize();

  // Function to Open Modal for Adding or Editing Image
  const openModal = (image = null) => {
    setImageData(image);
    setShowModal(true);
  };

  // Function to Close Modal
  const closeModal = () => {
    setShowModal(false);
    setImageData(null);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto gap-4 bg-slate-100 transition-all duration-300 ${
          expanded && !isSmallScreen ? "ml-56" : "ml-16 lg:ml-20"
        } ${isSmallScreen && expanded ? "ml-0" : ""}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-100">
          <DashboardHeader />
        </div>

        <div className="flex flex-col gap-4 p-6">
          {/* Tab Buttons */}
          <div className="flex gap-4 my-4">
            {["image", "carousel", "multimedia"].map((tab) => (
              <button
                key={tab}
                className={`${
                  selectedTab === tab ? "bg-blue-900 text-white" : "bg-gray-200"
                } py-2 px-4 rounded-lg capitalize`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Image Tab */}
          {selectedTab === "image" && <GalleryImage openModal={openModal} />}

          {/* Carousel Tab */}
          {selectedTab === "carousel" && <CarouselPage openModal={openModal} />}

          {/* Multimedia Tab */}
          {selectedTab === "multimedia" && (
            <MultimediaPage openModal={openModal} />
          )}

          {/* Modal for Add/Edit Image */}
          {showModal && (
            <GalleryImageModel
              isOpen={showModal}
              closeModal={closeModal}
              imageData={imageData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
