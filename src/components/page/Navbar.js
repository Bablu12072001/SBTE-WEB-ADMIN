import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import image from "../assets/images/sbtelogo.png";
import image2 from "../assets/images/biharlogo.png";
import { Link } from "react-router-dom";
import GoogleTranslate from "../common/GoogleTranslate";
import Social from "./social";
import GlobalSearchDropdown from "./GlobalSearchDropdown";
import Chat from "./chat";

const Navbar = () => {
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [sbteAnchorEl, setSbteAnchorEl] = useState(null);
  const [studentCornerAnchorEl, setStudentCornerAnchorEl] = useState(null);
  const [documentsAnchorEl, setDocumentsAnchorEl] = useState(null);
  const [trainingAnchorEl, setTrainingAnchorEl] = useState(null);
  const [collabAnchorEl, setCollabAnchorEl] = useState(null);
  const [actsCircularsAnchorEl, setActsCircularsAnchorEl] = useState(null);
  const [afilCircularsAnchorEl, setAfilCircularsAnchorEl] = useState(null);
  const [academicsAnchorEl, setAcademicsAnchorEl] = useState(null);
  const [curriculumAnchorEl, setCurriculumAnchorEl] = useState(null);

  const [suteOpen, setSuteOpen] = useState(false);
  const [collaOpen, setCollaOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [actsCircularsOpen, setActsCircularsOpen] = useState(false);
  const [mobileStudentCornerOpen, setMobileStudentCornerOpen] = useState(false);
  const [mobileAcademicsOpen, setMobileAcademicsOpen] = useState(false);
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);

  const [currentLogo, setCurrentLogo] = useState(image);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogo((prevLogo) => (prevLogo === image ? image2 : image));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const closeAllMenus = () => {
    setSbteAnchorEl(null);
    setStudentCornerAnchorEl(null);
    setDocumentsAnchorEl(null);
    setTrainingAnchorEl(null);
    setCollabAnchorEl(null);
    setActsCircularsAnchorEl(null);
    setAfilCircularsAnchorEl(null);
    setAcademicsAnchorEl(null);
    setCurriculumAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleMenuClose = () => {
    closeAllMenus();
  };

  const handleMenuClick = (menuSetter, event) => {
    closeAllMenus();
    menuSetter(event.currentTarget);
  };

  const handleMobileMenuClick = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <>
      <Social />
      <Chat />
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            backgroundColor: "#1c44b2",
            padding: "0.4rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            color: "white",
            clipPath: "polygon(0% 0, 100% 0, 100% 100%, 1% 100%)",
            ml: { xs: 2, sm: 4, md: 8, lg: 10 },
          }}
        >
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, ml: 5 }}>
            <Button sx={{ color: "white" }} component={Link} to="/">
              Home
            </Button>
            <Button
              sx={{ color: "white" }}
              component={Link}
              to="https://sbteonline.bihar.gov.in/login"
            >
              EMS Portal
            </Button>

            <Button sx={{ color: "white" }} component={Link} to="/download">
              Download Apps
            </Button>
            <Button
              sx={{ color: "white" }}
              component={Link}
              to="https://sbteonline.bihar.gov.in/login"
            >
              Affiliation Portal
            </Button>
            <Button
              sx={{ color: "white" }}
              component={Link}
              to="https://sbtelms.bihar.gov.in/"
            >
              LMS Portal (Moodle)
            </Button>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GlobalSearchDropdown />
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* <LanguageIcon /> */}

            <GoogleTranslate />
          </Box>

          <Box sx={{ display: { xs: "block", md: "none" }, ml: "auto" }}>
            <IconButton
              edge="end"
              sx={{ color: "white" }}
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            height: { xs: 60, sm: 80, md: 100 },
            width: { xs: 60, sm: 80, md: 100 },
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 10,
            borderRadius: "50%",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 3,
          }}
          component={Link}
          to="/"
          onClick={closeAllMenus}
        >
          <img
            src={currentLogo}
            alt="Logo"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
              borderRadius: "50%",
              transition: "opacity 0.5s ease-in-out",
              padding: 5,
            }}
          />
        </Box>

        {/* Desktop Menu */}
        <Box
          sx={{
            backgroundColor: "#eeeeee",
            padding: "0.6rem 1rem",
            display: { xs: "none", md: "flex" },
            clipPath: "polygon(1% 0, 100% 0, 100% 100%, 0% 100%)",
            pl: { xs: 2, sm: 4, md: 6, lg: 10 },
            ml: { xs: 2, sm: 4, md: 8, lg: 10 },
          }}
        >
          {/* SBTE */}
          <Button
            onClick={(e) => handleMenuClick(setSbteAnchorEl, e)}
            sx={{ color: "black", fontSize: 11 }}
          >
            SBTE <ExpandMoreIcon fontSize="small" />
          </Button>
          <Menu
            anchorEl={sbteAnchorEl}
            open={Boolean(sbteAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              component={Link}
              to="/about "
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              About SBTE
            </MenuItem>
            <MenuItem
              sx={{ fontSize: 11 }}
              onClick={(e) => setAfilCircularsAnchorEl(e.currentTarget)}
            >
              Affiliated Institutes <ExpandMoreIcon fontSize="small" />
            </MenuItem>
            <Menu
              anchorEl={afilCircularsAnchorEl}
              open={Boolean(afilCircularsAnchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem
                sx={{ fontSize: 11 }}
                component={Link}
                to="/government-institute"
                onClick={handleMenuClose}
              >
                Government Institute
              </MenuItem>
              <MenuItem
                component={Link}
                to="/private-institutes"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Private Institute
              </MenuItem>
              <MenuItem
                component={Link}
                to="/autonomous-institute"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Autonomous Institute
              </MenuItem>
              <MenuItem
                component={Link}
                to="/branch-wise-intake"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Branch Wise Intake
              </MenuItem>
              <MenuItem
                component={Link}
                to="/eoa-loa"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                EOA/LOA
              </MenuItem>
            </Menu>
            <MenuItem
              component={Link}
              to="/mission"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Mission and Vision
            </MenuItem>
            <MenuItem
              component={Link}
              to="/organisation"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Organisation Structure
            </MenuItem>

            <MenuItem
              component={Link}
              to="/gallery"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Gallery
            </MenuItem>
          </Menu>

          {/* Student's Corner */}
          <Button
            onClick={(e) => handleMenuClick(setStudentCornerAnchorEl, e)}
            sx={{ color: "black", fontSize: 11 }}
          >
            Student's Corner <ExpandMoreIcon fontSize="small" />
          </Button>
          <Menu
            anchorEl={studentCornerAnchorEl}
            open={Boolean(studentCornerAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={(e) => setAcademicsAnchorEl(e.currentTarget)}
              sx={{ fontSize: 11 }}
            >
              Academics <ExpandMoreIcon fontSize="small" />
            </MenuItem>
            <Menu
              anchorEl={academicsAnchorEl}
              open={Boolean(academicsAnchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem
                component={Link}
                to="/academic-calendar"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Academic Calendar
              </MenuItem>
              <MenuItem
                component={Link}
                to="https://sbteonline.bihar.gov.in/login
"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Registration
              </MenuItem>
              <MenuItem
                component={Link}
                to="https://sbteonline.bihar.gov.in/login"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Enrollments
              </MenuItem>
              <MenuItem
                component={Link}
                to="https://sbteonline.bihar.gov.in/login"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Exam Result
              </MenuItem>
              <MenuItem
                component={Link}
                to="/e-content-virtual-labs"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                E-Content & Virtual Labs
              </MenuItem>
              <MenuItem
                component={Link}
                to="/previous-year-questions"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Previous Year Questions
              </MenuItem>
              <MenuItem
                component={Link}
                to="/question-answer-key"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Question Answer Key
              </MenuItem>
            </Menu>

            <MenuItem
              onClick={(e) => setCurriculumAnchorEl(e.currentTarget)}
              sx={{ fontSize: 11 }}
            >
              Curriculum <ExpandMoreIcon fontSize="small" />
            </MenuItem>
            <Menu
              anchorEl={curriculumAnchorEl}
              open={Boolean(curriculumAnchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem
                component={Link}
                to="/curriculum"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Curriculum
              </MenuItem>
              <MenuItem
                component={Link}
                to="/curriculum-feedback"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Curriculum Feedback
              </MenuItem>
              <MenuItem
                component={Link}
                to="/available-courses"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Available Courses
              </MenuItem>
              <MenuItem
                component={Link}
                to="/add-on-courses"
                sx={{ fontSize: 11 }}
                onClick={handleMenuClose}
              >
                Add-on Courses
              </MenuItem>
            </Menu>

            <MenuItem
              component={Link}
              to="https://www.digilocker.gov.in/web/dashboard/issuers/000607"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Digilocker
            </MenuItem>
            <MenuItem
              component={Link}
              to="/award"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Award
            </MenuItem>
          </Menu>

          {/* Documents & Downloads */}
          <Button
            onClick={(e) => handleMenuClick(setDocumentsAnchorEl, e)}
            sx={{ color: "black", fontSize: 11 }}
          >
            Documents & Downloads <ExpandMoreIcon fontSize="small" />
          </Button>
          <Menu
            anchorEl={documentsAnchorEl}
            open={Boolean(documentsAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/official-letters"
            >
              Official Letters
            </MenuItem>

            <MenuItem
              onClick={(e) => setActsCircularsAnchorEl(e.currentTarget)}
              sx={{ fontSize: 11 }}
            >
              Acts and Circulars <ExpandMoreIcon fontSize="small" />
            </MenuItem>
            <Menu
              anchorEl={actsCircularsAnchorEl}
              open={Boolean(actsCircularsAnchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem
                sx={{ fontSize: 11 }}
                component={Link}
                to="/sbtenorms-documents "
                onClick={handleMenuClose}
              >
                SBTE Norms - Documents
              </MenuItem>
              <MenuItem
                sx={{ fontSize: 11 }}
                component={Link}
                to="/dsttenorms-documents "
                onClick={handleMenuClose}
              >
                DSTTE Norms - Documents
              </MenuItem>
              {/* <MenuItem
                sx={{ fontSize: 11}}
                component={Link}
                to="/sops-usermanual"
              >
                Sops & User Manual
              </MenuItem> */}
            </Menu>
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/sops-usermanual"
              onClick={handleMenuClose}
            >
              Sops & User Manual
            </MenuItem>
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/downloads"
              onClick={handleMenuClose}
            >
              Downloads
            </MenuItem>
          </Menu>

          <Button
            component={Link}
            to="/user-portal/trainings"
            sx={{ color: "black", fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Training & Placement
          </Button>
          {/* <Menu
            anchorEl={trainingAnchorEl}
            open={Boolean(trainingAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/career"
              onClick={handleMenuClose}
            >
              Career
            </MenuItem>
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/training"
              onClick={handleMenuClose}
            >
              Training
            </MenuItem>
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/login"
              onClick={handleMenuClose}
            >
              Login
            </MenuItem>
          </Menu> */}

          <Button
            component={Link}
            to="https://alumni.sbtebihar.in/"
            sx={{ color: "black", fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Alumni
          </Button>
          <Button
            component={Link}
            to="/document-verification"
            sx={{ color: "black", fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Document Verification Status
          </Button>
          <Button
            component={Link}
            to="https://sbteweb.bihar.gov.in/grievance"
            sx={{ color: "black", fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Grievance
          </Button>
          <Button
            component={Link}
            to="/faq"
            sx={{ color: "black", fontSize: 11 }}
            onClick={handleMenuClose}
          >
            FAQ
          </Button>
          <Button
            component={Link}
            to="/external-links"
            // to="#"
            sx={{ color: "black", fontSize: 11 }}
            onClick={handleMenuClose}
          >
            External Links
          </Button>
          {/* <Button
            component={Link}
            to="/collaboration"
            sx={{ color: "black", fontSize: 11}}
            onClick={handleMenuClose}
          >
            Collaboration
          </Button> */}
          <Button
            onClick={(e) => handleMenuClick(setCollabAnchorEl, e)}
            sx={{ color: "black", fontSize: 11 }}
          >
            Collaboration <ExpandMoreIcon fontSize="small" />
          </Button>
          <Menu
            anchorEl={collabAnchorEl}
            open={Boolean(collabAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/mou-moa"
              onClick={handleMenuClose}
            >
              MOU/MOA
            </MenuItem>
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/academic"
              onClick={handleMenuClose}
            >
              Academic Partnership
            </MenuItem>
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/csr"
              onClick={handleMenuClose}
            >
              CSR /Social Impact Programs
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ display: { xs: "block", md: "none" }, width: "100%" }}
      >
        <MenuItem
          disableRipple
          sx={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* <LanguageIcon /> */}

            <GoogleTranslate />
          </Box>
        </MenuItem>

        <MenuItem
          disableRipple
          sx={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <GlobalSearchDropdown />
          </Box>
        </MenuItem>
        <MenuItem
          disableRipple
          sx={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <Button
            sx={{ color: "black" }}
            component={Link}
            to="https://sbteonline.bihar.gov.in/login"
            onClick={handleMenuClose}
          >
            Online Portal
          </Button>

          <Button
            sx={{ color: "black" }}
            component={Link}
            to="/download"
            onClick={handleMenuClose}
          >
            Download
          </Button>
          <Button
            sx={{ color: "black" }}
            component={Link}
            to="https://sbteonline.bihar.gov.in/login"
            onClick={handleMenuClose}
          >
            Affiliation Portal
          </Button>
          <Button
            sx={{ color: "black" }}
            component={Link}
            to="https://sbtelms.bihar.gov.in/"
            onClick={handleMenuClose}
          >
            LMS Portal (Moodle)
          </Button>
        </MenuItem>

        <MenuItem
          onClick={() => handleMobileMenuClick(setSuteOpen)}
          sx={{ fontSize: 11 }}
        >
          SBTE <ExpandMoreIcon fontSize="small" />
        </MenuItem>
        <Collapse in={suteOpen}>
          <MenuItem
            component={Link}
            to="/about"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            About SBTE
          </MenuItem>
          <MenuItem
            component={Link}
            to="/government-institute"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Government Institutes
          </MenuItem>
          <MenuItem
            component={Link}
            to="/private-institutes"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Private Institutes
          </MenuItem>
          <MenuItem
            component={Link}
            to="/autonomous-institute"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Autonomous Institute
          </MenuItem>
          <MenuItem
            component={Link}
            to="/branch-wise-intake"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Branch Wise Intake
          </MenuItem>
          <MenuItem
            component={Link}
            to="/eoa-loa"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            EOA/LOA
          </MenuItem>
          <MenuItem
            component={Link}
            to="/mission"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Mission and Vision
          </MenuItem>
          <MenuItem
            component={Link}
            to="/organisation"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Organisation Structure
          </MenuItem>
          <MenuItem
            component={Link}
            to="/gallery"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Gallery
          </MenuItem>
        </Collapse>

        <MenuItem
          onClick={() => handleMobileMenuClick(setMobileStudentCornerOpen)}
          sx={{ fontSize: 11 }}
        >
          Student's Corner <ExpandMoreIcon fontSize="small" />
        </MenuItem>
        <Collapse in={mobileStudentCornerOpen}>
          <MenuItem
            onClick={() => handleMobileMenuClick(setMobileAcademicsOpen)}
            sx={{ fontSize: 11 }}
          >
            Academics <ExpandMoreIcon fontSize="small" />
          </MenuItem>
          <Collapse in={mobileAcademicsOpen}>
            <MenuItem
              component={Link}
              to="/academic-calendar"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Academic Calendar
            </MenuItem>
            <MenuItem
              component={Link}
              to="https://sbteonline.bihar.gov.in/login
"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Registration
            </MenuItem>
            <MenuItem
              component={Link}
              to="https://sbteonline.bihar.gov.in/login"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Enrollments
            </MenuItem>
            <MenuItem
              component={Link}
              to="https://sbteonline.bihar.gov.in/login"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Exam Result
            </MenuItem>
            <MenuItem
              component={Link}
              to="/e-content-virtual-labs"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              E-Content & Virtual Labs
            </MenuItem>
            <MenuItem
              component={Link}
              to="/previous-year-questions"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Previous Year Questions
            </MenuItem>
            <MenuItem
              component={Link}
              to="/question-answer-key"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Question Answer Key
            </MenuItem>
          </Collapse>

          <MenuItem
            onClick={() => handleMobileMenuClick(setMobileCurriculumOpen)}
            sx={{ fontSize: 11 }}
          >
            Curriculum <ExpandMoreIcon fontSize="small" />
          </MenuItem>
          <Collapse in={mobileCurriculumOpen}>
            <MenuItem
              component={Link}
              to="/curriculum"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Curriculum
            </MenuItem>
            <MenuItem
              component={Link}
              to="/curriculum-feedback"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Curriculum Feedback
            </MenuItem>
            <MenuItem
              component={Link}
              to="/available-courses"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Available Courses
            </MenuItem>
            <MenuItem
              component={Link}
              to="/add-on-courses"
              sx={{ fontSize: 11 }}
              onClick={handleMenuClose}
            >
              Add-on Courses
            </MenuItem>
          </Collapse>

          <MenuItem
            component={Link}
            to="https://www.digilocker.gov.in/web/dashboard/issuers/000607"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Digilocker
          </MenuItem>
          <MenuItem
            component={Link}
            to="/award"
            sx={{ fontSize: 11 }}
            onClick={handleMenuClose}
          >
            Award
          </MenuItem>
        </Collapse>

        <MenuItem
          onClick={() => handleMobileMenuClick(setDocumentsOpen)}
          sx={{ fontSize: 11 }}
        >
          Documents & Downloads <ExpandMoreIcon fontSize="small" />
        </MenuItem>
        <Collapse in={documentsOpen}>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/official-letters "
            onClick={handleMenuClose}
          >
            Official Letters
          </MenuItem>
          <MenuItem
            onClick={() => handleMobileMenuClick(setActsCircularsOpen)}
            sx={{ fontSize: 11 }}
          >
            Acts and Circulars <ExpandMoreIcon fontSize="small" />
          </MenuItem>
          <Collapse in={actsCircularsOpen}>
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/sbtenorms-documents "
              onClick={handleMenuClose}
            >
              SBTE Norms - Documents
            </MenuItem>
            <MenuItem
              sx={{ fontSize: 11 }}
              component={Link}
              to="/dsttenorms-documents "
              onClick={handleMenuClose}
            >
              DSTTE Norms - Documents
            </MenuItem>
          </Collapse>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/sops-usermanual"
            onClick={handleMenuClose}
          >
            Sops & User Manual
          </MenuItem>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/downloads"
            onClick={handleMenuClose}
          >
            Downloads
          </MenuItem>
        </Collapse>

        <Button
          component={Link}
          to="/user-portal/trainings"
          sx={{ color: "black", fontSize: 11 }}
          onClick={handleMenuClose}
        >
          Training & Placement
        </Button>
        {/* <Collapse in={trainingOpen}>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/career"
            onClick={handleMenuClose}
          >
            Career
          </MenuItem>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/training"
            onClick={handleMenuClose}
          >
            Training
          </MenuItem>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/login"
            onClick={handleMenuClose}
          >
            Login
          </MenuItem>
        </Collapse> */}

        <MenuItem
          component={Link}
          to="https://alumni.sbtebihar.in/"
          sx={{ fontSize: 11 }}
          onClick={handleMenuClose}
        >
          Alumni
        </MenuItem>
        <MenuItem
          component={Link}
          to="/document-verification"
          sx={{ fontSize: 11 }}
          onClick={handleMenuClose}
        >
          Document Verification Status
        </MenuItem>
        <MenuItem
          component={Link}
          to="https://sbteweb.bihar.gov.in/grievance"
          sx={{ fontSize: 11 }}
          onClick={handleMenuClose}
        >
          Grievance
        </MenuItem>
        <MenuItem
          component={Link}
          to="/faq"
          sx={{ fontSize: 11 }}
          onClick={handleMenuClose}
        >
          FAQ
        </MenuItem>
        <MenuItem
          component={Link}
          to="/external-links"
          sx={{ fontSize: 11 }}
          onClick={handleMenuClose}
        >
          External Links
        </MenuItem>
        {/* <MenuItem
          onClick={() => handleMenuClick(setCollaOpen)}
          // to="#"
          sx={{ fontSize: 11}}
        >
          Collaboration <ExpandMoreIcon fontSize="small" />
        </MenuItem>

        <Collapse in={collaOpen}>
          <MenuItem
            sx={{ fontSize: 11}}
            component={Link}
            to="/mou-moa"
            onClick={handleMenuClose}
          >
            MOU/MOA
          </MenuItem>
          <MenuItem
            sx={{ fontSize: 11}}
            component={Link}
            to="/academic"
            onClick={handleMenuClose}
          >
            Academic Partnership
          </MenuItem>
          <MenuItem
            sx={{ fontSize: 11}}
            component={Link}
            to="/csr"
            onClick={handleMenuClose}
          >
            CSR /Social Impact Programs
          </MenuItem>
        </Collapse> */}
        <MenuItem
          onClick={() => handleMobileMenuClick(setCollaOpen)}
          sx={{ fontSize: 11 }}
        >
          Collaboration <ExpandMoreIcon fontSize="small" />
        </MenuItem>
        <Collapse in={collaOpen}>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/mou-moa"
            onClick={handleMenuClose}
          >
            MOU/MOA
          </MenuItem>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/academic"
            onClick={handleMenuClose}
          >
            Academic Partnership
          </MenuItem>
          <MenuItem
            sx={{ fontSize: 11 }}
            component={Link}
            to="/csr"
            onClick={handleMenuClose}
          >
            CSR /Social Impact Programs
          </MenuItem>
        </Collapse>
      </Menu>
    </>
  );
};

export default Navbar;
