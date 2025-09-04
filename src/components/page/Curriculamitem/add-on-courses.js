import React, { useEffect, useState } from "react";
import axios from "axios";
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
import LandingPage from "./pageadd";

const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/web/add_on_courses");
        if (response.data.status) {
          setCourses(response.data.body);
        } else {
          setError("Failed to fetch courses.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <LandingPage />
      <Box sx={{ p: 2, marginBottom: 8 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            bgcolor: "#0b0b61",
            color: "white",
            py: 1,
            borderRadius: 1,
            mb: 2,
          }}
        >
          Add-On Courses
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="courses table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e6f2f8" }}>
                  <TableCell align="center">
                    <strong>SL NO</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>COURSE NAME</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>DESCRIPTION</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>LINK</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course, index) => (
                  <TableRow
                    key={course.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9fcff" : "#e6f2f8",
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {index + 1}.
                    </TableCell>
                    <TableCell align="center">{course.course_name}</TableCell>
                    <TableCell align="center">{course.description}</TableCell>
                    <TableCell align="center">
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0077cc", textDecoration: "none" }}
                      >
                        {course.link}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default CoursesTable;
