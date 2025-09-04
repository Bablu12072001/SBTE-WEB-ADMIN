import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LandingPage from "./pageeoa";
import axios from "axios";

export default function SearchPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterByYear(selectedYear);
  }, [data, selectedYear]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/web/eoa_loa");
      if (response.data.status) {
        setData(response.data.body);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const isPDF = (url) => /\.pdf$/i.test(url.toLowerCase());

  const handleAttachmentClick = (url) => {
    window.open(url, "_blank");
  };

  const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const filterByYear = (year) => {
    if (!year) {
      setFilteredData([]); // ❌ Don't show anything if year is not selected
    } else {
      const filtered = data.filter((item) =>
        item.session?.toString().includes(year.toString())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <>
      <LandingPage />
      <Box
        sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
      >
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Typography
            variant="h4"
            sx={{
              borderBottom: "3px solid #00bcd4",
              pb: 1,
              mb: 4,
              fontWeight: 600,
              textAlign: "left",
            }}
          >
            EOA/LOA of All Institutes
          </Typography>

          <Box sx={{ mb: 4, width: 250 }}>
            <FormControl fullWidth>
              <InputLabel id="year-select-label">
                Filter by Session Year
              </InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={selectedYear}
                label="Filter by Session Year"
                onChange={handleYearChange}
              >
                <MenuItem value="">Select Year</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {filteredData.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 3, boxShadow: 3 }}
            >
              <Table sx={{ minWidth: 900 }} aria-label="customized table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#00bcd4" }}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #ccc",
                      }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #ccc",
                      }}
                    >
                      Institute
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #ccc",
                      }}
                    >
                      Institute Type (Click to View)
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #ccc",
                      }}
                    >
                      Session
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                        "&:hover": { backgroundColor: "#f1f1f1" },
                      }}
                    >
                      <TableCell sx={{ border: "1px solid #ccc" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>
                        {row.institute}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => handleAttachmentClick(row.attachment)}
                          startIcon={
                            isPDF(row.attachment) ? <PictureAsPdfIcon /> : null
                          }
                        >
                          {row.institute_type}
                        </Button>
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>
                        {row.session}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : selectedYear ? (
            <Typography>No data available for year {selectedYear}.</Typography>
          ) : (
            <Typography>Please select a session year to view data.</Typography>
          )}
        </Container>
      </Box>
    </>
  );
}
