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
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProcedures = async () => {
    try {
      const res = await axios.get("/api/web/procedure");
      if (res.data.status) {
        setProcedures(res.data.body);
      }
    } catch (error) {
      console.error("Error fetching procedures:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f7f9fb",
        minHeight: "100vh",
        paddingLeft: { xs: 3, sm: 7, md: 14 },
      }}
    >
      {/* Section Header */}
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
          Procedure
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

      {/* PDF Cards */}
      <Grid container spacing={2}>
        {procedures.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                width: 260, // ✅ Fixed width
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
                mx: "auto",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0px 4px 12px rgba(0, 0, 255, 0.5)",
                },
              }}
            >
              {item.attachment?.startsWith("http") ? (
                <Link
                  href={item.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{ fontSize: 14 }}
                >
                  {item.txt || "Download PDF"}
                </Link>
              ) : (
                <Typography sx={{ fontSize: 14 }}>
                  {item.txt || "No valid attachment"}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
