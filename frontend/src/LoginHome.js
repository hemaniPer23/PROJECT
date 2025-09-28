// LoginHome.js
import React from "react";
import "./Css/loginHome.css";
import { useNavigate } from "react-router-dom";

const LoginHome = () => {
  const navigate = useNavigate();

  return (
    <div className="container-loginhome">
      <br /><br /><br />

      <h1 className="title-loginhome">මැතිවරණ කොමිෂන් සභාව</h1>
      <h2 className="title-loginhome">Election Commission</h2>

      <br /><br /><br /><br /><br />

      <div className="button-box-loginhome">
        <button className="lang-btn-loginhome" onClick={() => navigate("/category")}>
          පිවිසෙන්න<br />Login
        </button>
      </div>

      <div className="footer-loginhome">
        &copy; 2025 Election Commission of Sri Lanka
      </div>
    </div>
  );
};

export default LoginHome;