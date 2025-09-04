"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import axios from "axios";

const AdvertisementScroll = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [announcements, setAnnouncements] = useState([]);

  const icons = ["📢", "🚨", "📰", "🔔", "✅", "🚀", "📣"];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("/api/web/news");
        if (res.data.status && Array.isArray(res.data.body)) {
          setAnnouncements(res.data.body);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([]);
      }
    };

    fetchAnnouncements();
  }, []);

  const isValidURL = (url) => {
    try {
      return Boolean(new URL(url));
    } catch {
      return false;
    }
  };

  const getFileExtension = (url = "") => {
    return url.split(".").pop()?.toLowerCase();
  };

  const renderScrollContent = () => {
    if (!announcements.length) {
      return (
        <Typography
          sx={{
            fontSize: isSmallScreen ? "0.9rem" : "1.1rem",
            color: "white",
            mx: 2,
          }}
        >
          ⚠️ No announcements available.
        </Typography>
      );
    }

    return (
      <>
        {Array(2)
          .fill(null)
          .map((_, repeatIndex) => (
            <Box key={repeatIndex} sx={{ display: "inline-flex" }}>
              {announcements.map((item, index) => {
                const title =
                  item.title.charAt(0).toUpperCase() + item.title.slice(1);
                const displayText = `${icons[index % icons.length]} ${title}`;
                const link = item.attachment;
                const isLink = isValidURL(link);
                const ext = getFileExtension(link);

                const isPDF =
                  ext === "pdf" ||
                  title.toLowerCase().includes(".pdf") ||
                  link?.toLowerCase().includes(".pdf");

                if (isLink || isPDF) {
                  return (
                    <a
                      key={`${repeatIndex}-${index}`}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="announcement-link"
                      style={{
                        color: "white",
                        margin: "0 16px",
                        fontSize: isSmallScreen ? "0.9rem" : "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      {displayText}
                    </a>
                  );
                } else {
                  return (
                    <Typography
                      key={`${repeatIndex}-${index}`}
                      sx={{
                        color: "white",
                        margin: "0 16px",
                        fontSize: isSmallScreen ? "0.9rem" : "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayText}
                    </Typography>
                  );
                }
              })}
            </Box>
          ))}
      </>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#043194",
        borderTop: "4px solid #00bcd4",
        borderBottom: "4px solid #00bcd4",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <CampaignIcon
        sx={{
          color: "red",
          fontSize: isSmallScreen ? 30 : 40,
          mx: 1.5,
        }}
      />

      <Box
        className="scroll-container"
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        <Box className="scroll-content">{renderScrollContent()}</Box>
      </Box>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .scroll-container:hover .scroll-content {
          animation-play-state: paused;
        }

        .scroll-content {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }

        .announcement-link {
          text-decoration: none;
          transition: text-decoration 0.3s ease;
        }

        .announcement-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </Box>
  );
};

export default AdvertisementScroll;
