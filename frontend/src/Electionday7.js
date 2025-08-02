import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import './Electionday7.css'; // Ensure this path is correct

export default function Electionday1() {
  const navigate = useNavigate(); // Initialize navigation

  const handleDone = () => {
    // Navigate to Electionday9 page
    navigate('/electionday9'); // Adjust the path according to your routes
  };

  return (
    <div className="main-container">
      <div className="titles">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      <div className="popup-box">
        <p className="popup-text">
          <strong>Testing 1</strong> &nbsp; Successful
        </p>
        <button className="done-button" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
}
