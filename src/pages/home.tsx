"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { ReactTyped } from "react-typed";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

// Example images (replace with your own or use Cloudinary links)
const heroImage = "https://images.pexels.com/photos/4145197/pexels-photo-4145197.jpeg";
const featureImages = [
  "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg",
  "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
  "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg",
];

const features = [
  {
    title: "User Management",
    description: "Register, log in, and manage user profiles with unique roles (admin, student).",
    img: featureImages[0],
  },
  {
    title: "Course & Assignment Tracking",
    description: "Add, update, and track courses and assignments with due dates, status, and points.",
    img: featureImages[1],
  },
  {
    title: "Group Collaboration",
    description: "Shared task management, invite members, and submit challenges as a team.",
    img: featureImages[2],
  },
];

export default function Home() {
  const [showTyped, setShowTyped] = useState(false);

  useEffect(() => {
    document.title = "AcadHelper – Your Academic Companion";
    setShowTyped(true);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #e0e7ff 100%)" }}>
      <Navbar />

      {/* Hero Section */}
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{
          px: { xs: 2, md: 8 },
          pt: { xs: 12, md: 18 },
          pb: { xs: 4, md: 8 },
        }}
      >
        <Grid item xs={12} md={6}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              mb: 2,
              fontSize: { xs: "2rem", md: "3.5rem" },
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {showTyped ? (
              <ReactTyped
                strings={[
                  "AcadHelper",
                  "Your Academic Companion",
                  "Organize. Collaborate. Succeed.",
                ]}
                typeSpeed={80}
                backSpeed={40}
                backDelay={1200}
                loop
                showCursor
                cursorChar="|"
              />
            ) : (
              "AcadHelper"
            )}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Streamline your academic journey with powerful tools for managing courses, assignments, events, and collaboration—all in one place.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              boxShadow: 3,
              textTransform: "none",
            }}
          >
            Get Started
          </Button>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src={heroImage}
            alt="Academic Collaboration"
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              width: "100%",
              maxWidth: 400,
              objectFit: "cover",
            }}
          />
        </Grid>
      </Grid>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Typography variant="h4" fontWeight="bold" align="center" sx={{ mb: 6 }}>
          Key Features
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ px: { xs: 2, md: 8 } }}>
          {features.map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: 7 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 320,
                }}
              >
                <Avatar
                  src={feature.img}
                  alt={feature.title}
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 2,
                    boxShadow: 2,
                  }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" align="center" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Gamification & Leaderboard */}
      <Box
        sx={{
          py: 10,
          px: { xs: 2, md: 8 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          bgcolor: "linear-gradient(90deg, #e0e7ff 0%, #e3f2fd 100%)",
        }}
      >
        <Box sx={{ flex: 1, mb: { xs: 4, md: 0 }, pr: { md: 6 } }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Gamification & Leaderboards
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Earn points for daily and weekly challenges, early submissions, and climb the leaderboard to see how you stack up against others—both in your course and globally!
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src="https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg"
            alt="Leaderboard"
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              width: "100%",
              maxWidth: 260,
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>

      {/* Virtual Room & Pomodoro */}
      <Box
        sx={{
          py: 10,
          px: { xs: 2, md: 8 },
          display: "flex",
          flexDirection: { xs: "column", md: "row-reverse" },
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ flex: 1, mb: { xs: 4, md: 0 }, pl: { md: 6 } }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Virtual Room & Pomodoro Timer
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Stay focused with a distraction-free virtual room and built-in Pomodoro timer to maximize your productivity.
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
            alt="Pomodoro Timer"
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              width: "100%",
              maxWidth: 260,
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>

      {/* Call to Action */}
        <Box sx={{ textAlign: "center", py: 8, bgcolor: "#8000ff" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: "#fff" }}>
            Ready to boost your academic performance?
        </Typography>
        </Box>

    </Box>
  );
}
