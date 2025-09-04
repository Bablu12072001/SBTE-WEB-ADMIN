"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LandingPage from "./page-traning";

export default function JobTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      .catch((err) => {
        setError("Error fetching data.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <LandingPage />
      <Box sx={{ width: "100%", mt: 4 }}>
        <Box
          sx={{
            overflowX: "hidden", // Prevent horizontal scroll/overflow
            bgcolor: "#1a237e",
            p: isMobile ? 1 : 1.3,
          }}
        >
          <Typography
            variant={isMobile ? "subtitle1" : "h6"} // smaller font on mobile
            sx={{
              color: "white",
              textAlign: "center",

              whiteSpace: "nowrap", // prevent wrapping if you want one line only
              overflow: "hidden", // hide overflow
              textOverflow: "ellipsis", // show "..." if overflowed
            }}
          >
            Training
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" p={2}>
              {error}
            </Typography>
          ) : (
            <Table
              sx={{ minWidth: 1000, border: "1px solid #ccc" }}
              aria-label="job table"
            >
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
                    "Apply-Link",
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
                    <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                      JOB-{job.id}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      {job.job_title}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      {job.company_name}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      {job.job_role}
                    </TableCell>
                    <TableCell
                      sx={{ whiteSpace: "pre-line", border: "1px solid #ccc" }}
                    >
                      {job.salary}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                      {new Date(
                        job.application_start_date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                      {new Date(job.application_end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                      {job.interview_date
                        ? new Date(job.interview_date).toLocaleDateString()
                        : "Will be notified"}
                    </TableCell>
                    <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                      {job.apply_link ? (
                        <Button
                          variant="contained"
                          color="success"
                          href={job.apply_link}
                          target="_blank"
                        >
                          Apply
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          disabled
                          startIcon={<BlockIcon />}
                          sx={{
                            cursor: "default",
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
                    <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
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
                    <TableCell
                      sx={{
                        border: "1px solid #ccc",
                        minWidth: 200,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                    >
                      {job.remarks}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>
    </>
  );
}
