import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRDisplay from "./QRDisplay"; // Correctly import QRDisplay
import database_url from "../utils/constants";
const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesDialogOpen, setAttendeesDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const token = Cookies.get("token");
  console.log(token);
  if(!token) navigate("/login");

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`https://matched-3qlo.onrender.com/all/event`, {
          withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
        });
        setEvents(response.data.eventData);
        console.log(response.data);
        setOwnerName(response.data.eventData[0].owner_id.username);
      } catch (error) {
        showSnackbar("Failed to fetch events.", "error");
        console.error("Failed to fetch events:", error.message);
      }
    };

    fetchEvents();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fetch attendees for a specific event
  const handleViewAttendees = async (eventId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `https://matched-3qlo.onrender.com/all/${eventId}/attendee`,
        {
          withCredentials: true,method: "GET",
    credentials: "include", // Allows cookies to be sent with the request
    headers: {
        "Content-Type": "application/json"
    }
        }
      );
      setAttendees(response.data.attendeeData);
      setAttendeesDialogOpen(true);
    } catch (error) {
      showSnackbar("Failed to fetch attendees.", "error");
      console.error("Failed to fetch attendees:", error.message);
    }
  };

  // Create a new event using a dialog
  const handleCreateEvent = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `https://matched-3qlo.onrender.com/event/create`,
        { event_name: eventName },
        { withCredentials: true,method: "POST",
    credentials: "include", // Allows cookies to be sent with the request
    headers: {
        "Content-Type": "application/json"
    },}
      );
      setEvents([...events, response.data.data]);
      showSnackbar("Event created successfully.");
      setCreateEventDialogOpen(false); // Close dialog after creation
      setEventName(""); // Clear input field
    } catch (error) {
      showSnackbar("Failed to create event.", "error");
      console.error("Failed to create event:", error.message);
    }
  };

  // Generate QR Code
  const handleGenerateQR = (eventId) => {
    setQrData(eventId);
    setQrDialogOpen(true);
    showSnackbar("QR Code generated successfully.");
  };

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`https://matched-3qlo.onrender.com/event/${eventId}`, {
        withCredentials: true,method: "DELETE",
    credentials: "include", // Allows cookies to be sent with the request
    headers: {
        "Content-Type": "application/json"
    }
      });
      setEvents(events.filter((event) => event._id !== eventId));
      showSnackbar("Event deleted successfully.");
    } catch (error) {
      showSnackbar("Failed to delete event.", "error");
      console.error("Failed to delete event:", error.message);
    }
  };

  // Logout function
  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const generateMatch = async (event_id) => {
    try {
      const response = await axios.get(
        `https://matched-3qlo.onrender.com/match/${event_id}`,
        { withCredentials: true,method: "GET",
    credentials: "include", // Allows cookies to be sent with the request
    headers: {
        "Content-Type": "application/json"
    }}
      );
      showSnackbar("Match generated successfully.");
      console.log(response.data);
    } catch (error) {
      showSnackbar("Failed to generate match.", "error");
      console.error(error.message);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#121212", color: "#ffffff", minHeight: "100vh", padding: "16px" }}>
      <AppBar position="static" sx={{ backgroundColor: "#1f1f1f" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome {ownerName}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateEventDialogOpen(true)}
            sx={{
              mb: 3,
              backgroundColor: "#333",
              color: "#fff",
              "&:hover": { backgroundColor: "#555" },
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            Create Event
          </Button>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#1f1f1f", color: "#ffffff", overflowX: "auto" }}
          >
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell sx={{ color: "#fff" }}>{event.event_name}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleGenerateQR(event._id)}
                        sx={{
                          mr: 1,
                          mb: isMobile ? 1 : 0,
                          borderColor: "#fff",
                          color: "#fff",
                          "&:hover": {
                            borderColor: "#76b1e3",
                            color: "#76b1e3",
                          },
                        }}
                      >
                        Get QR
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewAttendees(event._id)}
                        sx={{
                          mr: 1,
                          mb: isMobile ? 1 : 0,
                          borderColor: "#fff",
                          color: "#fff",
                          "&:hover": {
                            borderColor: "#76b1e3",
                            color: "#76b1e3",
                          },
                        }}
                      >
                        View Event
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteEvent(event._id)}
                        sx={{
                          mr: 1,
                          mb: isMobile ? 1 : 0,
                          borderColor: "#ff6666",
                          color: "#ff6666",
                          "&:hover": {
                            borderColor: "#ff4d4d",
                            color: "#ff4d4d",
                          },
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => generateMatch(event._id)}
                        color="primary"
                        sx={{
                          mr: 1,
                          mb: isMobile ? 1 : 0,
                          borderColor: "#fff",
                          color: "#fff",
                          "&:hover": {
                            borderColor: "#76b1e3",
                            color: "#76b1e3",
                          },
                        }}
                      >
                        Create Match
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      {/* Create Event Dialog */}
      <Dialog open={createEventDialogOpen} onClose={() => setCreateEventDialogOpen(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Event Name"
            
            fullWidth
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateEventDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateEvent} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Display Dialog */}
      <QRDisplay
        open={qrDialogOpen}
        handleClose={() => setQrDialogOpen(false)}
        qrData={qrData}
      />

      {/* Attendees Dialog */}
      <Dialog
        open={attendeesDialogOpen}
        onClose={() => setAttendeesDialogOpen(false)}
        PaperProps={{ style: { backgroundColor: "#1f1f1f", color: "#ffffff"} }}

      >
        <DialogTitle>Attendees List</DialogTitle>
        <DialogContent >
          <TableContainer component={Paper} sx={{ backgroundColor: "#121212",minWidth: "30vw" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>Temp ID</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Gender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee._id}>
                    <TableCell sx={{ color: "#fff" }}>{attendee.temp_id}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{attendee.gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendeesDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
