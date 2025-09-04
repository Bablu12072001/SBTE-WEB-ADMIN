import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/images/gallery.jpg"; // Your image path

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: { xs: 80, sm: 150, md: 300 },
        width: "100%",
        position: "relative",

        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      {/* Left Dark Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0.7) 30%, transparent 100%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "absolute",
          zIndex: 3,
          bottom: { xs: 24, sm: 32 },
          left: { xs: 16, sm: 32 },
          color: "#fff",
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            fontSize: { xs: 18, sm: 38 },
            mb: 1,
          }}
        >
          Branch Wise Intake
        </Typography>

        {/* Breadcrumb Navigation */}
        <Stack direction="row" spacing={1}>
          <Typography
            component={Link}
            onClick={() => navigate("/")}
            sx={{
              color: "#ddd",
              cursor: "pointer",
              fontSize: { xs: 14, sm: 16 },
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Home
          </Typography>
          <Typography sx={{ color: "#ddd", fontSize: { xs: 14, sm: 16 } }}>
            &gt;
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            Affiliated Institute
          </Typography>
          <Typography sx={{ color: "#ddd", fontSize: { xs: 14, sm: 16 } }}>
            &gt;
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            Branch Wise Intake
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default LandingPage;
