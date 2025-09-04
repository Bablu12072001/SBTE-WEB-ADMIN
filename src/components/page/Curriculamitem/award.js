"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import image from "../../assets/images/award.png";
import LandingPage from "./pageaward";

export default function MeritoriousAwardSection() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statePage, setStatePage] = useState(0);
  const [collegePage, setCollegePage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await axios.get("/api/web/award");
        if (res.data.status) {
          setAwards(res.data.body);
        }
      } catch (error) {
        console.error("Failed to fetch awards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  const handleOpenInNewTab = (attachment) => {
    window.open(attachment, "_blank");
  };

  const stateAwards = awards.filter((award) => award.type === "state-level");
  const collegeAwards = awards.filter(
    (award) => award.type === "college-level"
  );

  const handleStatePageChange = (event, newPage) => setStatePage(newPage);
  const handleCollegePageChange = (event, newPage) => setCollegePage(newPage);

  return (
    <>
      <LandingPage />
      <Box
        sx={{
          backgroundColor: "#eef2fd",
          minHeight: "100vh",
          px: { xs: 2, sm: 4, md: 8 },
          py: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isLargeScreen && (
          <Box
            component="img"
            src={image}
            alt="Award Illustration"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              maxWidth: 350,
              width: "100%",
              height: "auto",
              zIndex: 1,
            }}
          />
        )}

        <Grid
          container
          spacing={4}
          alignItems="flex-start"
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                borderBottom: "2px solid #3f51b5",
                mb: 3,
                fontSize: { xs: "1.6rem", sm: "2rem" },
              }}
            >
              Meritorious Students Encouragement Award
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              List of Toppers among Bihar Polytechnic Institutions.
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {/* State Level Awards */}
                {stateAwards.length > 0 && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ mt: 4, fontWeight: "bold", color: "#3f51b5" }}
                    >
                      State Level Awards
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{ my: 2, overflowX: "auto" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>SL.No</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Download</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stateAwards
                            .slice(
                              statePage * rowsPerPage,
                              statePage * rowsPerPage + rowsPerPage
                            )
                            .map((award, index) => (
                              <TableRow key={award.id}>
                                <TableCell>
                                  {statePage * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell>{award.year}</TableCell>
                                <TableCell>
                                  <Link
                                    component="button"
                                    onClick={() =>
                                      handleOpenInNewTab(award.attachment)
                                    }
                                    underline="hover"
                                  >
                                    Download
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      <TablePagination
                        component="div"
                        count={stateAwards.length}
                        page={statePage}
                        onPageChange={handleStatePageChange}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[]}
                      />
                    </TableContainer>
                  </>
                )}

                {/* College Level Awards */}
                {collegeAwards.length > 0 && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ mt: 4, fontWeight: "bold", color: "#3f51b5" }}
                    >
                      College Level Awards
                    </Typography>
                    <TableContainer
                      component={Paper}
                      sx={{ my: 2, overflowX: "auto" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>SL.No</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Download</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {collegeAwards
                            .slice(
                              collegePage * rowsPerPage,
                              collegePage * rowsPerPage + rowsPerPage
                            )
                            .map((award, index) => (
                              <TableRow key={award.id}>
                                <TableCell>
                                  {collegePage * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell>{award.year}</TableCell>
                                <TableCell>
                                  <Link
                                    component="button"
                                    onClick={() =>
                                      handleOpenInNewTab(award.attachment)
                                    }
                                    underline="hover"
                                  >
                                    Download
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      <TablePagination
                        component="div"
                        count={collegeAwards.length}
                        page={collegePage}
                        onPageChange={handleCollegePageChange}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[]}
                      />
                    </TableContainer>
                  </>
                )}

                {stateAwards.length === 0 && collegeAwards.length === 0 && (
                  <Typography>No awards found.</Typography>
                )}
              </>
            )}
          </Grid>

          {/* Bottom image for small screens */}
          {!isLargeScreen && (
            <Grid item xs={12}>
              <Box
                component="img"
                src={image}
                alt="Award Illustration"
                sx={{
                  width: "100%",
                  maxHeight: 350,
                  objectFit: "contain",
                  mt: 2,
                }}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
