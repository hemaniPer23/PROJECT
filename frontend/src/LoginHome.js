// LoginHome.js
import React from "react";
import "./Css/loginHome.css";
import { useNavigate } from "react-router-dom";

const LoginHome = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <br /><br /><br />

      <h1 className="title">මැතිවරණ කොමිෂන් සභාව</h1>
      <h2 className="title">Election Commission</h2>

      <br /><br /><br /><br /><br />

      <div className="button-box">
        <button className="lang-btn" onClick={() => navigate("/loginHome")}>
          පිවිසෙන්න<br />Login
        </button>

        <button className="lang-btn" onClick={() => navigate("/loginHome")}>
          ප්‍රතිඵල<br />Result
        </button>
      </div>

      <div className="footer">
        &copy; 2025 Election Commission of Sri Lanka
      </div>
    </div>
  );
};

export default LoginHome;
