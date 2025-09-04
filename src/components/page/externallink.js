"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// import LandingPage from "./page";

export default function AcademicCalendarPage() {
  const [calendarItems, setCalendarItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/web/external")
      .then((response) => {
        if (response.data.status && response.data.body) {
          setCalendarItems(response.data.body);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch calendar data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* <LandingPage /> */}
      <Box sx={{ backgroundColor: "#f0f0f5", py: 5, overflowX: "auto" }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              backgroundColor: "#eef2ff",
              borderRadius: 3,
              border: "4px solid #00bcd4",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              px: { xs: 2, sm: 3, md: 5 },
              py: { xs: 2, sm: 3 },
              width: "94%",
              mb: 5,
            }}
          >
            {loading ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List disablePadding>
                {calendarItems.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      py: 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "30px", mt: 0.3 }}>
                      <ArrowRightIcon sx={{ color: "black" }} />
                    </ListItemIcon>
                    <Typography
                      variant="body1"
                      component="a"
                      href={item.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        color: "#1976d2",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        cursor: "pointer",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}
