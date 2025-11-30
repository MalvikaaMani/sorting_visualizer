import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./../styles/AuthPage.css";

const AuthPage = () => {
  console.log("API URL:", process.env.REACT_APP_API_URL);
  const navigate = useNavigate();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode") || "login";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(mode === "login");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const url = isLogin
        ? `${baseUrl}/auth/login`
        : `${baseUrl}/auth/signup`;

      const payload = isLogin
        ? { username, password }
        : { username, email, password };

      const res = await axios.post(url, payload);

      if (isLogin) {
        localStorage.setItem("token", res.data.access_token);
        navigate("/dashboard");
      } else {
        alert("Signup successful! Now login.");
        navigate("/auth?mode=login");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Something went wrong"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleAuth}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p className="switch-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
