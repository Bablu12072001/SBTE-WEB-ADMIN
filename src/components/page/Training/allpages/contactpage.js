import React from "react";
import {
  Box,
  Typography,
  Link,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CallIcon from "@mui/icons-material/Call";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";

const ContactUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fd",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 600,
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Title */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "#1e3d8f",
              fontWeight: "bold",
              borderBottom: "2px solid #1e3d8f",
              display: "inline-block",
              px: 2,
            }}
          >
            Contact Us
          </Typography>
        </Box>

        {/* Board Name */}
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: "bold",
            mb: 2,
            textAlign: "center",
            color: "#1e3d8f",
          }}
        >
          State Board of Technical Education
        </Typography>

        {/* Address */}
        <Typography
          sx={{
            fontSize: 15,
            lineHeight: 1.8,
            textAlign: "center",
            color: "#444",
            mb: 2,
          }}
        >
          <ApartmentIcon
            sx={{ mr: 1, fontSize: 20, verticalAlign: "middle" }}
          />
          4th Floor, Technology Bhawan,
          <br />
          Vishweshariya Bhawan Campus,
          <br />
          Bailey Road, Patna, Bihar - 800015, India
        </Typography>

        {/* Contact Info */}
        <Box sx={{ mt: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <CallIcon sx={{ mr: 1, fontSize: 20, color: "#1e3d8f" }} />
            <Link
              href="tel:18002020305"
              color="inherit"
              underline="hover"
              sx={{
                fontSize: 15,
                color: "#1e3d8f",
                fontWeight: 500,
                "&:hover": { color: "#FFD700" },
              }}
            >
              Toll Free: 1800-202-0305
            </Link>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <CallIcon sx={{ mr: 1, fontSize: 20, color: "#1e3d8f" }} />
            <Link
              href="tel:+916122547532"
              color="inherit"
              underline="hover"
              sx={{
                fontSize: 15,
                color: "#1e3d8f",
                fontWeight: 500,
                "&:hover": { color: "#FFD700" },
              }}
            >
              +91 (0612) 2547532
            </Link>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <ForwardToInboxIcon
              sx={{ mr: 1, fontSize: 20, color: "#1e3d8f" }}
            />
            <Link
              href="mailto:sbtebihar@bihar.gov.in"
              color="inherit"
              underline="hover"
              sx={{
                fontSize: 15,
                color: "#1e3d8f",
                fontWeight: 500,
                "&:hover": { color: "#FFD700" },
              }}
            >
              sbtebihar@bihar.gov.in
            </Link>
          </Box>

          <Box display="flex" alignItems="center">
            <ForwardToInboxIcon
              sx={{ mr: 1, fontSize: 20, color: "#1e3d8f" }}
            />
            <Link
              href="mailto:sbte.patna@gmail.com"
              color="inherit"
              underline="hover"
              sx={{
                fontSize: 15,
                color: "#1e3d8f",
                fontWeight: 500,
                "&:hover": { color: "#FFD700" },
              }}
            >
              sbte.patna@gmail.com
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ContactUs;
