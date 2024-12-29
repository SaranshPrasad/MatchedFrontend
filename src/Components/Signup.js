import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import database_url from "../utils/constants";
const Signup = () => {
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const token = Cookies.get("token");
      
    useEffect(()=>{
      if(token){
        navigate("/dashboard");
      }
    },[token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
      return;
    }

    try {
      const response = await axios.post(`${database_url}/auth/signup`, {
        username,
        email,
        password,
      },{ withCredentials: true });

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Signup successful! Redirecting to login page...",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Signup failed: ${error.response?.data || error.message}`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0f0f0f, #1a1a1a)",
        backgroundColor: "#0e0e0e",
        color: "white",
        padding: "0 16px",
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(145deg, #121212, #1a1a1a)",
            color: "white",
            boxShadow:
              "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.02)",
            textAlign: "center",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              inputRef={usernameRef}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "transparent" },
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
              InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              inputRef={emailRef}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "transparent" },
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
              InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              inputRef={passwordRef}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "transparent" },
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
              InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              inputRef={confirmPasswordRef}
              sx={{
                mb: 3,
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "transparent" },
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
              InputLabelProps={{ style: { color: "rgba(255, 255, 255, 0.7)" } }}
              variant="outlined"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{
                textTransform: "none",
                fontSize: "16px",
                backgroundColor: theme.palette.primary.main,
                color: "white",
                "&:hover": { backgroundColor: theme.palette.primary.dark },
                mb: 2,
              }}
            >
              Signup
            </Button>
          </form>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}
          >
            Already have an account?{" "}
            <span
              style={{
                color: theme.palette.primary.main,
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </Typography>
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;
