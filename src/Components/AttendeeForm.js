import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import questions from "../utils/questions";
import database_url from "../utils/constants";
const AttendeeForm = () => {
  const { event_id } = useParams();
  const navigate = useNavigate();

  const [gender, setGender] = useState("");
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleGenderChange = (e) => setGender(e.target.value);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${database_url}/attendee/${event_id}/register`,
        { gender, answers }
      );
      const tempId = response.data.saveAttendee.temp_id;
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate(`/get-match/${event_id}/${tempId}`);
      }, 2000); // Redirect after showing the snackbar
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
      setSnackbarMessage("Error: " + (err.response?.data?.message || "Something went wrong!"));
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "700px",
          padding: "20px",
          boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.8), 0 10px 20px rgba(0, 0, 0, 0.9)",
          borderRadius: "8px",
          backgroundColor: "transparent",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#ffffff",
            }}
          >
            Attendee Choices
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: "white" }}>Gender</InputLabel>
            <Select
              value={gender}
              onChange={handleGenderChange}
              required
              sx={{
                backgroundColor: "#121212",
                color: "white",
                "& .MuiSelect-icon": { color: "white" },
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>

          {questions.map((q, index) => (
            <Box
              key={q.id}
              sx={{
                color: "#fff",
                marginBottom: "20px",
                padding: "10px",
                backgroundColor: "#1c1c1c",
                borderRadius: "8px",
                boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.8)",
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                {q.question}
              </Typography>
              <RadioGroup
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                {q.options.map((option, optIndex) => (
                  <FormControlLabel
                    key={optIndex}
                    value={option}
                    control={<Radio sx={{ color: "#6200ea" }} />}
                    label={option}
                    sx={{
                      color: "white",
                      "& .MuiFormControlLabel-label": { color: "white" },
                    }}
                  />
                ))}
              </RadioGroup>
            </Box>
          ))}

          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#6200ea",
                "&:hover": {
                  backgroundColor: "#3700b3",
                },
              }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AttendeeForm;
