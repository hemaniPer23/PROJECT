// LoginHome.js
import React from "react";
import "./Css/loginHome.css";
import { useNavigate } from "react-router-dom";

const LoginHome = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (language) => {
    navigate("/category");
  };

  return (
    <div className="login-page-container">
      <main className="login-card">
        <img
          src="/National logo.jpg"
          alt="National Emblem"
          className="national-emblem"
        />

        <h1 className="title-sinhala">මැතිවරණ කොමිෂන් සභාව</h1>
        <h2 className="title-english">ELECTION COMMISSION</h2>

        <div className="welcome-box">
          <div className="welcome-col">
            <p className="welcome-title">ආයුබෝවන්!</p>
            <p className="welcome-text">
              මැතිවරණ කොමිෂන් සභාවේ නිල වෙබ් අඩවියට ඔබ සාදරයෙන් පිළිගනිමු.
            </p>
          </div>
          <div className="welcome-col">
            <p className="welcome-title">Welcome!</p>
            <p className="welcome-text">
              Welcome to the official website of the Election Commission.
            </p>
          </div>
        </div>

        <div className="button-container">
          <button
            className="action-button"
            onClick={() => handleLanguageSelect("si")}
          >
            පිවිසෙන්න
          </button>
        </div>
      </main>
    </div>
  );
};

export default LoginHome;