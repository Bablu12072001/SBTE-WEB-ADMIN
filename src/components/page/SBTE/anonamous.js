"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Link,
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
import LandingPage from "./anopage";

const AutonomousInstitutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [autoTotalIntake, setAutoTotalIntake] = useState(0);

  const yearOptions = ["2025-2026"];

  const fetchInstitutes = async (year) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://sbte-api.anantdrishti.com/util/getInstituteList?instituteType=AUTONOMOUS&academicYear=${year}`
      );

      const body = response.data || {};
      const data = Array.isArray(body["instituteList"])
        ? body["instituteList"]
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setInstitutes(data);
      setAutoTotalIntake(body.autoTotalIntake || 0);
    } catch (error) {
      console.error("Failed to fetch institutes:", error);
      setInstitutes([]);
      setAutoTotalIntake(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes(selectedYear);
  }, [selectedYear]);

  return (
    <>
      <LandingPage />

      <Box
        sx={{
          maxWidth: "95%",
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
          Autonomous Institutes List
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
          <Typography sx={{ flex: 1, minWidth: "250px", textAlign: "left" }}>
            The list of all Autonomous Institutes affiliated under SBTE Bihar
          </Typography>

          <Typography sx={{ flex: 1, minWidth: "250px", textAlign: "center" }}>
            Select Academic Year
          </Typography>

          <Box
            sx={{
              flex: 1,
              minWidth: "250px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <FormControl
              size="small"
              sx={{ minWidth: 200, backgroundColor: "#fff", borderRadius: 2 }}
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
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : institutes.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#043194" }}>
                  <TableCell sx={{ ...cellHeadStyle, width: "5%" }}>
                    S. No
                  </TableCell>
                  <TableCell sx={{ ...cellHeadStyle, width: "10%" }}>
                    Inst. Code
                  </TableCell>
                  <TableCell sx={{ ...cellHeadStyle, width: "35%" }}>
                    Inst. Name
                  </TableCell>
                  <TableCell sx={{ ...cellHeadStyle, width: "30%" }}>
                    Courses / Branches
                  </TableCell>
                  <TableCell sx={{ ...cellHeadStyle, width: "10%" }}>
                    Approved Intake
                  </TableCell>
                  <TableCell sx={{ ...cellHeadStyle, width: "10%" }}>
                    Total Approved Intake
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {institutes.map((inst, idx) => {
                  const programs = inst.programList || [];
                  const totalRows = programs.length || 1;

                  return (
                    <React.Fragment key={idx}>
                      <TableRow
                        sx={{
                          backgroundColor:
                            idx % 2 === 0 ? "#f0f4f8" : "#e3ecf3",
                        }}
                      >
                        <TableCell rowSpan={totalRows} sx={cellStyle}>
                          {idx + 1}
                        </TableCell>
                        <TableCell rowSpan={totalRows} sx={cellStyle}>
                          {inst.code}
                        </TableCell>
                        <TableCell rowSpan={totalRows} sx={cellStyle}>
                          <Box sx={{ fontWeight: "bold", mb: 0.5 }}>
                            {inst.name}
                          </Box>
                          <Box fontSize={12} sx={{ fontStyle: "italic" }}>
                            Institute Address: {inst.instituteAddress}
                          </Box>
                          <Box fontSize={12}>
                            Website:{" "}
                            {inst.website !== "NA" ? (
                              <Link
                                href={inst.website}
                                target="_blank"
                                rel="noopener"
                              >
                                {inst.website}
                              </Link>
                            ) : (
                              "NA"
                            )}
                          </Box>
                          <Box fontSize={12}>
                            EOA No:{" "}
                            {inst.instituteEoaLoaLetterPath ? (
                              <Link
                                href={inst.instituteEoaLoaLetterPath}
                                target="_blank"
                                rel="noopener"
                              >
                                {inst.eoaNo || "N/A"}
                              </Link>
                            ) : (
                              inst.eoaNo || "N/A"
                            )}
                          </Box>
                          <Box fontSize={12}>
                            SBTE Affiliation Letter:{" "}
                            {inst.sbteEoaLoaLetterPath ? (
                              <Link
                                href={inst.sbteEoaLoaLetterPath}
                                target="_blank"
                                rel="noopener"
                              >
                                {inst.eoaLoaLetterNo || "Letter"}
                              </Link>
                            ) : (
                              "N/A"
                            )}
                          </Box>
                        </TableCell>

                        {programs.length > 0 ? (
                          <>
                            <TableCell sx={cellStyle}>
                              1. {programs[0].programName}
                            </TableCell>
                            <TableCell sx={cellStyle}>
                              {programs[0].approvedIntake}
                            </TableCell>
                            <TableCell rowSpan={totalRows} sx={cellStyle}>
                              {inst.totalApprovedIntake || "N/A"}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell sx={cellStyle}>N/A</TableCell>
                            <TableCell sx={cellStyle}>N/A</TableCell>
                            <TableCell rowSpan={totalRows} sx={cellStyle}>
                              {inst.totalApprovedIntake || "N/A"}
                            </TableCell>
                          </>
                        )}
                      </TableRow>

                      {programs.slice(1).map((program, pIndex) => (
                        <TableRow
                          key={pIndex}
                          sx={{
                            backgroundColor:
                              (idx + pIndex + 1) % 2 === 0
                                ? "#ffffff"
                                : "#f7faff",
                          }}
                        >
                          <TableCell sx={cellStyle}>
                            {pIndex + 2}. {program.programName}
                          </TableCell>
                          <TableCell sx={cellStyle}>
                            {program.approvedIntake}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })}

                {/* Total Intake Row */}
                <TableRow sx={{ backgroundColor: "#dff0d8" }}>
                  <TableCell
                    colSpan={5}
                    sx={{
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    Total Approved Intake (Autonomous):
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: 14 }}>
                    {autoTotalIntake}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography textAlign="center" p={3}>
            No Autonomous institutes found for {selectedYear}.
          </Typography>
        )}
      </Box>
    </>
  );
};

// Styles
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

export default AutonomousInstitutes;
