"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  LinearProgress,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";

const CollaborationDialog = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  uploadFile,
  editData,
  imageProgress,
  pdfProgress,
}) => {
  const categoryOptions = [
    "MOU/MOA",
    "Academic Partnership",
    "CSR / Social Impact Programs",
  ];

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "image",
      "logo",
      "category",
      "title",
      "label",
      "date",
      "description",
      "file",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill the "${field}" field.`);
        return;
      }
    }

    if (!formData.created_by) {
      formData.created_by = "admin";
    }

    setError("");
    onSubmit(e);
  };

  useEffect(() => {
    if (open) setError("");
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex justify-between items-center">
        <span className="text-blue-900 font-semibold text-lg">
          {editData ? "Edit" : "Add"} Collaboration
        </span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Error Message */}
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}

          {/* Upload Image */}
          <TextField
            fullWidth
            type="file"
            label="Upload Image"
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              uploadFile(e.target.files[0], "/api/presign/gallery", "image")
            }
          />
          {imageProgress > 0 && (
            <LinearProgress variant="determinate" value={imageProgress} />
          )}
          {formData.image && (
            <Box className="text-center space-y-1">
              <img
                src={formData.image}
                alt="Uploaded"
                className="w-full h-40 object-cover rounded"
              />
              <Typography variant="body2" color="primary">
                ✅ Image Uploaded
              </Typography>
            </Box>
          )}

          {/* Upload Logo */}
          <TextField
            fullWidth
            type="file"
            label="Upload Logo"
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              uploadFile(e.target.files[0], "/api/presign/gallery", "logo")
            }
          />
          {formData.logo && (
            <Box className="text-center space-y-1">
              <img
                src={formData.logo}
                alt="Logo"
                className="w-32 h-32 object-contain rounded mx-auto"
              />
              <Typography variant="body2" color="primary">
                ✅ Logo Uploaded
              </Typography>
            </Box>
          )}

          {/* Category */}
          <TextField
            fullWidth
            select
            label="Select Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            {categoryOptions.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          {/* Label */}
          <TextField
            fullWidth
            label="Label"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            required
          />

          {/* Date */}
          <TextField
            fullWidth
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          {/* Upload PDF */}
          <TextField
            fullWidth
            type="file"
            label="Upload PDF"
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              uploadFile(e.target.files[0], "/api/presign/upload", "pdf")
            }
          />
          {pdfProgress > 0 && (
            <LinearProgress variant="determinate" value={pdfProgress} />
          )}
          {formData.file && (
            <Typography variant="caption" color="green">
              ✅ PDF Uploaded:{" "}
              <a
                href={formData.file}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                View PDF
              </a>
            </Typography>
          )}

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#1a237e" }}
          >
            {editData ? "Update" : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationDialog;
