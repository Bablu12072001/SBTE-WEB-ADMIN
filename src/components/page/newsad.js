// components/PrintAdAgencyCard.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import "../../PrintAdAgencyCard.css"; // Our CSS animation file

const PrintAdAgencyCard = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [adImages, setAdImages] = useState([]);
  const [openImage, setOpenImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/api/web/ads");
        const data = await response.json();
        const images = data.body || [];
        const fullUrls = images.map((img) => ({
          url: img.image,
          date: img.date || "Unknown Date",
        }));
        setAdImages(fullUrls);
      } catch (error) {
        console.error("Error fetching advertisement images:", error);
      }
    };
    fetchAds();
  }, []);

  const imageHeight = isMobileView ? 200 : 300;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          height: "50%",
        }}
      >
        <Card
          sx={{
            position: "relative",
            overflow: "hidden",
            height: imageHeight,
            width: "92%",
            border: "3px solid white",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: 5,
          }}
        >
          <Typography
            sx={{
              position: "absolute",
              top: "10px",
              left: "20px",
              backgroundColor: "rgba(255, 0, 0, 0.8)",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: isMobileView ? "1rem" : "1.5rem",
              zIndex: 5,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
              letterSpacing: "2px",
            }}
          >
            News
          </Typography>

          {/* Scrolling Images */}
          <Box className="scrolling-wrapper">
            <Box className="scrolling-images">
              {[...adImages, ...adImages].map((imgObj, i) => (
                <Box
                  key={i}
                  sx={{
                    width: isMobileView ? "100vw" : "400px",
                    height: "100%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpenImage(imgObj.url)}
                >
                  <img
                    src={imgObj.url}
                    alt={`Ad ${i + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* View All Button */}
          <Button
            onClick={() => navigate("/all-news")}
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              zIndex: 5,
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: "bold",
              px: 2,
              py: 1,
              borderRadius: "20px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#125ea3",
              },
            }}
          >
            View All
          </Button>
        </Card>
      </Box>

      {/* Popup Dialog */}
      <Dialog
        open={!!openImage}
        onClose={() => setOpenImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            onClick={() => setOpenImage(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
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
              margin: "auto",
              display: "block",
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrintAdAgencyCard;
