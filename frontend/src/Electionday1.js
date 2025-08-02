import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Electionday1.css';

export default function Electionday1() {
  const navigate = useNavigate();

  return (
    <div className="full-page">
      <div className="navbar">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>

      <div className="main-content">
        <h1 className="sinhala-heading">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="english-heading">Election Commission 2025</h2>

        <div className="button-container">
          <button className="action-button" onClick={() => navigate('/electionday3')}>
            Presiding Officer
          </button>
          <button className="action-button">
            Ballot Paper
          </button>
        </div>
      </div>
    </div>
  );
}
