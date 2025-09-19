import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/algorithms").then((res) => {
      setAlgorithms(res.data);
    });
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="title">Sorting Visualizer 🎉</h1>
      <p className="subtitle">
        Choose one algorithm card or compare them all together!
      </p>

      <div className="algo-grid">
        {algorithms.map((algo) => (
          <div key={algo.id} className="algo-card">
            <h2>{algo.name}</h2>
            <p>{algo.desc}</p>
            <button
              onClick={() => navigate(`/visualizer/${algo.id}`)}
              className="play-btn"
            >
              ▶ Play {algo.name}
            </button>
          </div>
        ))}

        {/* Compare All card */}
        <div className="algo-card compare-card">
          <h2>Compare All</h2>
          <p>Run all algorithms side by side and visualize the differences!</p>
          <button
            onClick={() => navigate("/visualizer/compare")}
            className="play-btn"
          >
            🔀 Compare All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
