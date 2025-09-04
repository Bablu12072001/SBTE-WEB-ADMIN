"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/sbtelogo.png";
import "./scroll.css";

const isImage = (url) => /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(url);
const isPDF = (url) => /\.pdf$/i.test(url);

const StyledTableContainer = styled("div")(({ theme }) => ({
  height: "100%",
  maxHeight: "500px",
  overflow: "hidden",
  padding: theme.spacing(2),
  position: "relative",
  borderRadius: "8px",
  zIndex: 1,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${Logo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "320px",
    filter: "blur(2px)",
    opacity: 0.2,
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 2,
  },
}));

const TableSection = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("en-US", { day: "2-digit" }),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear(),
    };
  };

  const handleOpenAttachment = (url) => {
    if (!url) return;
    if (isPDF(url) || isImage(url) || url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      alert("Unsupported file type");
    }
  };

  const markTopFiveAsNew = (data) => {
    const sorted = [...data].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sorted.map((item, index) => ({
      ...item,
      new: index < 5,
    }));
  };

  useEffect(() => {
    axios
      .get("/api/web/news/announcement")
      .then((response) => {
        if (response.data?.status && Array.isArray(response.data.body)) {
          setAnnouncements(markTopFiveAsNew(response.data.body));
        }
      })
      .catch((error) => console.error("Error fetching announcements:", error));

    axios
      .get("/api/web/circular")
      .then((response) => {
        if (response.data?.status && Array.isArray(response.data.body)) {
          setNotifications(markTopFiveAsNew(response.data.body));
        }
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  const renderTableRows = (rows, type) =>
    rows.map((row, index) => {
      const { day, month, year } = formatDate(row.date);
      return (
        <TableRow
          key={`${type}-${index}`}
          sx={{ borderBottom: "1px solid #b0bec5" }}
        >
          <TableCell>
            <Box display="flex" alignItems="flex-start">
              <Box
                mr={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                minWidth="40px"
                color="#01579b"
              >
                <span style={{ fontSize: "1rem" }}>{day}</span>
                <span style={{ fontSize: "1.1rem", marginTop: 4 }}>
                  {month}
                </span>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#01579b",
                    fontSize: "1.1rem",
                    marginBottom: 1,
                    cursor: row.attachment ? "pointer" : "default",
                  }}
                  onClick={() =>
                    row.attachment && handleOpenAttachment(row.attachment)
                  }
                >
                  {row.title?.charAt(0).toUpperCase() + row.title?.slice(1)}
                  {row.new && (
                    <span
                      style={{
                        color: "white",
                        backgroundColor: "#d50000",
                        borderRadius: "8px",
                        padding: "2px 6px",
                        fontSize: "0.75rem",
                        marginLeft: "10px",
                      }}
                    >
                      NEW
                    </span>
                  )}
                </Typography>

                {type === "announcement" && (
                  <Typography
                    variant="caption"
                    color="#01579b"
                    sx={{
                      border: "1px solid #01579b",
                      borderRadius: "12px",
                      padding: "4px 8px",
                      display: "inline-block",
                      fontWeight: 500,
                    }}
                  >
                    Posted on {day} {month}, {year}
                  </Typography>
                )}
              </Box>
            </Box>
          </TableCell>
        </TableRow>
      );
    });

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingX={isSmallScreen ? 2 : 8}
      paddingY={4}
      sx={{ minHeight: "100vh", background: "#f5f5f5" }}
    >
      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
        width="100%"
      >
        {/* Announcements Section */}
        <Paper
          sx={{
            width: isSmallScreen ? "100%" : "60%",
            height: "600px",
            overflow: "hidden",
            borderRadius: "0.5rem",
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#e8eaf6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingX: 2,
              paddingY: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "900",
                fontSize: "1.5rem",
                color: "#bdbdbd",
              }}
            >
              <span style={{ color: "#01579b" }}>Important</span> Announcement
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate("/announcements")}
              sx={{ fontSize: "0.85rem", color: "#01579b" }}
            >
              View More
            </Button>
          </Box>

          <StyledTableContainer>
            <Box className="scroll-container">
              <Table>
                <TableBody>
                  {renderTableRows(announcements, "announcement")}
                </TableBody>
              </Table>
            </Box>
          </StyledTableContainer>
        </Paper>

        {/* Notifications Section */}
        <Paper
          sx={{
            width: isSmallScreen ? "100%" : "40%",
            height: "600px",
            overflow: "hidden",
            borderRadius: "0.5rem",
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#e8eaf6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingX: 2,
              paddingY: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "900",
                fontSize: "1.5rem",
                color: "#bdbdbd",
              }}
            >
              <span style={{ color: "#01579b" }}>Latest</span> Event
              Notifications
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate("/notifications")}
              sx={{ fontSize: "0.85rem", color: "#01579b" }}
            >
              View More
            </Button>
          </Box>

          <StyledTableContainer>
            <Box className="scroll-container">
              <Table>
                <TableBody>
                  {renderTableRows(notifications, "notification")}
                </TableBody>
              </Table>
            </Box>
          </StyledTableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default TableSection;
