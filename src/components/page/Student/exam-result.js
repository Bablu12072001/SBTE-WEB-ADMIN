import React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    useMediaQuery,
    Container,
    IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "@mui/material/styles";
import LandingPage from "./pageexam";

const notices = [
    " Lorem ipsum dolor sit amet consectetur adipisicing elit. doloribus repellat, corporis minima ducimus fugiat saepe accusamus laborum nemo minus!",
    " Lorem ipsum dolor sit amet consectetur adipisicing elit. doloribus repellat, corporis minima ducimus fugiat saepe accusamus laborum nemo minus!",
    " Lorem ipsum dolor sit amet consectetur adipisicing elit. doloribus repellat, corporis minima ducimus fugiat saepe accusamus laborum nemo minus!",
    " Lorem ipsum dolor sit amet consectetur adipisicing elit. doloribus repellat, corporis minima ducimus fugiat saepe accusamus laborum nemo minus!",
];

export default function SBTEResultUI() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            <LandingPage />
            <Box>
                <Grid container sx={{ py: 6 }}>
                    <Grid
                        item
                        xs={12}
                        md={7}
                        sx={{
                            p: { xs: 2, md: 4 },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Container maxWidth="sm">
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                <span style={{ color: "#1A237E" }}>SBTE WELCOMES </span>
                                <span style={{ color: "#00ACC1" }}>YOU</span>
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ mt: 2, fontSize: "1.2rem", color: "#424242" }}
                            >
                                The State Board of Technical Education (SBTE), Patna, Bihar, is
                                responsible for evaluation and certification of six-semester Diploma
                                Courses of all the Polytechnic Institutions affiliated to the SBTE Bihar.
                                It has been constituted vide govt. order no. 75/Dir dated 31st May, 1955
                                under the Science, Technology and Technical Education Department,
                                Government of Bihar.
                            </Typography>
                        </Container>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                            backgroundColor: "#263A8B",
                            color: "white",
                            p: { xs: 2, md: 4 },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6" align="center" gutterBottom>
                            EXAM Held -Feb-2025, Semester -I / II , III & V, Result are now available
                            for download.
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: "white",
                                mt: 4,
                                mb: 2,
                                p: 1,
                                borderRadius: 1,
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Enter Roll Number"
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{ px: 2 }}
                            />
                        </Paper>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#00BCD4",
                                color: "white",
                                width: "60%",
                                p: 1.5,
                            }}
                            endIcon={<DownloadIcon />}
                        >
                            Download
                        </Button>
                    </Grid>
                </Grid>


                <Grid container>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        order={{ xs: 1, md: 1 }}
                        sx={{
                            backgroundColor: "#1A2C6B",
                            color: "white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 3,
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Notice
                        </Typography>
                        <Paper
                            elevation={6}
                            sx={{
                                width: "100%",
                                maxWidth: 700,
                                height: 500,
                                backgroundColor: "white",
                                color: "red",
                                p: 3,
                                borderRadius: 2,
                                overflowY: "auto",
                                boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                boxSizing: "border-box",
                            }}
                        >
                            {notices.length > 0 ? (
                                notices.map((text, i) => (
                                    <Box key={i} sx={{ width: "100%" }}>
                                        <Typography
                                            component="a"
                                            href="#"
                                            sx={{
                                                paddingBottom: 2,
                                                display: "block",
                                                textAlign: "center",
                                                textDecoration: "underline",
                                                mb: 4,
                                                color: "red",
                                                fontSize: "18px",
                                            }}
                                        >
                                            {text}
                                        </Typography>
                                        {i < notices.length - 1 && (
                                            <hr style={{ borderTop: "1.5px dotted grey" }} />
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{ color: "red", textAlign: "center" }}
                                >
                                    No notices available.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        order={{ xs: 2, md: 2 }}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            px: { xs: 2, sm: 4, md: 10 }, // Responsive horizontal padding
                            py: { xs: 4, md: 6 },         // Optional: vertical padding
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" sx={{ color: "#2E2E2E", mb: 4 }}>
                            Login
                        </Typography>

                        <Box sx={{ width: "100%", maxWidth: 600 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                User Id
                            </Typography>
                            <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />

                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Password
                            </Typography>
                            <TextField fullWidth type="password" variant="outlined" sx={{ mb: 2 }} />

                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Captcha
                            </Typography>

                            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Grid item xs={7}>
                                    <TextField fullWidth variant="outlined" />
                                </Grid>
                                <Grid
                                    item
                                    xs={3}
                                    sx={{
                                        backgroundColor: "#f2f2f2",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                        height: 56,
                                    }}
                                >
                                    SDFA32GS
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton
                                        onClick={() => console.log("Refresh clicked")}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: "#fff",
                                            borderRadius: "50%",
                                            border: "1px solid #ccc",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: 0,
                                        }}
                                    >
                                        <RefreshIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: "#00BCD4", color: "white", p: 1.5 }}
                            >
                                Login
                            </Button>

                            <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                    mt: 3,
                                    px: { xs: 0, md: 4 },
                                    textAlign: "center",
                                }}
                            >
                                <Grid item xs={12} sm={"auto"}>
                                    <Typography
                                        component="a"
                                        href="#"
                                        sx={{ textDecoration: "underline", color: "#2E2E2E" }}
                                    >
                                        Register Student
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={"auto"}>
                                    <Typography
                                        component="a"
                                        href="#"
                                        sx={{ textDecoration: "underline", color: "#2E2E2E" }}
                                    >
                                        Register New Institute
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={"auto"}>
                                    <Typography
                                        component="a"
                                        href="#"
                                        sx={{ textDecoration: "underline", color: "#2E2E2E" }}
                                    >
                                        Forgot Password
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                </Grid>
            </Box>
        </>
    );
}
