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

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sort by date and mark top 5 as new
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
      .get("/api/web/news/announcement")
      .then((response) => {
        if (response.data?.status && Array.isArray(response.data.body)) {
          const processed = markTopFiveAsNew(response.data.body);
          setAnnouncements(processed);
        }
      })
      .catch((err) => {
        console.error("Error fetching announcements:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, color: "#1565c0" }}
      >
        📢 Announcements
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={6} sx={{ borderRadius: 4 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>SL. No</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Attachment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {item.title}
                        {item.isNew && (
                          <Chip
                            label="New"
                            size="small"
                            color="primary"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      {item.attachment ? (
                        <a
                          href={item.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1565c0", fontWeight: "bold" }}
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

export default AnnouncementsPage;
