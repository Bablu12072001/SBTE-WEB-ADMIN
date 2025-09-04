"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import LandingPage from "./page-available";

const Available = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/web/available_courses");
        if (res.data.status && Array.isArray(res.data.body)) {
          setCourses(res.data.body);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching available courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Sorting courses by Branch Code numerically in ascending order
  const sortedCourses = courses.sort((a, b) => {
    return a.branch_code - b.branch_code; // Assuming branch_code is numeric. If it's a string with numbers, use localeCompare.
  });

  return (
    <>
      <LandingPage />
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{ bgcolor: "#0b0b61", color: "white", py: 1, borderRadius: 1 }}
        >
          Available Courses
        </Typography>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="available courses table"
              >
                <TableHead>
                  <TableRow sx={{ bgcolor: "#0b0b40" }}>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid #ddd",
                      }}
                    >
                      Branch Code
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid #ddd",
                      }}
                    >
                      Branch
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        border: "1px solid #ddd",
                      }}
                    >
                      Branch Short Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedCourses.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        backgroundColor: index % 2 === 1 ? "#f0f8ff" : "white",
                      }}
                    >
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {row.branch_code}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {row.branch}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {row.branch_short_name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Available;
