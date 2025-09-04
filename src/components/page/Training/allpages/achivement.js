import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";

const FullWidthImageText = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get("/api/web/achievements");
      if (res.data.status) {
        setAchievements(res.data.body);
      }
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {achievements.slice(0, 2).map((item, index) => (
        <Box key={item.id} sx={{ marginBottom: 10 }}>
          <Grid
            container
            spacing={2}
            direction={
              index % 2 === 0
                ? isMobile
                  ? "column"
                  : "row"
                : isMobile
                ? "column-reverse"
                : "row"
            }
            sx={{
              mb: 4,
              flexWrap: isMobile ? "wrap" : "nowrap",
              padding: 4,
              bgcolor: index % 2 === 0 ? "#e3f2fd" : "#1c44b2",
              alignItems: "flex-start",
            }}
          >
            {(index % 2 === 0 || isMobile) && (
              <Grid
                item
                sx={{
                  flex: isMobile ? "1 1 100%" : "0 0 550px",
                  height: isMobile ? "auto" : 340,
                }}
              >
                <Box
                  component="img"
                  src={item.attachment}
                  alt="Achievement"
                  sx={{
                    width: "100%",
                    height: isMobile ? "auto" : "100%",
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              </Grid>
            )}

            <Grid
              item
              sx={{
                flex: 1,
                pl: isMobile ? 0 : 3,
                pt: isMobile ? 2 : 0,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: "30px",
                  mb: 1,
                  color: index % 2 === 0 ? "black" : "white",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Achievement
              </Typography>

              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: 1.8,
                  color: index % 2 === 0 ? "black" : "white",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  textAlign: "justify",
                }}
              >
                {item.text}
              </Typography>
            </Grid>

            {index % 2 !== 0 && !isMobile && (
              <Grid
                item
                sx={{
                  flex: "0 0 550px",
                  height: 320,
                }}
              >
                <Box
                  component="img"
                  src={item.attachment}
                  alt="Achievement"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default FullWidthImageText;
