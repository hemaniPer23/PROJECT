import React from 'react';
import './Electionday10.css';

export default function Electionday10({ voted = 300, nonVoted = 700 }) {
  const total = voted + nonVoted;
  const percentage = total > 0 ? (voted / total) * 100 : 0;

  return (
    <div className="election-container">
      <div className="header">
        <h1 className="title">Election Commission</h1>
      </div>

      <div className="stats-box">
        <div className="stat">
          <label>Voted:</label>
          <span>{voted}</span>
        </div>

        <div className="stat">
          <label>Non-Voted:</label>
          <span>{nonVoted}</span>
        </div>

        <div className="stat">
          <label>Voted %:</label>
          <span className="percentage">{percentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
