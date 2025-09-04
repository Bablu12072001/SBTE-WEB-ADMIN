import React from "react";
import { Box, Typography, Link } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CallIcon from "@mui/icons-material/Call";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";

const ContactUs = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f7fd", py: 4, px: { xs: 2, md: 10 } }}>
      {/* Title */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "#1e3d8f",
            borderBottom: "1px solid #1e3d8f",
            display: "inline-block",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          Contact Us
        </Typography>
      </Box>

      {/* Contact Details */}
      <Box sx={{ mt: 3 }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: "bold",
            mb: 1,
            borderBottom: "2px solid #1e3d8f",
            display: "inline-block",
            pb: 0.5,
            color: "#1e3d8f",
          }}
        >
          State Board of Technical Education
        </Typography>

        <Typography sx={{ fontSize: 14, lineHeight: 1.8 }}>
          <ApartmentIcon
            sx={{ mr: 1, fontSize: 18, verticalAlign: "middle" }}
          />
          4th Floor, Technology Bhawan,
          <br />
          Vishweshariya Bhawan Campus,
          <br />
          Bailey Road Patna, Bihar
          <br />
          PIN - 800015, India
        </Typography>

        {/* Contact Info */}
        <Box sx={{ mt: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <CallIcon sx={{ mr: 1, fontSize: 18 }} />
            <Link
              href="tel:18002020305"
              color="inherit"
              underline="hover"
              sx={{ "&:hover": { color: "#FFD700" } }}
            >
              Toll Free Number: 18002020305
            </Link>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <CallIcon sx={{ mr: 1, fontSize: 18 }} />
            <Link
              href="tel:+916122547532"
              color="inherit"
              underline="hover"
              sx={{ "&:hover": { color: "#FFD700" } }}
            >
              +91 - (0612)-2547532
            </Link>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <ForwardToInboxIcon sx={{ mr: 1, fontSize: 18 }} />
            <Link
              href="mailto:sbtebihar@bihar.gov.in"
              color="inherit"
              underline="hover"
              sx={{ "&:hover": { color: "#FFD700" } }}
            >
              sbtebihar@bihar.gov.in
            </Link>
          </Box>

          <Box display="flex" alignItems="center">
            <ForwardToInboxIcon sx={{ mr: 1, fontSize: 18 }} />
            <Link
              href="mailto:sbte.patna@gmail.com"
              color="inherit"
              underline="hover"
              sx={{ "&:hover": { color: "#FFD700" } }}
            >
              sbte.patna@gmail.com
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUs;
