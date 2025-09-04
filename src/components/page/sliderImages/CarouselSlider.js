import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  CardMedia,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import "./ImageGallery.css";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [eventName, setEventName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/web/latest_image");
        const data = response.data.body;
        if (response.data.status && data.length > 0) {
          const latest = data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )[0];
          if (latest?.images?.length) {
            const repeated = [
              ...latest.images,
              ...latest.images,
              ...latest.images,
              ...latest.images,
            ];
            setImages(repeated);
            setEventName(latest.event_name || "Latest Event");
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleImageClick = (url) => setSelectedImage(url);
  const handleClose = () => setSelectedImage(null);

  return (
    <Box sx={{ backgroundColor: "#eef2ff", px: 5, py: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: "2rem" }}>
          Latest Images
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/gallery")}
          sx={{
            backgroundColor: "#1d3b82",
            borderRadius: "28px",
            textTransform: "none",
            fontSize: "1rem",
            px: 4,
            py: 1,
            "&:hover": {
              backgroundColor: "#142a5f",
            },
          }}
        >
          View All
        </Button>
      </Box>

      {/* Scrollable Container */}
      <Box className="scroll-wrapper">
        <Box className="scroll-track">
          {images.map((imgUrl, index) => (
            <Box
              key={`${imgUrl}-${index}`}
              className="image-card"
              onClick={() => handleImageClick(imgUrl)}
            >
              <CardMedia
                component="img"
                image={imgUrl}
                alt={`Image ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* <Box className="image-label">
                <Typography variant="body2">{eventName}</Typography>
              </Box> */}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Modal */}
      <Modal
        open={!!selectedImage}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={!!selectedImage}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <IconButton onClick={handleClose} sx={{ color: "#444", mb: 1 }}>
              <CloseIcon />
            </IconButton>
            <img
              src={selectedImage}
              alt="Full preview"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ImageGallery;
