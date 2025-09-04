import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import image from "../../assets/images/sbtelogo.png";
import Social from "../social";
// import FirstPage from "./firstcard";
// import SecondCard from "./secondcard";
// import Thirdcard from "./thirdcard";
// import Footers from "./Footers";

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#1D4ED8",
  fontWeight: "bold",
  borderRadius: "6px",
  padding: "4px 16px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "SBTE Home", path: "/" },
    { label: "Overview", path: "/user-portal/trainings" },
    { label: "Why Recruit", path: "/user-portal/why" },
    { label: "Secretary’s Message", path: "/user-portal/msg" },
    { label: "Recruitment Process", path: "/user-portal/recruitment-process" },
    { label: "Contact Us", path: "/user-portal/contact" },
    { label: "Placement Brochure", path: "/user-portal/brochure" },
    { label: "Career", path: "/user-portal/career" },
    { label: "Student Dashboard", path: "/user-portal/student-dashboard" },
  ];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <Social />
      <AppBar
        position="static"
        sx={{ backgroundColor: "#1D4ED8", boxShadow: "none" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={image}
                alt="SBTE Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Typography variant="h6" fontWeight="bold" color="#fff">
              SBTE BIHAR
            </Typography>
          </Box>

          {!isMobile && (
            <Stack direction="row" spacing={2}>
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  sx={{ color: "#fff", fontWeight: 400, textTransform: "none" }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}

          {!isMobile ? (
            <LoginButton
              onClick={() => navigate("/user-portal/login")}
              variant="contained"
            >
              Login
            </LoginButton>
          ) : (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List>
                    {navItems.map((item, index) => (
                      <ListItem
                        button
                        key={index}
                        onClick={() => navigate(item.path)}
                      >
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                    <ListItem
                      button
                      onClick={() => navigate("/user-portal/login")}
                    >
                      <LoginButton fullWidth>Login</LoginButton>
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* <FirstPage />
      <SecondCard />
      <Thirdcard />
      <Footers /> */}
    </>
  );
};

export default Navbar;
