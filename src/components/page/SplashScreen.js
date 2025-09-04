"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import Logo from "../assets/images/sbtelogo.png";

const SplashScreen = () => {
  return (
    <Box
      sx={{
        bgcolor: "#e8eaf6",
        color: "white",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="SBTE Logo"
        sx={{
          width: 200,
          height: 200,
          mb: 3,
          borderRadius: "50%",
          boxShadow: "0 0 30px 10px #cbdfff",
        }}
      />
      <Typography variant="h4" fontFamily="serif" color="black">
        STATE BOARD OF TECHNICAL EDUCATION
      </Typography>
      <Typography variant="subtitle1" fontFamily="sans-serif" color="black">
        SCIENCE TECHNOLOGY AND TECHNICAL EDUCATION DEPARTMENT,
        <br />
        GOVERNMENT OF BIHAR
      </Typography>
    </Box>
  );
};

export default SplashScreen;
