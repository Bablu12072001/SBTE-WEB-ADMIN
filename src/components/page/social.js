import { Box } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

import { FaTumblr } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function Social() {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        padding: "17px",
        borderRadius: "0px",
        transition: "all 0.35s ease-in-out 0s",
        position: "fixed",
        top: "15%", // Adjust the vertical position
        right: "0px",
        textAlign: "center",
        zIndex: 9999,

        // Media Query for smaller screens
        "@media (max-width: 768px)": {
          top: "40%", // Adjust the vertical position for smaller screens
        },
      }}
    >
      <div
        sx={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <a
          href="https://www.facebook.com/sbtebiharpatna/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#3b5998",
          }}
        >
          <FacebookIcon
            sx={{
              fontSize: {
                xs: "24px", // extra-small screens
                sm: "30px", // small screens
                md: "36px", // medium screens
                lg: "35px", // large screens
                xl: "40px", // extra-large screens
              },
            }}
          />
        </a>
        <a
          href="https://x.com/sbtebiharpatna/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#1DA1F2",
          }}
        >
          <XIcon
            sx={{
              fontSize: {
                xs: "24px", // extra-small screens
                sm: "30px", // small screens
                md: "36px", // medium screens
                lg: "35px", // large screens
                xl: "40px", // extra-large screens
              },
            }}
          />
        </a>
        <a
          href="https://www.linkedin.com/company/state-board-of-technical-education-bihar-patna/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#0077B5",
          }}
        >
          <LinkedInIcon
            sx={{
              fontSize: {
                xs: "24px", // extra-small screens
                sm: "30px", // small screens
                md: "36px", // medium screens
                lg: "35px", // large screens
                xl: "40px", // extra-large screens
              },
            }}
          />
        </a>
        <a
          href="https://www.tumblr.com/sbtebiharpatna/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#0077B5",
          }}
        >
          {/* <LinkedInIcon
            sx={{
              fontSize: {
                xs: "24px", // extra-small screens
                sm: "30px", // small screens
                md: "36px", // medium screens
                lg: "35px", // large screens
                xl: "40px", // extra-large screens
              },
            }}
          /> */}

          <Box
            sx={{
              fontSize: {
                xs: "24px",
                sm: "32px",
                md: "38px",
              },
            }}
          >
            <FaTumblr />
          </Box>

          {/* <FontAwesomeIcon icon={faTumblr} size="2x" color="#34526f" /> */}
        </a>
        <a
          href="https://www.instagram.com/sbtebiharpatna/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#0077B5",
          }}
        >
          <InstagramIcon
            sx={{
              fontSize: {
                xs: "24px", // extra-small screens
                sm: "30px", // small screens
                md: "36px", // medium screens
                lg: "35px", // large screens
                xl: "40px", // extra-large screens
              },
            }}
          />
        </a>
        <a
          href="https://whatsapp.com/channel/0029Vb652QOA2pLEXPzVHX2o"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#0077B5",
          }}
        >
          <WhatsAppIcon
            sx={{
              fontSize: {
                xs: "24px", // extra-small screens
                sm: "30px", // small screens
                md: "36px", // medium screens
                lg: "35px", // large screens
                xl: "40px", // extra-large screens
              },
            }}
          />
        </a>
        <a
          href="https://www.threads.com/@sbtebiharpatna"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#0077B5",
          }}
        >
          <Box
            sx={{
              fontSize: {
                xs: "24px",
                sm: "32px",
                md: "38px",
              },
            }}
          >
            <SiThreads />
          </Box>
        </a>
        <a
          href="https://www.youtube.com/@sbtebiharpatna"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#0077B5",
          }}
        >
          <YouTubeIcon
            sx={{
              fontSize: {
                xs: "24px", // extra-small screens
                sm: "30px", // small screens
                md: "36px", // medium screens
                lg: "35px", // large screens
                xl: "40px", // extra-large screens
              },
            }}
          />
        </a>
      </div>
    </Box>
  );
}
