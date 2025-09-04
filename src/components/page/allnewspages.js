// pages/AllNewsPage.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AllNewsPage = () => {
  const [adImages, setAdImages] = useState([]);
  const [openImage, setOpenImage] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/api/web/ads");
        const data = await response.json();
        const images = data.body || [];
        const formatted = images.map((img) => ({
          url: img.image,
          date: img.date
            ? new Date(img.date).toISOString().slice(0, 10)
            : "Unknown Date",
        }));
        setAdImages(formatted);
      } catch (error) {
        console.error("Error loading images", error);
      }
    };

    fetchAds();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        All News Images
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {adImages.map((img, i) => (
          <Grid item key={i}>
            <Card
              sx={{
                width: 400,
                height: 300,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover .hover-info": {
                  opacity: 1,
                },
              }}
              onClick={() => setOpenImage(img.url)}
            >
              <CardMedia
                component="img"
                image={img.url}
                alt={`News ${i + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <CardContent
                className="hover-info"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  py: 1,
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {img.date}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Image Popup */}
      <Dialog
        open={!!openImage}
        onClose={() => setOpenImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            onClick={() => setOpenImage(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={openImage}
            alt="Full View"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
              display: "block",
              margin: "auto",
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AllNewsPage;
