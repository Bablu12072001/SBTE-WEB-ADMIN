import React from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import img1 from "../../../assets/images/uniform.jpeg";
import img2 from "../../../assets/images/uniform.jpeg";
import img3 from "../../../assets/images/uniform.jpeg";
import img4 from "../../../assets/images/uniform.jpeg";
// Add more image imports as needed

const managers = [
    {
        name: "Ahmad Mahmood",
        role: "Placement Manager for MTech & IDC programs",
        phone: "+91-9876543210",
        email: "ahmad.mahmood@example.com",
        image: img1,
    },
    {
        name: "Ravi Sharma",
        role: "Placement Manager for BTech programs",
        phone: "+91-9123456780",
        email: "ravi.sharma@example.com",
        image: img2,
    },
    {
        name: "Neha Verma",
        role: "Placement Manager for MBA programs",
        phone: "+91-9988776655",
        email: "neha.verma@example.com",
        image: img3,
    },
    // {
    //     name: "Karan Mehta",
    //     role: "Placement Manager for PhD programs",
    //     phone: "+91-9345612345",
    //     email: "karan.mehta@example.com",
    //     image: img4,
    // },
    // {
    //     name: "Priya Singh",
    //     role: "Assistant Manager - Internships",
    //     phone: "+91-9812312345",
    //     email: "priya.singh@example.com",
    //     image: img2,
    // },
    // {
    //     name: "Ankit Joshi",
    //     role: "Corporate Relations Manager",
    //     phone: "+91-9090909090",
    //     email: "ankit.joshi@example.com",
    //     image: img3,
    // },
    // {
    //     name: "Shruti Agarwal",
    //     role: "Placement Coordinator",
    //     phone: "+91-9012121212",
    //     email: "shruti.agarwal@example.com",
    //     image: img1,
    // },
    // {
    //     name: "Deepak Reddy",
    //     role: "Industry Liaison Officer",
    //     phone: "+91-9000000000",
    //     email: "deepak.reddy@example.com",
    //     image: img4,
    // },
];

export default function PlacementManagers() {
    return (
        <Box sx={{ padding: 4, backgroundColor: "#f7f9fb", minHeight: "80vh" }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, marginLeft: 8 }}>
                Administrative Staff
            </Typography>
            <Grid container spacing={3}>
                {managers.map((manager, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box sx={{ position: "relative", width: 340, mx: "auto" }}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    height: 300,
                                    width: 320,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    src={manager.image}
                                    height="120"
                                    alt={manager.name}
                                    sx={{ height: 200, width: 340, objectFit: "contain" }}
                                />
                                <CardContent
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography fontWeight="bold" fontSize={13}>
                                            {manager.name}
                                        </Typography>
                                        <Typography variant="body2" fontSize={11} color="text.secondary">
                                            {manager.role}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        gap={1}
                                        mt={1}
                                        sx={{
                                            flexWrap: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 140,
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#e3f2fd",
                                                px: 1,
                                                py: 0.4,
                                                borderRadius: "20px",
                                                fontSize: "0.7rem",
                                                fontWeight: 500,
                                                whiteSpace: "nowrap",
                                                "&:hover": {
                                                    backgroundColor: "#bbdefb",
                                                    cursor: "pointer",
                                                },
                                            }}
                                        >
                                            <PhoneIcon sx={{ fontSize: 10 }} />
                                            {manager.phone}
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 180,
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#e3f2fd",
                                                px: 1,
                                                py: 0.4,
                                                borderRadius: "20px",
                                                fontSize: "0.7rem",
                                                fontWeight: 500,
                                                whiteSpace: "nowrap",
                                                "&:hover": {
                                                    backgroundColor: "#bbdefb",
                                                    cursor: "pointer",
                                                },
                                            }}
                                        >
                                            <EmailIcon sx={{ fontSize: 10 }} />
                                            {manager.email}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 26,
                                    backgroundColor: "#fff",
                                    boxShadow: 1,
                                    padding: "4px",
                                }}
                                aria-label="external link"
                            >
                                <ArrowOutwardIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
