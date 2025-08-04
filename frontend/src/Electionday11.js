import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Electionday7.css'; // Ensure this CSS file exists and is styled properly

export default function Electionday1() {
  const navigate = useNavigate(); // Initialize navigation

  const handleDone = () => {
    // ✅ Navigate to Electionday8.js page
    navigate('/electionday8');
  };

  return (
    <div className="main-container">
      <div className="titles">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      <div className="popup-box">
        <p className="popup-text">
          <strong>Voting</strong> &nbsp; Successful
        </p>
        <button className="done-button" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
}
