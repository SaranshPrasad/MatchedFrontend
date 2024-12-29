import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import database_url from "../utils/constants";
const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const token = Cookies.get("token");
    
  useEffect(()=>{
    if(token){
      navigate("/dashboard");
    }
  },[token]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(`${database_url}/auth/login`, {
        email,
        password,
      },{withCredentials: true});

      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set("token", token, { expires: 1 });
        setSnackbar({ open: true, message: "Login successful!", severity: "success" });
        navigate("/dashboard");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Login failed: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    }
  };

  const handleSignupClick = () => {
    navigate("/signup");
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
            boxShadow: "inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.02)",
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
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              inputRef={emailRef}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
              InputLabelProps={{
                style: { color: "rgba(255, 255, 255, 0.7)" },
              }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              inputRef={passwordRef}
              sx={{
                mb: 3,
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
              InputLabelProps={{
                style: { color: "rgba(255, 255, 255, 0.7)" },
              }}
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
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
                mb: 2,
              }}
            >
              Login
            </Button>
          </form>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}
          >
            Don't have an account?{" "}
            <span
              style={{
                color: theme.palette.primary.main,
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={handleSignupClick}
            >
              Signup
            </span>
          </Typography>
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
