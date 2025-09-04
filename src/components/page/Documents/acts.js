"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Link } from "@mui/material";
import LandingPage from "./pageact";
import axios from "axios";

export default function SbteNormsFull() {
  const [semesterSystem, setSemesterSystem] = useState([]);
  const [nonSemesterSystem, setNonSemesterSystem] = useState([]);

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const response = await axios.get("/api/web/norms");

        if (response.data.status && Array.isArray(response.data.body)) {
          const semester = response.data.body
            .filter((item) => item.type === "Semester System")
            .map((item) => ({
              ...item,
              attachment: item.attachement || "",
              norms: item.norms || {},
            }));

          const nonSemester = response.data.body
            .filter((item) => item.type === "Non-Semester System")
            .map((item) => ({
              ...item,
              attachment: item.attachement || "",
              norms: item.norms || {},
            }));

          setSemesterSystem(semester);
          setNonSemesterSystem(nonSemester);
        }
      } catch (error) {
        console.error("Failed to fetch circulars:", error);
      }
    };

    fetchCirculars();
  }, []);

  const renderList = (data) => (
    <ol style={{ paddingLeft: "1.5rem", color: "#2c3e50" }}>
      {data.map((item, index) => {
        const attachmentUrl = item.attachment || null;
        const firstNormLink = item.norms?.link?.[0] || null;
        const linkToOpen = attachmentUrl || firstNormLink;

        return (
          <li key={item.id || index} style={{ marginBottom: "1rem" }}>
            {linkToOpen ? (
              <Link
                href={linkToOpen}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              >
                {item.title || "Untitled Document"}
              </Link>
            ) : (
              <Typography variant="body1" fontWeight="bold">
                {item.title || "Untitled Document"}
              </Typography>
            )}

            {/* Show all norms if attachment is not present */}
            {!item.attachment &&
              Array.isArray(item.norms?.link) &&
              Array.isArray(item.norms?.norm) &&
              item.norms.link.map(
                (linkItem, i) =>
                  linkItem && (
                    <Typography key={i} variant="body2">
                      <Link
                        href={linkItem}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        🔗 {item.norms.norm[i] || `Norm ${i + 1}`}
                      </Link>
                    </Typography>
                  )
              )}
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <LandingPage />
      <Box sx={{ p: { xs: 2, md: 6 }, backgroundColor: "#fffaf3" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#043194" }}>
          SBTE <span style={{ color: "#00bcd4" }}>Norms</span>
        </Typography>
        <Box
          sx={{
            width: 80,
            height: 3,
            backgroundColor: "#043194",
            mt: 1,
            mb: 3,
          }}
        />
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Various documents related to Acts, Circulars, or Notifications are
          listed below:
        </Typography>

        {/* Semester System Section */}
        {semesterSystem.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{ mt: 4, mb: 1, fontWeight: "bold", color: "#0d47a1" }}
            >
              Semester System
            </Typography>
            {renderList(semesterSystem)}
          </>
        )}

        {/* Non-Semester System Section */}
        {nonSemesterSystem.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{ mt: 4, mb: 1, fontWeight: "bold", color: "#0d47a1" }}
            >
              Non-Semester System
            </Typography>
            {renderList(nonSemesterSystem)}
          </>
        )}

        {/* Empty State */}
        {semesterSystem.length === 0 && nonSemesterSystem.length === 0 && (
          <Typography variant="body1" sx={{ color: "#999" }}>
            No documents found.
          </Typography>
        )}
      </Box>
    </>
  );
}
