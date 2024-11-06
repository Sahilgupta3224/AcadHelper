"use client";
import { Box, Modal, Typography, TextField, Button, IconButton, ToggleButtonGroup, ToggleButton } from "@mui/material";
import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import GoogleIcon from "@mui/icons-material/Google"; 
import axios from "axios";
import { toast } from 'react-toastify'; 
import { useRouter } from 'next/navigation';
import {useStore} from '@/store'

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, handleClose }) => {
  const [username, setTheUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null); // State for email error
  const { user, setUser } = useStore(); // Get user and setUser from Zustand store
  const [authType, setAuthType] = useState("login"); 
  const router = useRouter(); 

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAuthTypeChange = (_: React.MouseEvent<HTMLElement>, newAuthType: string | null) => {
    if (newAuthType) {
      setAuthType(newAuthType);
      setEmailError(null);
      toast.info("Authentication type changed");
    }
  };

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (authType === "login") {
      const objData = { email, password };

      if (!validateEmail(email)) {
        setEmailError("Invalid email format!"); // Set email error
        return;
      } else {
        setEmailError(null); // Clear email error if valid
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        toast.info("You are already logged in!");
        return; // Exit the function early
      }

      try {
        const response = await axios.post("/api/auth/login", objData);
        const userData = response.data.user;
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData); // Set user in Zustand store
        console.log("User check",user)
        toast.success("Logged in successfully!");
        router.push('/Leaderboard');
        handleClose();
        // Clear fields
        setEmail('');
        setPassword('');
        setTheUsername('');
      } catch (error: any) {
        console.error("Error while logging in:", error);
        const errorMessage = error.response?.data?.message || "Error while logging in. Please try again.";
        toast.error(errorMessage);
      }
    } else {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      if (!validateEmail(email)) {
        setEmailError("Invalid email format!"); // Set email error
        return;
      } else {
        setEmailError(null); 
      }

      const reqData = { username, email, password };
  
      try {
        const response = await axios.post("/api/auth/signup", reqData);
        const userD = response.data;
        setUser(userD); // Set user in Zustand store
        toast.success("Signed up successfully!");
        localStorage.setItem("user", JSON.stringify(userD.savedUser));
        router.push('/Leaderboard');
        handleClose();
        // Clear fields
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } catch (error: any) {
        console.error("Error while signing up:", error);
        const errorMessage = error.response?.data?.message || "Error while signing up. Please try again.";
        toast.error(errorMessage);
      }
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      // Perform Google sign-in logic here
    } catch (error: any) {
      console.error("Error during Google sign-in:", error);
      const errorMessage = error.response?.data?.message || "An error occurred during Google sign-in.";
      toast.error(errorMessage);
      handleClose(); // Close the modal
    }
  };

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose} aria-labelledby="auth-modal">
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" px={2}>
            <Typography id="auth-modal" variant="h6" component="h2" fontSize="2rem">
              {authType === "login" ? "Login" : "Sign Up"}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <ToggleButtonGroup
            value={authType}
            exclusive
            onChange={handleAuthTypeChange}
            aria-label="authentication type"
            sx={{ marginBottom: 2 }}
          >
            <ToggleButton value="login" aria-label="login" onClick={() => setAuthType("login")}>
              Login
            </ToggleButton>
            <ToggleButton value="signup" aria-label="signup" onClick={() => setAuthType("signup")}>
              Sign Up
            </ToggleButton>
          </ToggleButtonGroup>

          {authType === "signup" && (
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setTheUsername(e.target.value)}
              autoComplete="off"
            />
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            error={!!emailError} // Set error state
            helperText={emailError} // Display error message
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />

          {authType === "signup" && (
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="off"
            />
          )}

          <Button variant="outlined" color="primary" fullWidth onClick={handleSave}>
            {authType === "login" ? "Login" : "Sign Up"}
          </Button>

          <Box display="flex" justifyContent="space-between" width="100%" marginTop={2}>
            <Button variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleSignIn}>
              Google
            </Button>
            <Button variant="outlined" startIcon={<GitHubIcon />} onClick={() => { console.log("Github"); }}>
              GitHub
            </Button>
            <Button variant="outlined" startIcon={<InstagramIcon />} onClick={() => { console.log("Insta"); }}>
              Instagram
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default LoginModal;
