import React from "react";
import { Box, Typography, Link, useTheme } from "@mui/material";
import logo from "../assets/images/logobihar.jpg";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CallIcon from "@mui/icons-material/Call";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { useNavigate } from "react-router-dom";
import Count from "./count";

function Footer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const links = [
    { label: "LMS Moodle", href: "https://sbtelms.bihar.gov.in/" },
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Official Letters", href: "/official-letters" },
    {
      label: "DigiLocker",
      href: "https://www.digilocker.gov.in/web/dashboard/issuers/000607",
    },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const handleClick = (href) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener");
    } else {
      navigate(href);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#043194", color: "white" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",

          px: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            paddingBottom: 8,
            display: "flex",
            justifyContent: "center",
            position: "relative",
            paddingRight: 4,
            paddingLeft: 4,
          }}
        >
          <Box
            sx={{
              top: "-40px",
              position: "relative",
              backgroundColor: "white",
              padding: 1,
              borderRadius: 1,
              boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "0px",
                left: "-40px",
                width: 0,
                height: 0,
                bottom: "-4px",
                borderLeft: "40px solid transparent",
                // borderRight: '40px solid transparent',
                borderBottom: "40px solid #3f51b5 ",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                top: "0px",
                right: "-40px",
                width: 0,
                height: 0,
                // borderLeft: '40px solid transparent',
                borderRight: "40px solid transparent",
                borderBottom: "40px solid #3f51b5",
              }}
            />
            <Box
              component="img"
              src={logo}
              alt="Board Logo"
              sx={{
                marginTop: 6,
                width: 160,
                height: "auto",
                objectFit: "contain",
                display: "block",
                mx: "auto",
              }}
            />
          </Box>
        </Box>
        {/* Address and Contact Info */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" },
            textAlign: "justify",
            paddingRight: 2,
            py: 2,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: "bold", mb: 1 }}>
            State Board of Technical Education
          </Typography>
          <Typography>
            <ApartmentIcon /> 4th Floor, Technology Bhawan,
            <br />
            Vishweshariya Bhawan Campus,
            <br />
            Bailey Road Patna, Bihar
            <br />
            PIN - 800015, India
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <CallIcon sx={{ mr: 1 }} />
              <Link href="tel:18002020305" color="inherit" underline="hover">
                Toll Free Number: 18002020305
              </Link>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <CallIcon sx={{ mr: 1 }} />
              <Link href="tel:+916122547532" color="inherit" underline="hover">
                +91 - (0612)-2547532
              </Link>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <ForwardToInboxIcon sx={{ mr: 1 }} />
              <Link
                href="mailto:sbtebihar@bihar.gov.in"
                color="inherit"
                underline="hover"
              >
                sbtebihar@bihar.gov.in
              </Link>
            </Box>
            <Box display="flex" alignItems="center">
              <ForwardToInboxIcon sx={{ mr: 1 }} />
              <Link
                href="mailto:sbte.patna@gmail.com"
                color="inherit"
                underline="hover"
              >
                sbte.patna@gmail.com
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Useful Links */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" },
            textAlign: "justify",
            paddingLeft: 4,
            py: 2,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: "bold", mb: 1 }}>
            Useful Links
          </Typography>
          {links.map((item, idx) => (
            <Box
              key={idx}
              mb={1}
              sx={{
                cursor: "pointer",
                color: "inherit",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => handleClick(item.href)}
            >
              {item.label}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 100%", md: "1 1 30%" },
            textAlign: "justify",
            py: 2,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: "bold", mb: 1 }}>
            Reach us
          </Typography>
          <Box sx={{ mt: 1 }}>
            <iframe
              title="SBTE Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7195.909128899094!2d85.114835!3d25.606426!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed57bfeddeaa53%3A0x5e3d170e46cbf64a!2sState%20Board%20of%20Technical%20Education!5e0!3m2!1sen!2sin!4v1746083036757!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Box>
      </Box>

      {/* Bottom Footer */}
      <Box sx={{ bgcolor: "#00bcd4", color: "white", py: 3 }}>
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="body2"
            sx={{ flex: 1, fontSize: "0.9rem", fontWeight: 400 }}
          >
            © All rights reserved.{" "}
            <Box component="span" sx={{ color: "yellow", fontWeight: "bold" }}>
              SBTE
            </Box>{" "}
            (State Board of Technical Education, Bihar)
          </Typography>

          <Typography
            variant="body2"
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "right" },
              fontSize: "0.9rem",
              fontWeight: 400,
            }}
          >
            <Box component="span" sx={{ fontWeight: "bold" }}>
              SBTE
            </Box>
          </Typography>

          <Box sx={{ mt: { xs: 1, md: 0 } }}>
            <Count />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
