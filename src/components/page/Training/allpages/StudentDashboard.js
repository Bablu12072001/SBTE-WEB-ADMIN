"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DownloadIcon from "@mui/icons-material/Download";
import BlockIcon from "@mui/icons-material/Block";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formId, setFormId] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/user-portal/login");
  };

  // ✅ Fetch Jobs
  useEffect(() => {
    axios
      .get("/api/web/approved_job_post")
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.body)) {
          setJobData(res.data.body);
        } else {
          setError("No jobs found.");
        }
      })
      .catch(() => setError("Error fetching jobs."))
      .finally(() => setLoading(false));
  }, []);

  // ✅ After login redirect handling
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("studentData");
    const redirectLink = localStorage.getItem("redirect_apply_link");

    if (isLoggedIn && redirectLink) {
      localStorage.removeItem("redirect_apply_link");
      handleOpenForm(redirectLink);
    }
  }, []);

  // ✅ Handle Open Form
  const handleOpenForm = async (applyLink) => {
    const isLoggedIn = localStorage.getItem("studentData");

    // 🚨 Check login first
    if (!isLoggedIn) {
      localStorage.setItem("redirect_apply_link", applyLink);
      navigate("/user-portal/login");
      return;
    }

    if (!applyLink) return;

    const isExternalLink =
      applyLink.startsWith("http://") || applyLink.startsWith("https://");

    if (isExternalLink) {
      window.open(applyLink, "_blank", "noopener noreferrer");
      return;
    }

    const id = applyLink.split("/").pop();
    if (!id) return;

    setFormId(id);

    try {
      const response = await axios.get(`/api/web/form/${id}`);
      const formBody = response.data.body;

      if (response.data.status && Array.isArray(formBody.form)) {
        const fields = formBody.form;
        setDynamicFields(fields);

        const initialValues = {};
        fields.forEach((field) => {
          initialValues[field.label] = "";
        });

        setFormValues(initialValues);
        setFormOpen(true);
      } else {
        alert("Form not found.");
      }
    } catch {
      alert("Error loading form.");
    }
  };

  // ✅ Handle Close Form
  const handleCloseForm = () => {
    setFormOpen(false);
    setFormValues({});
    setFormId("");
    setDynamicFields([]);
  };

  // ✅ Handle Change
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // ✅ Handle Submit Form
  const handleSubmitForm = async () => {
    try {
      const payload = {
        form_id: formId,
        data: formValues,
      };
      await axios.post("/api/web/form_data", payload);
      alert("Form submitted successfully!");
      handleCloseForm();
    } catch {
      alert("Form submission failed.");
    }
  };

  if (!studentData) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          No student data found. Please login again.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/user-portal/login")}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* ✅ Student Profile Card */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" mb={2}>
          Welcome, {studentData.name} 🎉
        </Typography>
        <Typography>User ID: {studentData.userId}</Typography>
        <Typography>Role: {studentData.roles?.join(", ")}</Typography>
        <Typography>Student ID: {studentData.studentId}</Typography>
        <Typography>Type: {studentData.type}</Typography>

        <Typography variant="h6" mt={3}>
          Available Menu:
        </Typography>
        <ul>
          {studentData.roleviewMenu?.map((menu, index) => (
            <li key={index}>{menu}</li>
          ))}
        </ul>

        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ mt: 3 }}
        >
          Logout
        </Button>
      </Paper>

      {/* ✅ Career Tab */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Box sx={{ bgcolor: "#1a237e", p: isMobile ? 1 : 1.3 }}>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{ color: "white", textAlign: "center" }}
          >
            Career Opportunities
          </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: "auto", mt: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" p={2}>
              {error}
            </Typography>
          ) : (
            <Table sx={{ minWidth: 1000, border: "1px solid #ccc" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0d0d3c" }}>
                  {[
                    "Sl.No.",
                    "Job Id",
                    "Job Title",
                    "Company",
                    "Job Role",
                    "Salary",
                    "Start Date",
                    "End Date",
                    "Interview",
                    "Apply",
                    "Download",
                    "Remarks",
                  ].map((head, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid #ccc",
                        textAlign: "center",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {jobData.map((job, index) => (
                  <TableRow
                    key={job.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "white" : "#e3f2fd",
                    }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">JOB-{job.id}</TableCell>
                    <TableCell>{job.job_title}</TableCell>
                    <TableCell>{job.company_name}</TableCell>
                    <TableCell>{job.job_role}</TableCell>
                    <TableCell sx={{ whiteSpace: "pre-line" }}>
                      {job.salary}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(
                        job.application_start_date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(job.application_end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {job.interview_date
                        ? new Date(job.interview_date).toLocaleDateString()
                        : "Will be notified"}
                    </TableCell>
                    <TableCell align="center">
                      {job.apply_link ? (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleOpenForm(job.apply_link)}
                        >
                          Apply
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          disabled
                          startIcon={<BlockIcon />}
                          sx={{
                            "&.Mui-disabled": {
                              bgcolor: "#00bcd4",
                              color: "#d84315",
                            },
                          }}
                        >
                          Closed
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        href={job.job_description_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<DownloadIcon />}
                      >
                        PDF
                      </Button>
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>{job.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>

      {/* ✅ Dynamic Form Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>Apply for Job</DialogTitle>
        <DialogContent>
          {dynamicFields.length === 0 ? (
            <Typography>Loading form...</Typography>
          ) : (
            dynamicFields.map((field, idx) =>
              field.field === "dropdown" ? (
                <TextField
                  key={idx}
                  select
                  fullWidth
                  margin="dense"
                  label={field.label}
                  name={field.label}
                  value={formValues[field.label]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                >
                  {field.list.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  key={idx}
                  fullWidth
                  margin="dense"
                  label={field.label}
                  name={field.label}
                  value={formValues[field.label]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              )
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitForm}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
