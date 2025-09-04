"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  CircularProgress,
  ListItemText,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function AcademicCalendarPage() {
  const [calendarList, setCalendarList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/web/academic_calander")
      .then((response) => {
        const list = response.data?.body || [];
        setCalendarList(list);
      })
      .catch((err) => {
        console.error("Failed to fetch calendar list:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAttachmentClick = (attachmentUrl) => {
    if (!attachmentUrl) return;

    const fileExtension = attachmentUrl.split(".").pop().toLowerCase();

    // List of supported image extensions
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

    if (fileExtension === "pdf" || imageExtensions.includes(fileExtension)) {
      // Open in new tab
      window.open(attachmentUrl, "_blank");
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      // Download Excel file
      const link = document.createElement("a");
      link.href = attachmentUrl;
      link.download = attachmentUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Unsupported file type!");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f0f0f5", p: 2 }}>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List disablePadding>
          {calendarList.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              {/* Arrow Icon */}
              <ListItemIcon sx={{ minWidth: "30px", mt: 0.5 }}>
                <ArrowRightIcon sx={{ color: "black" }} />
              </ListItemIcon>

              {/* Image Preview (Optional) */}
              {item.image && (
                <Box
                  component="img"
                  src={item.image}
                  alt="Calendar"
                  sx={{
                    width: { xs: "60px", sm: "80px" },
                    height: "auto",
                    borderRadius: 1,
                    border: "1px solid #ccc",
                  }}
                />
              )}

              {/* Title with Clickable Attachment */}
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    onClick={() => handleAttachmentClick(item.attachment)}
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      color: "#1976d2",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      cursor: "pointer",
                      "&:hover": {
                        color: "#0d47a1",
                      },
                    }}
                  >
                    {item.title}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
