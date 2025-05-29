"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation"; // Next.js router
import { useStore } from "../store"; // Adjust path as needed
import toast, { Toaster } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import { institutes } from "./SampleData/Sample";
import { auth } from "../../firebase.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Simple Google G Logo SVG component
const GoogleLogo = () => (
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const LoginModal = ({ open, handleClose, guestLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [institute, setInstitute] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useStore();
  const router = useRouter();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validateUsername = (username) =>
    /^[a-zA-Z0-9_]{3,15}$/.test(username);

  useEffect(() => {
    if (open && guestLogin) {
      setIsLogin(true);
      setEmail("shikharpandya007@gmail.com");
      setPassword("Shikhar@123");
      setTimeout(() => {
        document.getElementById("login-btn")?.click();
      }, 300);
    }
  }, [open, guestLogin]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      // if (!validateEmail(email)) {
      //   toast.error("Invalid email.");
      //   return;
      // }
      // if (!validatePassword(password)) {
      //   toast.error("Invalid password format.");
      //   return;
      // }
      if (!isLogin) {
        // if (!validateUsername(username)) {
        //   toast.error("Invalid username.");
        //   return;
        // }
        // if (!institute) {
        //   toast.error("Select an institute.");
        //   return;
        // }
        const res = await axios.post(`/api/auth/signup`, {
          email,
          password,
          username,
          institute,
        });
        if (res.status === 201) {
          const user = res.data.user;
          user.token = res.data.token;
          setUser(user);
          toast.success("Check your email to verify your account.");
          router.push("/Dashboard");
          handleClose();
        } else {
          router.push("/");
          toast.error("Signup failed.");
        }
      } else {
        const res = await axios.post(`/api/auth/login`, {
          email,
          password,
        });
        if (res.status === 200) {
          const user = res.data.user;
          user.token = res.data.token;
          setUser(user);
          toast.success("Login successful!");
          router.push("/Dashboard");
          handleClose();
        } else {
          toast.error("Login failed.");
          router.push("/");
        }
      }
    } catch (err:any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Authentication error.");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user2 = result.user;
      console.log(user2);
      const res = await axios.post(`/api/auth/google`, { email: user2.email });
      
      if (res.status === 200) {
        const user = res.data.user;
        user.token = res.data.token;
        setUser(user);
        toast.success("Google login successful!");
        router.push("/Dashboard");
        handleClose();
      } else {
        toast.error("Google login failed.");
      }
    } catch (err:any) {
      if (err.response && err.response.status === 403) {
        toast.error("No account found for this Google email. Please sign up using the website form first.");
      } else {
        console.error("Google Sign-In Error:", err); // Log the full error
        toast.error(err.message || "Google authentication error."); // Show more specific error if available
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkVerification = async () => {
      if (!user) return;
      // Add any verification logic if needed
    };
    checkVerification();
  }, [user, router]);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          outline: "none",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {isLogin ? "Login" : "Sign Up"}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!(email && !validateEmail(email))}
          helperText={email && !validateEmail(email) ? "Enter a valid email" : ""}
        />
        {!isLogin && (
          <>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!(username && !validateUsername(username))}
              helperText={
                username && !validateUsername(username)
                  ? "3-15 chars, letters, numbers, or _"
                  : ""
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel shrink htmlFor="institute-native-select">
                Institute
              </InputLabel>
              <select
                id="institute-native-select"
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '8px'
                }}
              >
                <option value="" disabled>
                  Select an institute
                </option>
                {institutes.map((uni, i) => (
                  <option key={i} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </FormControl>
          </>
        )}
      <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!(password && !validatePassword(password))} 
          helperText={
            password && !validatePassword(password)
              ? "Min 8 chars, 1 letter, 1 number, 1 special"
              : ""
          }
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, height: 45 }}
          onClick={handleAuth}
          disabled={loading}
          id="login-btn"
        >
          {loading ? <CircularProgress size={24} /> : isLogin ? "Login" : "Sign Up"}
        </Button>
        
          <Button
            fullWidth
            variant="outlined" // Or "contained" if you prefer a filled look
            startIcon={<GoogleLogo />}
            sx={{ 
              mt: 2, 
              height: 45,
              borderColor: '#dadce0', // Google-like border color
              color: '#3c4043', // Google-like text color
              textTransform: 'none', // To prevent all caps
              fontWeight: 500,
              fontSize: '0.9rem',
              '&:hover': {
                borderColor: '#c6c9cc',
                backgroundColor: '#f8f9fa', // Slight hover effect
              },
            }}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#4285F4' }} /> : "Sign in with Google"}
          </Button>
        
        <Typography textAlign="center" mt={2}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={toggleMode}
            style={{ color: "#1976d2", cursor: "pointer" }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </Typography>
        <Toaster position="top-right" />
      </Box>
    </Modal>
  );
};

export default LoginModal;
