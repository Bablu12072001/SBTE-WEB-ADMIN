"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
  Box,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import LandingPage from "./pageD";

function HeadlinesTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await axios.get("/api/web/downloads");
        if (response.data.status) {
          setDocuments(response.data.body);
        } else {
          setError("Failed to fetch documents");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  return (
    <>
      <LandingPage />
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            backgroundColor: "#1a237e",
            color: "white",
            p: 2,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          Downloads
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2, textAlign: "center" }}>
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 0.6 }}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#0d0d3c",
                    borderTop: "4px solid white",
                  }}
                >
                  <TableCell
                    sx={{
                      border: "2px solid grey",
                      color: "white",
                      fontWeight: "bold",
                      width: "10%",
                    }}
                  >
                    Sl. No
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid grey",
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: 2,
                    }}
                  >
                    Different documents related to SBTE which can be downloaded
                    are listed below
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc, index) => (
                  <TableRow
                    key={doc.id}
                    sx={{
                      color: "#043194",
                      backgroundColor: index % 2 === 0 ? "white" : "#e3f2fd",
                    }}
                  >
                    <TableCell sx={{ border: "1px solid grey", p: 1 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid grey", p: 1 }}>
                      <Link
                        href={doc.attachment}
                        target="_blank"
                        rel="noopener"
                        underline="hover"
                        sx={{
                          fontSize: isMobile ? "0.85rem" : "1rem",
                          display: "block",
                          wordBreak: "break-word",
                          color: "#121858",
                        }}
                      >
                        {doc.title}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}

export default HeadlinesTable;
