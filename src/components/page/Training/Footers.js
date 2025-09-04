import React from "react";
import { Box, Grid, Typography, Button, Link, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CallIcon from "@mui/icons-material/Call";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import logo from "../../assets/images/sbtelogo.png";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        bgcolor: "#1E43B1",
        color: "white",
        pt: 5,
        pb: 3,
        px: { xs: 3, md: 8 },
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        {/* Left Section - Logo & Info */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Box
              component="img"
              src={logo}
              alt="SBTE Logo"
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid white",
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ fontSize: 18 }}
              >
                OFFICIAL RECRUITMENT WEBSITE FOR SBTE BIHAR
              </Typography>
              <Typography variant="caption" display="block">
                SCIENCE TECHNOLOGY AND TECHNICAL EDUCATION DEPARTMENT
              </Typography>
              <Typography variant="caption" display="block">
                GOVERNMENT OF BIHAR
              </Typography>
            </Box>
          </Box>

          {/* Address Section */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: "bold",
                mb: 1,
                borderBottom: "2px solid #fff",
                display: "inline-block",
                pb: 0.5,
              }}
            >
              State Board of Technical Education
            </Typography>
            <Typography sx={{ fontSize: 14, lineHeight: 1.8 }}>
              <ApartmentIcon sx={{ mr: 1, fontSize: 18 }} />
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
        </Grid>

        {/* Quick Links Section */}
        <Grid item xs={12} md={4}>
          <Typography
            fontWeight="bold"
            fontSize="16px"
            mb={1}
            sx={{
              borderBottom: "2px solid white",
              display: "inline-block",
              pb: 0.5,
            }}
          >
            Quick Links / Resources
          </Typography>
          <Box display="flex" flexDirection="column" gap={0.5} mt={1}>
            {[
              {
                label: "Placement Statistics",
                path: "/user-portal/placement-statistics",
              },
              { label: "Procedure", path: "/user-portal/procedure" },
              { label: "Our Achievement", path: "/user-portal/achievement" },
              {
                label: "Success Stories",
                path: "/user-portal/success-stories",
              },
            ].map((link, index) => (
              <Button
                key={index}
                onClick={() => handleNavigation(link.path)}
                sx={{
                  color: "white",
                  textAlign: "left",
                  fontSize: "14px",
                  justifyContent: "flex-start",
                  textTransform: "none",
                  "&:hover": {
                    color: "#FFD700",
                    pl: 1,
                    transition: "0.3s",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", my: 3 }} />

      {/* Bottom Footer Text */}
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          opacity: 0.8,
          fontSize: 13,
        }}
      >
        © {new Date().getFullYear()} State Board of Technical Education, Bihar.
        All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
