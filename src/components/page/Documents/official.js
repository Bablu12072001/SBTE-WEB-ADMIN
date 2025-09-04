import React, { useEffect, useState } from "react";
import axios from "axios";
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
  CircularProgress,
} from "@mui/material";
import LandingPage from "./pageO";

const OfficialLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get("/api/web/official_letter");
        if (response.data.status) {
          setLetters(response.data.body);
        }
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching letters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  const isImage = (url) => /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(url);
  const isPDF = (url) => /\.pdf$/i.test(url);

  const handleOpenAttachment = (url) => {
    if (isImage(url) || isPDF(url)) {
      window.open(url, "_blank");
    } else {
      alert("Unsupported file type");
    }
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
          Official Letters
        </Typography>

        {loading ? (
          <Typography align="center" sx={{ my: 4 }}>
            <CircularProgress />
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ boxShadow: 6, border: "1px solid #ccc" }}>
              <TableHead sx={{ backgroundColor: "#0d0d3c" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      border: "1px solid #ccc",
                    }}
                  >
                    Sl.No.
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      minWidth: 120,
                      whiteSpace: "nowrap",
                      border: "1px solid #ccc",
                    }}
                  >
                    Publish Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      minWidth: 160,
                      whiteSpace: "nowrap",
                      border: "1px solid #ccc",
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      border: "1px solid #ccc",
                    }}
                  >
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {letters.map((letter, index) => (
                  <TableRow
                    key={letter.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "white" : "#e3f2fd",
                    }}
                  >
                    <TableCell
                      sx={{ border: "1px solid #ccc", color: "#1a0dab" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", color: "#1a0dab" }}
                    >
                      {letter.date}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#1a0dab",
                          fontSize: "0.85rem",
                          marginBottom: 1,
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenAttachment(letter.attachment)}
                      >
                        {letter.title.charAt(0).toUpperCase() +
                          letter.title.slice(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#1a0dab",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenAttachment(letter.attachment)}
                      >
                        {letter.description}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default OfficialLetters;
