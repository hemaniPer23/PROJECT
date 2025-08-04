import React, { useState, useEffect } from 'react';
import './Css/Electionday6.css';
import loadingGif from './image/Loading.gif';

export default function Electionday1() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      {/* ✅ Title always visible at top */}
      <div className="title-section">
        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව 2025</h1>
        <h2 className="title-english">Election Commission 2025</h2>
      </div>

      {/* ✅ Conditional rendering: loader or main content */}
      {loading ? (
        <div className="loader">
          <img src={loadingGif} alt="Loading..." />
        </div>
      ) : (
        <div className="overlay">
          <div className="content">
            {/* Your main content here */}
            <p>Main content loaded!</p>
          </div>
        </div>
      )}
    </div>
  );
}
