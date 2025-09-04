"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
} from "@mui/material";
import axios from "axios";

const CircularsPage = () => {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sort by date (newest first) and mark top 5 as new
  const markTopFiveAsNew = (data) => {
    const sorted = [...data].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sorted.map((item, index) => ({
      ...item,
      isNew: index < 5,
    }));
  };

  useEffect(() => {
    axios
      .get("/api/web/circular")
      .then((response) => {
        if (response.data?.status && Array.isArray(response.data.body)) {
          const processed = markTopFiveAsNew(response.data.body);
          setCirculars(processed);
        }
      })
      .catch((err) => {
        console.error("Error fetching circulars:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, color: "#2e7d32" }}
      >
        📜 Circulars
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={6} sx={{ borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#e8f5e9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>SL. No</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Attachment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {circulars.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {item.title}
                        {item.isNew && (
                          <Chip
                            label="New"
                            size="small"
                            color="success"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(item.date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </TableCell>
                    <TableCell>
                      {item.attachment ? (
                        <a
                          href={item.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#388e3c", fontWeight: "bold" }}
                        >
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default CircularsPage;
