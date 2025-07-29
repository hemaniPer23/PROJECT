import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Category.css';

export default function Category() {
  const navigate = useNavigate();

  return (
    <div className="category-container">
      <br /> <br /> <br /> <br /> <br />

      <h1 className="category-title">Menu</h1>

      <div className="button-group">
        <button
          className="menu-button registration-button"
          onClick={() => navigate('/registrationlogin')}
        >
          Registration
        </button>

        {/* ✅ Updated route to electionday2 */}
        <button
          className="menu-button election-button"
          onClick={() => navigate('/electionday2')}
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
