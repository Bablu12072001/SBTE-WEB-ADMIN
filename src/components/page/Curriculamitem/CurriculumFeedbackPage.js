"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const CurriculumFeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    designation: "",
    email: "",
    institute: "",
    branch: "",
    subject: "",
    topic: "",
    feedback: "",
  });

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchFeedbackList = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/web/curriculam_feedback");
      if (res.data.status && Array.isArray(res.data.body)) {
        setFeedbackList(res.data.body);
      }
    } catch (err) {
      console.error("Error fetching feedback", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackList();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/admin/curriculam_feedback", formData);
      if (res.data.status) {
        setSuccess("Feedback submitted successfully.");
        setFormData({
          name: "",
          phone_number: "",
          designation: "",
          email: "",
          institute: "",
          branch: "",
          subject: "",
          topic: "",
          feedback: "",
        });
        fetchFeedbackList();
      } else {
        setError("Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      setError("Error submitting feedback.");
    }
  };

  return (
    <Box sx={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Feedback Form */}
      <Box p={3}>
        <Typography
          variant="h5"
          align="center"
          sx={{
            background: "linear-gradient(90deg, #1a1a5c, #0099cc)",
            color: "#fff",
            p: 2,
            borderRadius: 2,
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Curriculum Feedback Form
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "#f9f9f9",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          <Grid container spacing={2}>
            {[
              { label: "Name", name: "name" },
              { label: "Phone Number", name: "phone_number" },
              { label: "Designation", name: "designation" },
              { label: "Email", name: "email", type: "email" },
              { label: "Institute", name: "institute" },
              { label: "Branch", name: "branch" },
              { label: "Subject", name: "subject" },
              { label: "Topic", name: "topic" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  type={field.type || "text"}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg, #1a1a5c, #0099cc)",
                  color: "#fff",
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: "25px",
                  mt: 2,
                }}
              >
                Submit Feedback
              </Button>
            </Grid>
          </Grid>

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>

      {/* Feedback Carousel */}
      <Box
        sx={{
          py: 6,
          background: "linear-gradient(to right, #e0f7fa, #e3f2fd)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          mb={4}
          sx={{ fontFamily: "Poppins" }}
        >
          Feedback
        </Typography>

        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : feedbackList.length === 0 ? (
          <Typography align="center" color="textSecondary">
            No feedback entries available.
          </Typography>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop
          >
            {Array.from({
              length: Math.ceil(feedbackList.length / (isMobile ? 1 : 2)),
            }).map((_, slideIndex) => (
              <SwiperSlide key={slideIndex}>
                <Box display="flex" justifyContent="center">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 4,
                      justifyContent: "center",
                      width: "100%",
                      maxWidth: 1300,
                      px: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }, // Responsive horizontal padding
                      py: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, // Responsive vertical padding
                    }}
                  >
                    {feedbackList
                      .slice(
                        slideIndex * (isMobile ? 1 : 2),
                        slideIndex * (isMobile ? 1 : 2) + (isMobile ? 1 : 2)
                      )
                      .map((item, idx) => (
                        <Paper
                          key={idx}
                          elevation={6}
                          sx={{
                            flex: 1,
                            minWidth: 280,
                            p: 3,
                            borderRadius: 4,
                            backgroundColor: "#ffffff",
                            transition: "transform 0.3s",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Avatar sx={{ bgcolor: "#1976d2" }}>
                              {item.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold">
                                {item.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.designation}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: 16,
                              color: "#444",
                              fontStyle: "italic",
                              mt: 1,
                            }}
                          >
                            “{item.feedback}”
                          </Typography>
                        </Paper>
                      ))}
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    </Box>
  );
};

export default CurriculumFeedbackPage;
