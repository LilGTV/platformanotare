import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Evaluation from "./pages/Evaluation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Notifications from "./components/Notifications";
import ProjectManagement from "./pages/ProjectManagement";
import DashboardProf from "./pages/DashboardProf";
import EvaluatedProjects from "./pages/EvaluatedProjects";
import "./App.css";

function App() {
  const sampleNotifications = [
    "Aveți un proiect de evaluat",
    "Ați fost ales profesor coordonator",
    "Ați fost evaluat",
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/evaluation/:id" element={<Evaluation />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/notifications"
          element={<Notifications notifications={sampleNotifications} />}
        />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/dashboard_prof" element={<DashboardProf />} />
        <Route path="/projects_evaluated" element={<EvaluatedProjects />} />
      </Routes>
    </Router>
  );
}

export default App;
