import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Category.css';

export default function Category() {
  const navigate = useNavigate();

  return (
    <div className="category-container">
      <h1 className="category-title">Menu</h1>
      <div className="button-group">
        <button
          className="menu-button registration-button"
          onClick={() => navigate('/choose')} // ✅ Updated path
        >
          Registration
        </button>
        <button
          className="menu-button election-button"
          onClick={() => navigate('/electionday')}
        >
          Election Day
        </button>
        <button
          className="menu-button result-button"
          onClick={() => navigate('/viewresult')}
        >
          View Result
        </button>
      </div>
      <footer className="footer">
        &copy; 2025 Election Commission of Sri Lanka
      </footer>
    </div>
  );
}
