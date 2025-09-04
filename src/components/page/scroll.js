import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import image from "../assets/images/sbtelogo.png";
import backgroundImage from "../assets/images/wave1.jpeg";
import Social from "./social";

const ImageScrollGallery = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/web/home");
        const imageArray = response.data?.body || [];
        setImages(imageArray);
      } catch (error) {
        console.error("Error fetching scroll images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Auto-scroll once images are available
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <>
      <Social />
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          height: isSmallScreen ? "auto" : "500px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            flex: isSmallScreen ? "unset" : "0 0 40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: "100%",
              height: isSmallScreen ? "auto" : "80%",
            }}
          >
            <Box
              component="img"
              src={image}
              alt="SBTE Logo"
              sx={{
                width: isSmallScreen ? "50%" : "35%",
                height: "auto",
                maxHeight: "190px",
                mb: 2,
              }}
            />
            <Typography
              sx={{
                color: "black",
                fontSize: isSmallScreen ? "1.5rem" : "2rem",
                fontWeight: "bold",
                textShadow: "4px 4px 6px rgba(0, 0, 0, 0.6)",
                lineHeight: 1.2,
                px: 2,
              }}
            >
              State Board of Technical Education
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: isSmallScreen ? "1rem" : "1.1rem",
                mt: 2,
                lineHeight: 1.5,
                px: 3,
              }}
            >
              Science Technology and Technical Education Department, Government
              of Bihar
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: isSmallScreen ? "unset" : "0 0 60%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            height: isSmallScreen ? "250px" : "100%",
            position: "relative",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : images.length > 0 ? (
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              <Box
                component="img"
                src={images[currentIndex]["image"]}
                alt={`Gallery ${currentIndex}`}
                key={images[currentIndex].id}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.5s ease-in-out",
                }}
              />
              {images[currentIndex].label && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    px: 2,
                    py: 1,
                    borderRadius: "4px",
                    fontSize: "1rem",
                    maxWidth: "90%",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {images[currentIndex].label}
                </Box>
              )}
            </Box>
          ) : (
            <Typography>No images available</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ImageScrollGallery;
