import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  MenuItem,
  Paper,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import image from "../../assets/images/doc3.jpeg";
import LandingPage from "./pageans";

export default function TrackDocumentStatus() {
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [branchOptions, setBranchOptions] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const yearOptions = ["2023", "2024"];
  const semesterOptions = ["I", "II", "III", "IV", "5", "VI", "VII", "VIII"];

  const inputStyle = {
    backgroundColor: "#fff",
    borderRadius: 2,
    boxShadow: 1,
    "& .MuiOutlinedInput-root": { height: 42 },
    "& .MuiOutlinedInput-input": { padding: "8px 12px" },
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#1a237e" },
  };

  useEffect(() => {
    axios
      .get("/api/web/available_courses")
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.body)) {
          setBranchOptions(res.data.body);
        }
      })
      .catch((err) => console.error("Branch error:", err));
  }, []);

  const handleSearch = () => {
    if (!year || !branch || !semester) {
      alert("Please select Year, Branch, and Semester.");
      return;
    }

    axios
      .get("/api/web/question_answer")
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.body)) {
          const filtered = res.data.body.filter((paper) => {
            return (
              paper.exam_year === year &&
              paper.branch === branch &&
              paper.semester === semester
            );
          });

          if (filtered.length > 0) {
            setFilteredPapers(filtered);
            setNoDataMessage("");
          } else {
            setFilteredPapers([]);
            setNoDataMessage(
              "No data available for the selected Year, Branch, and Semester."
            );
          }
        } else {
          setFilteredPapers([]);
          setNoDataMessage("No data received from server.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setFilteredPapers([]);
        setNoDataMessage("An error occurred while fetching data.");
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <LandingPage />
      <Box
        sx={{
          minHeight: "100vh",
          py: 4,
          px: { xs: 2, sm: 4, md: 8 },
          position: "relative",
          backgroundColor: "#f7f9fc",
        }}
      >
        {isLargeScreen && (
          <Box
            component="img"
            src={image}
            alt="Document Illustration"
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              maxWidth: 300,
              width: "100%",
              height: "auto",
              zIndex: 1,
            }}
          />
        )}

        <Grid container spacing={4} sx={{ position: "relative", zIndex: 2 }}>
          <Grid item xs={12} lg={8}>
            <Typography
              sx={{
                fontWeight: "bold",
                borderBottom: "2px solid #3f51b5",
                fontSize: "28px",
                mb: 4,
              }}
            >
              Answer Key of Question Paper Used in End Semester Examination
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Select Exam Year
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  sx={inputStyle}
                >
                  <MenuItem value="">Select Year</MenuItem>
                  {yearOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item sm={1} sx={{ display: { xs: "none", sm: "block" } }}>
                <Divider orientation="vertical" flexItem />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Select Branch
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  sx={inputStyle}
                >
                  <MenuItem value="">Select Branch</MenuItem>
                  {branchOptions.map((option) => (
                    <MenuItem key={option.id} value={option.branch}>
                      {option.branch}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Select Semester
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  sx={inputStyle}
                >
                  <MenuItem value="">Select Semester</MenuItem>
                  {semesterOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: { xs: "center", sm: "start" },
              }}
            >
              <Button
                onClick={handleSearch}
                variant="contained"
                sx={{
                  backgroundColor: "#1a237e",
                  px: 4,
                  py: 1.2,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  borderRadius: "8px",
                  boxShadow: 3,
                  "&:hover": {
                    backgroundColor: "#0d1b5e",
                  },
                }}
              >
                Search
              </Button>
            </Box>

            <Box sx={{ mt: 5 }}>
              {filteredPapers.length > 0 ? (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Answer Key of Question Paper Used in End Semester
                    Examination
                  </Typography>
                  <TableContainer
                    component={Paper}
                    sx={{ maxWidth: "100%", overflowX: "auto" }}
                  >
                    <Table sx={{ minWidth: 800, border: "1px solid #ccc" }}>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#1a237e" }}>
                          {[
                            "S.No",
                            "Subject",
                            "Code",
                            "Branch",
                            "Semester",
                            "Year",
                            "View",
                          ].map((heading) => (
                            <TableCell
                              key={heading}
                              align="center"
                              sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              {heading}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredPapers.map((paper, index) => (
                          <TableRow key={paper.id}>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid #ddd" }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid #ddd" }}
                            >
                              {paper.subject_name}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid #ddd" }}
                            >
                              {paper.subject_code}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid #ddd" }}
                            >
                              {paper.branch}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid #ddd" }}
                            >
                              {paper.semester}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid #ddd" }}
                            >
                              {paper.exam_year}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ border: "1px solid #ddd" }}
                            >
                              <Link
                                href={paper.attachment}
                                target="_blank"
                                rel="noopener"
                                underline="hover"
                              >
                                View
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : noDataMessage ? (
                <Typography sx={{ color: "red", fontWeight: "bold" }}>
                  {noDataMessage}
                </Typography>
              ) : null}
            </Box>
          </Grid>

          {!isLargeScreen && (
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={image}
                alt="Document Illustration"
                sx={{
                  width: "100%",
                  maxHeight: 350,
                  mt: 4,
                }}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}
