import React, { useState, useEffect } from "react";
import axios from "axios";

function VisitorCounter() {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const fetchVisitCount = async () => {
      try {
        const response = await axios.get(
          "https://sbte.bihar.gov.in/api/web/visitor"
        );
        if (
          response.data &&
          response.data.status === true &&
          response.data.body &&
          typeof response.data.body.total_count === "number"
        ) {
          return response.data.body.total_count;
        } else {
          console.error("Unexpected GET response format:", response.data);
          return 0;
        }
      } catch (error) {
        console.error("Error fetching visit count:", error);
        return 0;
      }
    };

    const incrementVisitCount = async () => {
      try {
        await axios.post("https://sbte.bihar.gov.in/api/web/visitor", {
          count: 1,
        });
        console.log("Visitor count incremented.");
      } catch (error) {
        console.error(
          "Error incrementing visit count:",
          error.response?.data || error
        );
      }
    };

    const handleVisitorCount = async () => {
      const hasVisited = localStorage.getItem("hasVisitedSBTE");

      if (!hasVisited) {
        // New user (first time on this browser)
        await incrementVisitCount();
        localStorage.setItem("hasVisitedSBTE", "true");
      }

      // Always fetch current count to display
      const currentCount = await fetchVisitCount();
      setVisitCount(currentCount);
    };

    handleVisitorCount();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "10px 15px",
        borderRadius: "15px",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        width: "fit-content",
        margin: "5px auto",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      👀 Visitors: {visitCount}
    </div>
  );
}

export default VisitorCounter;
