"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Container,
} from "@mui/material";
import LandingPage from "./dsttepage";
import axios from "axios";

export default function DstteNorms() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("/api/web/act_circular/DSTTE Norms");
        if (response.data.status && Array.isArray(response.data.body)) {
          setAnnouncements(response.data.body);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <>
      <LandingPage />
      <Container
        maxWidth="md"
        sx={{
          textAlign: "left",
          py: 6,
          paddingLeft: 4,
          marginLeft: 0,
        }}
      >
        <Box sx={{ paddingLeft: 2, marginLeft: 0 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#043194" }}
          >
            DSTTE <span style={{ color: "#00bcd4" }}> Norms-Documents</span>
          </Typography>
          <Box
            sx={{
              width: 100,
              height: 3,
              backgroundColor: "#043194",
              mt: 1,
              mb: 3,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              paddingLeft: 2,
              marginLeft: 0,
              marginTop: 2,
            }}
          >
            Various documents related to Acts, Circulars, or Notifications are
            listed below:
          </Typography>

          {announcements.length > 0 ? (
            <List sx={{ paddingLeft: 2, marginLeft: 0 }}>
              {announcements.map((item, index) => (
                <ListItem
                  key={item.id || index}
                  sx={{
                    paddingLeft: 0,
                    marginLeft: 0,
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{ paddingLeft: 0, marginLeft: 0 }}
                      >
                        <strong>{index + 1}. </strong>
                        <Link
                          href={item.attachment}
                          underline="hover"
                          target="_blank"
                          rel="noopener noreferrer"
                          color="inherit"
                        >
                          {item.title || "No Title"}
                        </Link>
                      </Typography>
                    }
                    sx={{
                      paddingLeft: 0,
                      marginLeft: 0,
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ color: "#999", paddingLeft: 2 }}>
              No announcements found.
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
