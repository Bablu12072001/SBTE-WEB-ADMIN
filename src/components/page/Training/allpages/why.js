import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import backgroundImg from "../../../assets/images/blue.jpg";
// import Footer from "../Footers";
// import Msg from "./msg"
// import Requirement from "./requirement"
// import ContactPage from "./contactpage";
// import Contactcards from "./contactcards";
// import Contactad from "./contactad"
// import Placement from "./placement";
// import Logins from "./logins"
// import Procedure from "./procedure";
// import Achievements from "./achivement";
// import Stroies from "./stories"

const cardData = [
  {
    icon: <ShareIcon fontSize="large" sx={{ color: "#1D4ED8" }} />,
    title: "Practical Skills ",
    description:
      "Hands-on training through modern workshops, laboratories, and real-world industrial exposure.",
  },
  {
    icon: <StarIcon fontSize="large" sx={{ color: "#1D4ED8" }} />,
    title: "Updated Curriculum",
    description:
      "Our curriculum is aligned with AICTE Examination Reform Policy, Outcome-Based Education (OBE) framework, and current industry demands, ensuring strong technical and professional relevance",
  },
  {
    icon: <ScheduleIcon fontSize="large" sx={{ color: "#1D4ED8" }} />,
    title: "Strong Work Ethic ",
    description:
      "Rigorous academic environment with emphasis on discipline, safety, and teamwork.",
  },
  {
    icon: <EmojiEventsIcon fontSize="large" sx={{ color: "#1D4ED8" }} />,
    title: "Adaptability",
    description:
      "Ability to quickly learn and integrate into diverse work cultures.",
  },
];

const WhySBTEBihar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          py: 10,
          px: 2,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Why Recruit SBTE Diploma Students
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: 1000, mx: "auto", mb: 6 }}>
          The State Board of Technical Education (SBTE) Bihar produces a large
          pool of industry-ready diploma engineers every year through its
          network of Government and Private Polytechnics.
        </Typography>

        <Box
          sx={{
            maxWidth: "1300px",
            mx: "auto",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            gap: 3,
            px: 2,
          }}
        >
          {cardData.map((card, index) => (
            <Card
              key={index}
              sx={{
                flex: "1 1 25%",
                minWidth: "250px",
                maxWidth: "300px",
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                textAlign: "center",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              elevation={3}
            >
              <Box
                mb={2}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                }}
              >
                {card.icon}
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {card.description}
              </Typography>
              {/* <Button
                variant="text"
                sx={{
                  mt: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  color: "#fff",
                  border: "1px solid #fff",
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Know More
              </Button> */}
            </Card>
          ))}
        </Box>
      </Box>
      {/* <Footer />

            < Msg />
            <Requirement />
            <ContactPage />
            <Contactcards />
            <Contactad />
            <Placement />
            <Logins />
            <Procedure />
            <Achievements />
            <Stroies /> */}
    </>
  );
};

export default WhySBTEBihar;
