"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  IconButton,
  Fade,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Video from "./video";

import Page from "./page";

const API_URL = "/api/web/gallery";

export default function UnitGalleryPage() {
  const [eventList, setEventList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullImage, setFullImage] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        if (res.data.status) {
          setEventList(res.data.body);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch gallery:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchEventDetails = (eventName) => {
    const event = eventList.find((e) => e.event_name === eventName);
    if (event) {
      setEventDetails([
        {
          topic: event.event_name,
          date: new Date(event.timestamp).toLocaleDateString(),
          images: event.images || [],
        },
      ]);
      setSelectedEvent(eventName);
    }
  };

  const handleBack = () => {
    setSelectedEvent(null);
    setEventDetails([]);
    setFullImage(null);
  };

  return (
    <>
      <Page />
      <Box sx={{ minHeight: "80vh", bgcolor: "#e3f2fd" }}>
        {selectedEvent ? (
          <Box sx={{ p: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              sx={{ mb: 3 }}
            >
              ← Go Back
            </Button>

            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "#1565c0",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {selectedEvent} Photos
            </Typography>

            <Grid container spacing={4}>
              {eventDetails[0]?.images?.map((img, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    onClick={() => setFullImage(img)}
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      overflow: "hidden",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="220"
                      image={img}
                      alt={`image-${index}`}
                      sx={{ objectFit: "cover", height: 220 }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ p: 4 }}>
            {/* <Typography
              variant="h4"
              sx={{
                mb: 4,
                fontWeight: "bold",
                color: "#0d47a1",
                textAlign: "center",
              }}
            >
              SBTE - State Board of Technical Education, Bihar
            </Typography> */}

            <Typography
              variant="h5"
              sx={{
                borderBottom: "3px solid #1565c0",
                width: "fit-content",
                fontWeight: "bold",
                color: "#0d47a1",
                backgroundColor: "rgba(255,255,255,0.7)",
                px: 2,
                borderRadius: 1,
                mb: 3,
              }}
            >
              Gallery
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Grid container spacing={4}>
                {eventList.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <Card
                      onClick={() => fetchEventDetails(item.event_name)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 4,
                        boxShadow: 4,
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="220"
                        image={item.thumb_image}
                        alt={item.event_name}
                        sx={{
                          objectFit: "cover",
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                          height: "220px",
                        }}
                      />
                      <CardContent
                        sx={{
                          backgroundColor: "#fff",
                          textAlign: "center",
                          borderBottomLeftRadius: 16,
                          borderBottomRightRadius: 16,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="primary"
                          noWrap
                        >
                          {item.event_name}
                        </Typography>
                        {/* <Typography variant="body2">
                          Year: {item.date || "NA"}
                        </Typography> */}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Popup Full Image View */}
        {fullImage && (
          <Backdrop open sx={{ zIndex: 1300, color: "#fff" }}>
            <Fade in={true}>
              <Box
                sx={{
                  position: "relative",
                  width: "90%",
                  maxWidth: 800,
                  bgcolor: "#fff",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 10,
                  textAlign: "center",
                }}
              >
                <IconButton
                  onClick={() => setFullImage(null)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#000",
                    backgroundColor: "#e3f2fd",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <img
                  src={fullImage}
                  alt="Full View"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    borderRadius: "10px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Fade>
          </Backdrop>
        )}
      </Box>

      <Video />
    </>
  );
}
