import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import banner from "../../assets/images/image new.png";
import LandingPage from "./organjationpage";

const Organisation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <LandingPage />
      <Box
        sx={{
          width: "100%",
          minHeight: isMobile ? "auto" : "calc(100vh - 64px)",
          bgcolor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "flex-start" : "space-between",
          pb: isMobile ? 0 : undefined,
          py: 2,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: isMobile ? 1 : 2,
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: isMobile
                ? "1.2rem"
                : {
                    sm: "1.5rem",
                    md: "2rem",
                  },
              px: 2,

              color: "#121858",
              mb: isMobile ? 1 : 0,
            }}
          >
            Organization Structure of State Board of Technical Education Bihar
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: isMobile ? 0 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",

            p: isMobile ? 2 : 4,
            height: isMobile ? "auto" : undefined,
          }}
        >
          <Box
            component="img"
            src={banner}
            alt="Organization Structure"
            sx={{
              maxWidth: "100%",
              maxHeight: isMobile ? "60vh" : "80vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
              marginBottom: 4,
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Organisation;
