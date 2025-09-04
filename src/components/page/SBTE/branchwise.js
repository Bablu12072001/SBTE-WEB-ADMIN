"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import LandingPage from "./branchpage";

const BranchWiseIntake = () => {
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [selectedType, setSelectedType] = useState("GOVERNMENT");

  const yearOptions = ["2025-2026"];
  const intakeTypeOptions = [
    { label: "Government Intake", value: "GOVERNMENT" },
    { label: "Private Intake", value: "PRIVATE" },

    { label: "Autonomous Intake", value: "AUTONOMOUS" },
  ];

  const fetchBranchWiseIntake = async (year, type) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://sbte-api.anantdrishti.com/util/getInstituteList?academicYear=${year}&instituteType=${type}`
      );

      const body = response.data || {};

      let data = [];
      if (type === "GOVERNMENT") data = body.govBranchWiseIntake || [];
      else if (type === "PRIVATE") data = body.prvBranchWiseIntake || [];
      else if (type === "AUTONOMOUS") data = body.autoBranchWiseIntake || [];

      setBranchData(data);
    } catch (error) {
      console.error("Failed to fetch branch-wise intake data:", error);
      setBranchData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchWiseIntake(selectedYear, selectedType);
  }, [selectedYear, selectedType]);

  return (
    <>
      <LandingPage />

      <Box
        sx={{
          maxWidth: "90%",
          margin: "20px auto",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            backgroundColor: "#121858",
            color: "white",
            padding: "12px",
            textAlign: "center",
            fontWeight: "bold",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            fontSize: "18px",
          }}
        >
          Branch Wise Intake List
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            px: 3,
            py: 2,
            backgroundColor: "#0d0d34",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            borderBottom: "2px solid white",
            textAlign: "center",
          }}
        >
          <Typography sx={{ flex: 1, minWidth: "200px", textAlign: "left" }}>
            The list of all Branch Wise Intake affiliated under SBTE Bihar
          </Typography>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              minWidth: "300px",
            }}
          >
            <FormControl
              size="small"
              sx={{ minWidth: 160, bgcolor: "#fff", borderRadius: 2 }}
            >
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 200, bgcolor: "#fff", borderRadius: 2 }}
            >
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {intakeTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : branchData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#043194" }}>
                  <TableCell sx={{ ...cellHeadStyle, width: "5%" }}>
                    S. No
                  </TableCell>
                  <TableCell sx={{ ...cellHeadStyle, width: "75%" }}>
                    Branch / Course Name
                  </TableCell>
                  <TableCell sx={{ ...cellHeadStyle, width: "20%" }}>
                    Approved Intake
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchData.map(([branchName, intake], index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f7faff" : "#ffffff",
                    }}
                  >
                    <TableCell sx={cellStyle}>{index + 1}</TableCell>
                    <TableCell sx={cellStyle}>{branchName}</TableCell>
                    <TableCell sx={cellStyle}>{intake}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography textAlign="center" p={3}>
            No data found for {selectedType} intake in academic year{" "}
            {selectedYear}.
          </Typography>
        )}
      </Box>
    </>
  );
};

const cellHeadStyle = {
  color: "white",
  fontWeight: "bold",
  border: "1px solid #ccc",
  textAlign: "center",
  fontSize: "13px",
  padding: "8px",
};

const cellStyle = {
  border: "1px solid #ccc",
  fontSize: "13px",
  textAlign: "left",
  padding: "8px",
};

export default BranchWiseIntake;
