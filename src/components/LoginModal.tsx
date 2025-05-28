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
        toast.error("Google authentication error.");
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
            variant="outlined"
            sx={{ mt: 2, height: 45 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign in with Google"}
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
