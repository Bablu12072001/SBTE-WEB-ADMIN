import React, { useState } from "react";
import {
  Card,
  Box,
  Typography,
  CardMedia,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import img1 from "../assets/images/sumit-kumar.jpg";
import img2 from "../assets/images/Dr (Ms.) Pratima Satish Kumar Verma.jpg";
import img3 from "../assets/images/Mr._Ahmad_Mahmood.jpg";
import img4 from "../assets/images/Chandra-shekhar-Singh.jpg";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const peopleData = [
  {
    image: img1,
    name: "Shri Sumit Kumar Singh",
    title: "Hon’ble Minister",
    department:
      "Science , Technology and Technical Education Department,\nGovernment of Bihar",
  },
  {
    image: img2,
    name: "Dr. Pratima",
    title: "Secretary",
    department:
      "Science ,Technology and Technical Education Department,\nGovernment of Bihar",
  },
  {
    image: img3,
    name: "Mr Ahmed Mahmood",
    title: "Director",
    department:
      "Science ,Technology and Technical Education Department,\nGovernment of Bihar",
  },
  {
    image: img4,
    name: "Dr Chandra Shekhar Singh",
    title: "Secretary",
    department:
      "State Board of Technical Education , Bihar\nGovernment of Bihar",
  },
];

const ProfileCards = () => {
  const isTouch = useMediaQuery("(hover: none) and (pointer: coarse)");
  const [activeCard, setActiveCard] = useState(null);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {peopleData.map((person, index) => {
          const isActive = isTouch && activeCard === index;

          return (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: 8,
              }}
              onClick={() => {
                if (isTouch) {
                  setActiveCard(activeCard === index ? null : index);
                }
              }}
            >
              <MotionCard
                whileHover={!isTouch ? "hover" : undefined}
                animate={isActive ? "hover" : "rest"}
                initial="rest"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.02 },
                }}
                transition={{ duration: 0.4 }}
                sx={{
                  width: 280,
                  height: 350,
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: 6,
                  backgroundColor: "#f0f0f0",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image Box */}
                <MotionBox
                  variants={{
                    rest: { height: "90%", y: 0 },
                    hover: { height: "50%", y: -5 },
                  }}
                  transition={{ duration: 0.4 }}
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={person.image}
                    alt={person.name}
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </MotionBox>

                {/* Name Box (Always visible) */}
                <Box
                  sx={{
                    textAlign: "center",
                    py: 1,
                    px: 2,
                    height: "10%",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {person.name}
                  </Typography>
                </Box>

                {/* Hover Detail Box */}
                <MotionBox
                  variants={{
                    rest: { opacity: 0, height: 0 },
                    hover: { opacity: 1, height: "50%" },
                  }}
                  transition={{ duration: 0.4 }}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: "#0b1e3d",
                    color: "#fff",
                    textAlign: "center",
                    overflow: "hidden",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center", // center content horizontally
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {person.name}
                  </Typography>
                  {person.title && (
                    <Typography variant="body2" fontWeight="bold">
                      {person.title}
                    </Typography>
                  )}
                  {person.department && (
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", mt: 0.5 }}
                    >
                      {person.department.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </Typography>
                  )}
                </MotionBox>
              </MotionCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProfileCards;
