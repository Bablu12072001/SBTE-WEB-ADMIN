import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import image from "../../../assets/images/Chandra-shekhar-Singh.jpg";

const FullWidthImageText = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ marginBottom: 10 }}>
        <Grid
          container
          spacing={2}
          direction={isSmallScreen ? "column" : "row"}
          sx={{
            mb: 4,
            p: 2,
            bgcolor: "#e3f2fd",
            alignItems: isSmallScreen ? "center" : "flex-start",
            flexWrap: isSmallScreen ? "wrap" : "nowrap",
          }}
        >
          {/* Image Section */}
          <Grid
            item
            sx={{
              flex: isSmallScreen ? "unset" : "0 0 400px",
              width: isSmallScreen ? "100%" : "auto",
              height: isSmallScreen ? 400 : 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              //   bgcolor: "white",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={image}
              alt="First"
              sx={{
                width: 350,
                objectFit: "contain", // ensures whole image is visible
                borderRadius: 4,
              }}
            />
          </Grid>

          {/* Text Section */}
          <Grid
            item
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // pushes signature to bottom
              pl: isSmallScreen ? 0 : 3,
              pt: isSmallScreen ? 2 : 0,
              minHeight: isSmallScreen ? "auto" : 300,
            }}
          >
            {/* Main Text */}
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "black",
                textAlign: "justify",
                mb: 2,
              }}
            >
              At SBTE Bihar, our vision is to create technically skilled
              professionals who can contribute meaningfully to the growth of
              industries and the nation. Through our structured training,
              industry collaborations, and placement initiatives, we ensure our
              students are not only academically sound but also practically
              skilled and workplace-ready. We invite esteemed organizations to
              partner with us in providing our talented diploma engineers the
              opportunity to showcase their skills and grow along with your
              enterprise.
            </Typography>

            {/* Signature */}
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Dr. Chandrashekhar Singh
              </Typography>
              <Typography variant="body2">Secretary,</Typography>
              <Typography variant="body2">
                State Board of Technical Education, Bihar
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FullWidthImageText;
