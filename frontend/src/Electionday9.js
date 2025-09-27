import React from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Electionday9.css"; // Make sure this file exists and the path is correct

export default function Electionday9() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Redirect to Electionday8 page after login
    navigate("/electionday8"); // Adjust route as per your router setup
  };

  return (
    <div className="login-container-e9">
      <h1 className="title-e9">මැතිවරණ කොමිෂන් සභාව</h1>
      <h2 className="title-e9">Election Commission</h2>

      <div className="login-box-e9">
        <h3 className="login-title-e9">Login</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="පරිශීලක නාමය / Username"
            required
            className="input-e9"
          />
          <input
            type="password"
            name="password"
            placeholder="මුර පදය / Password"
            required
            className="input-e9"
          />
          <button type="submit" className="lang-btn-e9">
            Login
          </button>
        </form>
      </div>

      <footer className="footer-e9">
        &copy; 2025 Election Commission of Sri Lanka
      </footer>
    </div>
  );
}
