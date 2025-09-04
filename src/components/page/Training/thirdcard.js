import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import axios from "axios";

// Single Card Component
const PlacementCard = ({ image, companyName, placedDate }) => (
  <Card
    sx={{
      minWidth: 220,
      maxWidth: 220,
      m: 1,
      borderRadius: 3,
      boxShadow: 2,
      overflow: "hidden",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        boxShadow: 5,
      },
    }}
  >
    <Box sx={{ position: "relative" }}>
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={companyName}
        sx={{ objectFit: "cover" }}
      />
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          boxShadow: 1,
          "&:hover": { backgroundColor: "#f3f3f3" },
        }}
        onClick={() => window.open(image, "_blank")}
      >
        <OpenInNewIcon fontSize="small" />
      </IconButton>
    </Box>

    <Box sx={{ p: 1, textAlign: "center" }}>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ lineHeight: 1.2 }}
      >
        {companyName}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 0.5 }}
      >
        {placedDate
          ? new Date(placedDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Date not available"}
      </Typography>
    </Box>
  </Card>
);

const PlacementCardSection = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await axios.get("/api/web/upcoming_placement");
        setPlacements(response.data.body);
      } catch (error) {
        console.error("Error fetching placements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 4 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          borderBottom: "2px solid #1D4ED8",
          display: "inline-block",
          mb: 3,
        }}
      >
        Upcoming Placements
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            overflow: "hidden",
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "max-content",
              animation: "scrollLeft 30s linear infinite",
              "@keyframes scrollLeft": {
                "0%": {
                  transform: "translateX(100%)", // Start fully off-screen to the right
                },
                "100%": {
                  transform: "translateX(-100%)", // Move fully to the left
                },
              },
            }}
          >
            {placements.map((placement, index) => (
              <PlacementCard
                key={`${placement.id}-${index}`}
                image={placement.company_photo}
                companyName={placement.company_name}
                placedDate={placement.date}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PlacementCardSection;
