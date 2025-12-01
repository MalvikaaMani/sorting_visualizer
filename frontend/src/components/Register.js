// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/AuthPage.css";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return alert("Please enter your name");

    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const res = await axios.post(`${baseUrl}/players`, { username: trimmed });
      const player = res.data;
      localStorage.setItem("sv_username", player.username);
      localStorage.setItem("sv_user_uuid", player.user_uuid);
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating player: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>What's your name?</h2>
        <form onSubmit={handleStart}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Starting..." : "Start"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
