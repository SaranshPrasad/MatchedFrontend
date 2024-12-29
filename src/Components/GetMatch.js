import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import database_url from "../utils/constants";
const GetMatch = () => {
  const { event_id, tempId } = useParams();

  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchNumber, setMatchNumber] = useState(null);
  const [error, setError] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [countdown, setCountdown] = useState(null); // To track countdown value

  const handleGetMatch = async () => {
    setLoadingMatch(true);
    setError("");
    setMatchNumber(null); // Reset match number

    let countdownValue = 30; // Set countdown to 30 seconds
    setCountdown(countdownValue);

    const interval = setInterval(() => {
      countdownValue -= 1;
      setCountdown(countdownValue);

      if (countdownValue <= 0) {
        clearInterval(interval); // Stop the interval after countdown ends
      }
    }, 1000);

    // Wait for the countdown to complete
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Fetch match data after 30 seconds
    try {
      const response = await axios.get(
        `${database_url}/match/${event_id}/${tempId}`
      );
      console.log(response.data)
      const fetchedMatchNumber = response.data.matchNumbers[0];
      setMatchNumber(fetchedMatchNumber);
      console.log(fetchedMatchNumber);
      setSnackbarMessage("Match fetched successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
      setSnackbarMessage(
        "Error: " + (err.response?.data?.message || "Something went wrong!")
      );
      setOpenSnackbar(true);
    } finally {
      setCountdown(null); // Clear countdown
      setLoadingMatch(false);
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
      }}
    >
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        {matchNumber ? (
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Match Number: {matchNumber}
          </Typography>
        ) : (
          <>
            {countdown !== null ? (
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Please wait... {countdown} seconds
              </Typography>
            ) : (
              <Button
                variant="contained"
                onClick={handleGetMatch}
                disabled={loadingMatch}
                sx={{
                  backgroundColor: "#03dac6",
                  "&:hover": {
                    backgroundColor: "#018786",
                  },
                }}
              >
                {loadingMatch ? "Fetching Matches..." : "Get Match"}
              </Button>
            )}
          </>
        )}

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

export default GetMatch;
