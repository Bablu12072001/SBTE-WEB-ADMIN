"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import LandingPage from "./page";

export default function TrackDocumentStatus() {
  const [letterNo, setLetterNo] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async () => {
    if (!letterNo.trim() && !fromDate && !toDate) {
      setError("Please enter a Letter No. or select a date range.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      let baseUrl =
        "https://sbte-api.anantdrishti.com/docVerification/getDocVerificationStatusForOrg?";

      const params = [];

      if (letterNo.trim()) {
        params.push(`letterNo=${encodeURIComponent(letterNo.trim())}`);
      } else {
        params.push("letterNo=");
      }

      if (fromDate) {
        params.push(`fromDate=${formatDate(fromDate)}`);
      } else {
        params.push("fromDate=");
      }

      if (toDate) {
        params.push(`toDate=${formatDate(toDate)}`);
      } else {
        params.push("toDate=");
      }

      const url = baseUrl + params.join("&");

      const response = await axios.get(url);

      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        setError(response.data?.message || "Unexpected response format.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LandingPage />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ minHeight: "100vh", py: 4, px: 4 }}>
          <Grid container spacing={4}>
            {/* Left: Search Form */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  borderBottom: "3px solid #1976d2",
                  display: "inline-block",
                  mb: 3,
                }}
              >
                Track Document Status
              </Typography>

              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Typography fontWeight="bold" mb={1}>
                      Letter Number
                    </Typography>
                    <TextField
                      fullWidth
                      value={letterNo}
                      onChange={(e) => setLetterNo(e.target.value)}
                      placeholder="Enter Letter Number"
                      variant="outlined"
                      sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                    />
                  </Grid>

                  <Grid
                    item
                    sm={1}
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      justifyContent: "center",
                      fontWeight: "bold",
                      mt: 4,
                    }}
                  >
                    OR
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography fontWeight="bold" mb={1}>
                      From Date
                    </Typography>
                    <DatePicker
                      value={fromDate}
                      onChange={(newValue) => setFromDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography fontWeight="bold" mb={1}>
                      To Date
                    </Typography>
                    <DatePicker
                      value={toDate}
                      onChange={(newValue) => setToDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} mt={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSearch}
                      disabled={loading}
                      sx={{
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "#0d47a1",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Search Document Status"
                      )}
                    </Button>
                  </Grid>
                </Grid>

                {error && (
                  <Typography color="error" mt={2}>
                    {error}
                  </Typography>
                )}
              </Paper>

              {/* Table Results */}
              {results.length > 0 && (
                <TableContainer
                  component={Paper}
                  sx={{ mt: 4, borderRadius: 2 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#1976d2" }}>
                        {[
                          "Sl.No.",
                          "Organization Name",
                          "Org Letter No.",
                          "Org Letter Date",
                          "Received Date",
                          "Final Status",
                          "Dispatch Status",
                          "Dispatch Date(s) & Letter No(s)",
                        ].map((head) => (
                          <TableCell
                            key={head}
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            {head}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((doc, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? "#f5f5f5" : "white",
                          }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{doc.orgName || "-"}</TableCell>
                          <TableCell>{doc.orgLetterNo || "-"}</TableCell>
                          <TableCell>{doc.orgLetterDate || "-"}</TableCell>
                          <TableCell>{doc.receivedDate || "-"}</TableCell>
                          <TableCell>{doc.finalStatus || "-"}</TableCell>
                          <TableCell>{doc.dispatchStatus || "-"}</TableCell>
                          <TableCell>
                            {Array.isArray(doc.dispatchDateAndLetterNo) &&
                            doc.dispatchDateAndLetterNo.length > 0 ? (
                              <ul style={{ paddingLeft: "16px", margin: 0 }}>
                                {doc.dispatchDateAndLetterNo.map(
                                  ([date, letterNo], idx) => (
                                    <li key={idx}>
                                      {date} - {letterNo}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {!loading && results.length === 0 && !error && (
                <Typography sx={{ mt: 3, fontStyle: "italic" }}>
                  No document found for the given criteria.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </>
  );
}
