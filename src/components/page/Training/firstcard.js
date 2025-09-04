import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [carouselImages, setCarouselImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/web/placement_carousel")
      .then((res) => {
        if (res.data.status) {
          setCarouselImages(res.data.body);
        }
      })
      .catch((err) => {
        console.error("Error fetching carousel images:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        carouselImages.length > 0 ? (prevIndex + 1) % carouselImages.length : 0
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages]);

  return (
    <Box>
      {/* Image Carousel */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "40vh", sm: "50vh", md: "65vh" },
          position: "relative",
          overflow: "hidden",
          bgcolor: "#e0e0e0",
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          carouselImages.map((item, index) => (
            <Box
              key={item.id}
              component="img"
              src={item.image}
              alt={item.label || `Slide ${index + 1}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // You can change to "contain" if needed
                position: "absolute",
                top: 0,
                left: 0,
                opacity: index === currentImageIndex ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            />
          ))
        )}
      </Box>

      {/* Text Content */}
      <Box sx={{ bgcolor: "#f5f6ff", py: { xs: 4, sm: 5, md: 6 } }}>
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            align={isMobile ? "center" : "left"}
            gutterBottom
            sx={{ fontFamily: "sans-serif" }}
          >
            A One-Stop Portal for Placements & Internships
          </Typography>

          <Typography
            variant="h6"
            fontWeight="bold"
            align="center"
            gutterBottom
            sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.25rem" } }}
          >
            Welcome to the official recruitment website for SBTE Bihar.
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{
              mb: 3,
              px: { xs: 2, sm: 4, md: 0 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            The State Board of Technical Education, Bihar is committed to
            nurturing skilled professionals through quality technical education.
            Our diploma graduates are a blend of practical expertise,
            dedication, and strong foundational knowledge. They are trained to
            meet industry demands and contribute effectively in their respective
            fields.
          </Typography>

          <Box textAlign="center">
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#1D4ED8",
                px: 3,
                py: 1.2,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                "&:hover": {
                  backgroundColor: "#2c387e",
                },
              }}
            >
              Let's get started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
