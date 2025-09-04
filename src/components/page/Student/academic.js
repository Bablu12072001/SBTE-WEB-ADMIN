"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import LandingPage from "./page";
import Accadmic from "./calender";

export default function AcademicCalendarPage() {
  const [calendarList, setCalendarList] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [tableData, setTableData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/web/academic")
      .then((response) => {
        const list = response.data?.data || [];
        setCalendarList(list);
      })
      .catch((err) => {
        console.error("Failed to fetch calendar list:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTitleClick = (id) => {
    setTableLoading(true);
    axios
      .get(`/api/web/academic/${id}`)
      .then((response) => {
        const data = response.data?.data;
        if (data && data.events) {
          const headers = [
            "Sl. no",
            "Activity",
            "1st sem",
            "2nd sem",
            "3rd sem",
            "4th sem",
            "5th sem",
            "6th sem",
          ];

          const rows = data.events.map((event, index) => [
            `${index + 1}.`,
            event.event,
            formatSemester(event.semesters["1"]),
            formatSemester(event.semesters["2"]),
            formatSemester(event.semesters["3"]),
            formatSemester(event.semesters["4"]),
            formatSemester(event.semesters["5"]),
            formatSemester(event.semesters["6"]),
          ]);

          setSelectedCalendar(data);
          setTableData({ headers, rows });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch calendar by ID:", err);
      })
      .finally(() => setTableLoading(false));
  };

  // ✅ UPDATED FORMATTER TO HANDLE BOTH FORMATS
  const formatSemester = (semData) => {
    if (!semData) return "-";

    // If value is a string (e.g., "30/05/2025")
    if (typeof semData === "string") {
      return semData;
    }

    // If value is an object with split characters and/or date
    if (typeof semData === "object") {
      const date = semData.date || "-";
      const value =
        semData.value ??
        Object.keys(semData)
          .filter((key) => !isNaN(key))
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => semData[k])
          .join("")
          .trim();

      return `${value || "-"} (${date})`;
    }

    return "-";
  };

  return (
    <>
      <LandingPage />
      <Box sx={{ backgroundColor: "#f0f0f5", py: 5, overflowX: "auto" }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              backgroundColor: "#eef2ff",
              borderRadius: 3,
              border: "4px solid #00bcd4",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              px: { xs: 2, sm: 3, md: 5 },
              py: { xs: 2, sm: 3 },
              width: "94%",
              mb: 5,
            }}
          >
            {loading ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List disablePadding>
                {calendarList.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{ display: "flex", alignItems: "flex-start", py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: "30px", mt: 0.3 }}>
                      <ArrowRightIcon sx={{ color: "black" }} />
                    </ListItemIcon>
                    <Typography
                      variant="body1"
                      component="span"
                      onClick={() => handleTitleClick(item.id)}
                      sx={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        color: "#1976d2",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        cursor: "pointer",
                      }}
                    >
                      {item.title} ({item.session}) - {item.institution_type}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}

            <Box>
              <Accadmic />
            </Box>
          </Box>
        </Container>

        <Box sx={{ padding: 2 }}>
          {tableLoading ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : selectedCalendar && tableData.rows.length > 0 ? (
            <Paper
              elevation={4}
              sx={{ overflowX: "auto", borderRadius: 2, mt: 4 }}
            >
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{
                          backgroundColor: "#00BCD4",
                          color: "white",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          borderBottom: "2px solid white",
                        }}
                      >
                        {selectedCalendar.title} ({selectedCalendar.session}) -{" "}
                        {selectedCalendar.institution_type}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                      {tableData.headers.map((header, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            border: "1px solid #cfd8dc",
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.rows.map((row, rowIndex) => (
                      <TableRow
                        key={rowIndex}
                        sx={{
                          backgroundColor:
                            rowIndex % 2 === 0 ? "#f5f8ff" : "white",
                        }}
                      >
                        {row.map((cell, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            sx={{
                              textAlign: "center",
                              fontWeight: cellIndex === 0 ? "bold" : "normal",
                              border: "1px solid #cfd8dc",
                            }}
                          >
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
