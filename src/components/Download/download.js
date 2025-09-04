import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import image1 from "../assets/images/andraid.jpeg";
import image2 from "../assets/images/ios.jpeg";

const Download = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1e1e1e",
        minHeight: "100vh",
        p: 4,
        color: "#fff",
        marginBottom: 4,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
        Download App
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ color: "#aaa", mb: 4, fontStyle: "italic" }}
      >
        This app is for internal assessment and supports both platforms.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: "#fff",
              color: "#000",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              image={image1}
              alt="Android App"
              sx={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.75rem" }}
              >
                Android App
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download the Android version of the app.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                href="https://play.google.com/store/apps/details?id=com.sbte.bihar"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: "#fff",
              color: "#000",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              image={image2}
              alt="iOS App"
              sx={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold", fontSize: "1.75rem" }}
              >
                iOS App
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download the iOS version of the app.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                href="https://apps.apple.com/in/app/sbte-bihar/id6745698249"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 6, color: "#aaa", fontStyle: "italic" }}
      >
        For any queries regarding the app, please contact:
      </Typography>

      <Paper
        elevation={3}
        sx={{ mt: 2, maxWidth: 400, mx: "auto", p: 4, textAlign: "left" }}
      >
        <Typography variant="subtitle1">
          <strong>Name</strong>: Milind Anand
        </Typography>
        <Typography variant="subtitle1">
          <strong>Email ID</strong>: sbte.patna@gmail.com
        </Typography>
        <Typography variant="subtitle1">
          <strong>Mobile Number</strong>: +91 9031659969
        </Typography>
      </Paper>
    </Box>
  );
};

export default Download;
