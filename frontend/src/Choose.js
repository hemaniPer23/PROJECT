import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Css/Choose.css';

const Choose = () => {
  const navigate = useNavigate();

  return (
    <div className="choose-container">
      <h1 className="choose-title">Choose Registration Type</h1>
      <div className="button-group">
        <button
          className="reg-button candidate-button"
          onClick={() => navigate('/registrationcandidate')}
        >
          Registration Candidate
        </button>
        <button
          className="reg-button form-button"
          onClick={() => navigate('/registration')}
        >
          Registration Voter
        </button>
        <button
          className="reg-button back-button"
          onClick={() => navigate('/category')} // ✅ Go to Category page
        >
          Back
        </button>
      </div>
      <footer className="footer">
        &copy; 2025 Election Commission of Sri Lanka
      </footer>
    </div>
  );
};

export default Choose;
