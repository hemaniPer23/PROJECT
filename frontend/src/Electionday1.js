import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing
import './Css/Electionday1.css';  // Make sure this path is correct

export default function Electionday1() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  return (
    <div className="container">
      <div className="content">
        <br />  <br />  <br />  <br />
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
        <div className="button-group">
          <button 
            className="btn" 
            onClick={() => navigate('/electionday2')}  // ✅ Correct route
          >
            Presiding Officer
          </button>
          <button className="btn">
            Ballot Paper
          </button>
        </div>
      </div>
    </div>
  );
}
