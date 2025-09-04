import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ marginBottom: 6 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          mt: 4,
          textDecoration: "underline",
          color: " #121858",
          fontWeight: "bold",
        }}
      >
        PRIVACY POLICY FOR "SBTE EMS"
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Typography sx={{ fontStyle: "italic" }}>
          This Privacy Policy describes how "State Board of Technical Education,
          Bihar" ("we," "us," or "our") collects, uses, and safeguards your
          personal information when you use our mobile application "SBTE EMS"
          (the "App"). By downloading, installing, or using the App, you consent
          to the practices outlined in this Privacy Policy.
        </Typography>
      </Paper>

      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textDecoration: "underline",
          textDecorationColor: "#043194",
          textDecorationThickness: "3px",
          textUnderlineOffset: "6px",
          marginBottom: 2,
        }}
      >
        1. INFORMATION WE COLLECT
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        1.1. User-Provided Information:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <List>
          <ListItem>
            <ListItemText primary="Name" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email address" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Phone number" />
          </ListItem>
          <ListItem>
            <ListItemText primary="User-generated content (such as comments or reviews)" />
          </ListItem>
        </List>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>
        1.2. Automatically Collected Information:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
        <List>
          <ListItem>
            <ListItemText primary="Device information (e.g., device type, operating system version)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="App usage data (e.g., interactions, pages visited)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="IP address" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Unique device identifiers" />
          </ListItem>
        </List>
      </Paper>

      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textDecoration: "underline",
          textDecorationColor: "#043194",
          textDecorationThickness: "3px",
          textUnderlineOffset: "6px",
          marginBottom: 2,
        }}
      >
        2. HOW WE USE YOUR INFORMATION
      </Typography>
      <List sx={{ mb: 4 }}>
        <ListItem>
          <ListItemText primary="2.1. Providing Services: We use your information to provide and enhance our App's functionality, respond to your inquiries, and improve user experience." />
        </ListItem>
        <ListItem>
          <ListItemText primary="2.2. Analytics: We may use your information for analytics purposes to understand how users interact with the App and to make improvements." />
        </ListItem>
        <ListItem>
          <ListItemText primary="2.3. Communication: We may use your contact information to send you important updates, notifications, or marketing communications, with your consent." />
        </ListItem>
      </List>

      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textDecoration: "underline",
          textDecorationColor: "#043194",
          textDecorationThickness: "3px",
          textUnderlineOffset: "6px",
          marginBottom: 2,
        }}
      >
        3. DISCLOSURE OF YOUR INFORMATION
      </Typography>
      <Typography sx={{ mb: 2 }}>
        We do not sell or rent your personal information to third parties.
        However, we may share your information in the following situations:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="3.1. Service Providers: We may engage third-party service providers to assist in App development, maintenance, and other related services. These providers may have access to your information, but they are obligated to protect it in accordance with this Privacy Policy." />
        </ListItem>
        <ListItem>
          <ListItemText primary=" 3.2. Legal Compliance: We may disclose your information when required by law, such as in response to legal processes, court orders, or government requests." />
        </ListItem>
      </List>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textDecoration: "underline",
          textDecorationColor: "#043194",
          textDecorationThickness: "3px",
          textUnderlineOffset: "6px",
          marginBottom: 2,
        }}
      >
        4. Security
      </Typography>
      <Typography>
        {" "}
        We employ reasonable security measures to protect your personal
        information from unauthorized access, disclosure, alteration, or
        destruction. However, please be aware that no method of transmission
        over the internet or method of electronic storage is entirely secure.
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textDecoration: "underline",
          textDecorationColor: "#043194",
          textDecorationThickness: "3px",
          textUnderlineOffset: "6px",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        5. Your Choices
      </Typography>
      <Typography sx={{ mb: 2 }}>
        You have choices regarding your personal information:{" "}
      </Typography>
      <ListItem>
        <ListItemText primary="5.1. Access and Correction: You can request access to and correction of your personal information by contacting us at" />
      </ListItem>
      <Box sx={{ marginLeft: 2 }}>
        <Typography sx={{ fontWeight: "bold" }}>
          State Board of Technical Education
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          4th Floor, Technology Bhawan,
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Vishweshariya Bhawan Campus,
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Bailey Road Patna, Bihar
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>PIN - 800015, India</Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Email: sbte.patna@gmail.com
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Phone: +91 - (0612)-2547532 / +91 99347 20425
        </Typography>
      </Box>
      <ListItem>
        <ListItemText primary="5.1. Access and Correction: You can request access to and correction of your personal information by contacting us at" />
      </ListItem>

      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textDecoration: "underline",
          textDecorationColor: "#043194",
          textDecorationThickness: "3px",
          textUnderlineOffset: "6px",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        6. Changes to this Privacy Policy
      </Typography>
      <Typography>
        We may update this Privacy Policy to reflect changes in our practices or
        for other operational, legal, or regulatory reasons. We will notify you
        of any material changes by updating the Privacy Policy within the App.
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textDecoration: "underline",
          textDecorationColor: "#043194",
          textDecorationThickness: "3px",
          textUnderlineOffset: "6px",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        7. Contact Us
      </Typography>
      <Typography>
        If you have questions, concerns, or requests related to this Privacy
        Policy or your personal information, please contact us at
      </Typography>
      <Box sx={{ marginLeft: 2, marginTop: 2 }}>
        <Typography sx={{ fontWeight: "bold" }}>
          State Board of Technical Education
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          4th Floor, Technology Bhawan,
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Vishweshariya Bhawan Campus,
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Bailey Road Patna, Bihar
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>PIN - 800015, India</Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Email: sbte.patna@gmail.com
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Phone: +91 - (0612)-2547532 / +91 99347 20425
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
