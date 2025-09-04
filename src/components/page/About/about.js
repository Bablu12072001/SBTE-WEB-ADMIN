import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
// import backgroundImage from "../assets/images/bg.jpeg";
import Page from "./page";

const ImageScrollGallery = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    axios
      .get("/api/web/about")
      .then((res) => {
        if (res.data.status) {
          setAboutData(res.data.body);
        }
      })
      .catch((err) => {
        console.error("Error fetching About data:", err);
      });
  }, []);

  if (!aboutData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      {" "}
      <Page />
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          height: isSmallScreen ? "auto" : "100vh",
          overflow: "hidden",
          backgroundColor: "#e8eaf6",
          px: 2,
          py: 4,
        }}
      >
        {/* Left Text Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: isSmallScreen ? "center" : "flex-start",
            zIndex: 1,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "700px",
              height: "100%",
              padding: isSmallScreen ? 2 : 8,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                sx={{
                  color: "blue",
                  fontSize: isSmallScreen ? "1.3rem" : "1.6rem",
                  lineHeight: 1.2,
                  mb: 2,
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                {aboutData.title}{" "}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography
                sx={{
                  color: "black",
                  fontSize: isSmallScreen ? "1.2rem" : "1.6rem",
                  lineHeight: 1.2,
                  mb: 2,
                  textAlign: "justify",
                  fontWeight: "bold",
                }}
              >
                State Board of Technical Education Bihar
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Typography
                sx={{
                  fontSize: isSmallScreen ? "1rem" : "1.2rem",
                  lineHeight: 1.6,
                  textAlign: "justify",
                  color: "#333",
                }}
              >
                {aboutData.descriptions}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  href={aboutData.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    backgroundColor: "#043194",
                    textTransform: "capitalize",
                  }}
                >
                  Watch Video
                </Button>

                {/* <Button
                variant="outlined"
                href="#"
                sx={{
                  color: "#043194",
                  textTransform: "capitalize",
                  borderColor: "#043194",
                }}
              >
                Read More
              </Button> */}
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Right Image Section */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            width: "100%",
            mt: isSmallScreen ? 4 : 0,
            height: isSmallScreen ? "300px" : "100%",
          }}
        >
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 60,
                left: { xs: 45, sm: 110 },
                right: { xs: 40, sm: 94 },
                bottom: { xs: 100, sm: 250 },
                borderTopLeftRadius: "60px",
                // backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "top right",
                backgroundRepeat: "no-repeat",
                zIndex: 1,
                width: "auto",
                height: { xs: "170px", sm: "400px" },
              }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 300, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Box
              sx={{
                position: "relative",
                height: { xs: "170px", sm: "400px" },
                width: "90%",
                margin: "10% 5%",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={aboutData?.image_link}
                alt="First Image"
                sx={{
                  width: "80%",
                  height: { xs: "170px", sm: "400px" },
                  objectFit: "cover",
                  borderBottomRightRadius: "81px",
                  border: "4px solid #ffc107",
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </Box>
    </>
  );
};

export default ImageScrollGallery;
