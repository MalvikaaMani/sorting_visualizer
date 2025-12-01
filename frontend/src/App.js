// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Visualizer from "./components/Visualizer";
import CompareVisualizer from "./components/CompareVisualizer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visualizer/:algoId" element={<Visualizer />} />
        <Route path="/visualizer/compare" element={<CompareVisualizer />} />
      </Routes>
    </Router>
  );
}

export default App;
