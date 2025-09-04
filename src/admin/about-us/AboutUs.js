// AboutUs.jsx - Converted from Next.js to React

import { useEffect, useState, useRef } from "react";
import { IoMdCreate, IoMdTrash } from "react-icons/io";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";
import { Video } from "lucide-react";
import useScreenSize from "../useScreenSize";
import AddMemberFormModal from "./components/AddMemberFormModal";
import EditMemberModal from "./components/EditMemberModal";
import AboutUsFormModal from "./components/AboutUsFormModal";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

export default function AboutUs() {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aboutUsData, setAboutUsData] = useState(null);
  const [members, setMembers] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const loadingBarRef = useRef(null);
  const isSmallScreen = useScreenSize();

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      fetchAboutUs(storedToken);
      fetchMembers(storedToken);
    }
  }, []);

  const fetchAboutUs = async (storedToken) => {
    try {
      setLoading(true);
      loadingBarRef.current?.continuousStart();
      const response = await axios.get("/api/web/about", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data.body;
      if (response.data.status && data) {
        setAboutUsData({
          id: data.id,
          title: data.title,
          description: data.descriptions,
          imageUrl: data.image_link,
          videoLink: data.video_link,
        });
      } else {
        setAboutUsData(null);
      }
    } catch (err) {
      console.error("Error fetching About Us:", err);
      setAboutUsData(null);
    } finally {
      setLoading(false);
      loadingBarRef.current?.complete();
    }
  };

  const fetchMembers = async (storedToken) => {
    try {
      const res = await axios.get("/api/admin/member", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });
      setMembers(res.data.status ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers([]);
    }
  };

  const handleAddOrUpdate = async (payload) => {
    try {
      loadingBarRef.current?.continuousStart();
      const isUpdate = aboutUsData && aboutUsData.id;
      const method = isUpdate ? "PUT" : "POST";
      const finalPayload = { ...payload };
      if (!isUpdate) delete finalPayload.id;

      const response = await fetch("/api/admin/about", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      const result = await response.json();
      if (result.status) {
        setAboutUsData({
          id: result.body?.id || finalPayload.id || 1,
          title: payload.title,
          description: payload.descriptions,
          imageUrl: payload.image,
          videoLink: payload.video,
        });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error saving About Us:", error);
      return { success: false };
    } finally {
      loadingBarRef.current?.complete();
    }
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleSaveMember = async (updatedMember) => {
    try {
      await axios.put("/api/admin/member", updatedMember, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Member updated successfully");
      setMembers((prev) =>
        prev.map((m) =>
          m.id === updatedMember.id ? { ...m, ...updatedMember } : m
        )
      );
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member");
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete("/api/admin/member", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id },
      });
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete member");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`flex-1 overflow-auto gap-4 bg-[#F4EEFF] transition-all duration-300 ${
          expanded && !isSmallScreen ? "ml-56" : "ml-12 lg:ml-20"
        } ${isSmallScreen && expanded ? "ml-0" : ""}`}
      >
        <div className="sticky top-0 bg-[#F4EEFF]">
          <DashboardHeader />
        </div>

        <div className="px-4 py-6 relative">
          <p className="text-xl font-semibold text-gray-600">About Us</p>
          {loading ? (
            <LoadingBar color="#4CAF50" ref={loadingBarRef} />
          ) : (
            <div>
              <p className="mt-4 text-lg text-gray-700 text-justify">
                {aboutUsData?.description || "No data available"}
              </p>

              {aboutUsData?.imageUrl && (
                <div className="mt-6 flex">
                  <img
                    src={aboutUsData.imageUrl}
                    alt="About us"
                    className="h-96 w-96 object-cover border p-4 rounded-lg"
                  />
                </div>
              )}

              {aboutUsData?.videoLink && (
                <div className="mt-4">
                  <a
                    href={aboutUsData.videoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit text-blue-600 text-lg flex items-center gap-2 hover:underline"
                  >
                    <Video /> Watch Video
                  </a>
                </div>
              )}

              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-blue-900"
                onClick={() => setShowModal(true)}
              >
                <IoMdCreate size={28} />
              </button>
            </div>
          )}
        </div>

        <div className="px-8 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-600">
              Profile Update
            </h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowAddMemberModal(true)}
            >
              Add New Member
            </button>
          </div>

          {members.length === 0 ? (
            <p className="text-gray-500">No members found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-8">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={member.image_link}
                      alt={member.name}
                      className="h-24 w-24 rounded-full object-cover border"
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500">{member.position}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 text-justify">
                    {member.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Updated by {member.created_by} on{" "}
                    {new Date(member.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditModal(member)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <IoMdCreate size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <IoMdTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AboutUsFormModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        aboutUsData={aboutUsData}
        setAboutUsData={setAboutUsData}
        onSave={handleAddOrUpdate}
      />

      <EditMemberModal
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        member={selectedMember}
        onSave={handleSaveMember}
      />

      <AddMemberFormModal
        isOpen={showAddMemberModal}
        setIsOpen={setShowAddMemberModal}
        token={token}
        onSuccess={() => fetchMembers(token)}
      />
    </div>
  );
}
