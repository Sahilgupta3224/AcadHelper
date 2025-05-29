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
  Container, // Added for consistent padding
  Link, // Added for footer links
} from "@mui/material";
import { useRouter } from "next/navigation"; // Added for button navigation

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
  const router = useRouter(); // Initialize router

  useEffect(() => {
    document.title = "AcadHelper – Your Academic Companion";
    setShowTyped(true);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #e0e7ff 100%)" }}>
      <Navbar />

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{
            px: { xs: 2, md: 4 }, // Adjusted padding for container
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
              onClick={() => router.push('/Login')} // Example: Navigate to login/signup
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
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" align="center" sx={{ mb: 6 }}>
            Key Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}> {/* Adjusted sm breakpoint */}
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "box-shadow 0.3s, transform 0.3s", // Added transform transition
                    "&:hover": { boxShadow: 7, transform: "translateY(-5px)" }, // Added slight lift on hover
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
                  <CardContent sx={{ textAlign: "center" }}> {/* Centered CardContent text */}
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Gamification & Leaderboard */}
      <Box
        sx={{
          py: 10,
          px: { xs: 2, md: 4 },
          bgcolor: "linear-gradient(90deg, #e0e7ff 0%, #e3f2fd 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}> {/* Increased size */}
                Gamification & Leaderboards
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, fontSize: "1.1rem" }}> {/* Increased size */}
                Earn points for daily and weekly challenges, early submissions, and climb the leaderboard to see how you stack up against others—both in your course and globally!
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {/* Placeholder for navigation or modal */}}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                src="https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg" // Consider a more illustrative image
                alt="Leaderboard"
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  width: "100%",
                  maxWidth: 300, // Adjusted size
                  objectFit: "cover",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Virtual Room & Pomodoro */}
      <Box
        sx={{
          py: 10,
          px: { xs: 2, md: 4 },
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" direction={{ xs: "column-reverse", md: "row" }}> {/* Ensure image is on the left for md */}
            <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg" // Consider a more illustrative image
                alt="Pomodoro Timer"
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  width: "100%",
                  maxWidth: 300, // Adjusted size
                  objectFit: "cover",
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}> {/* Increased size */}
                Virtual Room & Pomodoro Timer
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, fontSize: "1.1rem" }}> {/* Increased size */}
                Stay focused with a distraction-free virtual room and built-in Pomodoro timer to maximize your productivity.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {/* Placeholder for navigation or modal */}}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Explore Productivity Tools
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Call to Action */}
      <Box sx={{ textAlign: "center", py: 10, bgcolor: "#673ab7" /* A slightly different purple */ }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 3, color: "#fff" }}> {/* Increased size */}
            Ready to Boost Your Academic Performance?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, color: "rgba(255, 255, 255, 0.85)" }}>
            Join thousands of students organizing, collaborating, and succeeding with AcadHelper.
          </Typography>
          {/* <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#fff",
              color: "#673ab7",
              fontWeight: 700, // Bolder
              borderRadius: "50px", // Pill shape
              px: 6, // More padding
              py: 1.8,
              boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
              textTransform: "none",
              fontSize: "1.1rem",
              transition: "background-color 0.3s, transform 0.3s",
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                transform: "translateY(-3px)",
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
              }
            }}
            onClick={() => router.push('/Login')} // Example navigation
          >
            Sign Up for Free
          </Button> */}
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                &copy; {new Date().getFullYear()} AcadHelper. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <Link href="#" color="text.secondary" sx={{ mr: 2, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                Privacy Policy
              </Link>
              <Link href="#" color="text.secondary" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                Terms of Service
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}