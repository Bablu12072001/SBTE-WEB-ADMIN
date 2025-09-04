import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Typography,
  Modal,
  IconButton,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const VideoGallery = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const cardWidth = isSm ? "100%" : "calc(25% - 16px)";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/web/multimedia");
        if (response.data.status && Array.isArray(response.data.data)) {
          setVideos(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching video gallery:", error);
      }
    };

    fetchVideos();
  }, []);

  const getYoutubeEmbedUrl = (yt_link) => {
    let videoId = yt_link;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = yt_link.match(regex);
    if (match && match[1]) videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="xl">
        <Typography variant="h6" mb={3} fontWeight="bold" textAlign="left">
          Video Gallery
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: isSm ? "center" : "flex-start",
          }}
        >
          {videos.map((item, index) => (
            <Card
              key={item.id || index}
              onClick={() => setSelectedVideo(item.yt_link)}
              sx={{
                flex: `0 0 ${cardWidth}`,
                borderRadius: 3,
                boxShadow: 4,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 8,
                },
              }}
            >
              <CardMedia
                component="img"
                image={item.thumb_image || "/static/images/default.jpg"}
                alt={item.title || `Video ${index + 1}`}
                sx={{ width: "100%", height: 180, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ mt: 0.5 }}
                >
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Modal
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          bgcolor: "rgba(0,0,0,0.7)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "90%", sm: "70%", md: "60%" },
            maxWidth: 900,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            outline: "none",
          }}
        >
          <IconButton
            onClick={() => setSelectedVideo(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.500",
              zIndex: 10,
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          {selectedVideo && (
            <iframe
              width="100%"
              height="480"
              src={getYoutubeEmbedUrl(selectedVideo)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: "8px" }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default VideoGallery;
