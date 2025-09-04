import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import backgroundImageUrl from "../../../assets/images/bg1.jpg";
import image1 from "../../../assets/images/sbtelogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // recruiter states
  const [recruiterUsername, setRecruiterUsername] = useState("");
  const [recruiterPassword, setRecruiterPassword] = useState("");

  // student states
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setError("");
    setRecruiterUsername("");
    setRecruiterPassword("");
    setStudentEmail("");
    setStudentPassword("");
  };

  // Recruiter Login
  const handleRecruiterLogin = async () => {
    if (!recruiterUsername || !recruiterPassword) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/company/login", {
        username: recruiterUsername,
        password: recruiterPassword,
      });

      if (response.data.status) {
        const token = response.data.body;
        localStorage.setItem("token", token);
        localStorage.setItem("role", "recruiter");
        setError("");
        navigate("/alljobs");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
    setLoading(false);
  };

  // Student Login
  const handleStudentLogin = async () => {
    if (!studentEmail || !studentPassword) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://sbte-api.anantdrishti.com/user/login",
        {
          email: studentEmail,
          password: studentPassword,
        }
      );

      if (response.data) {
        const studentData = response.data;
        localStorage.setItem("studentData", JSON.stringify(studentData));
        localStorage.setItem("token", studentData.token);
        localStorage.setItem("role", "student");
        setError("");
        navigate("/user-portal/student-dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
    setLoading(false);
  };

  return (
    <Grid container sx={{ minHeight: "70vh", flexWrap: "wrap" }}>
      {/* Left Panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          width: { xs: "100%", md: "50%" },
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff",
          position: "relative",
          px: 12,
          py: 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box>
            <Typography
              sx={{
                mt: 1,
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              SBTE BIHAR Placements
            </Typography>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: 1,
                fontFamily: "Roboto, sans-serif",
              }}
            >
              One stop portal for placements <br /> & internships
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src={image1}
              alt="SBTE Logo"
              sx={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                backgroundColor: "white",
                p: 1,
                boxShadow: 3,
              }}
            />
          </Box>

          <Typography
            variant="body2"
            color="white"
            sx={{
              textAlign: "left",
              fontSize: "18px",
              fontFamily: "Roboto, sans-serif",
              mb: 1,
            }}
          >
            <strong>Instructions:</strong> <br />
            Login using your institute roll number or email.
          </Typography>
        </Box>
      </Grid>

      {/* Right Panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          width: { xs: "100%", md: "50%" },
          bgcolor: "#e3f2fd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 5, width: "100%", maxWidth: 520 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="Student" />
            <Tab label="Recruiter" />
          </Tabs>

          {/* Student Login */}
          {tab === 0 && (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* <Typography
                variant="body2"
                color="primary"
                textAlign="right"
                sx={{
                  mb: 3,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot Password?
              </Typography> */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleStudentLogin}
                disabled={loading}
                sx={{
                  backgroundColor: "#1976d2",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  py: 1.4,
                  fontSize: "1rem",
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(25, 118, 210, 0.3)",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#115293",
                    boxShadow: "0px 6px 14px rgba(17, 82, 147, 0.4)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </Button>
            </>
          )}

          {/* Recruiter Login */}
          {tab === 1 && (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Username or Email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={recruiterUsername}
                onChange={(e) => setRecruiterUsername(e.target.value)}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={recruiterPassword}
                onChange={(e) => setRecruiterPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Grid container justifyContent="space-between" sx={{ mb: 3 }}>
                {/* <Grid item>
                  <Typography variant="body2" color="primary">
                    Forgot Password?
                  </Typography>
                </Grid> */}
                <Grid item>
                  <Typography variant="body2">
                    Not a member?{" "}
                    <Link
                      component="button"
                      underline="hover"
                      fontWeight="bold"
                      color="#1976d2"
                      onClick={() => navigate("/registrationform")}
                    >
                      Register
                    </Link>
                  </Typography>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                fullWidth
                onClick={handleRecruiterLogin}
                disabled={loading}
                sx={{
                  backgroundColor: "#1976d2",
                  fontWeight: "bold",
                  py: 1.3,
                  fontSize: "1rem",
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Login"
                )}
              </Button>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
