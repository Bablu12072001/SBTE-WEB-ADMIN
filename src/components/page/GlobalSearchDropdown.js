import React from "react";
import {
  Autocomplete,
  TextField,
  Popper,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Custom Popper with high z-index so it shows over navbar
const CustomPopper = styled(Popper)(() => ({
  zIndex: 2000,
}));

const pages = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },

  { label: "Government Institutes", path: "/government-institute" },
  { label: "Private Institutes", path: "/private-institutes" },
  { label: "EOA/LOA", path: "/eoa-loa" },
  { label: "Mission and Vision", path: "/mission" },
  { label: "Organisation Structure", path: "/organisation" },
  { label: "Gallery", path: "/gallery" },

  // Student's Corner > Academics
  { label: "Academic Calendar", path: "/academic-calendar" },
  { label: "Registration", path: "https://sbteonline.bihar.gov.in/login" },
  { label: "Enrollments", path: "https://sbteonline.bihar.gov.in/login" },
  { label: "Exam Result", path: "https://sbteonline.bihar.gov.in/login" },
  { label: "E-Content & Virtual Labs", path: "/e-content-virtual-labs" },
  { label: "Previous Year Questions", path: "/previous-year-questions" },
  { label: "Question Answer Key", path: "/question-answer-key" },

  // Student's Corner > Curriculum
  { label: "Curriculum", path: "/curriculum" },
  { label: "Curriculum Feedback", path: "/curriculum-feedback" },
  { label: "Available Courses", path: "/available-courses" },
  { label: "Add-on Courses", path: "/add-on-courses" },

  // Student's Corner
  {
    label: "Digilocker",
    path: "https://www.digilocker.gov.in/dashboard/issuers/000607",
  },
  { label: "Award", path: "/award" },

  // Documents & Downloads
  { label: "Official Letters", path: "/official-letters" },
  { label: "SBTE Norms - Documents", path: "/sbtenorms-documents" },
  { label: "DSTTE Norms - Documents", path: "/dsttenorms-documents" },
  { label: "Sops & User Manual", path: "/sops-usermanual" },
  { label: "Downloads", path: "/downloads" },

  // Training & Placement
  { label: "Career", path: "/career" },
  { label: "Training", path: "/training" },
  { label: "Login", path: "/login" },

  // Portals
  { label: "Online Portal", path: "https://sbteonline.bihar.gov.in/login" },
  {
    label: "Affiliation Portal",
    path: "https://sbteonline.bihar.gov.in/login",
  },
  { label: "LMS Portal (Moodle)", path: "https://sbtelms.bihar.gov.in/" },

  // Other Links
  { label: "Alumni", path: "https://alumni.sbtebihar.in/" },
  { label: "Document Verification Status", path: "/document-verification" },
  { label: "Grievance", path: "https://sbteweb.bihar.gov.in/grievance" },
  { label: "FAQ", path: "/faq" },
  { label: "External Links", path: "#" },
  { label: "Collaboration", path: "#" },
];

function GlobalSearchDropdown() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm = 600px

  const handleSelect = (event, value) => {
    if (value?.path) {
      navigate(value.path);
    }
  };

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : "200px",
        padding: isMobile ? "8px" : "0px",
        backgroundColor: isMobile ? "white" : "transparent",
        zIndex: 1100,
      }}
    >
      <Autocomplete
        options={pages}
        getOptionLabel={(option) => option.label}
        onChange={handleSelect}
        PopperComponent={CustomPopper}
        disablePortal={false}
        sx={{
          width: "100%",
          "& .MuiInputBase-root": {
            height: 34,
            fontSize: 13,
            backgroundColor: "white",
          },
          "& .MuiInputBase-input": {
            padding: "4px 8px",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search..."
            size="small"
            variant="outlined"
          />
        )}
      />
    </Box>
  );
}

export default GlobalSearchDropdown;
