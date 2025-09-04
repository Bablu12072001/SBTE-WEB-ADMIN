"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  Modal,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import JobPostForm from "./JobPostForm"; // Add Job Form
import EditJobForm from "./EditJobForm"; // Edit Job Form
import DeleteJobConfirm from "./DeleteJobConfirm"; // Delete Confirm
import VisibilityIcon from "@mui/icons-material/Visibility";

// Helper: decode JWT token payload to get company_registration_number
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const token = localStorage.getItem("token");
const JobTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewAllModal, setOpenViewAllModal] = useState(false);

  // Selected job for edit/delete
  const [selectedJob, setSelectedJob] = useState(null);

  // Extract company_registration_number from token in localStorage
  const getCompanyIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = parseJwt(token);
    // Adjust here if your payload field name is different
    return payload?.company_registration_number || payload?.id || null;
  };

  const fetchJobs = async () => {
    const companyId = getCompanyIdFromToken();
    if (!companyId) {
      setError("Invalid or missing token. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `/api/company/job_post?id=${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status && Array.isArray(response.data.body)) {
        // Map API fields to match the table columns or adapt table columns accordingly
        const mappedJobs = response.data.body.map((job) => ({
          id: `SBT-${job.id}`,
          company_name: job.company_name,
          company_registration_number: job.company_registration_number,
          job_title: job.job_title,
          job_role: job.job_role,
          location: job.location,
          salary: job.salary,
          qualification: job.qualification,
          service_agreement: job.service_agreement,
          year_of_passing: job.year_of_passing,
          application_start_date: job.application_start_date,
          application_end_date: job.application_end_date,
          interview_rounds: job.interview_rounds,
          interview_date: job.interview_date,
          working_shift: job.working_shift,
          eligible_streams: job.eligible_streams,
          gender_preference: job.gender_preference,
          min_required_percentage: job.min_required_percentage,
          skills_required: job.skills_required,
          blocking_period: job.blocking_period,
          other_criterias: job.other_criterias,
          notes: job.notes,
          remarks: job.remarks,
          apply_link: job.apply_link,
          job_description_file: job.job_description_file,
          approved: job.approved,
          approved_by: job.approved_by,
          timestamp: job.timestamp,

          // Optional: for direct use in edit/delete/view actions
          fullData: job,
        }));

        setJobs(mappedJobs);
      } else {
        setError("Failed to load jobs data.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching jobs data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handlers to open modals
  const handleOpenEdit = (job) => {
    setSelectedJob(job.fullData || job);
    setOpenEditModal(true);
  };

  const handleOpenDelete = (job) => {
    setSelectedJob(job.fullData || job);

    setOpenDeleteModal(true);
  };
  const handleOpenView = (job) => {
    setSelectedJob(job.fullData || job);

    setOpenViewAllModal(true);
  };

  // After add job: refresh or update local state
  const handleJobAdded = (newJob) => {
    // Optional: fetch from API again or just append
    setJobs((prev) => [...prev, newJob]);
    fetchJobs();
    setOpenAddModal(false);
  };

  // After edit job: update job in local state
  const handleJobUpdated = (updatedJob) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === `SB-${updatedJob.id}`
          ? {
              ...job,
              title: updatedJob.job_title,
              role: updatedJob.job_role,
              salary: updatedJob.salary,
              status: updatedJob.job_description_file,
              fullData: updatedJob,
            }
          : job
      )
    );
    fetchJobs();
    setOpenEditModal(false);
  };

  // After delete job: remove from local state
  const handleJobDeleted = (deletedJobId) => {
    setJobs((prev) => prev.filter((job) => job.id !== `SB-${deletedJobId}`));
    setOpenDeleteModal(false);
    fetchJobs();
  };
  const [openViewAll, setOpenViewAll] = useState(null);

  return (
    <Box sx={{ p: 2, marginBottom: 6, marginTop: 4 }}>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        mb={2}
        gap={2}
      >
        <Typography
          sx={{ fontWeight: "bold", fontSize: "1.25rem", color: "#616161" }}
        >
          All Jobs Uploaded
        </Typography>

        <Stack direction={isMobile ? "column" : "row"} spacing={1}>
          <Button variant="contained" onClick={() => setOpenAddModal(true)}>
            Add Jobs
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center" mt={4}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Company Name
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Job Title
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Job Role
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Salary
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Qualification
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Apply Link
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1rem" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.slice(0, 10).map((job, index) => (
                <TableRow
                  key={job.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f0f8ff",
                  }}
                >
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.company_name}</TableCell>
                  <TableCell>{job.job_title}</TableCell>
                  <TableCell>{job.job_role}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.salary}</TableCell>
                  <TableCell>{job.qualification}</TableCell>
                  <TableCell>
                    {" "}
                    <a href={job.apply_link} target="_blank" rel="noreferrer">
                      Apply
                    </a>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenView(job)}
                      >
                        <VisibilityIcon sx={{ color: "#0288d1" }} />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDelete(job)}
                    >
                      <DeleteIcon sx={{ color: "#d32f2f" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(job)}
                    >
                      <EditIcon sx={{ color: "#1976d2" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openViewAllModal}
        onClose={() => setOpenViewAllModal(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Field
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{selectedJob.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>{selectedJob.company_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Reg. No.</TableCell>
                  <TableCell>
                    {selectedJob.company_registration_number}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>{selectedJob.job_title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>{selectedJob.job_role}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>{selectedJob.location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Salary</TableCell>
                  <TableCell>{selectedJob.salary}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Qualification</TableCell>
                  <TableCell>{selectedJob.qualification}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Service Agreement</TableCell>
                  <TableCell>{selectedJob.service_agreement}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Year of Passing</TableCell>
                  <TableCell>{selectedJob.year_of_passing}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>App Start</TableCell>
                  <TableCell>
                    {new Date(
                      selectedJob.application_start_date
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>App End</TableCell>
                  <TableCell>
                    {new Date(
                      selectedJob.application_end_date
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rounds</TableCell>
                  <TableCell>{selectedJob.interview_rounds}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interview Date</TableCell>
                  <TableCell>
                    {new Date(selectedJob.interview_date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Shift</TableCell>
                  <TableCell>{selectedJob.working_shift}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Streams</TableCell>
                  <TableCell>
                    {(() => {
                      try {
                        const parsed = JSON.parse(selectedJob.eligible_streams);
                        return Array.isArray(parsed)
                          ? parsed.join(", ")
                          : parsed.toString();
                      } catch (e) {
                        return selectedJob.eligible_streams;
                      }
                    })()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gender</TableCell>
                  <TableCell>{selectedJob.gender_preference}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Min %</TableCell>
                  <TableCell>{selectedJob.min_required_percentage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Skills</TableCell>
                  {/* <TableCell>{selectedJob.skills_required}</TableCell> */}
                  <TableCell>
                    {(() => {
                      try {
                        const parsed = JSON.parse(selectedJob.skills_required);
                        return Array.isArray(parsed)
                          ? parsed.join(", ")
                          : parsed.toString();
                      } catch (e) {
                        return selectedJob.skills_required;
                      }
                    })()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Blocking Period</TableCell>
                  <TableCell>{selectedJob.blocking_period}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Other Criteria</TableCell>
                  <TableCell>{selectedJob.other_criterias}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Notes</TableCell>
                  <TableCell>{selectedJob.notes}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Remarks</TableCell>
                  <TableCell>{selectedJob.remarks}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apply Link</TableCell>
                  <TableCell>
                    <a
                      href={selectedJob.apply_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Apply
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>JD File</TableCell>
                  <TableCell>
                    {selectedJob.job_description_file ? (
                      <a
                        href={selectedJob.job_description_file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open File
                      </a>
                    ) : (
                      "No File"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Approved</TableCell>
                  <TableCell>
                    {selectedJob.approved === 1 ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Approved By</TableCell>
                  <TableCell>{selectedJob.approved_by || "N/A"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}

          <Button
            variant="contained"
            onClick={() => setOpenViewAllModal(false)}
            sx={{ mt: 2, float: "right", backgroundColor: "#003366" }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add Job Modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="add-job-form-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <JobPostForm
            onClose={() => setOpenAddModal(false)}
            onAddSuccess={handleJobAdded}
            // fetchJobs={fetchJobs()}
          />
        </Box>
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-job-form-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedJob && (
            <EditJobForm
              job={selectedJob}
              onClose={() => setOpenEditModal(false)}
              onJobUpdated={handleJobUpdated}
            />
          )}
        </Box>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-job-confirm-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          {selectedJob && (
            <DeleteJobConfirm
              job={selectedJob}
              onClose={() => setOpenDeleteModal(false)}
              onJobDeleted={handleJobDeleted}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default JobTable;
