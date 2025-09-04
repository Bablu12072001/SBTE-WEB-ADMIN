import React from "react";
import {
  Box,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import RocketIcon from "@mui/icons-material/RocketLaunch";
import TargetIcon from "@mui/icons-material/CenterFocusStrong";
import bgImage from "../../assets/images/vission.jpeg";
import bgImage1 from "../../assets/images/mission.jpeg";
import LandingPage from "./missionpage";

// Hexagon style shared
const hexagonStyle = {
  width: 120,
  height: 110,
  clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "-55px",
  zIndex: 2,
};

const VisionMission = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <LandingPage />
      <Container maxWidth="xl" sx={{ mb: 8, mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 4 },
          }}
        >
          {/* Vision Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Box
              sx={{
                backgroundImage: `url(${bgImage})`,
                backgroundColor: "#61b6f2",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                padding: { xs: 4, md: 6 },
                textAlign: "center",
                position: "relative",
                paddingBottom: "60px",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}
              >
                VISION
              </Typography>
              <Box
                sx={{
                  ...hexagonStyle,
                  backgroundColor: "#1da1f2",
                }}
              >
                <TargetIcon sx={{ color: "#fff", fontSize: 40, zIndex: 4 }} />
              </Box>
            </Box>
            <Paper sx={{ flexGrow: 1, padding: 3, borderRadius: 2, mt: 6 }}>
              <Typography
                variant="body1"
                sx={{ textAlign: "justify", fontSize: 16 }}
              >
                To enhance the quality of technical education, institutions,
                programs, and systems towards achieving international standards.
                Develop technical manpower to meet the needs of industry 4.0 and
                the growth of the economy.
              </Typography>
            </Paper>
          </Box>

          {/* Mission Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Box
              sx={{
                backgroundImage: `url(${bgImage1})`,
                backgroundColor: "#e74c3c",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                padding: { xs: 4, md: 6 },
                textAlign: "center",
                position: "relative",
                paddingBottom: "60px",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}
              >
                MISSION
              </Typography>
              <Box
                sx={{
                  ...hexagonStyle,
                  backgroundColor: "#c0392b",
                }}
              >
                <RocketIcon sx={{ color: "#fff", fontSize: 40, zIndex: 4 }} />
              </Box>
            </Box>
            <Paper sx={{ flexGrow: 1, padding: 3, borderRadius: 2, mt: 6 }}>
              <Typography
                variant="body1"
                sx={{ textAlign: "justify", fontSize: 16 }}
              >
                To educate the next generation of technical leaders to create,
                to innovate, and to see the unseen. To manifest outcome-based
                education curriculum for the facilitation of NBA for all
                affiliated institutions. To impact technical education,
                examination, and continuous assessment of learning outcomes
                through the "Learning Management System" and ensuring a complete
                digital examination system for "On-Screen Marking."
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default VisionMission;
