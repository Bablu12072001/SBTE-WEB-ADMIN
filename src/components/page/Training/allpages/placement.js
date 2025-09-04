import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress, Link } from "@mui/material";

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
      .catch(() => {
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
        width="100%"
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
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
          gap: 3, // spacing between cards
        }}
      >
        {brochures.map((item) => (
          <Paper
            key={item.id}
            elevation={3}
            sx={{
              width: "100%",
              borderTop: "6px solid #0000c2",
              borderRight: "6px solid #0000c2",
              borderRadius: "12px",
              p: 4,
              textAlign: "center",
              fontWeight: 500,
              color: "#000",
              boxShadow: 3,
              minHeight: 150,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 6px 20px rgba(0, 0, 255, 0.4)",
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
                fontSize: 18,
                color: "#1e3d8f",
                wordBreak: "break-word",
                "&:hover": {
                  color: "#0000c2",
                },
              }}
            >
              {item.label || "Download Brochure"}
            </Link>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
