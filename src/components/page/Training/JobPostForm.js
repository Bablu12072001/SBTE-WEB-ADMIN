import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function JobPostForm({ onClose, onAddSuccess }) {
  const [companyRegNo, setCompanyRegNo] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    jobRole: "",
    location: "",
    salary: "",
    qualification: "",
    serviceAgreement: "",
    yearOfPassing: "",
    applicationStartDate: "",
    applicationEndDate: "",
    interviewRounds: "",
    interviewDate: "",
    workingShift: "",
    eligibleStreams: "",
    genderPreference: "",
    minRequiredPercentage: "",
    skillsRequired: "",
    blockingPeriod: "",
    otherCriterias: "",
    notes: "",
    remarks: "",
    applyLink: "",
    fileName: "",
    job_description_file: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });

  // New state for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.company_registration_number) {
          setCompanyRegNo(decoded.company_registration_number);
        }
      } catch (err) {
        console.error("Token decode error", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      const token = localStorage.getItem("token");

      try {
        // Use axios with onUploadProgress for progress percentage
        const response = await axios.post(
          "/api/presign/upload",
          {
            base64: base64Data,
            fileName: selectedFile.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );

        const result = response.data;

        if (result?.status && result?.path) {
          setForm((prev) => ({
            ...prev,
            job_description_file: result.path,
            fileName: selectedFile.name,
          }));
          setSnackbar({
            open: true,
            type: "success",
            message: "File uploaded successfully!",
          });
        } else {
          setSnackbar({
            open: true,
            type: "error",
            message: "Failed to upload file.",
          });
        }
      } catch (err) {
        console.error("Upload error:", err);
        setSnackbar({
          open: true,
          type: "error",
          message: "Error uploading file.",
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = "This field is required";
      }
    });
    if (!companyRegNo) {
      newErrors.companyRegNo = "Company Registration Number missing from token";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("token");

    const payload = {
      company_name: form.companyName,
      company_registration_number: companyRegNo,
      job_title: form.jobTitle,
      job_role: form.jobRole,
      location: form.location,
      salary: form.salary,
      qualification: form.qualification,
      service_agreement: form.serviceAgreement,
      year_of_passing: form.yearOfPassing,
      application_start_date: form.applicationStartDate,
      application_end_date: form.applicationEndDate,
      interview_rounds: form.interviewRounds,
      interview_date: form.interviewDate,
      working_shift: form.workingShift,
      eligible_streams: form.eligibleStreams.split(",").map((s) => s.trim()),
      gender_preference: form.genderPreference,
      min_required_percentage: form.minRequiredPercentage,
      skills_required: form.skillsRequired.split(",").map((s) => s.trim()),
      blocking_period: form.blockingPeriod,
      other_criterias: form.otherCriterias,
      notes: form.notes,
      remarks: form.remarks,
      apply_link: form.applyLink,
      job_description_file: form.job_description_file,
    };

    try {
      await axios.post("/api/company/job_post", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({
        open: true,
        type: "success",
        message: "Job posted successfully!",
      });

      if (onAddSuccess) onAddSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error submitting job post:", error);
      setSnackbar({
        open: true,
        type: "error",
        message: "Failed to post the job.",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto" }}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "1.75rem",
          color: "#121858",
          mb: 3,
        }}
      >
        Add Job
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {[
            "companyName",
            "jobTitle",
            "jobRole",
            "location",
            "salary",
            "qualification",
            "serviceAgreement",
            "yearOfPassing",
            "interviewRounds",
            "workingShift",
            "eligibleStreams",
            "genderPreference",
            "minRequiredPercentage",
            "skillsRequired",
            "blockingPeriod",
            "otherCriterias",
            "notes",
            "remarks",
            "applyLink",
          ].map((name) => (
            <Grid item xs={12} sm={6} key={name}>
              <TextField
                name={name}
                label={name
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (s) => s.toUpperCase())}
                value={form[name]}
                onChange={handleChange}
                error={!!errors[name]}
                helperText={errors[name]}
                fullWidth
                variant="outlined"
              />
            </Grid>
          ))}

          {["applicationStartDate", "applicationEndDate", "interviewDate"].map(
            (dateField) => (
              <Grid item xs={12} sm={6} key={dateField}>
                <TextField
                  type="date"
                  name={dateField}
                  label={dateField
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                  InputLabelProps={{ shrink: true }}
                  value={form[dateField]}
                  onChange={handleChange}
                  error={!!errors[dateField]}
                  helperText={errors[dateField]}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            )
          )}

          <Grid item xs={12} sm={6}>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<UploadFileIcon />}
              disabled={uploading}
            >
              Upload Job Description (Image / PDF / CSV)
              <input
                type="file"
                accept=".csv,.pdf,image/*"
                hidden
                onChange={handleFileUpload}
              />
            </Button>

            {uploading && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Uploading: {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {!uploading && form.fileName && (
              <Typography variant="caption" sx={{ mt: 1 }}>
                Selected: {form.fileName}
              </Typography>
            )}

            {errors.job_description_file && (
              <Typography color="error" variant="caption">
                {errors.job_description_file}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Box
          sx={{ display: "flex", justifyContent: "flex-start", mt: 3, gap: 2 }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ px: 4, fontSize: "1rem" }}
            disabled={uploading}
          >
            Submit
          </Button>
          {onClose && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{ px: 4, fontSize: "1rem" }}
              disabled={uploading}
            >
              Cancel
            </Button>
          )}
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
