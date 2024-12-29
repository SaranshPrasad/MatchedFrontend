import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import AttendeeForm from "./Components/AttendeeForm";
import GetMatch from "./Components/GetMatch";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={ <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendee/:event_id/register" element={<AttendeeForm />} />
        <Route path="/get-match/:event_id/:tempId" element={<GetMatch />} />
      </Routes>
    </Router>
  );
};

export default App;
