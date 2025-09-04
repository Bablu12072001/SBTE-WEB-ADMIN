import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
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

const OfficialLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get("/api/web/study_material");
        if (response.data.status) {
          const body = response.data.body;
          // Wrap in array if it's a single object
          const formattedData = Array.isArray(body) ? body : [body];
          setLetters(formattedData);
        }
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
      window.open(url, "_blank"); // Just open all links
    }
  };

  return (
    <Box sx={{ margin: 5 }}>
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
        Study Material
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
                    minWidth: 200,
                    border: "1px solid #ccc",
                  }}
                >
                  Material Link
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    minWidth: 160,
                    border: "1px solid #ccc",
                  }}
                >
                  Publish Date
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
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1a0dab",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenAttachment(letter.link)}
                    >
                      {letter.link}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.85rem", color: "#1a0dab" }}
                    >
                      {new Date(letter.updated_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OfficialLetters;
