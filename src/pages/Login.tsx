"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useStore } from "@/store";
import toast, { Toaster } from 'react-hot-toast';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useSession,signOut,signIn } from 'next-auth/react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useStore();
  const router = useRouter();
  const [error, setError] = useState("");

  // const session=useSession()

  const handleLogin = async () => {
    try {
      // const response = await axios.post('/api/auth/login', {
      //   email,
      //   password,
      // });

      // if (response.status === 200) {
      //   console.log("Login successful:", response.data);
      //   localStorage.setItem("user", JSON.stringify(response.data.user));
      //   setUser(response.data.user);
      //   router.push('/Dashboard');
      // } else {
      //   console.error("Login failed");
      // }

      if (!user.email || !user.password) {
        setError("please fill all the fields");
        return;
      }

      const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      if (!emailRegex.test(email)) {
        setError("invalid email id");
        return;
      }

      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (res?.error) {
        console.log(res);
        setError("error");
      }

      setError("");
      router.push("/Dashboard");

    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleSignin = async ()=>
  {
    try {

      signIn()
      // console.log("session",session)
      
    } catch (error) {
      console.log(error)
      return;
    }
  }

  return (
    
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box sx={{ width: '100%', p: 4, backgroundColor: 'white', borderRadius: 1, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Log In
        </Typography>
        <form>
          <TextField
            label="Email Address"
            type="email"
            id="email"
            name="email"
            placeholder="me@example.com"
            autoFocus
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            id="password"
            name="password"
            placeholder="••••••••••"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Submit
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 3 }}>
          Or log in with
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{ mt: 1 }}
          onClick={handleGoogleSignin}
        >
          Google
        </Button>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GitHubIcon />}
          sx={{ mt: 1 }}
          onClick={() => console.log('Login with GitHub')}
        >
          GitHub
        </Button>
        <Toaster />
      </Box>
    </Container>
  );
};

export default LoginForm;
