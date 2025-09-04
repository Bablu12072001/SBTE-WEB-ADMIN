// src/components/PlacementDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  InputLabel,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PlacementDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState("");
  const [cardData, setCardData] = useState(null);
  const [placementRateData, setPlacementRateData] = useState([]);
  const [companiesVisitedData, setCompaniesVisitedData] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (session) {
      fetchPlacementFilterData(session);
    }
  }, [session]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("/api/web/placement_session");
      if (res.data.status) {
        const sessionList = res.data.body.map((s) => s.session);
        setSessions(sessionList);
        setSession(sessionList[0]); // default selection
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const fetchPlacementFilterData = async (selectedSession) => {
    try {
      const res = await axios.get("/api/web/placement_filter", {
        params: { session: selectedSession },
      });
      if (res.data.status) {
        const body = res.data.body;

        const placementData = body.placement_data?.[0];
        const placementStatics = body.placement_statics?.[0];

        // Summary cards
        if (placementData) {
          setCardData({
            placement_rate: placementData.placement_rate || 0,
            company_visited: placementData.company_visited || 0,
            NSP: placementData.NSP || 0,
            male: placementData.male || 0,
            female: placementData.female || 0,
          });
        } else {
          setCardData(null);
        }

        // Placement rate chart
        const placementRate =
          placementStatics?.placement_rate?.map((item, index) => ({
            branch: item.Branch,
            total: item.TNS,
            placed: item.TSP,
            id: index,
          })) || [];

        // Companies visited chart
        const companies =
          placementStatics?.company_visited?.map((item, index) => ({
            company: item["Company Name"],
            highest: parseFloat(item["Highest Package"]),
            lowest: parseFloat(item["Lowest Package"]),
            hired: parseInt(item["Total Student Hire"]),
            id: index,
          })) || [];

        setPlacementRateData(placementRate);
        setCompaniesVisitedData(companies);
      }
    } catch (err) {
      console.error("Error fetching placement filter data:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        p: 3,
        background: "#f5f6fa",
        minHeight: "100vh",
        gap: 3,
      }}
    >
      {/* Sidebar */}
      <Card sx={{ width: 300 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              backgroundColor: "#2e1ad2",
              color: "#fff",
              p: 1,
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            PLACEMENT DASHBOARD
          </Typography>

          {/* Session Filter */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Session</InputLabel>
            <Select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              label="Session"
            >
              {sessions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Main Dashboard */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Placement Statistics ({session})
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {cardData ? (
            [
              { label: "Placement Rate", value: cardData.placement_rate },
              { label: "Companies Visited", value: cardData.company_visited },
              { label: "No of Student Placed (NSP)", value: cardData.NSP },
              { label: "Male Students", value: cardData.male },
              { label: "Female Students", value: cardData.female },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    borderTop: "5px solid #2e1ad2",
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ m: 2 }}>Loading data...</Typography>
          )}
        </Grid>

        {/* Placement Rate Chart */}
        <Card sx={{ p: 2, mb: 4, backgroundColor: "#eef0ff" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Placement Rate by Branch
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={placementRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#64b5f6" name="Total Students" />
              <Bar dataKey="placed" fill="#4caf50" name="Placed Students" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Companies Visited Chart */}
        <Card sx={{ p: 2, mb: 4, backgroundColor: "#eef0ff" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Companies Visited
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={companiesVisitedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="company"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="hired"
                stroke="#1976d2"
                name="Students Hired"
              />
              <Line
                type="monotone"
                dataKey="highest"
                stroke="#4caf50"
                name="Highest Package (LPA)"
              />
              <Line
                type="monotone"
                dataKey="lowest"
                stroke="#f44336"
                name="Lowest Package (LPA)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Box>
  );
};

export default PlacementDashboard;
