import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Google,
  Facebook,
  GitHub,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/company/login", {
        username,
        password,
      });

      if (response.data.status) {
        const token = response.data.body;
        localStorage.setItem("token", token);
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

  return (
    <Container
      maxWidth="md"
      sx={{ py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 4 }, marginBottom: 4 }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: { md: "70vh" },
          borderRadius: 6,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#043194",
            width: { xs: "100%", md: "100px" },
            height: { xs: "80px", md: "auto" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            writingMode: { xs: "horizontal-tb", md: "vertical-rl" },
            transform: { xs: "none", md: "rotate(180deg)" },
            color: "white",
            fontSize: "28px",
            fontWeight: "bold",
            borderTopLeftRadius: { xs: 8, md: 0 },
            borderTopRightRadius: { xs: 8, md: 0 },
            borderBottomRightRadius: { xs: 0, md: 14 },
            borderTopRightRadius: { xs: 0, md: 14 },
          }}
        >
          Sign In
        </Box>

        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f3f6ff",
            p: { xs: 3, sm: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderBottomLeftRadius: { xs: 8, md: 0 },
            borderBottomRightRadius: 8,
            borderTopRightRadius: { xs: 0, md: 8 },
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            Username/Email
          </Typography>

          <TextField
            fullWidth
            label="Username/Email"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 3,
              backgroundColor: "white",
              borderRadius: 6,
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
              },
            }}
          />

          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            Password
          </Typography>

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              backgroundColor: "white",
              borderRadius: 6,
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
              },
            }}
          />

          <Grid container justifyContent="space-between" sx={{ mb: 3 }}>
            <Grid item xs={12} sm={"auto"} sx={{ mb: { xs: 1, sm: 0 } }}>
              <Typography variant="body2">
                Forgot password?{" "}
                <Link
                  href="#"
                  underline="hover"
                  fontWeight="bold"
                  color="#1a0052"
                >
                  Recover
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={"auto"}>
              <Typography variant="body2">
                Not a member?
                <Button
                  variant="text"
                  onClick={() => navigate("/registrationform")}
                  sx={{ color: "#043194", fontWeight: "bold" }}
                >
                  Register
                </Button>
              </Typography>
            </Grid>
          </Grid>

          <Box
            display="flex"
            justifyContent="left"
            gap={2}
            sx={{ mb: 4, flexWrap: "wrap" }}
          >
            <IconButton
              sx={{
                backgroundColor: "white",
                p: 1.5,
                borderRadius: 2,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "scale(1.15)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Google
                sx={{
                  fontSize: "28px",
                  background: "conic-gradient(red, yellow, green, blue)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: "#000",
                p: 1.5,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.15)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                },
              }}
            >
              <GitHub sx={{ fontSize: "28px", color: "white" }} />
            </IconButton>

            <IconButton
              sx={{
                backgroundColor: "#1877F2",
                p: 1.5,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.15)",
                  boxShadow: "0 4px 12px rgba(24, 119, 242, 0.4)",
                },
              }}
            >
              <Facebook sx={{ fontSize: "28px", color: "white" }} />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              backgroundColor: "#043194",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
              py: 1.5,
              px: 4,
              width: "fit-content",
              alignSelf: "flex-end",
              "&:hover": {
                backgroundColor: "#021e5c",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
