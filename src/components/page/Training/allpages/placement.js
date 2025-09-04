import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";

export default function PlacementBrochure() {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/web/placement_broacher")
      .then((response) => {
        if (response.data.status) {
          setBrochures(response.data.body);
        } else {
          setError("Failed to fetch brochures.");
        }
      })
      .catch((err) => {
        setError("Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f7f9fb",
        minHeight: "100vh",
        paddingLeft: { xs: 3, sm: 7, md: 14 },
      }}
    >
      {/* Title */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
        flexWrap="wrap"
      >
        <Box
          sx={{
            flex: 1,
            maxWidth: 120,
            borderBottom: "2px solid #1976d2",
            mr: 2,
          }}
        />
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#1976d2"
          sx={{ whiteSpace: "nowrap", fontWeight: 600 }}
        >
          Placement Brochure
        </Typography>
        <Box
          sx={{
            flex: 1,
            maxWidth: 120,
            borderBottom: "2px solid #1976d2",
            ml: 2,
          }}
        />
      </Box>

      {/* Loading Spinner */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Typography color="error" align="center" mt={2}>
          {error}
        </Typography>
      )}

      {/* Brochure Cards */}
      <Grid container spacing={2}>
        {brochures.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Paper
              elevation={0}
              sx={{
                width: 260, // ✅ Fixed width added here
                borderTop: "4px solid #0000c2",
                borderRight: "4px solid #0000c2",
                borderRadius: "6px",
                p: 2,
                textAlign: "center",
                fontWeight: 500,
                color: "#000",
                boxShadow: 1,
                minHeight: 80,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                mx: "auto", // Center the card horizontally
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0px 4px 12px rgba(0, 0, 255, 0.5)",
                },
              }}
            >
              <Link
                href={item.attachment}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "#1e3d8f",
                  "&:hover": {
                    color: "#0000c2",
                  },
                }}
              >
                {item.label || "Download Brochure"}
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
