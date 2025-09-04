"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import axios from "axios";
import LandingPage from "./pageS";

const OfficialLetter = () => {
  const [manuals, setManuals] = useState([]);

  useEffect(() => {
    const fetchManuals = async () => {
      try {
        const response = await axios.get("/api/web/usermanual");
        if (response.data.status && Array.isArray(response.data.body)) {
          setManuals(response.data.body);
        }
      } catch (error) {
        console.error("Failed to fetch user manuals:", error);
      }
    };

    fetchManuals();
  }, []);

  const isValidAttachment = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp|pdf|doc|docx|mp4|avi|mov|wmv|mkv)$/i.test(
      url
    );
  };

  return (
    <>
      <LandingPage />
      <Container maxWidth="100vh" sx={{ my: 6 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            backgroundColor: "#1a237e",
            color: "#fff",
            py: 1,
            borderRadius: "4px 4px 0 0",
          }}
        >
          SOPs & User Manual
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#0d0d3c" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Sl.No.
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Publish Date
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Name (Click to View)
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Version
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {manuals.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "white" : "#e3f2fd",
                  }}
                >
                  {console.log("this is the pdf", item.attachment)}
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.publish_date}</TableCell>
                  {/* <TableCell>{item.name}</TableCell> */}
                  <TableCell>
                    {isValidAttachment(item.attachment) ? (
                      <Link
                        href={item.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: "black", fontWeight: "500" }}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.version}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {manuals.length === 0 && (
          <Typography
            variant="body1"
            align="center"
            sx={{ mt: 3, color: "#999" }}
          >
            No user manuals found.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default OfficialLetter;
