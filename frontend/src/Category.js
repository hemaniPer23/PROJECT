import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Category.css';

export default function Category() {
  const navigate = useNavigate();

  return (
    <div className="category-container">
      <h1 className="category-title">
        මැතිවරණ කොමිෂන් සභාව <br />
        Election Commission
      </h1>

      <div className="category-button-group">
        <button
          className="category-registration-button"
          onClick={() => navigate('/registrationlogin')}
        >
          Registration
        </button>

        <button
          className="category-election-button"
          onClick={() => navigate('/electionday2')}
        >
          Election Day
        </button>

        <button
          className="category-result-button"
          onClick={() => navigate('/LoginPage')}
        >
          View Result
        </button>
      </div>

      <footer className="category-footer">
        &copy; 2025 Election Commission of Sri Lanka
      </footer>
    </div>
  );
}
