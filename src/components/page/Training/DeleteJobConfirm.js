"use client";
import React, { useState } from "react";
import { Typography, Button, Stack } from "@mui/material";
import axios from "axios";

const DeleteJobConfirm = ({ job, onClose, onJobDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.delete("/api/company/job_post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id: job.id },
      });

      if (response.status === 200 || response.status === 204) {
        setSuccess(true);
        onJobDeleted(job.id); // inform parent to remove the job
      } else {
        setError("Failed to delete job.");
      }
    } catch (err) {
      setError(
        "Error deleting job: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h6" mb={2}>
        Confirm Delete
      </Typography>

      {!success ? (
        <>
          <Typography mb={3}>
            Are you sure you want to delete the job <strong>{job.title}</strong>{" "}
            (ID: {job.id})?
          </Typography>

          {error && (
            <Typography color="error" variant="body2" mb={2}>
              {error}
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Typography
            color="success.main"
            variant="body1"
            align="center"
            mb={3}
            mt={2}
          >
            Job deleted successfully!
          </Typography>
          <Stack direction="row" justifyContent="center">
            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </Stack>
        </>
      )}
    </>
  );
};

export default DeleteJobConfirm;
