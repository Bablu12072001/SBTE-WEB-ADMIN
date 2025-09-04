"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Faq = () => {
  const [faqsByType, setFaqsByType] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchFaqs = async () => {
      try {
        const response = await axios.get("/api/web/FAQ");
        const allFaqs = response?.data?.body || [];

        const grouped = {};
        allFaqs.forEach((faq) => {
          const type = faq.type?.toLowerCase() || "general";
          if (!grouped[type]) grouped[type] = [];
          grouped[type].push(faq);
        });

        const uniqueTypes = Object.keys(grouped);
        if (isMounted.current) {
          setFaqsByType(grouped);
          setCategories(uniqueTypes);
          setSelectedCategory(uniqueTypes[0] || "");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        if (isMounted.current) setLoading(false);
      }
    };

    fetchFaqs();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      p={2}
      gap={2}
      sx={{ marginBottom: 2 }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" width="100%">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Category Sidebar */}
          <Box sx={{ width: isMobile ? "100%" : 220, overflowX: "auto" }}>
            <Stack
              direction={isMobile ? "row" : "column"}
              spacing={1}
              sx={{ width: "100%" }}
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "contained" : "outlined"
                  }
                  sx={{
                    bgcolor:
                      selectedCategory === category ? "#90caf9" : "#e0eaff",
                    color: "#000",
                    textTransform: "capitalize",
                    borderRadius: 2,
                    height: 48,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    minWidth: isMobile ? "auto" : "100%",
                    px: 2,
                    borderWidth: 2,
                  }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setExpanded(null);
                  }}
                >
                  {category}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* FAQ List */}
          <Box flex={1}>
            {(faqsByType[selectedCategory] || []).length > 0 ? (
              faqsByType[selectedCategory].map((faq, index) => (
                <Accordion
                  key={faq.id}
                  expanded={expanded === index}
                  onChange={handleAccordionChange(index)}
                  sx={{
                    mb: 1,
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 3,
                    },
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      minHeight: 56,
                      bgcolor: expanded === index ? "#1565c0" : "#1976d2",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      borderRadius: "12px 12px 0 0",
                      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                        color: "#ffeb3b",
                      },
                    }}
                  >
                    <Typography>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#0d47a1",
                      fontSize: "1rem",
                      borderRadius: "0 0 12px 12px",
                    }}
                  >
                    <Typography mb={1}>{faq.answer}</Typography>
                    {faq.attachment && (
                      <Link
                        href={faq.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        fontSize="1rem"
                        color="primary"
                        display="block"
                        mt={1}
                      >
                        📎 View Attachment
                      </Link>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography>No FAQs available for this category.</Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Faq;
