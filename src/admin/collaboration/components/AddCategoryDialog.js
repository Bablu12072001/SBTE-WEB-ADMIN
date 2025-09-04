"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const AddCategoryDialog = ({ open, onClose, token }) => {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!category.trim()) {
      alert("Category name is required!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/admin/category",
        { category: category.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Category added successfully.");
      setCategory("");
      onClose();
    } catch (err) {
      console.error("Add category failed:", err);
      alert("❌ Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Category Name"
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          autoFocus
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{ backgroundColor: "#00695c" }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
