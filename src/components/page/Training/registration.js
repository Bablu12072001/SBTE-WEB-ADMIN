import React, { useState } from "react";
import {
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Button,
  Box,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function RegistrationForm() {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const init = {
    contact_person_name: "",
    username: "",
    email: "",
    phone_number: "",
    company_name: "",
    company_registration_number: "",
    company_phone_number: "",
    company_official_website: "",
    company_email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  };

  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerMessage("");
  };

  const handleDigit = (e) => {
    const { name, value } = e.target;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirm = () => setShowConfirm((prev) => !prev);

  const validate = () => {
    const errs = {};
    Object.entries(form).forEach(([k, v]) => {
      if (!v && k !== "confirmPassword") errs[k] = "Required";
    });
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords must match";
    ["phone_number", "company_phone_number"].forEach((k) => {
      if (form[k] && !/^[0-9]{10}$/.test(form[k]))
        errs[k] = "Enter a 10-digit number";
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const payload = { ...form };
    delete payload.confirmPassword;

    try {
      const res = await axios.post("/api/company/registration", payload);
      localStorage.setItem("authToken", res.data.token);
      setForm(init);
      setOpenSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.body ||
        err.response?.data?.message ||
        "Error occurred";
      setServerMessage(msg);
      setOpenError(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          py: 6,
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: "1100px",
            margin: "0 auto",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: 4,
            p: { xs: 3, sm: 6 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 4,
              fontWeight: "bold",
              color: "#043194",
            }}
          >
            Company Registration Form
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {serverMessage && (
                <Grid item xs={12}>
                  <Alert severity="error">{serverMessage}</Alert>
                </Grid>
              )}

              {[
                ["contact_person_name", "Contact Person Name"],
                ["username", "Username"],
                ["email", "Email"],
                ["company_name", "Company Name"],
                ["company_registration_number", "Company Reg. No."],
                ["company_official_website", "Company Website"],
                ["company_email", "Company Email"],
              ].map(([name, label]) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    label={label}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors[name]}
                    helperText={errors[name]}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              ))}

              {["phone_number", "company_phone_number"].map((name) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    label={
                      name === "phone_number"
                        ? "Phone Number"
                        : "Company Phone Number"
                    }
                    name={name}
                    value={form[name]}
                    onChange={handleDigit}
                    type="tel"
                    fullWidth
                    required
                    error={!!errors[name]}
                    helperText={errors[name]}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              ))}

              {[
                ["password", "Password", showPassword, toggleShowPassword],
                [
                  "confirmPassword",
                  "Confirm Password",
                  showConfirm,
                  toggleShowConfirm,
                ],
              ].map(([name, label, visible, toggleFn]) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    label={label}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    type={visible ? "text" : "password"}
                    fullWidth
                    required
                    error={!!errors[name]}
                    helperText={errors[name]}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleFn} edge="end">
                            {visible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.gender}>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="Prefer not to say"
                      control={<Radio />}
                      label="Prefer not to say"
                    />
                  </RadioGroup>
                  {errors.gender && (
                    <Typography variant="caption" color="error">
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={{
                    backgroundColor: "#043194",
                    color: "#fff",
                    px: 6,
                    py: 1.5,
                    fontWeight: "bold",
                    fontSize: "16px",
                    borderRadius: 3,
                    ":hover": {
                      backgroundColor: "#032973",
                    },
                  }}
                >
                  REGISTER
                </Button>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center", mt: 1 }}>
                <Typography>
                  Already Registered?{" "}
                  <Button
                    variant="text"
                    onClick={() => navigate("/user-portal/login")}
                    sx={{ color: "#043194", fontWeight: "bold" }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>

      {/* Error Dialog */}
      <Dialog
        open={openError}
        onClose={() => setOpenError(false)}
        PaperProps={{ sx: { borderRadius: 4, boxShadow: 12 } }}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent dividers>
          <Typography>{serverMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenError(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={openSuccess}
        TransitionComponent={Transition}
        onClose={() => {}}
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: 12,
            "& .MuiDialogTitle-root": {
              bgcolor: "primary.main",
              color: "white",
            },
          },
        }}
      >
        <DialogTitle>🎉 Registration Submitted</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Thank you for registering on the SBTE Career Portal.
            <br />
            Your details have been submitted for admin approval.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Continue to Login
          </Button>
          <IconButton onClick={() => navigate("/login")}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
