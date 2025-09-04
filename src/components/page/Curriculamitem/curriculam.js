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
  Paper,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import LandingPage from "./onepage";

const BranchSemesterTable = () => {
  const [syllabusData, setSyllabusData] = useState([]);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await axios.get("/api/web/syllabus");
        if (res.data.status && Array.isArray(res.data.data)) {
          setSyllabusData(res.data.data);
        } else {
          setSyllabusData([]);
        }
      } catch (error) {
        console.error("Error fetching syllabus:", error);
        setSyllabusData([]);
      }
    };

    fetchSyllabus();
  }, []);

  const getSemesterList = (branch) => {
    const semesters = branch.Semester || branch.semester || [];
    return semesters.slice().sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0]) || 0;
      const numB = parseInt(b.match(/\d+/)?.[0]) || 0;
      return numA - numB;
    });
  };

  const getLinksList = (branch) => {
    return branch.link || [];
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <LandingPage />
      <Box p={2}>
        {syllabusData.map((sessionItem, sessionIndex) => (
          <Box key={sessionIndex} mb={5}>
            <Typography
              variant="h6"
              align="center"
              sx={{
                backgroundColor: "#1a1a5c",
                color: "#fff",
                p: 1,
                borderRadius: "4px 4px 0 0",
              }}
            >
              {sessionItem.session}
            </Typography>

            <TableContainer component={Paper} sx={{ border: "1px solid #ccc" }}>
              <Table sx={{ minWidth: 650 }} aria-label="syllabus table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#0b0b40" }}>
                    <TableCell sx={{ color: "#fff", border: "1px solid #ccc" }}>
                      Branch Code
                    </TableCell>
                    <TableCell sx={{ color: "#fff", border: "1px solid #ccc" }}>
                      Branch
                    </TableCell>
                    <TableCell sx={{ color: "#fff", border: "1px solid #ccc" }}>
                      Semesters & Links
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessionItem.branches
                    .slice()
                    .sort((a, b) =>
                      a.branch_code
                        ?.toString()
                        .localeCompare(b.branch_code?.toString())
                    )
                    .map((branch, branchIndex) => {
                      const semesters = getSemesterList(branch);
                      const links = getLinksList(branch);

                      return (
                        <TableRow
                          key={branchIndex}
                          sx={{
                            backgroundColor:
                              branchIndex % 2 === 0 ? "#f0f8ff" : "#ffffff",
                          }}
                        >
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {branch.branch_code}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            {capitalizeWords(branch.branch)}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid #ccc" }}>
                            <Box
                              display="flex"
                              flexWrap="nowrap"
                              overflow="auto"
                              sx={{ gap: 1, p: 1 }}
                            >
                              {semesters.map((sem, i) => (
                                <Button
                                  key={i}
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    minWidth: "140px",
                                    maxWidth: "140px",
                                    whiteSpace: "nowrap",
                                    fontSize: "12px",
                                    flexShrink: 0,
                                    borderRadius: "8px",
                                  }}
                                  onClick={() =>
                                    window.open(
                                      `https://sbte.bihar.gov.in${links[i]}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  {sem}
                                </Button>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default BranchSemesterTable;
