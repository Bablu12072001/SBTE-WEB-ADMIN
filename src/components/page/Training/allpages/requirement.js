// RecruitmentProcess.jsx
import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";

const RecruitmentProcess = () => {
  // Recruitment Steps Data
  const steps = [
    "Communication with T&P Cell – Companies share their recruitment needs, job profiles, and eligibility criteria with the SBTE Training & Placement Cell.",
    "Company Login Profile for uploading their Job Vacancy, or Admin may also post the job details on the career section.",
    "A link will be shared to all interested polytechnic students for the placement drive.",
    "Student details will be shared to the concerned company HR. Eligible candidates are identified based on academic performance, technical skills, and other specified criteria.",
    "Pre-Placement Talk – Recruiters interact with shortlisted candidates to explain job roles, growth opportunities, and expectations.",
    "Recruitment Rounds – Selection process may include (as applicable):\n• Written/Online Test\n• Technical Interview\n• HR Interview\n• Trade Test (if applicable)",
    "Final Selection & Offer Letter – Selected candidates receive offer letters, and joining formalities are coordinated through the T&P Cell.",
    "Feedback & Future Collaboration – Recruiters provide feedback to improve training outcomes and sustain long-term industry–institute partnership.",
  ];

  return (
    <Box sx={{ bgcolor: "#f5f7ff", py: 5, px: 3 }}>
      {/* Title */}
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#0047ab", fontWeight: 600, mb: 1 }}
      >
        Recruitment Process
      </Typography>
      <Typography align="center" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
        Our process has evolved over the years to ensure that recruiters have a
        seamless hiring experience. Here are the simplified steps for you.
      </Typography>

      {/* Steps in Single Column */}
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {steps.map((step, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              borderLeft: "6px solid #0047ab",
              transition: "0.3s",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              {/* Step Number */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#f0f0f0",
                  borderRadius: 1,
                  textAlign: "center",
                  lineHeight: "40px",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </Box>

              {/* Step Text */}
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  whiteSpace: "pre-line", // preserves bullet points & new lines
                }}
              >
                {step}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default RecruitmentProcess;
