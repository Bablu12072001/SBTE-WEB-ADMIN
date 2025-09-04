/* global google */
import React, { useEffect, useState } from "react";
import LanguageIcon from "@mui/icons-material/Language";
import { IconButton, Box } from "@mui/material";

const GoogleTranslate = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Inject Google Translate script once
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setLoaded(true);
      };

      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        justifyContent: { xs: "center", sm: "flex-start" },
        p: 1,
      }}
    >
      {/* Custom Language Icon */}
      <IconButton
        size="medium"
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#e3f2fd",
          borderRadius: "50%",
          color: "#1976d2",
          "&:hover": {
            backgroundColor: "#bbdefb",
          },
        }}
      >
        <LanguageIcon />
      </IconButton>

      {/* Google Translate Dropdown (visible everywhere) */}
      <Box
        id="google_translate_element"
        sx={{
          display: "flex",
          alignItems: "center",
          maxWidth: "100%",
          overflowX: "auto",
          fontSize: "14px",
        }}
      />
    </Box>
  );
};

export default GoogleTranslate;
