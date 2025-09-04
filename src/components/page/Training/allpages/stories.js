import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function PlacementManagers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchManagers = async () => {
    try {
      const res = await axios.get("/api/web/approved_stories");
      if (res.data.status) {
        setManagers(res.data.body);
      }
    } catch (err) {
      console.error("Error fetching managers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f7f9fb", minHeight: "80vh" }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, paddingLeft: 8 }}>
        Institute Placement Managers
      </Typography>
      <Grid container spacing={3}>
        {managers.map((manager, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box sx={{ position: "relative", width: 340, mx: "auto" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  height: 420,
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardMedia
                  component="img"
                  src={manager.attachment}
                  height="120"
                  alt={manager.name}
                  sx={{ height: 180, width: 300, objectFit: "cover" }}
                />
                <CardContent
                  sx={{
                    px: 2,
                    py: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography fontWeight="bold" fontSize={13}>
                      {manager.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 1,
                      py: 0.4,
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                    }}
                  >
                    <ArrowDownwardIcon
                      sx={{
                        fontSize: 22,
                        backgroundColor: "#fff",
                        boxShadow: 1,
                        padding: "4px",
                        mr: 1,
                      }}
                    />
                    {manager.branch}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 1,
                      py: 0.4,
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <ArrowDownwardIcon
                      sx={{
                        fontSize: 22,
                        backgroundColor: "#fff",
                        boxShadow: 1,
                        padding: "4px",
                        mr: 1,
                      }}
                    />
                    {manager.collage_name}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 1,
                      py: 0.4,
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <ArrowDownwardIcon
                      sx={{
                        fontSize: 22,
                        backgroundColor: "#fff",
                        boxShadow: 1,
                        padding: "4px",
                        mr: 1,
                      }}
                    />
                    {manager.company_name}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 1,
                      py: 0.4,
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <ArrowDownwardIcon
                      sx={{
                        fontSize: 22,
                        backgroundColor: "#fff",
                        boxShadow: 1,
                        padding: "4px",
                        mr: 1,
                      }}
                    />
                    {manager.LPA} LPA
                  </Box>
                  <Typography
                    variant="body2"
                    fontSize={11}
                    color="text.secondary"
                    mt={1}
                  >
                    {manager.text}
                  </Typography>
                </CardContent>
              </Card>

              {/* <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 50,
                  backgroundColor: "#fff",
                  boxShadow: 1,
                  padding: "4px",
                }}
                aria-label="external link"
              >
                <ArrowOutwardIcon fontSize="small" />
              </IconButton> */}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
