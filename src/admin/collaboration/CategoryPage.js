"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useScreenSize from "../useScreenSize";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import Button from "@mui/material/Button";
import CollaborationCard from "./components/CollaborationCard";
import CollaborationDialog from "./components/CollaborationDialog";

const CategoryPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [list, setList] = useState([]);
  const [categories] = useState([
    { id: 1, category: "CSR/Social Impact Programs" },
    { id: 2, category: "Academic Partnership" },
    { id: 3, category: "MOU/MOA" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(
    "CSR/Social Impact Programs"
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [token, setToken] = useState("");
  const isSmall = useScreenSize();
  const [imageProg, setImageProg] = useState(0);
  const [pdfProg, setPdfProg] = useState(0);

  const [formData, setFormData] = useState({
    image: "",
    logo: "",
    file: "",
    category: "",
    title: "",
    label: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token && selectedCategory) {
      fetchList(selectedCategory);
    }
  }, [selectedCategory, token]);

  const fetchList = async (category) => {
    try {
      const cleanCategory = category.trim();
      const res = await axios.get("/api/web/collaboration", {
        headers: { Authorization: `Bearer ${token}` },
        params: { category: cleanCategory },
      });
      if (res.data.status) {
        setList(res.data.body);
      } else {
        setList([]);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setList([]);
    }
  };

  const openForm = (item = null) => {
    setEditData(item);
    setFormData({
      image: item?.image || "",
      logo: item?.logo || "",
      file: item?.file || "",
      category: item?.category || selectedCategory,
      title: item?.title || "",
      label: item?.label || "",
      date: item?.date || "",
      description: item?.description || "",
    });
    setOpenDialog(true);
  };

  const closeForm = () => {
    setOpenDialog(false);
    setEditData(null);
    setFormData({
      image: "",
      logo: "",
      file: "",
      category: "",
      title: "",
      label: "",
      date: "",
      description: "",
    });
    setImageProg(0);
    setPdfProg(0);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const uploadFile = async (file, endpoint, type) => {
    const base64 = await toBase64(file);
    const res = await axios.post(
      endpoint,
      { base64, fileName: file.name },
      {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          if (type === "image" || type === "logo") setImageProg(percent);
          else setPdfProg(percent);
        },
      }
    );

    const uploadedPath = res.data?.path;

    if (type === "image" || type === "logo") {
      setFormData((prev) => ({ ...prev, [type]: uploadedPath }));
      setImageProg(0);
    } else {
      setFormData((prev) => ({ ...prev, file: uploadedPath }));
      setPdfProg(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { image, logo, file, category, title, label, date, description } =
      formData;

    if (
      !image ||
      !logo ||
      !file ||
      !category ||
      !title ||
      !label ||
      !date ||
      !description
    ) {
      alert(
        "❗ Please fill all required fields including Logo, Image, and PDF."
      );
      return;
    }

    const payload = {
      image,
      logo,
      file,
      category: category.trim(),
      title: title.trim(),
      label: label.trim(),
      date,
      description: description.trim(),
      created_by: "admin",
    };

    try {
      if (editData) {
        await axios.put(
          "/api/admin/collaboration",
          { ...payload, id: editData.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("/api/admin/collaboration", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      closeForm();
      fetchList(selectedCategory);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete("/api/admin/collaboration", {
          headers: { Authorization: `Bearer ${token}` },
          data: { id },
        });
        fetchList(selectedCategory);
      } catch (e) {
        console.error("Delete failed:", e);
      }
    }
  };

  return (
    <>
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`flex-1 bg-[#F4EEFF] min-h-screen p-6 transition-all duration-300 ${
          expanded && !isSmall ? "ml-56" : "ml-12 lg:ml-20"
        } ${isSmall && expanded ? "ml-0" : ""}`}
      >
        <DashboardHeader />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-6 py-2 rounded-lg border text-sm font-semibold shadow-sm transition-all whitespace-nowrap max-w-full truncate text-ellipsis ${
                selectedCategory === cat.category
                  ? "bg-[#E3EAFD] border-blue-500 text-blue-900"
                  : "bg-white border-blue-200 text-blue-800 hover:bg-blue-50"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <Button
            variant="contained"
            onClick={() => openForm()}
            sx={{ backgroundColor: "#1a237e", textTransform: "none" }}
          >
            Add Data
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {list.map((item) => (
            <CollaborationCard
              key={item.id}
              item={item}
              onEdit={openForm}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Collaboration Form Dialog */}
        <CollaborationDialog
          open={openDialog}
          onClose={closeForm}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          uploadFile={uploadFile}
          editData={editData}
          imageProgress={imageProg}
          pdfProgress={pdfProg}
        />
      </div>
    </>
  );
};

export default CategoryPage;
