"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";

const EditJobForm = ({ job, onClose, onJobUpdated }) => {
  const [formData, setFormData] = useState({
    id: job.id || "",
    company_name: job.company_name || "",
    company_registration_number: job.company_registration_number || "",
    job_title: job.job_title || "",
    job_role: job.job_role || "",
    location: job.location || "",
    salary: job.salary || "",
    qualification: job.qualification || "",
    service_agreement: job.service_agreement || "",
    year_of_passing: job.year_of_passing || "",
    application_start_date: formatDate(job.application_start_date),
    application_end_date: formatDate(job.application_end_date),
    interview_rounds: job.interview_rounds || "",
    interview_date: formatDate(job.interview_date),
    working_shift: job.working_shift || "",
    eligible_streams: Array.isArray(job.eligible_streams)
      ? job.eligible_streams.join(", ")
      : job.eligible_streams || "",
    gender_preference: job.gender_preference || "",
    min_required_percentage: job.min_required_percentage || "",
    skills_required: Array.isArray(job.skills_required)
      ? job.skills_required.join(", ")
      : job.skills_required || "",
    blocking_period: job.blocking_period || "",
    other_criterias: job.other_criterias || "",
    notes: job.notes || "",
    remarks: job.remarks || "",
    apply_link: job.apply_link || "",
    job_description_file: job.job_description_file || "",
    approved: job.approved || 0,
    approved_by: job.approved_by || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Ensure date format is correct before sending
    const formattedData = {
      ...formData,
      application_start_date: formatDate(formData.application_start_date),
      application_end_date: formatDate(formData.application_end_date),
      interview_date: formatDate(formData.interview_date),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.put("/api/company/job_post", formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        onJobUpdated(formattedData);
      } else {
        setError("Failed to update job.");
      }
    } catch (err) {
      setError(
        "Error updating job: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 3,
        padding: 4,
        maxHeight: "85vh",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={2} color="primary">
        Edit Job Details - ID: {formData.id}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {[
            { label: "Company Name", name: "company_name", required: true },
            {
              label: "Company Registration Number",
              name: "company_registration_number",
            },
            { label: "Job Title", name: "job_title", required: true },
            { label: "Job Role", name: "job_role", required: true },
            { label: "Location", name: "location" },
            { label: "Salary", name: "salary" },
            { label: "Qualification", name: "qualification" },
            { label: "Service Agreement", name: "service_agreement" },
            { label: "Year of Passing", name: "year_of_passing" },
            {
              label: "Application Start Date",
              name: "application_start_date",
              type: "date",
            },
            {
              label: "Application End Date",
              name: "application_end_date",
              type: "date",
            },
            { label: "Interview Rounds", name: "interview_rounds" },
            { label: "Interview Date", name: "interview_date", type: "date" },
            { label: "Working Shift", name: "working_shift" },
            { label: "Eligible Streams", name: "eligible_streams" },
            { label: "Gender Preference", name: "gender_preference" },
            {
              label: "Min Required Percentage",
              name: "min_required_percentage",
            },
            { label: "Skills Required", name: "skills_required" },
            { label: "Blocking Period", name: "blocking_period" },
            { label: "Other Criterias", name: "other_criterias" },
            { label: "Notes", name: "notes" },
            { label: "Remarks", name: "remarks" },
            { label: "Apply Link", name: "apply_link" },
            { label: "Job Description File", name: "job_description_file" },
            { label: "Approved (0 or 1)", name: "approved", type: "number" },
            { label: "Approved By", name: "approved_by" },
          ].map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              fullWidth
              required={field.required || false}
              type={field.type || "text"}
              size="small"
              InputLabelProps={field.type === "date" ? { shrink: true } : {}}
              sx={{
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            />
          ))}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              color="primary"
              sx={{ borderRadius: 2 }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default EditJobForm;
